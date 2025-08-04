package com.example.crm.lead.model;

import com.example.crm.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName; // Tên khách hàng

    @Enumerated(EnumType.STRING)
    @Column(name = "province")
    private VietnamProvince province; // Tỉnh thành Việt Nam

    @Column(name = "phone", nullable = false)
    private String phone; // Số điện thoại

    @Column(name = "email")
    private String email; // Email

    @Column(name = "company")
    private String company; // Công ty

    @Enumerated(EnumType.STRING)
    @Column(name = "source")
    private LeadSource source; // Nguồn lead

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LeadStatus status; // Trạng thái lead

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes; // Ghi chú sau mỗi cuộc gọi

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator; // Người tạo lead

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser; // Nhân viên được assign (có thể null)

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        // Mặc định trạng thái là CHUA_GOI
        if (status == null) {
            status = LeadStatus.CHUA_GOI;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
