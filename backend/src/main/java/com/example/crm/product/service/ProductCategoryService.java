package com.example.crm.product.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.crm.product.model.ProductCategory;
import com.example.crm.product.repository.ProductCategoryRepository;

@Service
public class ProductCategoryService {
    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    public List<ProductCategory> getAllProductCategories() {
        return productCategoryRepository.findAll();
    }

    public ProductCategory saveProductCategory(ProductCategory productCategory) {
        return productCategoryRepository.save(productCategory);
    }
}
