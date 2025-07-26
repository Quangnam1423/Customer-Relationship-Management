package com.example.crm.product.controller;

import com.example.crm.product.model.Product;
import com.example.crm.product.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.saveProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setProductCode(productDetails.getProductCode());
        product.setProductName(productDetails.getProductName());
        product.setDescription(productDetails.getDescription());
        product.setUnitPrice(productDetails.getUnitPrice());
        product.setCostPrice(productDetails.getCostPrice());
        product.setUnitOfMeasure(productDetails.getUnitOfMeasure());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setIsActive(productDetails.getIsActive());
        product.setProductCategory(productDetails.getProductCategory());

        final Product updatedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
