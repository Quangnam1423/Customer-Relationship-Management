package com.example.crm.auth.repository;

import com.example.crm.auth.model.PasswordResetToken;
import com.example.crm.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUserAndUsedFalse(User user);
    void deleteByUser(User user);
    void deleteByUsedTrueOrExpiryDateBefore(java.time.LocalDateTime dateTime);
}
