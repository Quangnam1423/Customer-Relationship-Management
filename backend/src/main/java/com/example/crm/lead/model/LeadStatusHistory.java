package com.example.crm.lead.model;

import com.example.crm.user.model.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_status_history")
@Getter
@Setter
@NoArgsConstructor
public class LeadStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private Lead lead; // Lead được cập nhật

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status")
    private LeadStatus oldStatus; // Trạng thái cũ (có thể null nếu là lần đầu tạo)

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private LeadStatus newStatus; // Trạng thái mới

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", nullable = false)
    private User updatedBy; // Người thực hiện thay đổi

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes; // Ghi chú về sự thay đổi

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // Thời gian thay đổi

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public LeadStatusHistory(Lead lead, LeadStatus oldStatus, LeadStatus newStatus, User updatedBy, String notes) {
        this.lead = lead;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.updatedBy = updatedBy;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }
}
