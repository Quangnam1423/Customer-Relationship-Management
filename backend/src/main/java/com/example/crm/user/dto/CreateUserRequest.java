package com.example.crm.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;
    private String company;
    private String bio;
    private String role; // ROLE_USER, ROLE_TELESALES, ROLE_SALES, ROLE_MARKETING, ROLE_ADMIN
}
