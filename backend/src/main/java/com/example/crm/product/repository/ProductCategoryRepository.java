package com.example.crm.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.crm.product.model.ProductCategory;

import java.util.List;
import java.util.Optional;


@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long>{
    Optional<ProductCategory> findByName(String name);
}
