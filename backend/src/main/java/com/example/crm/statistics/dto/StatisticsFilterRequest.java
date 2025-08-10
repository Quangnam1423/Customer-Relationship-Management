package com.example.crm.statistics.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsFilterRequest {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long assignedUserId; // null = tất cả, current user = chỉ của tôi, specific id = của user đó
    private Boolean myLeadsOnly = false; // true = chỉ lead được gán cho user hiện tại
}
