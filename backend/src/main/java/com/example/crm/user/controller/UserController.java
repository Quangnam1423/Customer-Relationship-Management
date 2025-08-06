package com.example.crm.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.crm.user.dto.UserDTO;
import com.example.crm.user.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder encoder;

    // Get all assignable users (excluding admin)
    @GetMapping("/assignable")
    public ResponseEntity<List<UserDTO>> getAssignableUsers() {
        List<UserDTO> users = userService.getAssignableUsers();
        return ResponseEntity.ok(users);
    }

}
