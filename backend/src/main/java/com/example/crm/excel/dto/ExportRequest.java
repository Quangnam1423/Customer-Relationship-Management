package com.example.crm.excel.dto;

import java.util.List;

public class ExportRequest {
    private List<String> fields;

    public List<String> getFields() {
        return fields;
    }

    public void setFields(List<String> fields) {
        this.fields = fields;
    }
}
