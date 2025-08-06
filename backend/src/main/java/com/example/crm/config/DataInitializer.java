package com.example.crm.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.crm.user.model.ERole;
import com.example.crm.user.model.Role;
import com.example.crm.user.model.User;
import com.example.crm.user.repository.RoleRepository;
import com.example.crm.user.repository.UserRepository;
import com.example.crm.lead.model.Lead;
import com.example.crm.lead.model.LeadSource;
import com.example.crm.lead.model.LeadStatus;
import com.example.crm.lead.model.VietnamProvince;
import com.example.crm.lead.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner{
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeadRepository leadRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeUsers();
        initializeLeads();
    }

    private void initializeRoles() {
        // Initialize roles if they don't exist
        createRoleIfNotExists(ERole.ROLE_USER);
        createRoleIfNotExists(ERole.ROLE_ADMIN);
        createRoleIfNotExists(ERole.ROLE_MARKETING);
        createRoleIfNotExists(ERole.ROLE_TELESALES);
        createRoleIfNotExists(ERole.ROLE_SALES);
    }

    private void createRoleIfNotExists(ERole roleName) {
        try {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
                System.out.println("Created " + roleName);
            } else {
                System.out.println(roleName + " already exists");
            }
        } catch (Exception e) {
            System.out.println("Error creating " + roleName + ": " + e.getMessage());
        }
    }

    private void initializeUsers() {
        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@crm.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(ERole.ROLE_ADMIN);
            
            Set<Role> adminRoles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));
            adminRoles.add(adminRole);
            admin.setRoles(adminRoles);
            
            userRepository.save(admin);
            System.out.println("Created admin user: admin/admin123");
        }

        if (!userRepository.existsByUsername("marketing")) {
            User marketingUser = new User();
            marketingUser.setUsername("marketing");
            marketingUser.setEmail("marketing@crm.com");
            marketingUser.setPassword(passwordEncoder.encode("marketing123"));
            marketingUser.setRole(ERole.ROLE_MARKETING);

            Set<Role> marketingRoles = new HashSet<>();
            Role marketingRole = roleRepository.findByName(ERole.ROLE_MARKETING)
                .orElseThrow(() -> new RuntimeException("Marketing role not found"));
            marketingRoles.add(marketingRole);
            marketingUser.setRoles(marketingRoles);

            userRepository.save(marketingUser);
            System.out.println("Created marketing user: marketing/marketing123");
        }

        if (!userRepository.existsByUsername("telesales")) {
            User telesalesUser = new User();
            telesalesUser.setUsername("telesales");
            telesalesUser.setEmail("telesales@crm.com");
            telesalesUser.setPassword(passwordEncoder.encode("telesales123"));
            telesalesUser.setRole(ERole.ROLE_TELESALES);

            Set<Role> telesalesRoles = new HashSet<>();
            Role telesalesRole = roleRepository.findByName(ERole.ROLE_TELESALES)
                .orElseThrow(() -> new RuntimeException("Telesales role not found"));
            telesalesRoles.add(telesalesRole);
            telesalesUser.setRoles(telesalesRoles);

            userRepository.save(telesalesUser);
            System.out.println("Created telesales user: telesales/telesales123");
        }

        // Create regular user if not exists
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@crm.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(ERole.ROLE_USER);
            
            Set<Role> userRoles = new HashSet<>();
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("User role not found"));
            userRoles.add(userRole);
            user.setRoles(userRoles);
            
            userRepository.save(user);
            System.out.println("Created regular user: user/user123");
        }
    }

    private void initializeLeads() {
        // Only initialize leads if there are none
        if (leadRepository.count() == 0) {
            User adminUser = userRepository.findByUsername("admin").orElse(null);
            User marketingUser = userRepository.findByUsername("marketing").orElse(null);
            User telesalesUser = userRepository.findByUsername("telesales").orElse(null);

            if (adminUser != null && marketingUser != null && telesalesUser != null) {
                // Lead 1 - Nguyễn Văn A
                Lead lead1 = new Lead();
                lead1.setFullName("Nguyễn Văn A");
                lead1.setPhone("0901234567");
                lead1.setEmail("nguyenvana@gmail.com");
                lead1.setCompany("Công ty ABC");
                lead1.setProvince(VietnamProvince.HO_CHI_MINH);
                lead1.setSource(LeadSource.WEBSITE);
                lead1.setStatus(LeadStatus.CHUA_GOI);
                lead1.setCreator(adminUser);
                lead1.setAssignedUser(telesalesUser);
                lead1.setNotes("Khách hàng quan tâm đến sản phẩm CRM");
                leadRepository.save(lead1);

                // Lead 2 - Trần Thị B
                Lead lead2 = new Lead();
                lead2.setFullName("Trần Thị B");
                lead2.setPhone("0912345678");
                lead2.setEmail("tranthib@yahoo.com");
                lead2.setCompany("Công ty XYZ");
                lead2.setProvince(VietnamProvince.HA_NOI);
                lead2.setSource(LeadSource.FACEBOOK);
                lead2.setStatus(LeadStatus.CHUA_GOI);
                lead2.setCreator(marketingUser);
                lead2.setAssignedUser(marketingUser);
                lead2.setNotes("Đã gọi điện, khách quan tâm nhưng chưa quyết định");
                leadRepository.save(lead2);

                // Lead 3 - Lê Văn C
                Lead lead3 = new Lead();
                lead3.setFullName("Lê Văn C");
                lead3.setPhone("0923456789");
                lead3.setEmail("levanc@hotmail.com");
                lead3.setCompany("Startup DEF");
                lead3.setProvince(VietnamProvince.DA_NANG);
                lead3.setSource(LeadSource.GOOGLE);
                lead3.setStatus(LeadStatus.CHUA_GOI);
                lead3.setCreator(adminUser);
                lead3.setAssignedUser(telesalesUser);
                lead3.setNotes("Lead chất lượng cao, đã demo sản phẩm");
                leadRepository.save(lead3);

                // Lead 4 - Phạm Thị D
                Lead lead4 = new Lead();
                lead4.setFullName("Phạm Thị D");
                lead4.setPhone("0934567890");
                lead4.setEmail("phamthid@gmail.com");
                lead4.setCompany("");
                lead4.setProvince(VietnamProvince.CAN_THO);
                lead4.setSource(LeadSource.REFERRAL);
                lead4.setStatus(LeadStatus.CHUA_GOI);
                lead4.setCreator(telesalesUser);
                lead4.setAssignedUser(marketingUser);
                lead4.setNotes("Khách hàng cá nhân, đã gửi báo giá");
                leadRepository.save(lead4);

                // Lead 5 - Hoàng Văn E
                Lead lead5 = new Lead();
                lead5.setFullName("Hoàng Văn E");
                lead5.setPhone("0945678901");
                lead5.setEmail("hoangvane@company.com");
                lead5.setCompany("Doanh nghiệp GHI");
                lead5.setProvince(VietnamProvince.HAI_PHONG);
                lead5.setSource(LeadSource.PHONE);
                lead5.setStatus(LeadStatus.CHUA_GOI);
                lead5.setCreator(marketingUser);
                lead5.setAssignedUser(telesalesUser);
                lead5.setNotes("Đang thảo luận điều khoản hợp đồng");
                leadRepository.save(lead5);

                // Lead 6 - Vũ Thị F
                Lead lead6 = new Lead();
                lead6.setFullName("Vũ Thị F");
                lead6.setPhone("0956789012");
                lead6.setEmail("vuthif@email.com");
                lead6.setCompany("Công ty JKL");
                lead6.setProvince(VietnamProvince.BINH_DUONG);
                lead6.setSource(LeadSource.EMAIL);
                lead6.setStatus(LeadStatus.CHUA_LIEN_HE_DUOC);
                lead6.setCreator(adminUser);
                lead6.setAssignedUser(marketingUser);
                lead6.setNotes("Đã ký hợp đồng, khách hàng hài lòng");
                leadRepository.save(lead6);

                // Lead 7 - Đỗ Văn G
                Lead lead7 = new Lead();
                lead7.setFullName("Đỗ Văn G");
                lead7.setPhone("0967890123");
                lead7.setEmail("dovang@test.com");
                lead7.setCompany("");
                lead7.setProvince(VietnamProvince.DONG_NAI);
                lead7.setSource(LeadSource.EVENT);
                lead7.setStatus(LeadStatus.HUY);
                lead7.setCreator(telesalesUser);
                lead7.setAssignedUser(telesalesUser);
                lead7.setNotes("Khách không phù hợp với ngân sách");
                leadRepository.save(lead7);

                // Lead 8 - Ngô Thị H
                Lead lead8 = new Lead();
                lead8.setFullName("Ngô Thị H");
                lead8.setPhone("0978901234");
                lead8.setEmail("ngothih@domain.com");
                lead8.setCompany("Tập đoàn MNO");
                lead8.setProvince(VietnamProvince.KHANH_HOA);
                lead8.setSource(LeadSource.OTHER);
                lead8.setStatus(LeadStatus.HUY);
                lead8.setCreator(marketingUser);
                lead8.setAssignedUser(null); // Chưa được gán
                lead8.setNotes("Lead mới từ triển lãm");
                leadRepository.save(lead8);

                System.out.println("Created 8 sample leads successfully!");
            } else {
                System.out.println("Cannot create leads: Required users not found");
            }
        } else {
            System.out.println("Leads already exist, skipping initialization");
        }
    }
}
