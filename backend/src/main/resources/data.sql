INSERT INTO roles(name) VALUES('ROLE_USER');
INSERT INTO roles(name) VALUES('ROLE_ADMIN');
INSERT INTO roles(name) VALUES('ROLE_MARKETING');
INSERT INTO roles(name) VALUES('ROLE_TELESALES');
INSERT INTO roles(name) VALUES('ROLE_SALES');

-- Sample leads data (if leads table exists)
-- These will be inserted after users are created
INSERT IGNORE INTO leads (customer_name, area, phone, email, interest_field, source, source_detail, status, notes, creator_id, assigned_user_id) VALUES
('Nguyễn Văn A', 'Hà Nội', '0123456789', 'nguyenvana@gmail.com', 'Phần mềm bán hàng', 'marketing', 'Facebook', 'CHUA_GOI', 'Khách hàng quan tâm phần mềm bán hàng cho cửa hàng', 1, 1),
('Trần Thị B', 'Hồ Chí Minh', '0987654321', 'tranthib@gmail.com', 'Dịch vụ kế toán', 'tự sales', null, 'WARM_LEAD', 'Đã liên hệ, khách quan tâm dịch vụ kế toán tổng thể', 1, 2),
('Lê Văn C', 'Đà Nẵng', '0234567890', 'levanc@gmail.com', 'Xuất hóa đơn điện tử', 'marketing', 'Google Ads', 'COLD_LEAD', 'Chưa có nhu cầu ngay, cần follow up sau 3 tháng', 2, 1),
('Phạm Thị D', 'Cần Thơ', '0345678901', 'phamthid@gmail.com', 'Phần mềm quản lý nhân sự', 'khác', null, 'CHUA_GOI', null, 2, null),
('Hoàng Văn E', 'Hải Phòng', '0456789012', 'hoangvane@gmail.com', 'Phần mềm bán hàng', 'marketing', 'Zalo', 'TU_CHOI', 'Đã từ chối, không có nhu cầu', 1, 1),
('Ngô Thị F', 'Huế', '0567890123', 'ngothif@gmail.com', 'Dịch vụ thuế', 'tự sales', null, 'KY_HOP_DONG', 'Đã ký hợp đồng dịch vụ thuế trọn gói', 2, 2);
