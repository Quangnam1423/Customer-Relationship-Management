package com.example.crm.export.service;

import com.example.crm.export.dto.ExportRequest;
import com.example.crm.lead.model.Lead;
import org.apache.poi.ss.usermodel.Workbook;
import java.util.List;

public interface ExportService {
    Workbook exportLeadsToExcel(List<Lead> leads, List<String> fields);
    List<Lead> getFilteredLeads(ExportRequest request, Long currentUserId);
    List<String> getAvailableFields();
}
