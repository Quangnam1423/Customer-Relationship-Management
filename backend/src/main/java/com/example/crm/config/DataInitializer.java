package com.example.crm.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.crm.user.model.ERole;
import com.example.crm.user.model.Role;
import com.example.crm.user.model.User;
import com.example.crm.user.repository.RoleRepository;
import com.example.crm.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner{
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeUsers();
    }

    private void initializeRoles() {
        // Initialize roles if they don't exist
        createRoleIfNotExists(ERole.ROLE_USER);
        createRoleIfNotExists(ERole.ROLE_ADMIN);
        createRoleIfNotExists(ERole.ROLE_MARKETING);
        createRoleIfNotExists(ERole.ROLE_TELESALES);
        createRoleIfNotExists(ERole.ROLE_SALES);
    }

    private void createRoleIfNotExists(ERole roleName) {
        try {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
                System.out.println("Created " + roleName);
            } else {
                System.out.println(roleName + " already exists");
            }
        } catch (Exception e) {
            System.out.println("Error creating " + roleName + ": " + e.getMessage());
        }
    }

    private void initializeUsers() {
        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@crm.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(ERole.ROLE_ADMIN);
            
            Set<Role> adminRoles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));
            adminRoles.add(adminRole);
            admin.setRoles(adminRoles);
            
            userRepository.save(admin);
            System.out.println("Created admin user: admin/admin123");
        }

        if (!userRepository.existsByUsername("marketing")) {
            User marketingUser = new User();
            marketingUser.setUsername("marketing");
            marketingUser.setEmail("marketing@crm.com");
            marketingUser.setPassword(passwordEncoder.encode("marketing123"));
            marketingUser.setRole(ERole.ROLE_MARKETING);

            Set<Role> marketingRoles = new HashSet<>();
            Role marketingRole = roleRepository.findByName(ERole.ROLE_MARKETING)
                .orElseThrow(() -> new RuntimeException("Marketing role not found"));
            marketingRoles.add(marketingRole);
            marketingUser.setRoles(marketingRoles);

            userRepository.save(marketingUser);
            System.out.println("Created marketing user: marketing/marketing123");
        }

        if (!userRepository.existsByUsername("telesales")) {
            User telesalesUser = new User();
            telesalesUser.setUsername("telesales");
            telesalesUser.setEmail("telesales@crm.com");
            telesalesUser.setPassword(passwordEncoder.encode("telesales123"));
            telesalesUser.setRole(ERole.ROLE_TELESALES);

            Set<Role> telesalesRoles = new HashSet<>();
            Role telesalesRole = roleRepository.findByName(ERole.ROLE_TELESALES)
                .orElseThrow(() -> new RuntimeException("Telesales role not found"));
            telesalesRoles.add(telesalesRole);
            telesalesUser.setRoles(telesalesRoles);

            userRepository.save(telesalesUser);
            System.out.println("Created telesales user: telesales/telesales123");
        }

        // Create regular user if not exists
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@crm.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(ERole.ROLE_USER);
            
            Set<Role> userRoles = new HashSet<>();
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("User role not found"));
            userRoles.add(userRole);
            user.setRoles(userRoles);
            
            userRepository.save(user);
            System.out.println("Created regular user: user/user123");
        }
    }
}
