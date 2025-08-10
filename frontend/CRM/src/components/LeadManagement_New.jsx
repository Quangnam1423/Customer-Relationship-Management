import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchableSelect from './SearchableSelect';
import { Refresh } from '@mui/icons-material';
import './LeadManagement_New.css';

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [users, setUsers] = useState([]);
  const [statusChangeNote, setStatusChangeNote] = useState(''); // Ghi chú khi thay đổi trạng thái
  const [originalStatus, setOriginalStatus] = useState(null); // Lưu trạng thái gốc để so sánh

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Reset form function
  const resetForm = () => {
    setShowAddModal(false);
    setEditingLead(null);
    setOriginalStatus(null);
    setStatusChangeNote('');
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      company: '',
      province: '',
      source: '',
      status: 'CHUA_GOI',
      assignedUserId: null,
      notes: ''
    });
  };

  // Form data for add/edit
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    province: '',
    source: '',
    status: 'CHUA_GOI',
    assignedUserId: null,
    notes: ''
  });

  // Filter states
  const [filters, setFilters] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    province: '',
    source: '',
    status: '',
    assignedUserId: '',
    creatorId: '',
    myAssignedLeads: false,
    myCreatedLeads: false,
    createdDateFrom: '',
    createdDateTo: ''
  });

  // Provinces and other options
  const [provinces, setProvinces] = useState([]);
  const [leadStatuses, setLeadStatuses] = useState([]);
  
  const sourceOptions = [
    { value: 'WEBSITE', label: 'Website' },
    { value: 'FACEBOOK', label: 'Facebook' },
    { value: 'GOOGLE', label: 'Google' },
    { value: 'REFERRAL', label: 'Giới thiệu' },
    { value: 'PHONE', label: 'Điện thoại' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'EVENT', label: 'Sự kiện' },
    { value: 'OTHER', label: 'Khác' }
  ];

  useEffect(() => {
    fetchLeads();
    fetchProvinces();
    fetchUsers();
    fetchLeadStatuses();
  }, []);

  useEffect(() => {
    // Sắp xếp leads theo thời gian cập nhật gần nhất
    const sortedLeads = [...leads].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
    });
    
    // Auto apply filters when filters change
    applyFiltersToLeads(filters, sortedLeads);
  }, [leads, filters]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const response = await axios.get('http://localhost:8080/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReloadLeads = async () => {
    // Clear all filters first
    const clearedFilters = {
      fullName: '',
      phone: '',
      email: '',
      company: '',
      province: '',
      source: '',
      status: '',
      assignedUserId: '',
      creatorId: '',
      myAssignedLeads: false,
      myCreatedLeads: false
    };
    
    setFilters(clearedFilters);
    // Reload leads data
    await fetchLeads();
  };

  const fetchProvinces = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const response = await axios.get('http://localhost:8080/api/provinces', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProvinces(response.data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const response = await axios.get('http://localhost:8080/api/users/assignable', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchLeadStatuses = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const response = await axios.get('http://localhost:8080/api/leads/statuses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeadStatuses(response.data);
    } catch (error) {
      console.error('Error fetching lead statuses:', error);
    }
  };

  const fetchLeadDetails = async (leadId) => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const response = await axios.get(`http://localhost:8080/api/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedLead(response.data);
    } catch (error) {
      console.error('Error fetching lead details:', error);
      // Fallback to basic lead data if API fails
      const basicLead = leads.find(lead => lead.id === leadId);
      if (basicLead) {
        setSelectedLead(basicLead);
      }
    }
  };

  const handleFilterChange = (key, value) => {
    console.log('Filter changed:', key, '=', value, 'currentUser:', currentUser?.id);
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (typeof value === 'boolean') {
        return value === true;
      }
      return value !== '' && value !== null;
    }).length;
  };

  const applyFiltersToLeads = (filtersToApply, leadsToFilter = leads) => {
    let filtered = leadsToFilter;

    // Apply basic text/select filters
    Object.keys(filtersToApply).forEach(filterKey => {
      const filterValue = filtersToApply[filterKey];
      if (filterKey === 'myAssignedLeads' || filterKey === 'myCreatedLeads' || 
          filterKey === 'createdDateFrom' || filterKey === 'createdDateTo') {
        return; // Skip these special filters
      }
      
      if (filterValue && filterValue !== '') {
        filtered = filtered.filter(lead => {
          // Special handling for assignedUserId
          if (filterKey === 'assignedUserId') {
            if (filterValue === 'null') {
              return !lead.assignedUserId;
            }
            return lead.assignedUserId && lead.assignedUserId.toString() === filterValue.toString();
          }
          
          const leadValue = lead[filterKey];
          if (typeof leadValue === 'string') {
            return leadValue.toLowerCase().includes(filterValue.toLowerCase());
          }
          return leadValue === filterValue;
        });
      }
    });

    // Apply date range filter
    if (filtersToApply.createdDateFrom || filtersToApply.createdDateTo) {
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        let matchesDateRange = true;

        if (filtersToApply.createdDateFrom) {
          const fromDate = new Date(filtersToApply.createdDateFrom);
          fromDate.setHours(0, 0, 0, 0);
          matchesDateRange = matchesDateRange && leadDate >= fromDate;
        }

        // If createdDateTo is not specified but createdDateFrom is, use current date as end date
        if (filtersToApply.createdDateTo) {
          const toDate = new Date(filtersToApply.createdDateTo);
          toDate.setHours(23, 59, 59, 999);
          matchesDateRange = matchesDateRange && leadDate <= toDate;
        } else if (filtersToApply.createdDateFrom) {
          // Default to current date if only "from date" is specified
          const toDate = new Date();
          toDate.setHours(23, 59, 59, 999);
          matchesDateRange = matchesDateRange && leadDate <= toDate;
        }

        return matchesDateRange;
      });
    }

    // Apply "My Assigned Leads" filter
    if (filtersToApply.myAssignedLeads && currentUser) {
      console.log('Applying myAssignedLeads filter', {
        currentUserId: currentUser.id,
        totalLeads: filtered.length
      });
      filtered = filtered.filter(lead => {
        const matches = lead.assignedUserId && lead.assignedUserId.toString() === currentUser.id.toString();
        if (matches) {
          console.log('Lead matched myAssignedLeads:', lead.fullName, lead.assignedUserId);
        }
        return matches;
      });
      console.log('After myAssignedLeads filter:', filtered.length);
    }

    // Apply "My Created Leads" filter
    if (filtersToApply.myCreatedLeads && currentUser) {
      console.log('Applying myCreatedLeads filter', {
        currentUserId: currentUser.id,
        totalLeads: filtered.length
      });
      filtered = filtered.filter(lead => {
        const matches = lead.creatorId && lead.creatorId.toString() === currentUser.id.toString();
        if (matches) {
          console.log('Lead matched myCreatedLeads:', lead.fullName, lead.creatorId);
        }
        return matches;
      });
      console.log('After myCreatedLeads filter:', filtered.length);
    }

    // Luôn sắp xếp theo thời gian cập nhật gần nhất
    const sortedFiltered = filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      return dateB - dateA;
    });

    setFilteredLeads(sortedFiltered);
  };

  const clearFilters = () => {
    const clearedFilters = {
      fullName: '',
      phone: '',
      email: '',
      company: '',
      province: '',
      source: '',
      status: '',
      assignedUserId: '',
      creatorId: '',
      myAssignedLeads: false,
      myCreatedLeads: false,
      createdDateFrom: '',
      createdDateTo: ''
    };
    
    setFilters(clearedFilters);
    // Auto-apply will happen via useEffect
  };

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      console.log('Submitting form data:', formData);

      if (editingLead) {
        // Update existing lead
        const updateData = { ...formData };
        // Nếu trạng thái thay đổi và có ghi chú, thêm vào request
        if (originalStatus !== formData.status && statusChangeNote.trim()) {
          updateData.statusChangeNote = statusChangeNote.trim();
        }
        const response = await axios.put(`http://localhost:8080/api/leads/${editingLead.id}`, updateData, config);
        console.log('Update response:', response.data);
      } else {
        // Create new lead
        const response = await axios.post('http://localhost:8080/api/leads', formData, config);
        console.log('Create response:', response.data);
      }

      // Refresh leads list
      await fetchLeads();
      
      // Reset form and close modal
      resetForm();
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Lỗi khi lưu lead: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setOriginalStatus(lead.status); // Lưu trạng thái gốc
    setStatusChangeNote(''); // Reset ghi chú
    setFormData({
      fullName: lead.fullName || '',
      phone: lead.phone || '',
      email: lead.email || '',
      company: lead.company || '',
      province: lead.province || '',
      source: lead.source || '',
      status: lead.status || 'CHUA_GOI',
      assignedUserId: lead.assignedUserId || null,
      notes: lead.notes || ''
    });
    setShowAddModal(true);
    setSelectedLead(null); // Close detail modal
    
    // Đảm bảo leadStatuses đã được load
    if (leadStatuses.length === 0) {
      fetchLeadStatuses();
    }
  };

  const handleDeleteLead = async (lead) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa lead "${lead.fullName}"? Hành động này không thể hoàn tác.`)) {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        await axios.delete(`http://localhost:8080/api/leads/${lead.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Refresh leads list
        await fetchLeads();
        
        // Close detail modal
        setSelectedLead(null);
        
        // Show success message
        alert('Lead đã được xóa thành công!');
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Lỗi khi xóa lead: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Helper functions
  const getProvinceLabel = (provinceName) => {
    const province = provinces.find(p => p.name === provinceName);
    return province ? province.displayName : provinceName;
  };

  const getSourceLabel = (sourceValue) => {
    const source = sourceOptions.find(s => s.value === sourceValue);
    return source ? source.label : sourceValue;
  };

  const getStatusLabel = (statusValue) => {
    const status = leadStatuses.find(s => s.value === statusValue);
    return status ? status.label : statusValue;
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'CHUA_GOI': 'bg-secondary',
      'CHUA_LIEN_HE_DUOC': 'bg-warning',
      'WARM_LEAD': 'bg-info',
      'COLD_LEAD': 'bg-primary',
      'TU_CHOI': 'bg-danger',
      'KY_HOP_DONG': 'bg-success'
    };
    return statusClasses[status] || 'bg-secondary';
  };

  const getAssignedUserLabel = (userId) => {
    if (!userId) return 'Chưa phân công';
    const user = users.find(u => u.id === userId);
    return user ? (user.fullName || user.username) : 'Không xác định';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="lead-management">
      {/* Top Action Buttons */}
      <div className="d-flex justify-content-end mb-3">
        <button 
          className="btn btn-outline-dark btn-sm me-2"
          onClick={handleReloadLeads}
          title="Tải lại danh sách và xóa bộ lọc"
        >
          <Refresh />
        </button>
        
        <button 
          className="btn btn-dark btn-sm"
          onClick={() => {
            setShowAddModal(true);
            // Đảm bảo leadStatuses đã được load
            if (leadStatuses.length === 0) {
              fetchLeadStatuses();
            }
          }}
        >
          <i className="fas fa-plus me-2"></i>
          Thêm Lead
        </button>
      </div>

      {/* Lead Count Badge */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="badge bg-primary fs-6 px-3 py-2">
          All ({filteredLeads.length})
        </span>
        {getActiveFiltersCount() > 0 && (
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={clearFilters}
            title="Xóa tất cả bộ lọc"
          >
            <i className="fas fa-times me-1"></i>
            Xóa bộ lọc ({getActiveFiltersCount()})
          </button>
        )}
      </div>

      {/* Compact Filter Section */}
      <div className="filter-section mb-4">
        <div className="row g-2">
          <div className="col-md-2">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-sm"
                value={filters.fullName}
                onChange={(e) => handleFilterChange('fullName', e.target.value)}
                placeholder="Tên khách hàng"
              />
              {filters.fullName && (
                <button
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                  onClick={() => handleFilterChange('fullName', '')}
                  style={{ fontSize: '12px', color: '#999' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-md-2">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-sm"
                value={filters.phone}
                onChange={(e) => handleFilterChange('phone', e.target.value)}
                placeholder="Số điện thoại"
              />
              {filters.phone && (
                <button
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                  onClick={() => handleFilterChange('phone', '')}
                  style={{ fontSize: '12px', color: '#999' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-md-2">
            <div className="position-relative">
              <input
                type="email"
                className="form-control form-control-sm"
                value={filters.email}
                onChange={(e) => handleFilterChange('email', e.target.value)}
                placeholder="Email"
              />
              {filters.email && (
                <button
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                  onClick={() => handleFilterChange('email', '')}
                  style={{ fontSize: '12px', color: '#999' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-md-2">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-sm"
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                placeholder="Công ty"
              />
              {filters.company && (
                <button
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                  onClick={() => handleFilterChange('company', '')}
                  style={{ fontSize: '12px', color: '#999' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-md-2">
            <div className="position-relative">
              <select
                className="form-select form-select-sm"
                value={filters.province}
                onChange={(e) => handleFilterChange('province', e.target.value)}
              >
                <option value="">Tỉnh/Thành phố</option>
                {provinces.map(province => (
                  <option key={province.name} value={province.name}>
                    {province.displayName}
                  </option>
                ))}
              </select>
              {filters.province && (
                <button
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent me-4"
                  onClick={() => handleFilterChange('province', '')}
                  style={{ fontSize: '12px', color: '#999' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-md-2">
            <div className="position-relative">
              <select
                className="form-select form-select-sm"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Trạng thái</option>
                {leadStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              {filters.status && (
                <button
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent me-4"
                  onClick={() => handleFilterChange('status', '')}
                  style={{ fontSize: '12px', color: '#999' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Second row of filters */}
        <div className="row g-2 mt-2">
          <div className="col-md-2">
            <div className="position-relative">
              <select
                className="form-select form-select-sm"
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
              >
                <option value="">Nguồn lead</option>
                {sourceOptions.map(source => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
              {filters.source && (
                <button
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent me-4"
                  onClick={() => handleFilterChange('source', '')}
                  style={{ fontSize: '12px', color: '#999' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-md-2">
            <div className="position-relative">
              <select
                className="form-select form-select-sm"
                value={filters.assignedUserId}
                onChange={(e) => handleFilterChange('assignedUserId', e.target.value)}
              >
                <option value="">Người phụ trách</option>
                <option value="null">Chưa phân công</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.fullName || user.username}
                  </option>
                ))}
              </select>
              {filters.assignedUserId && (
                <button
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent me-4"
                  onClick={() => handleFilterChange('assignedUserId', '')}
                  style={{ fontSize: '12px', color: '#999' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-md-8 d-flex align-items-center">
            <div className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                id="myAssignedLeads"
                checked={filters.myAssignedLeads}
                onChange={(e) => handleFilterChange('myAssignedLeads', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="myAssignedLeads">
                Lead của tôi
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="checkbox"
                className="form-check-input"
                id="myCreatedLeads"
                checked={filters.myCreatedLeads}
                onChange={(e) => handleFilterChange('myCreatedLeads', e.target.checked)}
              />
              <label className="form-check-label" htmlFor="myCreatedLeads">
                Do tôi tạo
              </label>
            </div>
          </div>
        </div>
        
        {/* Third row - Date filters */}
        <div className="row g-2 mt-3">
          <div className="col-md-3">
            <label className="form-label text-muted small">Từ ngày</label>
            <div className="position-relative">
              <input
                type="date"
                className="form-control form-control-sm"
                value={filters.createdDateFrom}
                onChange={(e) => handleFilterChange('createdDateFrom', e.target.value)}
                title="Từ ngày"
              />
              {filters.createdDateFrom && (
                <button
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                  onClick={() => handleFilterChange('createdDateFrom', '')}
                  style={{ fontSize: '12px', color: '#999' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label text-muted small">Đến ngày (để trống = hôm nay)</label>
            <div className="position-relative">
              <input
                type="date"
                className="form-control form-control-sm"
                value={filters.createdDateTo}
                onChange={(e) => handleFilterChange('createdDateTo', e.target.value)}
                title="Đến ngày (để trống sẽ lấy ngày hiện tại)"
              />
              {filters.createdDateTo && (
                <button
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                  onClick={() => handleFilterChange('createdDateTo', '')}
                  style={{ fontSize: '12px', color: '#999' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-md-6 d-flex align-items-end">
            <small className="text-muted">
              <i className="fas fa-calendar-alt me-1"></i>
              Lọc lead theo thời gian tạo. Nếu không chọn "Đến ngày", mặc định là ngày hôm nay.
            </small>
          </div>
        </div>
      </div>

      {/* Lead Table */}
      <div className="table-container">
        <table className="table table-hover table-striped">
          <thead className="table-dark sticky-top">
            <tr>
              <th style={{ width: '140px' }}>Tên khách hàng</th>
              <th style={{ width: '110px' }}>Điện thoại</th>
              <th style={{ width: '140px' }}>Email</th>
              <th style={{ width: '120px' }}>Công ty</th>
              <th style={{ width: '100px' }}>Tỉnh/TP</th>
              <th style={{ width: '80px' }}>Nguồn</th>
              <th style={{ width: '100px' }}>Trạng thái</th>
              <th style={{ width: '120px' }}>Người phụ trách</th>
              <th style={{ width: '100px' }}>Người tạo</th>
              <th style={{ width: '90px' }}>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                  <div className="mt-2">Đang tải danh sách lead...</div>
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center text-muted py-5">
                  <i className="fas fa-search fa-2x mb-3 text-muted"></i>
                  <br />
                  {leads.length === 0 ? (
                    <div>
                      <strong>Chưa có lead nào trong hệ thống</strong>
                      <br />
                      <small>Hãy nhấn "Thêm Lead" để tạo lead đầu tiên</small>
                    </div>
                  ) : (
                    <div>
                      <strong>Không có lead nào phù hợp với bộ lọc</strong>
                      <br />
                      <small>Thử điều chỉnh bộ lọc để xem các lead khác</small>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="clickable-row"
                  onClick={() => fetchLeadDetails(lead.id)}
                  style={{ cursor: 'pointer' }}
                  title="Nhấn để xem chi tiết"
                >
                  <td className="text-truncate" title={lead.fullName}>
                    <strong>{lead.fullName}</strong>
                  </td>
                  <td className="text-truncate" title={lead.phone}>
                    {lead.phone}
                  </td>
                  <td className="text-truncate" title={lead.email || '-'}>
                    {lead.email || '-'}
                  </td>
                  <td className="text-truncate" title={lead.company || '-'}>
                    {lead.company || '-'}
                  </td>
                  <td className="text-truncate" title={getProvinceLabel(lead.province)}>
                    {getProvinceLabel(lead.province)}
                  </td>
                  <td className="text-truncate" title={getSourceLabel(lead.source)}>
                    {getSourceLabel(lead.source)}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(lead.status)} text-truncate`} style={{ fontSize: '0.7rem' }}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </td>
                  <td className="text-truncate" title={getAssignedUserLabel(lead.assignedUserId)}>
                    {getAssignedUserLabel(lead.assignedUserId)}
                  </td>
                  <td className="text-truncate" title={lead.creatorFullName || lead.creatorUsername}>
                    <i className="fas fa-user-plus me-1 text-success" style={{fontSize: '0.7rem'}}></i>
                    {lead.creatorFullName || lead.creatorUsername}
                  </td>
                  <td className="text-truncate" title={formatDate(lead.updatedAt)}>
                    {formatDate(lead.updatedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết Lead</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedLead(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Tên khách hàng:</strong> {selectedLead.fullName}</p>
                    <p><strong>Số điện thoại:</strong> {selectedLead.phone}</p>
                    <p><strong>Email:</strong> {selectedLead.email || 'Chưa có'}</p>
                    <p><strong>Công ty:</strong> {selectedLead.company || 'Khách hàng cá nhân'}</p>
                    <p><strong>Tỉnh/Thành phố:</strong> {getProvinceLabel(selectedLead.province)}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Nguồn lead:</strong> {getSourceLabel(selectedLead.source)}</p>
                    <p><strong>Trạng thái:</strong> 
                      <span className={`badge ${getStatusBadgeClass(selectedLead.status)} ms-2`}>
                        {getStatusLabel(selectedLead.status)}
                      </span>
                    </p>
                    <p><strong>Người phụ trách:</strong> {getAssignedUserLabel(selectedLead.assignedUserId)}</p>
                    <p><strong>Người tạo:</strong> 
                      <i className="fas fa-user-plus me-1 text-success"></i>
                      {selectedLead.creatorFullName || selectedLead.creatorUsername || 'Không xác định'}
                      {selectedLead.creatorEmail && (
                        <small className="text-muted ms-2">({selectedLead.creatorEmail})</small>
                      )}
                    </p>
                    <p><strong>Ngày tạo:</strong> {formatDate(selectedLead.createdAt)}</p>
                    <p><strong>Cập nhật lần cuối:</strong> {formatDate(selectedLead.updatedAt)}</p>
                  </div>
                </div>
                {selectedLead.notes && (
                  <div className="row mb-3">
                    <div className="col-12">
                      <p><strong>Ghi chú:</strong></p>
                      <div className="p-3 bg-light rounded">
                        {selectedLead.notes}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Lịch sử trạng thái */}
                <div className="row">
                  <div className="col-12">
                    <p><strong><i className="fas fa-history me-1"></i>Lịch sử trạng thái:</strong></p>
                    {selectedLead.statusHistory && selectedLead.statusHistory.length > 0 ? (
                      <div className="status-history" style={{maxHeight: '250px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '0.375rem', padding: '10px', backgroundColor: '#f8f9fa'}}>
                        {selectedLead.statusHistory.map((history, index) => (
                          <div key={history.id} className={`d-flex align-items-start mb-3 p-3 rounded ${index === 0 ? 'bg-white border-start border-primary border-3' : 'bg-light'}`}>
                            <div className="me-3">
                              <i className="fas fa-circle text-primary" style={{fontSize: '8px', marginTop: '6px'}}></i>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center mb-2">
                                {history.oldStatus && (
                                  <>
                                    <span className={`badge ${getStatusBadgeClass(history.oldStatus)} me-2`} style={{fontSize: '0.75rem'}}>
                                      {getStatusLabel(history.oldStatus)}
                                    </span>
                                    <i className="fas fa-arrow-right mx-2 text-muted" style={{fontSize: '0.8rem'}}></i>
                                  </>
                                )}
                                <span className={`badge ${getStatusBadgeClass(history.newStatus)}`} style={{fontSize: '0.75rem'}}>
                                  {getStatusLabel(history.newStatus)}
                                </span>
                                {index === 0 && (
                                  <span className="badge bg-success ms-2" style={{fontSize: '0.65rem'}}>Mới nhất</span>
                                )}
                              </div>
                              <div className="d-flex align-items-center mb-1">
                                <i className="fas fa-user me-2 text-primary" style={{fontSize: '0.8rem'}}></i>
                                <strong className="text-dark" style={{fontSize: '0.9rem'}}>{history.updatedByName}</strong>
                                <span className="text-muted mx-2">•</span>
                                <i className="fas fa-clock me-1 text-muted" style={{fontSize: '0.7rem'}}></i>
                                <small className="text-muted">{formatDate(history.createdAt)}</small>
                              </div>
                              {history.notes && (
                                <div className="mt-2 p-2 bg-info bg-opacity-10 rounded border-start border-info border-3">
                                  <i className="fas fa-comment me-2 text-info" style={{fontSize: '0.8rem'}}></i>
                                  <small className="text-dark">{history.notes}</small>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted p-4" style={{border: '2px dashed #dee2e6', borderRadius: '0.375rem', backgroundColor: '#f8f9fa'}}>
                        <i className="fas fa-history fa-3x mb-3 text-muted"></i>
                        <p className="mb-0">Chưa có lịch sử thay đổi trạng thái</p>
                        <small>Lịch sử sẽ được ghi lại khi bạn cập nhật trạng thái lead</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-danger me-auto"
                  onClick={() => handleDeleteLead(selectedLead)}
                  title="Xóa lead này"
                >
                  <i className="fas fa-trash me-2"></i>
                  Xóa
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => handleEditLead(selectedLead)}
                >
                  <i className="fas fa-edit me-2"></i>
                  Chỉnh sửa
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedLead(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Lead Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingLead ? 'Chỉnh sửa Lead' : 'Thêm Lead mới'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={resetForm}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitLead}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Tên khách hàng *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Số điện thoại *</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="company" className="form-label">Công ty</label>
                        <input
                          type="text"
                          className="form-control"
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Để trống nếu là khách hàng cá nhân"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="province" className="form-label">Tỉnh/Thành phố *</label>
                        <select
                          className="form-select"
                          id="province"
                          value={formData.province}
                          onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                          required
                        >
                          <option value="">Chọn tỉnh/thành phố</option>
                          {provinces.map(province => (
                            <option key={province.name} value={province.name}>
                              {province.displayName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="source" className="form-label">Nguồn lead *</label>
                        <select
                          className="form-select"
                          id="source"
                          value={formData.source}
                          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                          required
                        >
                          <option value="">Chọn nguồn lead</option>
                          {sourceOptions.map(source => (
                            <option key={source.value} value={source.value}>
                              {source.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="assignedUserId" className="form-label">Người phụ trách</label>
                        <select
                          className="form-select"
                          id="assignedUserId"
                          value={formData.assignedUserId || ''}
                          onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value || null })}
                        >
                          <option value="">Chưa gán</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.fullName || user.username} ({user.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {editingLead && (
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="status" className="form-label">Trạng thái</label>
                          <select
                            className="form-select"
                            id="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          >
                            {leadStatuses.length > 0 ? (
                              leadStatuses.map(status => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))
                            ) : (
                              // Fallback options nếu API chưa load được
                              <>
                                <option value="CHUA_GOI">Chưa gọi</option>
                                <option value="DA_GOI">Đã gọi</option>
                                <option value="DA_NHAN">Đã nhận</option>
                                <option value="KHONG_NHAN">Không nhận</option>
                                <option value="DA_HUY">Đã hủy</option>
                              </>
                            )}
                          </select>
                          {leadStatuses.length === 0 && (
                            <small className="text-muted">Đang tải danh sách trạng thái...</small>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Trường ghi chú khi thay đổi trạng thái */}
                  {editingLead && originalStatus && originalStatus !== formData.status && (
                    <div className="row mb-3">
                      <div className="col-12">
                        <div className="alert alert-info border-start border-info border-4 bg-info bg-opacity-10">
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-info-circle me-2 text-info"></i>
                            <small className="text-dark">
                              <strong>Thay đổi trạng thái:</strong>
                            </small>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className={`badge ${getStatusBadgeClass(originalStatus)} me-2`}>
                              {getStatusLabel(originalStatus)}
                            </span>
                            <i className="fas fa-arrow-right mx-2 text-muted"></i>
                            <span className={`badge ${getStatusBadgeClass(formData.status)}`}>
                              {getStatusLabel(formData.status)}
                            </span>
                          </div>
                        </div>
                        <label htmlFor="statusChangeNote" className="form-label">
                          <i className="fas fa-edit me-1"></i>
                          Ghi chú thay đổi trạng thái
                        </label>
                        <textarea
                          className="form-control border-info"
                          id="statusChangeNote"
                          rows="2"
                          value={statusChangeNote}
                          onChange={(e) => setStatusChangeNote(e.target.value)}
                          placeholder="Nhập lý do thay đổi trạng thái (tùy chọn)..."
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">Ghi chú</label>
                    <textarea
                      className="form-control"
                      id="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Nhập ghi chú về lead..."
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={resetForm}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingLead ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background overlay for modal */}
      {(selectedLead || showAddModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default LeadManagement;
