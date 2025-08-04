package com.example.crm.lead.model;

public enum LeadSource {
    WEBSITE("Website"),
    FACEBOOK("Facebook"),
    GOOGLE("Google"),
    REFERRAL("Giới thiệu"),
    PHONE("Điện thoại"),
    EMAIL("Email"),
    EVENT("Sự kiện"),
    OTHER("Khác");

    private final String displayName;

    LeadSource(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
