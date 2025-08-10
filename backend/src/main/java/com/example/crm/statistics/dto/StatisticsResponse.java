package com.example.crm.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatisticsResponse {
    private Map<String, Long> statusStatistics;
    private Map<String, Long> sourceStatistics;
    private Map<String, Long> assignedUserStatistics;
    private long totalLeads;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChartData {
        private String label;
        private long value;
        private String color;
    }
}
