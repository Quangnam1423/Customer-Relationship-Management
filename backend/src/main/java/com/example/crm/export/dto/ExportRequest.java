package com.example.crm.export.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class ExportRequest {
    private List<String> fields;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long assignedUserId;
    private Boolean myLeadsOnly;
    private String status;
    private String source;
}
