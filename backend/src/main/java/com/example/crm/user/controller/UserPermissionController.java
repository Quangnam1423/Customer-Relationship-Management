package com.example.crm.user.controller;

import com.example.crm.auth.dto.MessageResponse;
import com.example.crm.user.model.ERole;
import com.example.crm.user.service.UserPermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserPermissionController {

    private final UserPermissionService userPermissionService;

    /**
     * Cập nhật permission level cho user (chỉ admin mới được)
     */
    @PutMapping("/{userId}/permission")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserPermission(
            @PathVariable Long userId,
            @RequestParam int permissionLevel) {
        
        try {
            boolean success = userPermissionService.updateUserPermissionLevel(userId, permissionLevel);
            if (success) {
                ERole role = ERole.fromLevel(permissionLevel);
                return ResponseEntity.ok(new MessageResponse(
                    "User permission updated successfully to " + role.name()));
            } else {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("User not found"));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Invalid permission level: " + permissionLevel));
        }
    }

    /**
     * Lấy permission level của user
     */
    @GetMapping("/{userId}/permission")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserPermission(@PathVariable Long userId) {
        int permissionLevel = userPermissionService.getUserPermissionLevel(userId);
        if (permissionLevel >= 0) {
            ERole role = ERole.fromLevel(permissionLevel);
            return ResponseEntity.ok(new PermissionResponse(permissionLevel, role.name()));
        } else {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("User not found"));
        }
    }

    // DTO cho response
    public static class PermissionResponse {
        public int level;
        public String roleName;

        public PermissionResponse(int level, String roleName) {
            this.level = level;
            this.roleName = roleName;
        }
    }
}
