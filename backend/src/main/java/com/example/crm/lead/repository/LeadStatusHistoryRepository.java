package com.example.crm.lead.repository;

import com.example.crm.lead.model.LeadStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadStatusHistoryRepository extends JpaRepository<LeadStatusHistory, Long> {
    
    // Tìm lịch sử trạng thái theo lead ID, sắp xếp theo thời gian mới nhất
    @Query("SELECT h FROM LeadStatusHistory h WHERE h.lead.id = :leadId ORDER BY h.createdAt DESC")
    List<LeadStatusHistory> findByLeadIdOrderByCreatedAtDesc(@Param("leadId") Long leadId);
    
    // Tìm lịch sử trạng thái theo lead ID, sắp xếp theo thời gian cũ nhất
    @Query("SELECT h FROM LeadStatusHistory h WHERE h.lead.id = :leadId ORDER BY h.createdAt ASC")
    List<LeadStatusHistory> findByLeadIdOrderByCreatedAtAsc(@Param("leadId") Long leadId);
}
