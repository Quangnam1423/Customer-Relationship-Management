import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchableSelect from './SearchableSelect';
import { Refresh } from '@mui/icons-material';
import './LeadManagement.css';

const LeadManagement = ({ currentUser }) => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [users, setUsers] = useState([]);

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
    myCreatedLeads: false
  });

  // Applied filters state
  const [appliedFilters, setAppliedFilters] = useState({
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
    setFilteredLeads(sortedLeads);
  }, [leads]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      console.log('Fetching leads with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get('http://localhost:8080/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Leads response:', response.data);
      console.log('Number of leads:', response.data.length);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
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
      const response = await axios.get('http://localhost:8080/api/users', {
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
      const response = await axios.get('http://localhost:8080/api/lead-statuses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeadStatuses(response.data);
    } catch (error) {
      console.error('Error fetching lead statuses:', error);
    }
  };

  const handleFilterChange = (key, value) => {
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

  const getAppliedFiltersCount = () => {
    return Object.entries(appliedFilters).filter(([key, value]) => {
      if (typeof value === 'boolean') {
        return value === true;
      }
      return value !== '' && value !== null;
    }).length;
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    applyFiltersToLeads(filters);
  };

  const applyFiltersToLeads = (filtersToApply) => {
    let filtered = leads;

    // Apply basic text/select filters
    Object.keys(filtersToApply).forEach(filterKey => {
      const filterValue = filtersToApply[filterKey];
      if (filterKey === 'myAssignedLeads' || filterKey === 'myCreatedLeads') {
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

    // Apply "My Assigned Leads" filter
    if (filtersToApply.myAssignedLeads && currentUser) {
      filtered = filtered.filter(lead => 
        lead.assignedUserId && lead.assignedUserId.toString() === currentUser.id.toString()
      );
    }

    // Apply "My Created Leads" filter
    if (filtersToApply.myCreatedLeads && currentUser) {
      filtered = filtered.filter(lead => 
        lead.creatorId && lead.creatorId.toString() === currentUser.id.toString()
      );
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
      myCreatedLeads: false
    };
    
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    
    // Reset về danh sách được sắp xếp theo thời gian cập nhật
    const sortedLeads = [...leads].sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      return dateB - dateA;
    });
    setFilteredLeads(sortedLeads);
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
        const response = await axios.put(`http://localhost:8080/api/leads/${editingLead.id}`, formData, config);
        console.log('Update response:', response.data);
      } else {
        // Create new lead
        const response = await axios.post('http://localhost:8080/api/leads', formData, config);
        console.log('Create response:', response.data);
      }

      // Refresh leads list
      await fetchLeads();
      
      // Reset form and close modal
      setShowAddModal(false);
      setEditingLead(null);
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
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Lỗi khi lưu lead: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
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
          onClick={fetchLeads}
          title="Tải lại danh sách"
        >
          <Refresh />
        </button>
        
        <button 
          className="btn btn-dark btn-sm"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Thêm Lead
        </button>
      </div>

      {/* Lead Count Badge */}
      <div className="mb-3">
        <span className="badge bg-primary fs-6 px-3 py-2">
          All ({filteredLeads.length})
        </span>
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
            {getActiveFiltersCount() > 0 && (
              <button 
                className="btn btn-success btn-sm ms-3"
                onClick={applyFilters}
              >
                <i className="fas fa-filter me-1"></i>
                Áp dụng ({getActiveFiltersCount()})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lead Table */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th style={{ width: '180px', minWidth: '180px' }}>Tên khách hàng</th>
              <th style={{ width: '120px', minWidth: '120px' }}>Điện thoại</th>
              <th style={{ width: '200px', minWidth: '200px' }}>Email</th>
              <th style={{ width: '150px', minWidth: '150px' }}>Công ty</th>
              <th style={{ width: '120px', minWidth: '120px' }}>Tỉnh/TP</th>
              <th style={{ width: '100px', minWidth: '100px' }}>Nguồn</th>
              <th style={{ width: '120px', minWidth: '120px' }}>Trạng thái</th>
              <th style={{ width: '140px', minWidth: '140px' }}>Người phụ trách</th>
              <th style={{ width: '120px', minWidth: '120px' }}>Cập nhật</th>
              <th style={{ width: '120px', minWidth: '120px' }}>Ngày tạo</th>
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
                  onClick={() => setSelectedLead(lead)}
                  style={{ cursor: 'pointer' }}
                  title="Nhấn để xem chi tiết"
                >
                  <td className="text-truncate" style={{ maxWidth: '180px' }} title={lead.fullName}>
                    {lead.fullName}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '120px' }} title={lead.phone}>
                    {lead.phone}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '200px' }} title={lead.email || '-'}>
                    {lead.email || '-'}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '150px' }} title={lead.company || '-'}>
                    {lead.company || '-'}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '120px' }} title={getProvinceLabel(lead.province)}>
                    {getProvinceLabel(lead.province)}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '100px' }} title={getSourceLabel(lead.source)}>
                    {getSourceLabel(lead.source)}
                  </td>
                  <td style={{ maxWidth: '120px' }}>
                    <span className={`badge ${getStatusBadgeClass(lead.status)} text-truncate`} style={{ maxWidth: '110px' }}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '140px' }} title={getAssignedUserLabel(lead.assignedUserId)}>
                    {getAssignedUserLabel(lead.assignedUserId)}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '120px' }} title={formatDate(lead.updatedAt)}>
                    {formatDate(lead.updatedAt)}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '120px' }} title={formatDate(lead.createdAt)}>
                    {formatDate(lead.createdAt)}
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
                    <p><strong>Ngày tạo:</strong> {formatDate(selectedLead.createdAt)}</p>
                    <p><strong>Cập nhật lần cuối:</strong> {formatDate(selectedLead.updatedAt)}</p>
                  </div>
                </div>
                {selectedLead.notes && (
                  <div className="row">
                    <div className="col-12">
                      <p><strong>Ghi chú:</strong></p>
                      <div className="p-3 bg-light rounded">
                        {selectedLead.notes}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
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
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLead(null);
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
                  }}
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
                            {leadStatuses.map(status => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

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
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingLead(null);
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
                      }}
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
