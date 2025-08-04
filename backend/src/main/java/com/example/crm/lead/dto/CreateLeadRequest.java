package com.example.crm.lead.dto;

import com.example.crm.lead.model.VietnamProvince;
import com.example.crm.lead.model.LeadSource;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateLeadRequest {
    private String fullName;
    private VietnamProvince province;
    private String phone;
    private String email;
    private String company;
    private LeadSource source;
    private String notes;
    private Long assignedUserId; // Có thể null
}
