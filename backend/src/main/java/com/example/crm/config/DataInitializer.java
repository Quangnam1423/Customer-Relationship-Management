package com.example.crm.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
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
        // Clear existing leads and create new sample data
        long existingLeadCount = leadRepository.count();
        if (existingLeadCount > 0) {
            System.out.println("Found " + existingLeadCount + " existing leads. Clearing all leads...");
            leadRepository.deleteAll();
            System.out.println("All existing leads have been deleted.");
        }
        
        User adminUser = userRepository.findByUsername("admin").orElse(null);
        User marketingUser = userRepository.findByUsername("marketing").orElse(null);
        User telesalesUser = userRepository.findByUsername("telesales").orElse(null);

        if (adminUser != null && marketingUser != null && telesalesUser != null) {
            createSampleLeads(adminUser, marketingUser, telesalesUser);
            System.out.println("Created 50 sample leads successfully!");
        } else {
            System.out.println("Cannot create leads: Required users not found");
        }
    }

    @Transactional
    private void createSampleLeads(User adminUser, User marketingUser, User telesalesUser) {
        String[] firstNames = {
            "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Đặng", "Bùi", "Đỗ",
            "Hồ", "Ngô", "Dương", "Lý", "Võ", "Đào", "Đinh", "Tô", "Lưu", "Mai"
        };
        
        String[] middleNames = {"Văn", "Thị", "Minh", "Thu", "Quốc", "Hữu", "Công", "Đình", "Xuân", "Thanh"};
        
        String[] lastNames = {
            "An", "Bình", "Cường", "Dũng", "Em", "Phong", "Giang", "Hải", "Khoa", "Long",
            "Mai", "Nam", "Oanh", "Phúc", "Quân", "Sơn", "Thắng", "Uyên", "Vinh", "Xuân",
            "Yến", "Anh", "Bảo", "Chi", "Đạt", "Hùng", "Kiệt", "Linh", "Minh", "Nhân"
        };
        
        String[] companies = {
            "Công ty TNHH ABC", "Tập đoàn XYZ", "Công ty Cổ phần DEF", "Startup GHI", 
            "Doanh nghiệp JKL", "Công ty MNO", "Tổ chức PQR", "Nhà máy STU", "Xí nghiệp VWX",
            "Công ty YZ Tech", "ABC Solutions", "XYZ Digital", "Tech Innovate", "Smart Systems",
            "Green Energy Co", "Blue Ocean Ltd", "Red Dragon Corp", "Golden Gate Inc",
            "Silver Star Co", "Diamond Tech", "Platinum Solutions", "Crystal Clear Co",
            "Bright Future Ltd", "New Vision Corp", "Global Connect", "Fast Track Co",
            "Dynamic Systems", "Progressive Tech", "Advanced Solutions", "Next Gen Co"
        };
        
        VietnamProvince[] provinces = VietnamProvince.values();
        LeadSource[] sources = LeadSource.values();
        LeadStatus[] statuses = LeadStatus.values();
        User[] assignedUsers = {adminUser, marketingUser, telesalesUser, null}; // null for unassigned
        User[] creators = {adminUser, marketingUser, telesalesUser};
        
        String[] notes = {
            "Khách hàng quan tâm đến sản phẩm CRM",
            "Đã gọi điện, khách quan tâm nhưng chưa quyết định",
            "Lead chất lượng cao, đã demo sản phẩm",
            "Khách hàng cá nhân, đã gửi báo giá",
            "Đang thảo luận điều khoản hợp đồng",
            "Đã ký hợp đồng, khách hàng hài lòng",
            "Khách không phù hợp với ngân sách",
            "Lead mới từ triển lãm",
            "Cần tư vấn thêm về giá cả",
            "Khách hàng tiềm năng cao",
            "Đã gửi proposal, đang chờ phản hồi",
            "Khách yêu cầu customization",
            "Đang scheduling meeting",
            "Follow up sau 1 tuần",
            "Khách quan tâm package premium",
            "Cần demo chi tiết hơn",
            "Đã kết nối với decision maker",
            "Yêu cầu reference từ khách hàng cũ",
            "Đang đánh giá với competitor",
            "Hot lead - priority cao"
        };

        for (int i = 1; i <= 50; i++) {
            Lead lead = new Lead();
            
            // Random name generation
            String firstName = firstNames[i % firstNames.length];
            String middleName = middleNames[i % middleNames.length];
            String lastName = lastNames[i % lastNames.length];
            lead.setFullName(firstName + " " + middleName + " " + lastName);
            
            // Phone number
            lead.setPhone(String.format("09%08d", 10000000 + i));
            
            // Email
            String emailPrefix = lastName.toLowerCase().replaceAll("[^a-z]", "") + 
                               middleName.toLowerCase().replaceAll("[^a-z]", "");
            String[] emailDomains = {"gmail.com", "yahoo.com", "hotmail.com", "company.com", "email.com"};
            lead.setEmail(emailPrefix + i + "@" + emailDomains[i % emailDomains.length]);
            
            // Company (some leads don't have company)
            if (i % 4 != 0) { // 75% have company
                lead.setCompany(companies[i % companies.length]);
            } else {
                lead.setCompany(""); // 25% individual customers
            }
            
            // Province
            lead.setProvince(provinces[i % provinces.length]);
            
            // Source
            lead.setSource(sources[i % sources.length]);
            
            // Status - distribute realistically
            if (i <= 20) {
                lead.setStatus(LeadStatus.CHUA_GOI); // 40% not called yet
            } else if (i <= 35) {
                lead.setStatus(LeadStatus.CHUA_LIEN_HE_DUOC); // 30% couldn't reach
            } else if (i <= 42) {
                lead.setStatus(LeadStatus.WARM_LEAD); // 14% warm
            } else if (i <= 47) {
                lead.setStatus(LeadStatus.COLD_LEAD); // 10% cold
            } else if (i <= 49) {
                lead.setStatus(LeadStatus.TU_CHOI); // 4% rejected
            } else {
                lead.setStatus(LeadStatus.KY_HOP_DONG); // 2% signed
            }
            
            // Creator
            lead.setCreator(creators[i % creators.length]);
            
            // Assigned user (some unassigned)
            lead.setAssignedUser(assignedUsers[i % assignedUsers.length]);
            
            // Notes
            lead.setNotes(notes[i % notes.length]);
            
            leadRepository.save(lead);
        }
    }
}
