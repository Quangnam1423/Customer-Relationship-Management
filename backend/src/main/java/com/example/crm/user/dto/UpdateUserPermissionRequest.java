package com.example.crm.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserPermissionRequest {
    private String role; // ROLE_USER, ROLE_TELESALES, ROLE_SALES, ROLE_MARKETING, ROLE_ADMIN
}
