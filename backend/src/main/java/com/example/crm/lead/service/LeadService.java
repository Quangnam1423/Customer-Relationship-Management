package com.example.crm.lead.service;

import com.example.crm.lead.dto.CreateLeadRequest;
import com.example.crm.lead.dto.LeadResponse;
import com.example.crm.lead.dto.UpdateLeadRequest;
import com.example.crm.lead.model.Lead;
import com.example.crm.lead.model.LeadStatus;
import com.example.crm.lead.model.VietnamProvince;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface LeadService {
    
    // CRUD operations
    LeadResponse createLead(CreateLeadRequest request, Long creatorId);
    LeadResponse updateLead(Long leadId, UpdateLeadRequest request, Long updaterId);
    LeadResponse getLeadById(Long leadId);
    void deleteLead(Long leadId);
    
    // Listing operations
    List<LeadResponse> getAllLeads();
    List<LeadResponse> getAllLeadsOrderByUpdatedAt();
    List<LeadResponse> getLeadsByAssignedUser(Long userId);
    List<LeadResponse> getLeadsByCreator(Long creatorId);
    List<LeadResponse> getLeadsByStatus(LeadStatus status);
    
    // Filter operations
    List<LeadResponse> filterLeads(String customerName, VietnamProvince area, String phone, 
                                  String email, String interestField, String source, 
                                  LeadStatus status, Long assignedUserId, Long creatorId);
    
    // Search operations
    List<LeadResponse> searchLeadsByCustomerName(String customerName);
    List<LeadResponse> searchLeadsByPhone(String phone);
    List<LeadResponse> searchLeadsByArea(VietnamProvince area);
    List<LeadResponse> searchLeadsByRegion(String region);
    List<LeadResponse> searchLeadsByInterestField(String interestField);
    
    // Report operations
    Map<LeadStatus, Long> getLeadStatusReport();
    Map<String, Long> getLeadSourceReport();
    Map<VietnamProvince, Long> getLeadAreaReport();
    Map<String, Long> getLeadRegionReport();
    List<LeadResponse> getLeadsCreatedBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<LeadResponse> getLeadsUpdatedBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Update status with notes
    LeadResponse updateLeadStatus(Long leadId, LeadStatus status, String notes, Long updaterId);
    
    // Assign lead to user
    LeadResponse assignLeadToUser(Long leadId, Long userId, Long assignerId);
}
