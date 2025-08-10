package com.example.crm.excel.service;

import com.example.crm.lead.model.*;

import io.jsonwebtoken.io.IOException;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelExportService {

    public ByteArrayInputStream exportLeadsToExcel(List<Lead> leads, List<String> fields) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); 
        ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Leads");

            CellStyle headerCellStyle = workbook.createCellStyle();


            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
    
}
