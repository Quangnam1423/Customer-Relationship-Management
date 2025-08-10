package com.example.crm.export.controller;

import com.example.crm.export.dto.ExportRequest;
import com.example.crm.export.service.ExportService;
import com.example.crm.lead.model.Lead;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ExportController {

    @Autowired
    private ExportService exportService;

    @GetMapping("/fields")
    public ResponseEntity<List<String>> getAvailableFields() {
        System.out.println("ExportController: getAvailableFields called"); // Debug log
        try {
            List<String> fields = exportService.getAvailableFields();
            System.out.println("Fields returned: " + fields); // Debug log
            return ResponseEntity.ok(fields);
        } catch (Exception e) {
            System.err.println("Error in getAvailableFields: " + e.getMessage()); // Debug log
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/leads/excel")
    public ResponseEntity<byte[]> exportLeadsToExcel(@RequestBody ExportRequest request) {
        try {
            System.out.println("ExportController: exportLeadsToExcel called"); // Debug log
            
            // For simplicity, we'll assume current user ID is 1
            // In a real app, you'd fetch the user ID from the authenticated user
            Long currentUserId = 1L;
            
            // Get filtered leads
            List<Lead> leads = exportService.getFilteredLeads(request, currentUserId);
            
            // Validate fields
            List<String> availableFields = exportService.getAvailableFields();
            List<String> validFields = request.getFields().stream()
                .filter(availableFields::contains)
                .toList();
            
            if (validFields.isEmpty()) {
                validFields = availableFields; // Use all fields if none specified
            }
            
            // Generate Excel
            Workbook workbook = exportService.exportLeadsToExcel(leads, validFields);
            
            // Convert to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();
            
            byte[] excelBytes = outputStream.toByteArray();
            outputStream.close();
            
            // Generate filename
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String filename = "leads_export_" + timestamp + ".xlsx";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(excelBytes.length);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(excelBytes);
                
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
