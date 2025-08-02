package com.example.crm.user.dto;

import java.util.List;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private int permissionLevel;
    private boolean enabled;
    private List<String> roles;

    public UserDTO(Long id, String username, String email, int permissionLevel, boolean enabled, List<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.permissionLevel = permissionLevel;
        this.enabled = enabled;
        this.roles = roles;
    }

    public UserDTO(Long id, String username, String email, String phoneNumber, List<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public int getPermissionLevel() {
        return permissionLevel;
    }

    public void setPermissionLevel(int permissionLevel) {
        this.permissionLevel = permissionLevel;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
