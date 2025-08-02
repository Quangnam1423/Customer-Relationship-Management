package com.example.crm.auth.controller;

import com.example.crm.user.model.User;
import com.example.crm.user.repository.UserRepository;
import com.example.crm.user.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy danh sách tất cả users (chỉ admin)
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = users.stream()
            .map(user -> new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPermissionLevel(),
                user.isEnabled(),
                user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toList())
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(userDTOs);
    }

    /**
     * Lấy thống kê hệ thống
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSystemStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByEnabledTrue();
        
        AdminStats stats = new AdminStats();
        stats.setTotalUsers(totalUsers);
        stats.setActiveUsers(activeUsers);
        stats.setNewUsersThisMonth(12L); // TODO: Implement actual calculation
        stats.setTotalCustomers(89L); // TODO: Implement when Customer entity is ready
        stats.setTotalLeads(234L); // TODO: Implement when Lead entity is ready
        stats.setTotalOpportunities(45L); // TODO: Implement when Opportunity entity is ready
        
        return ResponseEntity.ok(stats);
    }

    /**
     * Vô hiệu hóa/kích hoạt user
     */
    @PutMapping("/users/{userId}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse(
            "User status updated to " + (user.isEnabled() ? "enabled" : "disabled")));
    }

    /**
     * Xóa user
     */
    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("User not found"));
        }
        
        userRepository.deleteById(userId);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }

    // DTO classes
    public static class AdminStats {
        private long totalUsers;
        private long activeUsers;
        private long newUsersThisMonth;
        private long totalCustomers;
        private long totalLeads;
        private long totalOpportunities;

        // Getters and setters
        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        
        public long getActiveUsers() { return activeUsers; }
        public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
        
        public long getNewUsersThisMonth() { return newUsersThisMonth; }
        public void setNewUsersThisMonth(long newUsersThisMonth) { this.newUsersThisMonth = newUsersThisMonth; }
        
        public long getTotalCustomers() { return totalCustomers; }
        public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }
        
        public long getTotalLeads() { return totalLeads; }
        public void setTotalLeads(long totalLeads) { this.totalLeads = totalLeads; }
        
        public long getTotalOpportunities() { return totalOpportunities; }
        public void setTotalOpportunities(long totalOpportunities) { this.totalOpportunities = totalOpportunities; }
    }

    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
