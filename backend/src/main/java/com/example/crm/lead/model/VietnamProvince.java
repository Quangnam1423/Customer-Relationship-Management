package com.example.crm.lead.model;

public enum VietnamProvince {
    // Miền Bắc
    HA_NOI("Hà Nội", "Miền Bắc"),
    HAI_PHONG("Hải Phòng", "Miền Bắc"),
    QUANG_NINH("Quảng Ninh", "Miền Bắc"),
    LANG_SON("Lạng Sơn", "Miền Bắc"),
    CAO_BANG("Cao Bằng", "Miền Bắc"),
    BAC_KAN("Bắc Kạn", "Miền Bắc"),
    THAI_NGUYEN("Thái Nguyên", "Miền Bắc"),
    PHU_THO("Phú Thọ", "Miền Bắc"),
    VINH_PHUC("Vĩnh Phúc", "Miền Bắc"),
    BAC_GIANG("Bắc Giang", "Miền Bắc"),
    BAC_NINH("Bắc Ninh", "Miền Bắc"),
    HUNG_YEN("Hưng Yên", "Miền Bắc"),
    HAI_DUONG("Hải Dương", "Miền Bắc"),
    HOA_BINH("Hòa Bình", "Miền Bắc"),
    HA_NAM("Hà Nam", "Miền Bắc"),
    NAM_DINH("Nam Định", "Miền Bắc"),
    THAI_BINH("Thái Bình", "Miền Bắc"),
    NINH_BINH("Ninh Bình", "Miền Bắc"),
    HA_GIANG("Hà Giang", "Miền Bắc"),
    TUYEN_QUANG("Tuyên Quang", "Miền Bắc"),
    LAI_CHAU("Lai Châu", "Miền Bắc"),
    DIEN_BIEN("Điện Biên", "Miền Bắc"),
    SON_LA("Sơn La", "Miền Bắc"),
    YEN_BAI("Yên Bái", "Miền Bắc"),
    LAO_CAI("Lào Cai", "Miền Bắc"),

    // Miền Trung
    THANH_HOA("Thanh Hóa", "Miền Trung"),
    NGHE_AN("Nghệ An", "Miền Trung"),
    HA_TINH("Hà Tĩnh", "Miền Trung"),
    QUANG_BINH("Quảng Bình", "Miền Trung"),
    QUANG_TRI("Quảng Trị", "Miền Trung"),
    THUA_THIEN_HUE("Thừa Thiên Huế", "Miền Trung"),
    DA_NANG("Đà Nẵng", "Miền Trung"),
    QUANG_NAM("Quảng Nam", "Miền Trung"),
    QUANG_NGAI("Quảng Ngãi", "Miền Trung"),
    BINH_DINH("Bình Định", "Miền Trung"),
    PHU_YEN("Phú Yên", "Miền Trung"),
    KHANH_HOA("Khánh Hòa", "Miền Trung"),
    NINH_THUAN("Ninh Thuận", "Miền Trung"),
    BINH_THUAN("Bình Thuận", "Miền Trung"),
    KON_TUM("Kon Tum", "Miền Trung"),
    GIA_LAI("Gia Lai", "Miền Trung"),
    DAK_LAK("Đắk Lắk", "Miền Trung"),
    DAK_NONG("Đắk Nông", "Miền Trung"),
    LAM_DONG("Lâm Đồng", "Miền Trung"),

    // Miền Nam
    HO_CHI_MINH("Hồ Chí Minh", "Miền Nam"),
    BA_RIA_VUNG_TAU("Bà Rịa - Vũng Tàu", "Miền Nam"),
    BINH_DUONG("Bình Dương", "Miền Nam"),
    BINH_PHUOC("Bình Phước", "Miền Nam"),
    DONG_NAI("Đồng Nai", "Miền Nam"),
    TAY_NINH("Tây Ninh", "Miền Nam"),
    LONG_AN("Long An", "Miền Nam"),
    AN_GIANG("An Giang", "Miền Nam"),
    DONG_THAP("Đồng Tháp", "Miền Nam"),
    TIEN_GIANG("Tiền Giang", "Miền Nam"),
    VINH_LONG("Vĩnh Long", "Miền Nam"),
    BEN_TRE("Bến Tre", "Miền Nam"),
    CAN_THO("Cần Thơ", "Miền Nam"),
    KIEN_GIANG("Kiên Giang", "Miền Nam"),
    CA_MAU("Cà Mau", "Miền Nam"),
    BAC_LIEU("Bạc Liêu", "Miền Nam"),
    SOC_TRANG("Sóc Trăng", "Miền Nam"),
    HAU_GIANG("Hậu Giang", "Miền Nam");

    private final String displayName;
    private final String region;

    VietnamProvince(String displayName, String region) {
        this.displayName = displayName;
        this.region = region;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getRegion() {
        return region;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
