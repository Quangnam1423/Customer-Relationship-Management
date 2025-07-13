package com.example.crm.customer.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.crm.customer.model.Customer;
import com.example.crm.customer.model.CustomerStatus;
import com.example.crm.customer.repository.CustomerRepository;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public boolean customerExists(String customerName) {
        return customerRepository.existsByFullName(customerName);
    }

    public boolean emailExists(String email) {
        return customerRepository.existsByEmail(email);
    }

    public boolean phoneNumberExists(String phoneNumber) {
        return customerRepository.existsByPhoneNumber(phoneNumber);
    }

    public Customer saveCustomer(Customer customer)
    {
        return customerRepository.save(customer);
    }

    public Customer getCustomerById(String id) {
        return customerRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    public List<Customer> getCustomersByLeadStatus(String leadStatus) {
        return customerRepository.findByLeadStatus(CustomerStatus.fromLabel(leadStatus));
    }
}
