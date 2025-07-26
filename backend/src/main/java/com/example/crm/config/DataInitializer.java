package com.example.crm.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.crm.user.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class DataInitializer implements CommandLineRunner{
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
    }

    private void initializeRoles() {
    }
}
