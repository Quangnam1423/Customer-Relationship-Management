package com.example.crm.customer.repository;

import com.example.crm.customer.model.Customer;
import com.example.crm.customer.model.CustomerStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;


public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findById(Long id);

    List<Customer> findByLeadStatus(CustomerStatus leadStatus);

    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByFullName(String customerFullName);
}