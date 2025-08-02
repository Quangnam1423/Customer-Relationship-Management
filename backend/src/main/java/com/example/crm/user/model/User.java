package com.example.crm.user.model;


import com.example.crm.account.model.Account;
import com.example.crm.cases.model.Case;
import com.example.crm.contact.model.Contact;
import com.example.crm.customer.model.Customer;
import com.example.crm.lead.model.Lead;
import com.example.crm.opportunity.model.Opportunity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
                , @UniqueConstraint(columnNames = "phoneNumber")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private String password;

    private boolean enabled = true;

    private String address;

    private String department;

    private String fullName;

    private String avatar;

    @Column(name = "permission_level", nullable = false)
    private int permissionLevel = 0; // Mặc định là ROLE_USER (level 0)

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(  name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "assignedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Lead> leads = new HashSet<>();

    @OneToMany(mappedBy = "assignedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Opportunity> opportunities = new HashSet<>();

    @OneToMany(mappedBy = "assignedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Customer> customers = new HashSet<>();

    @OneToMany(mappedBy = "assignedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Account> accounts = new HashSet<>();

    @OneToMany(mappedBy = "assignedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Contact> contacts = new HashSet<>();

    @OneToMany(mappedBy = "assignedUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Case> cases = new HashSet<>();

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.permissionLevel = ERole.ROLE_USER.getLevel(); // Mặc định level 0
    }

    // Phương thức tiện ích để kiểm tra quyền hạn
    public boolean hasPermissionLevel(int requiredLevel) {
        return this.permissionLevel >= requiredLevel;
    }

    public boolean hasPermissionLevel(ERole requiredRole) {
        return this.permissionLevel >= requiredRole.getLevel();
    }

    public ERole getPrimaryRole() {
        return ERole.fromLevel(this.permissionLevel);
    }

    public void setRole(ERole role) {
        this.permissionLevel = role.getLevel();
    }

    public boolean isAdmin() {
        return this.permissionLevel >= ERole.ROLE_ADMIN.getLevel();
    }

    public boolean canAccessMarketingFeatures() {
        return this.permissionLevel >= ERole.ROLE_MARKETING.getLevel();
    }

    public boolean canAccessSalesFeatures() {
        return this.permissionLevel >= ERole.ROLE_SALES.getLevel();
    }
}
