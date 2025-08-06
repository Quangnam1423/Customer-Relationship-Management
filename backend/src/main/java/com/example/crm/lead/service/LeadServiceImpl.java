package com.example.crm.lead.service;

import com.example.crm.lead.dto.CreateLeadRequest;
import com.example.crm.lead.dto.LeadResponse;
import com.example.crm.lead.dto.UpdateLeadRequest;
import com.example.crm.lead.model.Lead;
import com.example.crm.lead.model.LeadStatus;
import com.example.crm.lead.model.VietnamProvince;
import com.example.crm.lead.repository.LeadRepository;
import com.example.crm.user.model.User;
import com.example.crm.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public LeadResponse createLead(CreateLeadRequest request, Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        Lead lead = new Lead();
        lead.setFullName(request.getFullName());
        lead.setProvince(request.getProvince());
        lead.setPhone(request.getPhone());
        lead.setEmail(request.getEmail());
        lead.setCompany(request.getCompany());
        lead.setSource(request.getSource());
        lead.setNotes(request.getNotes());
        lead.setCreator(creator);
        
        // Assign user if provided
        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            lead.setAssignedUser(assignedUser);
        }

        lead = leadRepository.save(lead);
        return convertToResponse(lead);
    }

    @Override
    @Transactional
    public LeadResponse updateLead(Long leadId, UpdateLeadRequest request, Long updaterId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        User updater = userRepository.findById(updaterId)
                .orElseThrow(() -> new RuntimeException("Updater not found"));

        // Update fields if provided
        if (request.getFullName() != null) {
            lead.setFullName(request.getFullName());
        }
        if (request.getProvince() != null) {
            lead.setProvince(request.getProvince());
        }
        if (request.getPhone() != null) {
            lead.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            lead.setEmail(request.getEmail());
        }
        if (request.getCompany() != null) {
            lead.setCompany(request.getCompany());
        }
        if (request.getSource() != null) {
            lead.setSource(request.getSource());
        }
        if (request.getStatus() != null) {
            lead.setStatus(request.getStatus());
        }
        if (request.getNotes() != null) {
            lead.setNotes(request.getNotes());
        }
        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            lead.setAssignedUser(assignedUser);
        }

        lead = leadRepository.save(lead);
        return convertToResponse(lead);
    }

    @Override
    public LeadResponse getLeadById(Long leadId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        return convertToResponse(lead);
    }

    @Override
    @Transactional
    public void deleteLead(Long leadId) {
        if (!leadRepository.existsById(leadId)) {
            throw new RuntimeException("Lead not found");
        }
        leadRepository.deleteById(leadId);
    }

    @Override
    public List<LeadResponse> getAllLeads() {
        return leadRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeadResponse> getAllLeadsOrderByUpdatedAt() {
        return leadRepository.findAllOrderByUpdatedAtDesc().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeadResponse> getLeadsByAssignedUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return leadRepository.findByAssignedUser(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeadResponse> getLeadsByCreator(Long creatorId) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Creator not found"));
        return leadRepository.findByCreator(creator).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeadResponse> getLeadsByStatus(LeadStatus status) {
        return leadRepository.findByStatus(status).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    @Override
    public List<LeadResponse> filterLeads(String customerName, VietnamProvince area, String phone,
                                         String email, String interestField, String source,
                                         LeadStatus status, Long assignedUserId, Long creatorId) {
        // Implement complex filtering logic here
        // For now, return all leads and filter in memory (not efficient for large datasets)
        List<Lead> leads = leadRepository.findAll();
        
        return leads.stream()
                .filter(lead -> customerName == null || lead.getFullName().toLowerCase().contains(customerName.toLowerCase()))
                .filter(lead -> area == null || (lead.getProvince() != null && lead.getProvince() == area))
                .filter(lead -> phone == null || (lead.getPhone() != null && lead.getPhone().contains(phone)))
                .filter(lead -> email == null || (lead.getEmail() != null && lead.getEmail().toLowerCase().contains(email.toLowerCase())))
                .filter(lead -> interestField == null || (lead.getCompany() != null && lead.getCompany().toLowerCase().contains(interestField.toLowerCase())))
                .filter(lead -> source == null || (lead.getSource() != null && lead.getSource().equals(source)))
                .filter(lead -> status == null || lead.getStatus() == status)
                .filter(lead -> assignedUserId == null || (lead.getAssignedUser() != null && lead.getAssignedUser().getId().equals(assignedUserId)))
                .filter(lead -> creatorId == null || lead.getCreator().getId().equals(creatorId))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeadResponse> searchLeadsByCustomerName(String customerName) {
        return leadRepository.findByFullNameContainingIgnoreCase(customerName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeadResponse> searchLeadsByPhone(String phone) {
        return leadRepository.findByPhoneContaining(phone).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    @Override
    public List<LeadResponse> searchLeadsByArea(VietnamProvince area) {
        return leadRepository.findByProvince(area).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeadResponse> searchLeadsByRegion(String region) {
        // Lấy tất cả provinces của region
        List<VietnamProvince> provincesInRegion = Arrays.stream(VietnamProvince.values())
                .filter(province -> province.getRegion().equals(region))
                .collect(Collectors.toList());
        
        return leadRepository.findByProvinceIn(provincesInRegion).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeadResponse> searchLeadsByInterestField(String interestField) {
        return leadRepository.findByCompanyContainingIgnoreCase(interestField).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Map<LeadStatus, Long> getLeadStatusReport() {
        List<Object[]> results = leadRepository.countLeadsByStatus();
        Map<LeadStatus, Long> report = new HashMap<>();
        
        for (Object[] result : results) {
            LeadStatus status = (LeadStatus) result[0];
            Long count = (Long) result[1];
            report.put(status, count);
        }
        
        return report;
    }
    
    @Override
    public Map<String, Long> getLeadSourceReport() {
        List<Object[]> results = leadRepository.countLeadsBySource();
        Map<String, Long> report = new HashMap<>();
        
        for (Object[] result : results) {
            String source = (String) result[0];
            Long count = (Long) result[1];
            report.put(source, count);
        }
        
        return report;
    }
    
    @Override
    public Map<VietnamProvince, Long> getLeadAreaReport() {
        List<Object[]> results = leadRepository.countLeadsByProvince();
        Map<VietnamProvince, Long> report = new HashMap<>();
        
        for (Object[] result : results) {
            VietnamProvince area = (VietnamProvince) result[0];
            Long count = (Long) result[1];
            report.put(area, count);
        }
        
        return report;
    }
    
    @Override
    public Map<String, Long> getLeadRegionReport() {
        // Lấy all leads và group theo region
        List<Lead> allLeads = leadRepository.findAll();
        Map<String, Long> regionReport = new HashMap<>();
        
        for (Lead lead : allLeads) {
            if (lead.getProvince() != null) {
                String region = lead.getProvince().getRegion();
                regionReport.put(region, regionReport.getOrDefault(region, 0L) + 1);
            }
        }
        
        return regionReport;
    }

    @Override
    public List<LeadResponse> getLeadsCreatedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return leadRepository.findByCreatedAtBetween(startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeadResponse> getLeadsUpdatedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return leadRepository.findByUpdatedAtBetween(startDate, endDate).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LeadResponse updateLeadStatus(Long leadId, LeadStatus status, String notes, Long updaterId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        User updater = userRepository.findById(updaterId)
                .orElseThrow(() -> new RuntimeException("Updater not found"));

        lead.setStatus(status);
        if (notes != null) {
            lead.setNotes(notes);
        }

        lead = leadRepository.save(lead);
        return convertToResponse(lead);
    }

    @Override
    @Transactional
    public LeadResponse assignLeadToUser(Long leadId, Long userId, Long assignerId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        User assignedUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User to assign not found"));

        User assigner = userRepository.findById(assignerId)
                .orElseThrow(() -> new RuntimeException("Assigner not found"));

        lead.setAssignedUser(assignedUser);
        lead = leadRepository.save(lead);
        return convertToResponse(lead);
    }

    private LeadResponse convertToResponse(Lead lead) {
        LeadResponse response = new LeadResponse();
        response.setId(lead.getId());
        response.setFullName(lead.getFullName());
        response.setProvince(lead.getProvince());
        // Set province display name
        if (lead.getProvince() != null) {
            response.setProvinceDisplayName(lead.getProvince().getDisplayName());
            response.setAreaDisplayName(lead.getProvince().getDisplayName()); // For backward compatibility
        }
        response.setPhone(lead.getPhone());
        response.setEmail(lead.getEmail());
        response.setCompany(lead.getCompany());
        response.setSource(lead.getSource());
        if (lead.getSource() != null) {
            response.setSourceDisplayName(lead.getSource().getDisplayName());
        }
        response.setStatus(lead.getStatus());
        if (lead.getStatus() != null) {
            response.setStatusDisplayName(lead.getStatus().getDisplayName());
        }
        response.setNotes(lead.getNotes());
        response.setCreatedAt(lead.getCreatedAt());
        response.setUpdatedAt(lead.getUpdatedAt());

        // Creator info
        if (lead.getCreator() != null) {
            response.setCreatorId(lead.getCreator().getId());
            response.setCreatorUsername(lead.getCreator().getUsername());
            response.setCreatorEmail(lead.getCreator().getEmail());
        }

        // Assigned user info
        if (lead.getAssignedUser() != null) {
            response.setAssignedUserId(lead.getAssignedUser().getId());
            response.setAssignedUsername(lead.getAssignedUser().getUsername());
            response.setAssignedEmail(lead.getAssignedUser().getEmail());
        }

        return response;
    }
}
