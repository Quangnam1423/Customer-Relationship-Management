package com.example.crm.statistics.controller;

import com.example.crm.lead.repository.LeadRepository;
import com.example.crm.statistics.dto.StatisticsFilterRequest;
import com.example.crm.statistics.dto.StatisticsResponse;
import com.example.crm.statistics.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StatisticsController {
    
    private final StatisticsService statisticsService;
    private final LeadRepository leadRepository;
    
    @PostMapping("/leads")
    public ResponseEntity<StatisticsResponse> getLeadStatistics(@RequestBody StatisticsFilterRequest filter) {
        System.out.println("=== Statistics API called ===");
        System.out.println("Filter: " + filter);
        
        // Debug: Check total leads count
        long totalLeads = leadRepository.count();
        System.out.println("Total leads in database: " + totalLeads);
        
        StatisticsResponse statistics = statisticsService.getLeadStatistics(filter);
        System.out.println("Response: " + statistics);
        return ResponseEntity.ok(statistics);
    }
    
    @GetMapping("/leads")
    public ResponseEntity<StatisticsResponse> getLeadStatisticsDefault() {
        // Mặc định: tất cả lead từ đầu đến hiện tại
        StatisticsFilterRequest defaultFilter = new StatisticsFilterRequest();
        StatisticsResponse statistics = statisticsService.getLeadStatistics(defaultFilter);
        return ResponseEntity.ok(statistics);
    }
}
