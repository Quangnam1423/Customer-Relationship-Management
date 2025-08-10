package com.example.crm.auth.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendPasswordResetEmail(String email, String resetToken) {
        // In a real application, you would send an actual email here
        // For now, we'll just log the reset link
        String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;
        
        System.out.println("=== PASSWORD RESET EMAIL ===");
        System.out.println("To: " + email);
        System.out.println("Subject: Password Reset Request");
        System.out.println("Reset URL: " + resetUrl);
        System.out.println("Token: " + resetToken);
        System.out.println("This link will expire in 24 hours.");
        System.out.println("============================");
        
        // TODO: Implement actual email sending using JavaMailSender
        // Example:
        // SimpleMailMessage message = new SimpleMailMessage();
        // message.setTo(email);
        // message.setSubject("Password Reset Request");
        // message.setText("Click the following link to reset your password: " + resetUrl);
        // mailSender.send(message);
    }

    public void sendPasswordChangeConfirmation(String email) {
        System.out.println("=== PASSWORD CHANGED CONFIRMATION ===");
        System.out.println("To: " + email);
        System.out.println("Subject: Password Changed Successfully");
        System.out.println("Your password has been changed successfully.");
        System.out.println("====================================");
    }
}
