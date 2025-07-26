package com.example.crm.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.crm.product.model.Product;
import com.example.crm.user.model.User;
import java.util.List;
import java.util.Optional;



@Repository
public interface ProductRepository extends JpaRepository <Product, Long>{
    Optional<Product>  findById(Long id);
}