package com.example.crm.export.service;

import com.example.crm.export.dto.ExportRequest;
import com.example.crm.lead.model.Lead;
import com.example.crm.lead.model.LeadSource;
import com.example.crm.lead.model.LeadStatus;
import com.example.crm.lead.repository.LeadRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ExportServiceImpl implements ExportService {

    @Autowired
    private LeadRepository leadRepository;

    private static final Map<String, String> FIELD_LABELS;
    
    static {
        FIELD_LABELS = new HashMap<>();
        FIELD_LABELS.put("id", "ID");
        FIELD_LABELS.put("fullName", "Họ và tên");
        FIELD_LABELS.put("email", "Email");
        FIELD_LABELS.put("phone", "Số điện thoại");
        FIELD_LABELS.put("company", "Công ty");
        FIELD_LABELS.put("province", "Tỉnh/Thành phố");
        FIELD_LABELS.put("status", "Trạng thái");
        FIELD_LABELS.put("source", "Nguồn");
        FIELD_LABELS.put("assignedUser", "Người phụ trách");
        FIELD_LABELS.put("createdAt", "Ngày tạo");
        FIELD_LABELS.put("updatedAt", "Ngày cập nhật");
        FIELD_LABELS.put("notes", "Ghi chú");
        FIELD_LABELS.put("creator", "Người tạo");
    }

    @Override
    public Workbook exportLeadsToExcel(List<Lead> leads, List<String> fields) {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Leads");

        // Create header style
        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);

        // Create data style
        CellStyle dataStyle = workbook.createCellStyle();
        dataStyle.setBorderBottom(BorderStyle.THIN);
        dataStyle.setBorderTop(BorderStyle.THIN);
        dataStyle.setBorderRight(BorderStyle.THIN);
        dataStyle.setBorderLeft(BorderStyle.THIN);

        // Create header row
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < fields.size(); i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(FIELD_LABELS.getOrDefault(fields.get(i), fields.get(i)));
            cell.setCellStyle(headerStyle);
        }

        // Create data rows
        int rowIndex = 1;
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        
        for (Lead lead : leads) {
            Row row = sheet.createRow(rowIndex++);
            
            for (int i = 0; i < fields.size(); i++) {
                Cell cell = row.createCell(i);
                cell.setCellStyle(dataStyle);
                
                String fieldName = fields.get(i);
                String value = getFieldValue(lead, fieldName, dateFormatter);
                cell.setCellValue(value);
            }
        }

        // Auto-size columns
        for (int i = 0; i < fields.size(); i++) {
            sheet.autoSizeColumn(i);
            // Set minimum width
            if (sheet.getColumnWidth(i) < 2000) {
                sheet.setColumnWidth(i, 2000);
            }
        }

        return workbook;
    }

    private String getFieldValue(Lead lead, String fieldName, DateTimeFormatter dateFormatter) {
        try {
            switch (fieldName) {
                case "id":
                    return lead.getId() != null ? lead.getId().toString() : "";
                case "fullName":
                    return lead.getFullName() != null ? lead.getFullName() : "";
                case "email":
                    return lead.getEmail() != null ? lead.getEmail() : "";
                case "phone":
                    return lead.getPhone() != null ? lead.getPhone() : "";
                case "company":
                    return lead.getCompany() != null ? lead.getCompany() : "";
                case "province":
                    return lead.getProvince() != null ? lead.getProvince().getDisplayName() : "";
                case "status":
                    return lead.getStatus() != null ? lead.getStatus().getDisplayName() : "";
                case "source":
                    return lead.getSource() != null ? lead.getSource().getDisplayName() : "";
                case "assignedUser":
                    return lead.getAssignedUser() != null ? 
                        (lead.getAssignedUser().getFullName() != null ? 
                            lead.getAssignedUser().getFullName() : lead.getAssignedUser().getUsername()) : "";
                case "createdAt":
                    return lead.getCreatedAt() != null ? lead.getCreatedAt().format(dateFormatter) : "";
                case "updatedAt":
                    return lead.getUpdatedAt() != null ? lead.getUpdatedAt().format(dateFormatter) : "";
                case "notes":
                    return lead.getNotes() != null ? lead.getNotes() : "";
                case "creator":
                    return lead.getCreator() != null ? 
                        (lead.getCreator().getFullName() != null ? 
                            lead.getCreator().getFullName() : lead.getCreator().getUsername()) : "";
                default:
                    return "";
            }
        } catch (Exception e) {
            return "";
        }
    }

    @Override
    public List<Lead> getFilteredLeads(ExportRequest request, Long currentUserId) {
        // Use similar logic as in LeadServiceImpl for filtering
        List<Lead> allLeads = leadRepository.findAll();
        
        return allLeads.stream()
            .filter(lead -> {
                // Date filter
                if (request.getStartDate() != null && lead.getCreatedAt().toLocalDate().isBefore(request.getStartDate())) {
                    return false;
                }
                if (request.getEndDate() != null && lead.getCreatedAt().toLocalDate().isAfter(request.getEndDate())) {
                    return false;
                }
                
                // User assignment filter
                if (Boolean.TRUE.equals(request.getMyLeadsOnly())) {
                    return lead.getAssignedUser() != null && lead.getAssignedUser().getId().equals(currentUserId);
                } else if (request.getAssignedUserId() != null) {
                    return lead.getAssignedUser() != null && lead.getAssignedUser().getId().equals(request.getAssignedUserId());
                }
                
                // Status filter
                if (request.getStatus() != null && !request.getStatus().isEmpty()) {
                    return lead.getStatus() != null && lead.getStatus().name().equals(request.getStatus());
                }
                
                // Source filter  
                if (request.getSource() != null && !request.getSource().isEmpty()) {
                    return lead.getSource() != null && lead.getSource().name().equals(request.getSource());
                }
                
                return true;
            })
            .toList();
    }

    @Override
    public List<String> getAvailableFields() {
        return new ArrayList<>(FIELD_LABELS.keySet());
    }
}
