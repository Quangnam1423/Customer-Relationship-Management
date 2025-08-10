import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import './Export.css';

const Export = () => {
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    assignedUserId: null,
    myLeadsOnly: false,
    status: '',
    source: ''
  });

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Field labels mapping
  const fieldLabels = {
    id: 'ID',
    fullName: 'Họ và tên',
    email: 'Email',
    phone: 'Số điện thoại',
    company: 'Công ty',
    province: 'Tỉnh/Thành phố',
    status: 'Trạng thái',
    source: 'Nguồn',
    assignedUser: 'Người phụ trách',
    createdAt: 'Ngày tạo',
    updatedAt: 'Ngày cập nhật',
    notes: 'Ghi chú',
    creator: 'Người tạo'
  };

  const statusOptions = [
    { value: 'CHUA_GOI', label: 'Chưa gọi' },
    { value: 'DANG_LIEN_LAC', label: 'Đang liên lạc' },
    { value: 'DA_LIEN_LAC', label: 'Đã liên lạc' },
    { value: 'KHONG_QUAN_TAM', label: 'Không quan tâm' },
    { value: 'QUAN_TAM', label: 'Quan tâm' },
    { value: 'THANH_CONG', label: 'Thành công' }
  ];

  const sourceOptions = [
    { value: 'WEBSITE', label: 'Website' },
    { value: 'FACEBOOK', label: 'Facebook' },
    { value: 'GOOGLE', label: 'Google' },
    { value: 'GIOI_THIEU', label: 'Giới thiệu' },
    { value: 'KHAC', label: 'Khác' }
  ];

  useEffect(() => {
    fetchAvailableFields();
    fetchUsers();
  }, []);

  const fetchAvailableFields = async () => {
    try {
      const token = currentUser?.token || JSON.parse(localStorage.getItem('user'))?.token;
      console.log('Token being sent:', token); // Debug log
      
      if (!token) {
        console.error('No token available');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/export/fields', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableFields(response.data);
      // Select all fields by default
      setSelectedFields(response.data);
    } catch (error) {
      console.error('Error fetching available fields:', error);
      if (error.response?.status === 401) {
        console.error('Authentication failed - token may be invalid');
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const token = currentUser?.token || JSON.parse(localStorage.getItem('user'))?.token;
      const response = await axios.get('http://localhost:8080/api/users/assignable', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleSelectAll = () => {
    setSelectedFields(availableFields);
  };

  const handleSelectNone = () => {
    setSelectedFields([]);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      alert('Vui lòng chọn ít nhất một trường để xuất');
      return;
    }

    try {
      setExporting(true);

      const exportRequest = {
        fields: selectedFields,
        startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : null,
        endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : null,
        assignedUserId: filters.myLeadsOnly ? currentUser?.id : filters.assignedUserId,
        myLeadsOnly: filters.myLeadsOnly,
        status: filters.status || null,
        source: filters.source || null
      };

      const token = currentUser?.token || JSON.parse(localStorage.getItem('user'))?.token;
      
      if (!token) {
        alert('Không tìm thấy token xác thực');
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/export/leads/excel', 
        exportRequest,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob'
        }
      );

      // Create blob and download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or generate with timestamp
      const contentDisposition = response.headers['content-disposition'];
      console.log('Content-Disposition header:', contentDisposition); // Debug log
      
      let filename;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        console.log('Filename match:', filenameMatch); // Debug log
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // If no filename from headers, generate one with timestamp
      if (!filename) {
        const now = new Date();
        const timestamp = now.getFullYear() + 
          String(now.getMonth() + 1).padStart(2, '0') + 
          String(now.getDate()).padStart(2, '0') + '_' +
          String(now.getHours()).padStart(2, '0') + 
          String(now.getMinutes()).padStart(2, '0') + 
          String(now.getSeconds()).padStart(2, '0');
        filename = `leads_export_${timestamp}.xlsx`;
      }
      
      console.log('Final filename:', filename); // Debug log
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      alert('Xuất file Excel thành công!');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Có lỗi xảy ra khi xuất file Excel');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-container">
      {/* Header */}
      <div className="export-header">
        <h2>
          <i className="fas fa-file-excel me-2"></i>
          Xuất Excel
        </h2>
        <p className="text-muted">Chọn các trường dữ liệu và bộ lọc để xuất file Excel</p>
      </div>

      <div className="row">
        {/* Field Selection */}
        <div className="col-md-6">
          <div className="field-selection-card">
            <div className="card-header">
              <h6>
                <i className="fas fa-list me-2"></i>
                Chọn trường dữ liệu
              </h6>
              <div className="selection-actions">
                <button className="btn btn-sm btn-outline-primary me-2" onClick={handleSelectAll}>
                  Chọn tất cả
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={handleSelectNone}>
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="fields-grid">
                {availableFields.map(field => (
                  <div key={field} className="field-item">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`field-${field}`}
                        checked={selectedFields.includes(field)}
                        onChange={() => handleFieldToggle(field)}
                      />
                      <label className="form-check-label" htmlFor={`field-${field}`}>
                        {fieldLabels[field] || field}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="selected-count">
                <small className="text-muted">
                  Đã chọn: <strong>{selectedFields.length}</strong> / {availableFields.length} trường
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="col-md-6">
          <div className="filter-card">
            <div className="card-header">
              <h6>
                <i className="fas fa-filter me-2"></i>
                Bộ lọc dữ liệu
              </h6>
            </div>
            <div className="card-body">
              {/* Date Range */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Từ ngày</label>
                  <DatePicker
                    selected={filters.startDate}
                    onChange={(date) => handleFilterChange('startDate', date)}
                    className="form-control"
                    placeholderText="Chọn ngày bắt đầu"
                    dateFormat="dd/MM/yyyy"
                    isClearable
                    maxDate={new Date()}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Đến ngày</label>
                  <DatePicker
                    selected={filters.endDate}
                    onChange={(date) => handleFilterChange('endDate', date)}
                    className="form-control"
                    placeholderText="Chọn ngày kết thúc"
                    dateFormat="dd/MM/yyyy"
                    isClearable
                    minDate={filters.startDate}
                    maxDate={new Date()}
                  />
                </div>
              </div>

              {/* User Assignment */}
              <div className="mb-3">
                <label className="form-label">Người phụ trách</label>
                <select
                  className="form-select"
                  value={filters.assignedUserId || ''}
                  onChange={(e) => handleFilterChange('assignedUserId', e.target.value || null)}
                  disabled={filters.myLeadsOnly}
                >
                  <option value="">Tất cả</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.fullName || user.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="myLeadsOnly"
                  checked={filters.myLeadsOnly}
                  onChange={(e) => handleFilterChange('myLeadsOnly', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="myLeadsOnly">
                  Chỉ lead của tôi
                </label>
              </div>

              {/* Status Filter */}
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Filter */}
              <div className="mb-3">
                <label className="form-label">Nguồn</label>
                <select
                  className="form-select"
                  value={filters.source}
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                >
                  <option value="">Tất cả nguồn</option>
                  {sourceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Action */}
      <div className="export-actions">
        <button 
          className="btn btn-success btn-lg"
          onClick={handleExport}
          disabled={exporting || selectedFields.length === 0}
        >
          {exporting ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Đang xuất...
            </>
          ) : (
            <>
              <i className="fas fa-download me-2"></i>
              Xuất Excel ({selectedFields.length} trường)
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Export;
