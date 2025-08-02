package com.example.crm.user.service;

import com.example.crm.user.model.ERole;
import com.example.crm.user.model.User;
import com.example.crm.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserPermissionService {

    private final UserRepository userRepository;

    /**
     * Cập nhật permission level cho user
     */
    @Transactional
    public boolean updateUserPermissionLevel(Long userId, ERole newRole) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setRole(newRole);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    /**
     * Cập nhật permission level cho user bằng level number
     */
    @Transactional
    public boolean updateUserPermissionLevel(Long userId, int permissionLevel) {
        try {
            ERole role = ERole.fromLevel(permissionLevel);
            return updateUserPermissionLevel(userId, role);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Kiểm tra user có quyền thực hiện action không
     */
    public boolean userHasPermission(Long userId, ERole requiredRole) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return userOpt.get().hasPermissionLevel(requiredRole);
        }
        return false;
    }

    /**
     * Kiểm tra user có quyền thực hiện action không bằng level
     */
    public boolean userHasPermission(Long userId, int requiredLevel) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return userOpt.get().hasPermissionLevel(requiredLevel);
        }
        return false;
    }

    /**
     * Lấy permission level của user
     */
    public int getUserPermissionLevel(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return userOpt.get().getPermissionLevel();
        }
        return -1; // User không tồn tại
    }

    /**
     * Lấy role chính của user
     */
    public ERole getUserPrimaryRole(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return userOpt.get().getPrimaryRole();
        }
        return null;
    }
}
