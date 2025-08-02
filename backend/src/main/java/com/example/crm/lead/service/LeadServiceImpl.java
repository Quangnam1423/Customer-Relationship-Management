package com.example.crm.lead.service;

import com.example.crm.account.model.Account;
import com.example.crm.account.repository.AccountRepository;
import com.example.crm.contact.model.Contact;
import com.example.crm.contact.repository.ContactRepository;
import com.example.crm.customer.model.Customer;
import com.example.crm.customer.repository.CustomerRepository;
import com.example.crm.lead.model.Lead;
import com.example.crm.lead.model.LeadStatus;
import com.example.crm.lead.repository.LeadRepository;
import com.example.crm.opportunity.model.Opportunity;
import com.example.crm.opportunity.model.OpportunityStage;
import com.example.crm.opportunity.repository.OpportunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private final OpportunityRepository opportunityRepository;
    private final AccountRepository accountRepository;
    private final ContactRepository contactRepository;
    private final CustomerRepository customerRepository;

    @Override
    public Lead createLead(Lead lead) {
        lead.setStatus(LeadStatus.NEW);
        return leadRepository.save(lead);
    }

    @Override
    @Transactional
    public Opportunity convertLeadToOpportunity(Long leadId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        lead.setStatus(LeadStatus.CONVERTED);
        leadRepository.save(lead);

        // Create Account, Contact, and Opportunity from Lead data
        Account account = new Account();
        account.setCompanyName(lead.getName()); // Assuming lead name is company name
        account.setAssignedUser(lead.getAssignedUser());
        account = accountRepository.save(account);

        Contact contact = new Contact();
        contact.setFirstName(lead.getName()); // Or parse from name
        contact.setEmail(lead.getEmail());
        contact.setPhone(lead.getPhone());
        contact.setAccount(account);
        contact.setAssignedUser(lead.getAssignedUser());
        contactRepository.save(contact);

        Opportunity opportunity = new Opportunity();
        opportunity.setName("Opportunity from " + lead.getName());
        opportunity.setAccount(account);
        opportunity.setStage(OpportunityStage.QUALIFICATION);
        opportunity.setAssignedUser(lead.getAssignedUser());
        // Set other opportunity fields as needed

        return opportunityRepository.save(opportunity);
    }
}
