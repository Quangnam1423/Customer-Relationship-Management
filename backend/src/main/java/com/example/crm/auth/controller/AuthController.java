package com.example.crm.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.crm.user.model.ERole;
import com.example.crm.user.model.Role;
import com.example.crm.user.model.User;
import com.example.crm.user.repository.RoleRepository;
import com.example.crm.user.repository.UserRepository;
import com.example.crm.auth.dto.JwtResponse;
import com.example.crm.auth.dto.LoginRequest;
import com.example.crm.auth.dto.MessageResponse;
import com.example.crm.auth.dto.SignupRequest;
import com.example.crm.auth.dto.ForgotPasswordRequest;
import com.example.crm.auth.dto.ResetPasswordRequest;
import com.example.crm.auth.dto.ChangePasswordRequest;
import com.example.crm.auth.model.PasswordResetToken;
import com.example.crm.auth.repository.PasswordResetTokenRepository;
import com.example.crm.auth.service.EmailService;
import com.example.crm.auth.security.jwt.JwtUtils;
import com.example.crm.auth.security.service.UserDetailsImpl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Get user to access permissionLevel
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles,
                user.getPermissionLevel()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        // Set default permission level to ROLE_USER (0)
        user.setRole(ERole.ROLE_USER);

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
            
            if (!userOptional.isPresent()) {
                // Don't reveal that email doesn't exist for security reasons
                return ResponseEntity.ok(new MessageResponse("If your email exists, you will receive a password reset link."));
            }

            User user = userOptional.get();
            
            // Delete any existing tokens for this user
            tokenRepository.deleteByUser(user);
            
            // Generate new reset token
            String resetToken = UUID.randomUUID().toString();
            PasswordResetToken token = new PasswordResetToken(resetToken, user);
            tokenRepository.save(token);
            
            // Send email with reset link
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
            
            return ResponseEntity.ok(new MessageResponse("If your email exists, you will receive a password reset link."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(request.getToken());
            
            if (!tokenOptional.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid or expired reset token."));
            }

            PasswordResetToken resetToken = tokenOptional.get();
            
            if (!resetToken.isValid()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid or expired reset token."));
            }

            // Update user's password
            User user = resetToken.getUser();
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);
            
            // Mark token as used
            resetToken.setUsed(true);
            tokenRepository.save(resetToken);
            
            // Send confirmation email
            emailService.sendPasswordChangeConfirmation(user.getEmail());
            
            return ResponseEntity.ok(new MessageResponse("Password has been reset successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        try {
            Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
            
            if (!tokenOptional.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid reset token."));
            }

            PasswordResetToken resetToken = tokenOptional.get();
            
            if (!resetToken.isValid()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Expired reset token."));
            }

            return ResponseEntity.ok(new MessageResponse("Token is valid."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request,
                                          Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<User> userOptional = userRepository.findByUsername(username);
            
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found."));
            }

            User user = userOptional.get();
            
            // Verify current password
            if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Current password is incorrect."));
            }

            // Update password
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);

            // Send confirmation email
            emailService.sendPasswordChangeConfirmation(user.getEmail());

            return ResponseEntity.ok(new MessageResponse("Password has been changed successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
