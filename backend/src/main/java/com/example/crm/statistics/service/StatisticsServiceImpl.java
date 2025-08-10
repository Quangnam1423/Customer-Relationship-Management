package com.example.crm.statistics.service;

import com.example.crm.lead.model.Lead;
import com.example.crm.lead.repository.LeadRepository;
import com.example.crm.statistics.dto.StatisticsFilterRequest;
import com.example.crm.statistics.dto.StatisticsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {
    
    private final LeadRepository leadRepository;

    @Override
    public StatisticsResponse getLeadStatistics(StatisticsFilterRequest filter) {
        // Get filtered leads
        List<Lead> leads = getFilteredLeads(filter);
        
        // Calculate statistics
        Map<String, Long> statusStats = calculateStatusStatistics(leads);
        Map<String, Long> sourceStats = calculateSourceStatistics(leads);
        Map<String, Long> assignedUserStats = calculateAssignedUserStatistics(leads);
        
        return new StatisticsResponse(
            statusStats,
            sourceStats,
            assignedUserStats,
            leads.size()
        );
    }
    
    private List<Lead> getFilteredLeads(StatisticsFilterRequest filter) {
        List<Lead> allLeads = leadRepository.findAll();
        
        return allLeads.stream()
            .filter(lead -> {
                // Filter by date range
                if (filter.getStartDate() != null) {
                    LocalDateTime leadCreatedAt = lead.getCreatedAt();
                    if (leadCreatedAt.isBefore(filter.getStartDate())) {
                        return false;
                    }
                }
                
                if (filter.getEndDate() != null) {
                    LocalDateTime leadCreatedAt = lead.getCreatedAt();
                    if (leadCreatedAt.isAfter(filter.getEndDate())) {
                        return false;
                    }
                }
                
                // Filter by assigned user
                if (filter.getAssignedUserId() != null) {
                    if (lead.getAssignedUser() == null) {
                        return false;
                    }
                    return lead.getAssignedUser().getId().equals(filter.getAssignedUserId());
                }
                
                return true;
            })
            .collect(Collectors.toList());
    }
    
    private Map<String, Long> calculateStatusStatistics(List<Lead> leads) {
        return leads.stream()
            .collect(Collectors.groupingBy(
                lead -> lead.getStatus().getDisplayName(),
                Collectors.counting()
            ));
    }
    
    private Map<String, Long> calculateSourceStatistics(List<Lead> leads) {
        return leads.stream()
            .collect(Collectors.groupingBy(
                lead -> lead.getSource().getDisplayName(),
                Collectors.counting()
            ));
    }
    
    private Map<String, Long> calculateAssignedUserStatistics(List<Lead> leads) {
        return leads.stream()
            .collect(Collectors.groupingBy(
                lead -> {
                    if (lead.getAssignedUser() != null) {
                        return lead.getAssignedUser().getFullName() != null ? 
                               lead.getAssignedUser().getFullName() : 
                               lead.getAssignedUser().getUsername();
                    }
                    return "Chưa phân công";
                },
                Collectors.counting()
            ));
    }
}
