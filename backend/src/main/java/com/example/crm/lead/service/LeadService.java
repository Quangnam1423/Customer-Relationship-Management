package com.example.crm.lead.service;

import com.example.crm.lead.model.Lead;
import com.example.crm.opportunity.model.Opportunity;

public interface LeadService {
    Lead createLead(Lead lead);
    Opportunity convertLeadToOpportunity(Long leadId);
}
