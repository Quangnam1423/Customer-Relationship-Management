package com.example.crm.customer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.crm.customer.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Define custom query methods if needed

}
