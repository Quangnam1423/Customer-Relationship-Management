package com.example.crm.product.service;

import java.lang.foreign.Linker.Option;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.crm.product.model.Product;
import com.example.crm.product.model.ProductCategory;
import com.example.crm.product.repository.ProductCategoryRepository;
import com.example.crm.product.repository.ProductRepository;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts()
    {
        return productRepository.findAll();
    }

    public Product saveProduct(Product product)
    {
        return productRepository.save(product);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
