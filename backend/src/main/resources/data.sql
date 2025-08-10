INSERT INTO roles(name) VALUES('ROLE_USER');
INSERT INTO roles(name) VALUES('ROLE_ADMIN');
INSERT INTO roles(name) VALUES('ROLE_MARKETING');
INSERT INTO roles(name) VALUES('ROLE_TELESALES');
INSERT INTO roles(name) VALUES('ROLE_SALES');

-- Sample leads data 
INSERT IGNORE INTO leads (full_name, province, phone, email, company, source, status, notes, creator_id, assigned_user_id, created_at, updated_at) VALUES
('Nguyễn Văn A', 'HANOI', '0123456789', 'nguyenvana@gmail.com', 'Cửa hàng A', 'FACEBOOK', 'CHUA_GOI', 'Khách hàng quan tâm phần mềm bán hàng', 1, 1, NOW(), NOW()),
('Trần Thị B', 'HO_CHI_MINH', '0987654321', 'tranthib@gmail.com', 'Công ty B', 'WEBSITE', 'WARM_LEAD', 'Đã liên hệ, khách quan tâm dịch vụ', 1, 2, NOW(), NOW()),
('Lê Văn C', 'DA_NANG', '0234567890', 'levanc@gmail.com', 'Công ty C', 'GOOGLE', 'COLD_LEAD', 'Chưa có nhu cầu ngay', 2, 1, NOW(), NOW()),
('Phạm Thị D', 'CAN_THO', '0345678901', 'phamthid@gmail.com', 'Công ty D', 'REFERRAL', 'CHUA_GOI', 'Khách hàng tiềm năng', 2, NULL, NOW(), NOW()),
('Hoàng Văn E', 'HAI_PHONG', '0456789012', 'hoangvane@gmail.com', 'Công ty E', 'EMAIL', 'TU_CHOI', 'Đã từ chối', 1, 1, NOW(), NOW()),
('Ngô Thị F', 'HUE', '0567890123', 'ngothif@gmail.com', 'Công ty F', 'PHONE', 'KY_HOP_DONG', 'Đã ký hợp đồng', 2, 2, NOW(), NOW());
