package com.example.crm.lead.controller;

import com.example.crm.lead.model.VietnamProvince;
import com.example.crm.lead.service.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/provinces")
public class ProvinceController {

    @Autowired
    private ProvinceService provinceService;

    /**
     * Lấy tất cả các tỉnh thành
     */
    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getAllProvinces() {
        List<Map<String, String>> provinces = Arrays.stream(VietnamProvince.values())
                .map(province -> Map.of(
                        "name", province.name(),
                        "displayName", province.getDisplayName(),
                        "region", province.getRegion()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(provinces);
    }

    /**
     * Lấy tỉnh thành theo miền
     */
    @GetMapping("/by-region")
    public ResponseEntity<Map<String, List<VietnamProvince>>> getProvincesByRegion() {
        Map<String, List<VietnamProvince>> provincesByRegion = provinceService.getProvincesByRegion();
        return ResponseEntity.ok(provincesByRegion);
    }

    /**
     * Lấy tỉnh thành của một miền cụ thể
     */
    @GetMapping("/region/{regionName}")
    public ResponseEntity<List<VietnamProvince>> getProvincesByRegion(@PathVariable String regionName) {
        List<VietnamProvince> provinces = provinceService.getProvincesByRegion(regionName);
        return ResponseEntity.ok(provinces);
    }

    /**
     * Lấy danh sách các miền
     */
    @GetMapping("/regions")
    public ResponseEntity<List<String>> getAllRegions() {
        List<String> regions = provinceService.getAllRegions();
        return ResponseEntity.ok(regions);
    }
}
