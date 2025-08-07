import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchableSelect from './SearchableSelect';
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

  // Filter visibility state
  const [showFilters, setShowFilters] = useState(false);

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
      const response = await axios.get('http://localhost:8080/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
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
      console.log('Provinces response:', response.data);
      setProvinces(response.data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      console.error('Error details:', error.response);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const response = await axios.get('http://localhost:8080/api/users/assignable', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Users response:', response.data);
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
      console.log('Lead statuses response:', response.data);
      setLeadStatuses(response.data);
    } catch (error) {
      console.error('Error fetching lead statuses:', error);
      // Fallback to default statuses if API fails
      setLeadStatuses([
        { value: 'CHUA_GOI', label: 'Chưa gọi' },
        { value: 'CHUA_LIEN_HE_DUOC', label: 'Chưa liên hệ được' },
        { value: 'WARM_LEAD', label: 'Warm lead' },
        { value: 'COLD_LEAD', label: 'Cold lead' },
        { value: 'TU_CHOI', label: 'Từ chối' },
        { value: 'HUY', label: 'Hủy' },
        { value: 'KY_HOP_DONG', label: 'Ký hợp đồng' }
      ]);
    }
  };

  // Function to count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (key === 'myAssignedLeads' || key === 'myCreatedLeads') {
        if (value === true) count++;
      } else if (value && value !== '') {
        count++;
      }
    });
    return count;
  };

  const applyFilters = () => {
    applyFiltersWithState(filters);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Tự động áp dụng filter ngay khi thay đổi
      setTimeout(() => {
        applyFiltersWithState(newFilters);
      }, 0);
      
      return newFilters;
    });
  };

  const applyFiltersWithState = (filtersToApply) => {
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

      // Reset form and close modal
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        company: '',
        province: '',
        source: '',
        status: 'NEW',
        assignedUserId: null,
        notes: ''
      });
      setShowAddModal(false);
      setEditingLead(null);
      
      // Refresh leads
      fetchLeads();
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Có lỗi xảy ra khi lưu thông tin lead');
    }
  };

  const handleEditLead = (lead) => {
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
    setEditingLead(lead);
    setShowAddModal(true);
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'NEW': 'badge-secondary',
      'CONTACTED': 'badge-warning',
      'QUALIFIED': 'badge-info',
      'PROPOSAL': 'badge-primary',
      'NEGOTIATION': 'badge-dark',
      'CLOSED_WON': 'badge-success',
      'CLOSED_LOST': 'badge-danger'
    };
    return `badge ${statusClasses[status] || 'badge-light'}`;
  };

  const getStatusLabel = (status) => {
    const statusItem = leadStatuses.find(s => s.value === status);
    return statusItem ? statusItem.label : status;
  };

  const getSourceLabel = (source) => {
    const sourceItem = sourceOptions.find(s => s.value === source);
    return sourceItem ? sourceItem.label : source;
  };

  const getProvinceLabel = (provinceName) => {
    const province = provinces.find(p => p.name === provinceName);
    return province ? province.displayName : provinceName;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-management">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Quản lý Lead</h2>
          <p className="text-muted mb-0">
            Quản lý danh sách khách hàng tiềm năng của bạn
            <small className="d-block mt-1">
              <i className="fas fa-info-circle me-1"></i>
              Nhấn vào dòng để xem chi tiết lead • Sắp xếp theo cập nhật gần nhất
            </small>
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="d-flex gap-3">
          <button 
            className="btn btn-outline-primary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className={`fas ${showFilters ? 'fa-chevron-up' : 'fa-filter'} me-2`}></i>
            Bộ lọc
            {getActiveFiltersCount() > 0 && (
              <span className="badge bg-danger ms-2">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddModal(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Thêm Lead
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="filter-modal-overlay" onClick={() => setShowFilters(false)}>
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h5 className="mb-0">
                <i className="fas fa-filter me-2"></i>
                Bộ lọc Lead
              </h5>
              <button 
                className="btn-close" 
                onClick={() => setShowFilters(false)}
              ></button>
            </div>
            <div className="filter-modal-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tên khách hàng</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.fullName}
                    onChange={(e) => handleFilterChange('fullName', e.target.value)}
                    placeholder="Nhập tên..."
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.phone}
                    onChange={(e) => handleFilterChange('phone', e.target.value)}
                    placeholder="Nhập số điện thoại..."
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={filters.email}
                    onChange={(e) => handleFilterChange('email', e.target.value)}
                    placeholder="Nhập email..."
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Công ty</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filters.company}
                    onChange={(e) => handleFilterChange('company', e.target.value)}
                    placeholder="Nhập tên công ty..."
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Tỉnh/Thành phố</label>
                  <select
                    className="form-select"
                    value={filters.province}
                    onChange={(e) => handleFilterChange('province', e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {provinces.map(province => (
                      <option key={province.name} value={province.name}>
                        {province.displayName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Nguồn lead</label>
                  <select
                    className="form-select"
                    value={filters.source}
                    onChange={(e) => handleFilterChange('source', e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {sourceOptions.map(source => (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="form-select"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {leadStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Người phụ trách</label>
                  <select
                    className="form-select"
                    value={filters.assignedUserId}
                    onChange={(e) => handleFilterChange('assignedUserId', e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="null">Chưa gán</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.fullName || user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="myAssignedLeads"
                      checked={filters.myAssignedLeads}
                      onChange={(e) => handleFilterChange('myAssignedLeads', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="myAssignedLeads">
                      <i className="fas fa-user-check me-2"></i>
                      Chỉ hiển thị lead được gán cho tôi
                    </label>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="myCreatedLeads"
                      checked={filters.myCreatedLeads}
                      onChange={(e) => handleFilterChange('myCreatedLeads', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="myCreatedLeads">
                      <i className="fas fa-user-plus me-2"></i>
                      Chỉ hiển thị lead do tôi tạo
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="filter-modal-footer">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Bộ lọc sẽ tự động áp dụng khi thay đổi
                  </small>
                </div>
                <div>
                  {getActiveFiltersCount() > 0 && (
                    <small className="text-success me-3">
                      <i className="fas fa-check me-1"></i>
                      {getActiveFiltersCount()} bộ lọc đang hoạt động
                    </small>
                  )}
                  <button 
                    className="btn btn-outline-secondary me-2"
                    onClick={clearFilters}
                    disabled={getActiveFiltersCount() === 0}
                  >
                    <i className="fas fa-times me-2"></i>
                    Xóa bộ lọc
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowFilters(false)}
                  >
                    <i className="fas fa-check me-2"></i>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Table */}
      <div className="card table-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead>
                <tr>
                  <th>Tên khách hàng</th>
                  <th>Điện thoại</th>
                  <th>Email</th>
                  <th>Công ty</th>
                  <th>Tỉnh/TP</th>
                  <th>Nguồn</th>
                  <th>Trạng thái</th>
                  <th>Người phụ trách</th>
                  <th>Cập nhật lần cuối</th>
                  <th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center text-muted">
                      Không có lead nào phù hợp với bộ lọc
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className="table-row-hover clickable-row"
                      onClick={() => setSelectedLead(lead)}
                      style={{ cursor: 'pointer' }}
                      title="Nhấn để xem chi tiết"
                    >
                      <td title={lead.fullName}>{lead.fullName}</td>
                      <td title={lead.phone}>{lead.phone}</td>
                      <td title={lead.email || '-'}>{lead.email || '-'}</td>
                      <td title={lead.company || '-'}>{lead.company || '-'}</td>
                      <td title={getProvinceLabel(lead.province)}>{getProvinceLabel(lead.province)}</td>
                      <td title={getSourceLabel(lead.source)}>{getSourceLabel(lead.source)}</td>
                      <td title={getStatusLabel(lead.status)}>
                        <span className={getStatusBadgeClass(lead.status)}>
                          {getStatusLabel(lead.status)}
                        </span>
                      </td>
                      <td title={lead.assignedUsername || '-'}>{lead.assignedUsername || '-'}</td>
                      <td title={formatDate(lead.updatedAt)}>{formatDate(lead.updatedAt)}</td>
                      <td title={formatDate(lead.createdAt)}>{formatDate(lead.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
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
                    <p><strong>Điện thoại:</strong> {selectedLead.phone}</p>
                    <p><strong>Email:</strong> {selectedLead.email || 'Chưa có'}</p>
                    <p><strong>Công ty:</strong> {selectedLead.company || 'Chưa có'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Tỉnh/Thành phố:</strong> {getProvinceLabel(selectedLead.province)}</p>
                    <p><strong>Nguồn:</strong> {getSourceLabel(selectedLead.source)}</p>
                    <p>
                      <strong>Trạng thái:</strong> 
                      <span className={`ms-2 ${getStatusBadgeClass(selectedLead.status)}`}>
                        {getStatusLabel(selectedLead.status)}
                      </span>
                    </p>
                    <p><strong>Người phụ trách:</strong> {selectedLead.assignedUsername || 'Chưa gán'}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <p><strong>Người tạo:</strong> {selectedLead.creatorUsername || 'Không rõ'}</p>
                    <p><strong>Ngày tạo:</strong> {formatDate(selectedLead.createdAt)}</p>
                    <p><strong>Cập nhật lần cuối:</strong> {formatDate(selectedLead.updatedAt)}</p>
                  </div>
                </div>
                {selectedLead.notes && (
                  <div className="row">
                    <div className="col-12">
                      <p><strong>Ghi chú:</strong></p>
                      <p className="text-muted">{selectedLead.notes}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedLead(null)}
                >
                  Đóng
                </button>
                <button
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    handleEditLead(selectedLead);
                    setSelectedLead(null);
                  }}
                >
                  <i className="fas fa-edit me-2"></i>
                  Cập nhật sau cuộc gọi
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
                  {editingLead ? 'Cập nhật Lead' : 'Thêm Lead mới'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLead(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmitLead}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Họ và tên *</label>
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
                        <label htmlFor="source" className="form-label">Nguồn lead</label>
                        <select
                          className="form-select"
                          id="source"
                          value={formData.source}
                          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        >
                          <option value="">Chọn nguồn</option>
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
