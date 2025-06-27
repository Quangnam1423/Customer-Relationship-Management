package com.example.crm.customer.model;

public enum CustomerType {
    INDIVIDUAL("Individual"),
    BUSINESS("Business");

    private final String type;

    CustomerType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public static CustomerType fromString(String type)
    {
        for (CustomerType ct : CustomerType.values()) {
            if (ct.type.equalsIgnoreCase(type)) {
                return ct;
            }
        }
        throw new IllegalArgumentException("Unknown type: " + type);
    }
}
