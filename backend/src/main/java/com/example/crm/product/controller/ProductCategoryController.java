package com.example.crm.product.controller;

import com.example.crm.product.model.ProductCategory;
import com.example.crm.product.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-categories")
public class ProductCategoryController {

    @Autowired
    private ProductCategoryService productCategoryService;

    @PostMapping
    public ResponseEntity<ProductCategory> createProductCategory(@RequestBody ProductCategory productCategory) {
        return ResponseEntity.ok(productCategoryService.saveProductCategory(productCategory));
    }

    @GetMapping
    public ResponseEntity<List<ProductCategory>> getAllProductCategories() {
        return ResponseEntity.ok(productCategoryService.getAllProductCategories());
    }
}
