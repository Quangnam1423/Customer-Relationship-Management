package com.example.crm.lead.controller;

import com.example.crm.lead.model.VietnamProvince;
import com.example.crm.lead.service.ProvinceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    public ResponseEntity<List<VietnamProvince>> getAllProvinces() {
        List<VietnamProvince> provinces = provinceService.getAllProvinces();
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
