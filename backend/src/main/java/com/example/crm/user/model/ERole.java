package com.example.crm.user.model;

public enum ERole {
    ROLE_USER(0),           // Chưa có quyền gì, user thường
    ROLE_ADMIN(1),          // Quyền cao nhất, quản lý toàn hệ thống
    ROLE_MARKETING(2),      // Quyền marketing
    ROLE_TELESALES(3),      // Quyền telesales
    ROLE_SALES(4);          // Quyền sales

    private final int level;

    ERole(int level) {
        this.level = level;
    }

    public int getLevel() {
        return level;
    }

    // Phương thức để kiểm tra quyền hạn
    public boolean hasPermissionLevel(int requiredLevel) {
        return this.level >= requiredLevel;
    }

    // Phương thức để kiểm tra quyền cao hơn role khác
    public boolean hasHigherPermissionThan(ERole otherRole) {
        return this.level > otherRole.getLevel();
    }

    // Phương thức để lấy role từ level
    public static ERole fromLevel(int level) {
        for (ERole role : ERole.values()) {
            if (role.getLevel() == level) {
                return role;
            }
        }
        throw new IllegalArgumentException("No role found for level: " + level);
    }
}
