package com.example.crm.lead.dto;

import com.example.crm.lead.model.LeadStatus;
import com.example.crm.lead.model.VietnamProvince;
import com.example.crm.lead.model.LeadSource;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class LeadResponse {
    private Long id;
    private String fullName;
    private VietnamProvince province;
    private String provinceDisplayName; // Tên hiển thị của tỉnh thành
    private String phone;
    private String email;
    private String company;
    private LeadSource source;
    private String sourceDisplayName;
    private LeadStatus status;
    private String statusDisplayName;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String areaDisplayName;
    
    // Creator info
    private Long creatorId;
    private String creatorUsername;
    private String creatorEmail;
    
    // Assigned user info
    private Long assignedUserId;
    private String assignedUsername;
    private String assignedEmail;
}
