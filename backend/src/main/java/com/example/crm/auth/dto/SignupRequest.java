package com.example.crm.auth.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class SignupRequest {
    private String username;
    private String email;
    private String password;
    private Set<String> role;
}
