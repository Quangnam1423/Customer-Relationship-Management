package com.example.crm.customer.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.example.crm.user.model.User;


@Entity
@Table(name = "customers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"phoneNumber"}),
    @UniqueConstraint(columnNames = {"email"})
})
@Data
@NoArgsConstructor 
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustomerType customerType; // personal, business, organization

    @Column(nullable = false)
    private String fullName;

    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustomerSource source; // Marketing, Direct sales, Affiliate...

    private String sourceDetail; // Facebook, Google, Zalo...

    @Column(nullable = false)
    private String phoneNumber;

    private String email;

    private String interestedField;   // Field of interest

    private String businessField;     // Business field

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustomerStatus leadStatus; // Not called, Warm, Hot, Rejected...

    private String rejectionReason;   // If rejected

    private String note;

    private LocalDateTime consultationTime;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_owner_id")
    private User createdBy;  // Creator of the lead

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User leadOwner;  // Employee in charge of the lead

    public Customer(String customerType, 
        String fullname, 
        String address, 
        String source, 
        String sourceDetail, 
        String phoneNumber, 
        String email,
        String interestedField,
        String businessField,
        String leadStatus,
        String rejectionReason,
        String note,
        LocalDateTime consultationTime,
        LocalDateTime createdAt,
        User createdBy,
        User leadOwner
        
    ){
        this.customerType = CustomerType.valueOf(customerType.toUpperCase());
        this.fullName = fullname;
        this.address = address;
        this.source = CustomerSource.valueOf(source.toUpperCase());
        this.sourceDetail = sourceDetail;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.interestedField = interestedField;
        this.businessField = businessField;
        this.leadStatus = CustomerStatus.valueOf(leadStatus.toUpperCase());
        this.rejectionReason = rejectionReason;
        this.note = note;
        this.consultationTime = consultationTime;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.leadOwner = leadOwner;
    }
}
