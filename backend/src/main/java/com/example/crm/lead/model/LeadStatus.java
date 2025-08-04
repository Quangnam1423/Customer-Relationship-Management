package com.example.crm.lead.model;

public enum LeadStatus {
    CHUA_GOI("Chưa gọi"),
    CHUA_LIEN_HE_DUOC("Chưa liên hệ được"),
    WARM_LEAD("Warm lead"),
    COLD_LEAD("Cold lead"),
    TU_CHOI("Từ chối"),
    HUY("Hủy"),
    KY_HOP_DONG("Ký hợp đồng");

    private final String displayName;

    LeadStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
