import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    status: 'NEW',
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
    creatorId: ''
  });

  // Provinces and other options
  const [provinces, setProvinces] = useState([]);
  
  const leadStatuses = [
    { value: 'NEW', label: 'Mới' },
    { value: 'CONTACTED', label: 'Đã liên hệ' },
    { value: 'QUALIFIED', label: 'Đủ điều kiện' },
    { value: 'PROPOSAL', label: 'Đề xuất' },
    { value: 'NEGOTIATION', label: 'Đàm phán' },
    { value: 'CLOSED_WON', label: 'Thành công' },
    { value: 'CLOSED_LOST', label: 'Thất bại' }
  ];

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
  }, []);

  useEffect(() => {
    applyFilters();
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

  const applyFilters = () => {
    let filtered = leads;

    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value) {
        filtered = filtered.filter(lead => {
          const leadValue = lead[key];
          if (typeof leadValue === 'string') {
            return leadValue.toLowerCase().includes(value.toLowerCase());
          }
          return leadValue === value;
        });
      }
    });

    setFilteredLeads(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      fullName: '',
      phone: '',
      email: '',
      company: '',
      province: '',
      source: '',
      status: '',
      assignedUserId: '',
      creatorId: ''
    });
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

      if (editingLead) {
        // Update existing lead
        await axios.put(`http://localhost:8080/api/leads/${editingLead.id}`, formData, config);
      } else {
        // Create new lead
        await axios.post('http://localhost:8080/api/leads', formData, config);
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
      status: lead.status || 'NEW',
      assignedUserId: lead.assignedUser?.id || null,
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Lead</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
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
            setEditingLead(null);
            setShowAddModal(true);
          }}
        >
          <i className="fas fa-plus me-2"></i>
          Thêm Lead
        </button>
      </div>

      {/* Filter Section */}
      <div className="card mb-4">
        <div className="card-header">
          <button 
            className="btn btn-link p-0 text-decoration-none"
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#filterCollapse"
          >
            <i className="fas fa-filter me-2"></i>
            Bộ lọc
          </button>
        </div>
        <div className="collapse" id="filterCollapse">
          <div className="card-body">
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
            </div>
            <div className="d-flex justify-content-end">
              <button className="btn btn-outline-secondary" onClick={clearFilters}>
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
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
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
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
                    <tr key={lead.id} className="table-row-hover">
                      <td>{lead.fullName}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.email || '-'}</td>
                      <td>{lead.company || '-'}</td>
                      <td>{lead.province}</td>
                      <td>{getSourceLabel(lead.source)}</td>
                      <td>
                        <span className={getStatusBadgeClass(lead.status)}>
                          {getStatusLabel(lead.status)}
                        </span>
                      </td>
                      <td>{lead.assignedUser?.fullName || lead.assignedUser?.username || '-'}</td>
                      <td>{formatDate(lead.createdAt)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => setSelectedLead(lead)}
                          title="Xem chi tiết"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleEditLead(lead)}
                          title="Sửa"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
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
                    <p><strong>Tỉnh/Thành phố:</strong> {selectedLead.province}</p>
                    <p><strong>Nguồn:</strong> {getSourceLabel(selectedLead.source)}</p>
                    <p>
                      <strong>Trạng thái:</strong> 
                      <span className={`ms-2 ${getStatusBadgeClass(selectedLead.status)}`}>
                        {getStatusLabel(selectedLead.status)}
                      </span>
                    </p>
                    <p><strong>Người phụ trách:</strong> {selectedLead.assignedUser?.fullName || selectedLead.assignedUser?.username || 'Chưa gán'}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <p><strong>Người tạo:</strong> {selectedLead.creator?.fullName || selectedLead.creator?.username}</p>
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

                  {editingLead && (
                    <div className="row">
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
                                {user.fullName || user.username}
                              </option>
                            ))}
                          </select>
                        </div>
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
                          status: 'NEW',
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
