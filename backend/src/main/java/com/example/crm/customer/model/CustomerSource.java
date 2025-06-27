package com.example.crm.customer.model;

public enum CustomerSource {
    FACEBOOK("Facebook"),
    GOOGLE("Google"),
    ZALO("Zalo"),
    DIRECT("Direct"),
    CUSTOMER_REFERRAL("Customer Referral"),
    INTERNAL_REFERRAL("Internal Referral"), 
    EVENT("Event"),
    EXHIBITION("Exhibition"),
    MARKETING("Marketing"),
    SALES("Sales"),
    PARTNER("Partner"),
    AFFILIATE("Affiliate");

    private final String source;

    CustomerSource(String source) {
        this.source = source;
    }

    public String getSource() {
        return source;
    }


    public static CustomerSource fromString(String source) {
        for (CustomerSource cs : CustomerSource.values()) {
            if (cs.source.equalsIgnoreCase(source)) {
                return cs;
            }
        }
        throw new IllegalArgumentException("Unknown source: " + source);
    }
}
