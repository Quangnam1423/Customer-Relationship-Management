package com.example.crm.product.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "products",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"productCode"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String productCode;

    private String productName;

    @Lob
    private String description;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal costPrice;

    private String unitOfMeasure;

    private Integer stockQuantity;

    private Boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_category_id")
    private ProductCategory productCategory;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Product(String productCode, String productName, String description, BigDecimal unitPrice, BigDecimal costPrice,
            String unitOfMeasure, Integer stockQuantity, ProductCategory productCategory) {
        this.productCode = productCode;
        this.productName = productName;
        this.description = description;
        this.unitPrice = unitPrice;
        this.costPrice = costPrice;
        this.unitOfMeasure = unitOfMeasure;
        this.stockQuantity = stockQuantity;
        this.productCategory = productCategory;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.isActive = true;
    }
}
