package com.example.crm.lead.controller;

import com.example.crm.lead.model.Lead;
import com.example.crm.lead.service.LeadService;
import com.example.crm.opportunity.model.Opportunity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    public ResponseEntity<Lead> createLead(@RequestBody Lead lead) {
        Lead createdLead = leadService.createLead(lead);
        return ResponseEntity.ok(createdLead);
    }

    @PostMapping("/{id}/convert")
    public ResponseEntity<Opportunity> convertLead(@PathVariable Long id) {
        Opportunity opportunity = leadService.convertLeadToOpportunity(id);
        return ResponseEntity.ok(opportunity);
    }
}
