package com.example.crm.lead.controller;

import com.example.crm.lead.dto.CreateLeadRequest;
import com.example.crm.lead.dto.LeadResponse;
import com.example.crm.lead.dto.UpdateLeadRequest;
import com.example.crm.lead.model.LeadStatus;
import com.example.crm.lead.model.VietnamProvince;
import com.example.crm.lead.service.LeadService;
import com.example.crm.auth.security.service.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class LeadController {

    private final LeadService leadService;

    // Create new lead
    @PostMapping
    public ResponseEntity<LeadResponse> createLead(@RequestBody CreateLeadRequest request, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        LeadResponse response = leadService.createLead(request, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    // Update lead
    @PutMapping("/{id}")
    public ResponseEntity<LeadResponse> updateLead(@PathVariable Long id, 
                                                  @RequestBody UpdateLeadRequest request, 
                                                  Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        LeadResponse response = leadService.updateLead(id, request, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    // Get lead by ID
    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> getLeadById(@PathVariable Long id) {
        LeadResponse response = leadService.getLeadByIdWithHistory(id);
        return ResponseEntity.ok(response);
    }

    // Delete lead
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.ok().build();
    }

    // Get all leads (default sorted by updated_at desc)
    @GetMapping
    public ResponseEntity<List<LeadResponse>> getAllLeads() {
        List<LeadResponse> leads = leadService.getAllLeadsOrderByUpdatedAt();
        return ResponseEntity.ok(leads);
    }

    // Get leads assigned to current user
    @GetMapping("/my-assigned")
    public ResponseEntity<List<LeadResponse>> getMyAssignedLeads(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<LeadResponse> leads = leadService.getLeadsByAssignedUser(userDetails.getId());
        return ResponseEntity.ok(leads);
    }

    // Get leads created by current user
    @GetMapping("/my-created")
    public ResponseEntity<List<LeadResponse>> getMyCreatedLeads(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<LeadResponse> leads = leadService.getLeadsByCreator(userDetails.getId());
        return ResponseEntity.ok(leads);
    }

    // Get leads by assigned user
    @GetMapping("/assigned/{userId}")
    public ResponseEntity<List<LeadResponse>> getLeadsByAssignedUser(@PathVariable Long userId) {
        List<LeadResponse> leads = leadService.getLeadsByAssignedUser(userId);
        return ResponseEntity.ok(leads);
    }

    // Get leads by creator
    @GetMapping("/created-by/{creatorId}")
    public ResponseEntity<List<LeadResponse>> getLeadsByCreator(@PathVariable Long creatorId) {
        List<LeadResponse> leads = leadService.getLeadsByCreator(creatorId);
        return ResponseEntity.ok(leads);
    }

    // Get leads by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<LeadResponse>> getLeadsByStatus(@PathVariable LeadStatus status) {
        List<LeadResponse> leads = leadService.getLeadsByStatus(status);
        return ResponseEntity.ok(leads);
    }

    // Filter leads
    @GetMapping("/filter")
    public ResponseEntity<List<LeadResponse>> filterLeads(
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String interestField,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(required = false) Long assignedUserId,
            @RequestParam(required = false) Long creatorId) {
        
        VietnamProvince province = area != null ? VietnamProvince.valueOf(area) : null;
        List<LeadResponse> leads = leadService.filterLeads(customerName, province, phone, 
                                                          email, interestField, source, 
                                                          status, assignedUserId, creatorId);
        return ResponseEntity.ok(leads);
    }

    // Search leads by customer name
    @GetMapping("/search/customer")
    public ResponseEntity<List<LeadResponse>> searchByCustomerName(@RequestParam String name) {
        List<LeadResponse> leads = leadService.searchLeadsByCustomerName(name);
        return ResponseEntity.ok(leads);
    }

    // Search leads by phone
    @GetMapping("/search/phone")
    public ResponseEntity<List<LeadResponse>> searchByPhone(@RequestParam String phone) {
        List<LeadResponse> leads = leadService.searchLeadsByPhone(phone);
        return ResponseEntity.ok(leads);
    }

    // Search leads by area
    @GetMapping("/search/area")
    public ResponseEntity<List<LeadResponse>> searchByArea(@RequestParam String area) {
        List<LeadResponse> leads = leadService.searchLeadsByArea(VietnamProvince.valueOf(area));
        return ResponseEntity.ok(leads);
    }

    // Search leads by interest field
    @GetMapping("/search/interest")
    public ResponseEntity<List<LeadResponse>> searchByInterestField(@RequestParam String field) {
        List<LeadResponse> leads = leadService.searchLeadsByInterestField(field);
        return ResponseEntity.ok(leads);
    }

    // Update lead status and notes (after phone call)
    @PatchMapping("/{id}/status")
    public ResponseEntity<LeadResponse> updateLeadStatus(@PathVariable Long id,
                                                        @RequestParam LeadStatus status,
                                                        @RequestParam(required = false) String notes,
                                                        Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        LeadResponse response = leadService.updateLeadStatus(id, status, notes, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    // Assign lead to user
    @PatchMapping("/{id}/assign")
    public ResponseEntity<LeadResponse> assignLeadToUser(@PathVariable Long id,
                                                        @RequestParam Long userId,
                                                        Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        LeadResponse response = leadService.assignLeadToUser(id, userId, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    // Get lead status report
    @GetMapping("/reports/status")
    public ResponseEntity<Map<LeadStatus, Long>> getLeadStatusReport() {
        Map<LeadStatus, Long> report = leadService.getLeadStatusReport();
        return ResponseEntity.ok(report);
    }

    // Get lead source report
    @GetMapping("/reports/source")
    public ResponseEntity<Map<String, Long>> getLeadSourceReport() {
        Map<String, Long> report = leadService.getLeadSourceReport();
        return ResponseEntity.ok(report);
    }

    // Get leads created in date range
    @GetMapping("/reports/created")
    public ResponseEntity<List<LeadResponse>> getLeadsCreatedBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<LeadResponse> leads = leadService.getLeadsCreatedBetween(startDate, endDate);
        return ResponseEntity.ok(leads);
    }

    // Get leads updated in date range
    @GetMapping("/reports/updated")
    public ResponseEntity<List<LeadResponse>> getLeadsUpdatedBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<LeadResponse> leads = leadService.getLeadsUpdatedBetween(startDate, endDate);
        return ResponseEntity.ok(leads);
    }

    // Get all lead statuses with display names
    @GetMapping("/statuses")
    public ResponseEntity<List<Map<String, String>>> getAllLeadStatuses() {
        List<Map<String, String>> statuses = Arrays.stream(LeadStatus.values())
                .map(status -> Map.of(
                        "value", status.name(),
                        "label", status.getDisplayName()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(statuses);
    }
    
    // Get status history for a lead
    @GetMapping("/{id}/status-history")
    public ResponseEntity<?> getLeadStatusHistory(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(leadService.getLeadStatusHistory(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
