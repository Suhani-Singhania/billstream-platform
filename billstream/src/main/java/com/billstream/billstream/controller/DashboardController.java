package com.billstream.billstream.controller;

import com.billstream.billstream.models.User;
import com.billstream.billstream.repositories.UserRepository;
import com.billstream.billstream.service.UsageRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private UsageRecordService usageRecordService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getDashboardData() {
        // Enforce Phase 6 Tenant Isolation by grabbing the logged-in session profile
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user context missing"));

        Long tenantId = currentUser.getTenant().getId();
        Map<String, Object> metrics = usageRecordService.getDashboardMetrics(tenantId);

        return ResponseEntity.ok(metrics);
    }
}
