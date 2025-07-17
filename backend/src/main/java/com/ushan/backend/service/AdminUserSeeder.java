package com.ushan.backend.service;

import com.ushan.backend.entity.User;
import com.ushan.backend.repository.UserRepository;
import com.ushan.backend.util.Role;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@Profile({"dev", "test"}) // Only run this seeder in dev and test environments
public class AdminUserSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Inject UserRepository and PasswordEncoder
    public AdminUserSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct // This method will be called automatically after dependency injection is complete
    public void seedAdminUser() {
        log.info("Checking for existing admin user to seed if necessary...");

        // Check if an admin user already exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            log.info("Admin user not found. Seeding new admin user.");

            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@taskmanager.com"); // Add a default email
            adminUser.setPassword(passwordEncoder.encode("password")); // Hash the password
            adminUser.setRole(Role.ADMIN); // Set the role to ADMIN

            userRepository.save(adminUser);
            log.info("Admin user 'admin' seeded successfully with password 'password'.");
        } else {
            log.info("Admin user 'admin' already exists. Skipping seeding.");
        }
    }
}
