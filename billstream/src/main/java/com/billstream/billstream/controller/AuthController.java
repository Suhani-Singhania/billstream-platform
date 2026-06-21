package com.billstream.billstream.controller;

import com.billstream.billstream.dto.LoginRequest;
import com.billstream.billstream.dto.TenantRegisterRequest;
import com.billstream.billstream.models.Role;
import com.billstream.billstream.models.Tenant;
import com.billstream.billstream.models.User;
import com.billstream.billstream.repositories.RoleRepository;
import com.billstream.billstream.repositories.TenantRepository;
import com.billstream.billstream.repositories.UserRepository;
import com.billstream.billstream.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(TenantRepository tenantRepository, UserRepository userRepository,
                          RoleRepository roleRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerTenant(@Valid @RequestBody TenantRegisterRequest request) {
        // 1. Check if username or email already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is already taken"));
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already registered"));
        }

        // 2. Create and save the new Tenant Company context
        Tenant tenant = new Tenant(request.getCompanyName());
        tenant.setApiKey(UUID.randomUUID().toString()); // Auto-generate unique business API string key
        Tenant savedTenant = tenantRepository.save(tenant);

        // 3. Look up standard ROLE_USER from seeded data rows
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Default System Security Roles not initialized"));

        // 4. Create User entity with hashed password security mapping
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Encrypting raw text!
        user.setTenant(savedTenant);
        user.setRoles(Collections.singleton(userRole));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Tenant and Admin User registered successfully",
                "apiKey", savedTenant.getApiKey()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        // 1. Lookup the User structure profile
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        // 2. Cryptographically match hash password string signatures
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }

        // 3. Issue signed JWT session auth token carrying Multi-Tenant IDs
        String token = jwtUtil.generateToken(user.getUsername(), user.getTenant().getId());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "expiresInHours", 10,
                "companyName", user.getTenant().getCompanyName()
        ));
    }
}