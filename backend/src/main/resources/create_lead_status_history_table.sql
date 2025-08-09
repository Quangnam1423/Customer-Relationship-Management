-- Tạo bảng lịch sử trạng thái lead
CREATE TABLE IF NOT EXISTS lead_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lead_id BIGINT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    updated_by BIGINT NOT NULL,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT,
    
    INDEX idx_lead_status_history_lead_id (lead_id),
    INDEX idx_lead_status_history_created_at (created_at)
);
