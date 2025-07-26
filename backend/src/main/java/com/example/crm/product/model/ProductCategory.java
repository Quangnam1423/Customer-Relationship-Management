package com.example.crm.product.model;

import java.util.Set;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_categories")
@Getter
@Setter
@NoArgsConstructor
public class ProductCategory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Lob
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ProductCategory parentProductCategory;

    @OneToMany(mappedBy = "parentProductCategory", cascade = CascadeType.ALL)
    private Set<ProductCategory> chillCategories;

    @OneToMany(mappedBy = "productCategory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Product> products;
}