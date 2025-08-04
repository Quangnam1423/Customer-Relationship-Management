package com.example.crm.lead.service;

import com.example.crm.lead.model.VietnamProvince;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProvinceService {

    /**
     * Lấy tất cả các tỉnh thành
     */
    public List<VietnamProvince> getAllProvinces() {
        return Arrays.asList(VietnamProvince.values());
    }

    /**
     * Lấy các tỉnh thành theo miền
     */
    public Map<String, List<VietnamProvince>> getProvincesByRegion() {
        return Arrays.stream(VietnamProvince.values())
                .collect(Collectors.groupingBy(VietnamProvince::getRegion));
    }

    /**
     * Lấy danh sách tỉnh thành của một miền cụ thể
     */
    public List<VietnamProvince> getProvincesByRegion(String region) {
        return Arrays.stream(VietnamProvince.values())
                .filter(province -> province.getRegion().equals(region))
                .collect(Collectors.toList());
    }

    /**
     * Tìm tỉnh thành theo tên
     */
    public Optional<VietnamProvince> findProvinceByName(String name) {
        return Arrays.stream(VietnamProvince.values())
                .filter(province -> province.getDisplayName().equalsIgnoreCase(name) || 
                       province.name().equalsIgnoreCase(name))
                .findFirst();
    }

    /**
     * Lấy danh sách tên miền
     */
    public List<String> getAllRegions() {
        return Arrays.stream(VietnamProvince.values())
                .map(VietnamProvince::getRegion)
                .distinct()
                .collect(Collectors.toList());
    }

    /**
     * Kiểm tra tỉnh thành có tồn tại không
     */
    public boolean isValidProvince(String provinceName) {
        return findProvinceByName(provinceName).isPresent();
    }
}
