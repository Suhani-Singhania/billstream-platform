package com.billstream.billstream.config;

import com.billstream.billstream.models.Role;
import com.billstream.billstream.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    // Constructor injection for our RoleRepository
    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // If ROLE_USER doesn't exist in DB, create it
        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            roleRepository.save(new Role("ROLE_USER"));
            System.out.println("--> Seeded: ROLE_USER created successfully.");
        }

        // If ROLE_ADMIN doesn't exist in DB, create it
        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            roleRepository.save(new Role("ROLE_ADMIN"));
            System.out.println("--> Seeded: ROLE_ADMIN created successfully.");
        }
    }
}