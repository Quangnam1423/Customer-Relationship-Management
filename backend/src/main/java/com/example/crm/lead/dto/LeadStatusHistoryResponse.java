package com.example.crm.lead.dto;

import com.example.crm.lead.model.LeadStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class LeadStatusHistoryResponse {
    private Long id;
    private LeadStatus oldStatus;
    private LeadStatus newStatus;
    private String updatedByName;
    private Long updatedById;
    private String notes;
    private LocalDateTime createdAt;

    public LeadStatusHistoryResponse(Long id, LeadStatus oldStatus, LeadStatus newStatus, 
                                   String updatedByName, Long updatedById, String notes, LocalDateTime createdAt) {
        this.id = id;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.updatedByName = updatedByName;
        this.updatedById = updatedById;
        this.notes = notes;
        this.createdAt = createdAt;
    }
}
