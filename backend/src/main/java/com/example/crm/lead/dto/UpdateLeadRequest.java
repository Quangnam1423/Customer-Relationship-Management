package com.example.crm.lead.dto;

import com.example.crm.lead.model.LeadStatus;
import com.example.crm.lead.model.VietnamProvince;
import com.example.crm.lead.model.LeadSource;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateLeadRequest {
    private String fullName;
    private VietnamProvince province;
    private String phone;
    private String email;
    private String company;
    private LeadSource source;
    private LeadStatus status;
    private String notes;
    private Long assignedUserId;
    private String statusChangeNote; // Ghi chú khi thay đổi trạng thái
}
