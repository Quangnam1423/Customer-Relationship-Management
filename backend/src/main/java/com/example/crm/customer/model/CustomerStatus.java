package com.example.crm.customer.model;

public enum CustomerStatus {
    NEW("Chưa liên hệ"),
    ATTEMPTED("Đã cố gắng liên hệ"),
    CONTACTED("Đã liên hệ"),
    COLD("Cold lead"),
    WARM("Warm lead"),
    HOT("Hot lead"),
    QUALIFIED("Đủ điều kiện"),
    FOLLOW_UP("Cần theo dõi"),
    CONTRACTED("Đã ký hợp đồng"),
    REJECTED("Từ chối"),
    CANCELLED("Hủy lead");

    private final String label;

    CustomerStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    @Override
    public String toString() {
        return label;
    }

    public static CustomerStatus fromLabel(String label) {
        for (CustomerStatus status : CustomerStatus.values()) {
            if (status.getLabel().equalsIgnoreCase(label)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid status label: " + label);
    }
}
