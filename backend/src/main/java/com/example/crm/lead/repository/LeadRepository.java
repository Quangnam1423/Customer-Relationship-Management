package com.example.crm.lead.repository;

import com.example.crm.lead.model.Lead;
import com.example.crm.lead.model.LeadStatus;
import com.example.crm.lead.model.VietnamProvince;
import com.example.crm.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    
    // Tìm leads theo assigned user
    List<Lead> findByAssignedUser(User assignedUser);
    
    // Tìm leads theo creator
    List<Lead> findByCreator(User creator);
    
    // Tìm leads theo status
    List<Lead> findByStatus(LeadStatus status);
    
    // Tìm leads theo khu vực (tỉnh thành)
    List<Lead> findByProvince(VietnamProvince province);
    
    // Tìm leads theo miền
    @Query("SELECT l FROM Lead l WHERE l.province IN :provinces")
    List<Lead> findByProvinceIn(@Param("provinces") List<VietnamProvince> provinces);
    
    // Tìm leads theo nguồn
    List<Lead> findBySource(String source);
    
    // Tìm leads theo lĩnh vực quan tâm
    List<Lead> findByCompanyContainingIgnoreCase(String company);
    
    // Tìm leads theo tên khách hàng
    List<Lead> findByFullNameContainingIgnoreCase(String fullName);
    
    // Tìm leads theo số điện thoại
    List<Lead> findByPhoneContaining(String phone);
    
    // Tìm leads được tạo trong khoảng thời gian
    List<Lead> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Tìm leads được cập nhật trong khoảng thời gian
    List<Lead> findByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Query tùy chỉnh để lấy tất cả leads sắp xếp theo thời gian cập nhật mới nhất
    @Query("SELECT l FROM Lead l ORDER BY l.updatedAt DESC")
    List<Lead> findAllOrderByUpdatedAtDesc();
    
    // Query để đếm leads theo status
    @Query("SELECT l.status, COUNT(l) FROM Lead l GROUP BY l.status")
    List<Object[]> countLeadsByStatus();
    
    // Query để đếm leads theo nguồn
    @Query("SELECT l.source, COUNT(l) FROM Lead l GROUP BY l.source")
    List<Object[]> countLeadsBySource();

    // Query để đếm leads theo khu vực (tỉnh thành)
    @Query("SELECT l.province, COUNT(l) FROM Lead l GROUP BY l.province")
    List<Object[]> countLeadsByProvince();
}
