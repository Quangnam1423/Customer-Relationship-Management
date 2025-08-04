-- Drop existing leads table if it exists and recreate with new structure
DROP TABLE IF EXISTS leads;

-- Create leads table with new structure
CREATE TABLE leads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    area VARCHAR(255),
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    interest_field VARCHAR(255),
    source VARCHAR(255),
    source_detail VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'CHUA_GOI',
    notes TEXT,
    creator_id BIGINT NOT NULL,
    assigned_user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id),
    FOREIGN KEY (assigned_user_id) REFERENCES users(id)
);

-- Insert sample data for testing
INSERT INTO leads (customer_name, area, phone, email, interest_field, source, source_detail, status, notes, creator_id, assigned_user_id) VALUES
('Nguyễn Văn A', 'Hà Nội', '0123456789', 'a@gmail.com', 'Phần mềm bán hàng', 'marketing', 'Facebook', 'CHUA_GOI', 'Khách hàng quan tâm phần mềm bán hàng', 1, 1),
('Trần Thị B', 'Hồ Chí Minh', '0987654321', 'b@gmail.com', 'Dịch vụ kế toán', 'tự sales', null, 'WARM_LEAD', 'Đã liên hệ, khách quan tâm', 1, 2),
('Lê Văn C', 'Đà Nẵng', '0234567890', 'c@gmail.com', 'Xuất hóa đơn điện tử', 'marketing', 'Google Ads', 'COLD_LEAD', 'Chưa có nhu cầu ngay', 2, 1),
('Phạm Thị D', 'Cần Thơ', '0345678901', 'd@gmail.com', 'Phần mềm quản lý', 'khác', null, 'CHUA_GOI', null, 2, null);
