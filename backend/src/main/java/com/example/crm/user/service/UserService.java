package com.example.crm.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.crm.user.model.Role;
import com.example.crm.user.model.User;
import com.example.crm.user.repository.UserRepository;
import com.example.crm.user.dto.UpdateUserRequest;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean phoneNumberExists(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }

    // create a new user
    // checks if username, email, and phone number already exist
    public User saveUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already exists");
        }
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, UpdateUserRequest userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (userDetails.getUsername() != null) {
            user.setUsername(userDetails.getUsername());
        }
        if (userDetails.getEmail() != null) {
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getPhoneNumber() != null) {
            user.setPhoneNumber(userDetails.getPhoneNumber());
        }
        if (userDetails.getAddress() != null) {
            user.setAddress(userDetails.getAddress());
        }
        if (userDetails.getFullName() != null) {
            user.setFullName(userDetails.getFullName());
        }
        if (userDetails.getAvatar() != null) {
            user.setAvatar(userDetails.getAvatar());
        }

        return userRepository.save(user);
    }

    public User updateUserRoles(Long id, Set<Role> roles) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setRoles(roles);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
