import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { 
  FaUsers, FaPlus, FaEdit, FaTrash, FaEye, FaUserShield, FaSearch, 
  FaFilter, FaDownload, FaUserPlus, FaTimes, FaSave, FaArrowLeft, FaToggleOn, FaToggleOff 
} from 'react-icons/fa';
import axios from 'axios';
import AuthService from '../services/auth.service';
import './UserManagement.css';

const UserManagement = () => {
  useDocumentTitle('User Management');
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [permissionFilter, setPermissionFilter] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    company: '',
    bio: '',
    role: 'ROLE_USER'
  });

  const roles = [
    { value: 'ROLE_USER', label: 'User', level: 0, color: '#6c757d' },
    { value: 'ROLE_TELESALES', label: 'Telesales', level: 1, color: '#17a2b8' },
    { value: 'ROLE_SALES', label: 'Sales Manager', level: 2, color: '#28a745' },
    { value: 'ROLE_MARKETING', label: 'Marketing Manager', level: 4, color: '#fd7e14' },
    { value: 'ROLE_ADMIN', label: 'Administrator', level: 8, color: '#dc3545' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, permissionFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = AuthService.getCurrentUser()?.accessToken || AuthService.getCurrentUser()?.token;
      const response = await axios.get('http://localhost:8080/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(response.data);
    } catch (error) {
      setMessage('Error fetching users: ' + (error.response?.data?.message || error.message));
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(user => user.roles.includes(roleFilter));
    }

    if (permissionFilter) {
      filtered = filtered.filter(user => user.permissionLevel.toString() === permissionFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      phoneNumber: '',
      company: '',
      bio: '',
      role: 'ROLE_USER'
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = AuthService.getCurrentUser()?.accessToken || AuthService.getCurrentUser()?.token;
      await axios.post('http://localhost:8080/api/admin/users', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('User created successfully!');
      setIsSuccess(true);
      setShowCreateModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      setMessage('Error creating user: ' + (error.response?.data?.message || error.message));
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = AuthService.getCurrentUser()?.accessToken || AuthService.getCurrentUser()?.token;
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password; // Don't send empty password
      }

      await axios.put(`http://localhost:8080/api/admin/users/${selectedUser.id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('User updated successfully!');
      setIsSuccess(true);
      setShowEditModal(false);
      resetForm();
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      setMessage('Error updating user: ' + (error.response?.data?.message || error.message));
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = AuthService.getCurrentUser()?.accessToken || AuthService.getCurrentUser()?.token;
      await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('User deleted successfully!');
      setIsSuccess(true);
      fetchUsers();
    } catch (error) {
      setMessage('Error deleting user: ' + (error.response?.data?.message || error.message));
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermission = async (userId, newRole) => {
    setLoading(true);
    setMessage('');

    try {
      const token = AuthService.getCurrentUser()?.accessToken || AuthService.getCurrentUser()?.token;
      await axios.put(`http://localhost:8080/api/admin/users/${userId}/permission`, 
        { role: newRole }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage('User permission updated successfully!');
      setIsSuccess(true);
      fetchUsers();
    } catch (error) {
      setMessage('Error updating permission: ' + (error.response?.data?.message || error.message));
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      company: user.company || '',
      bio: user.bio || '',
      role: user.roles[0] || 'ROLE_USER'
    });
    setShowEditModal(true);
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const getRoleInfo = (roleName) => {
    return roles.find(role => role.value === roleName) || roles[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <div className="header-title">
          <button 
            className="btn btn-outline-secondary me-3" 
            onClick={() => navigate('/dashboard')}
            title="Back to Dashboard"
          >
            <FaArrowLeft className="me-2" />
            Back to Dashboard
          </button>
          <FaUsers className="header-icon" />
          <h2>User Management</h2>
          <span className="user-count">{filteredUsers.length} users</span>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <FaUserPlus className="me-2" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="filter-controls">
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={permissionFilter}
            onChange={(e) => setPermissionFilter(e.target.value)}
          >
            <option value="">All Permissions</option>
            <option value="0">Level 0</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="4">Level 4</option>
            <option value="8">Level 8</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <table className="table users-table">
            <thead>
              <tr>
                <th style={{width: '25%'}}>User</th>
                <th style={{width: '15%'}}>Role</th>
                <th style={{width: '20%'}}>Permission Level</th>
                <th style={{width: '12%'}}>Status</th>
                <th style={{width: '28%'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => {
                const roleInfo = getRoleInfo(user.roles[0]);
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          <FaUsers />
                        </div>
                        <div className="user-details">
                          <div className="username">{user.username}</div>
                          <div className="email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span 
                        className="role-badge" 
                        style={{ backgroundColor: roleInfo.color }}
                      >
                        {roleInfo.label}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm permission-select"
                        value={user.roles[0]}
                        onChange={(e) => handleUpdatePermission(user.id, e.target.value)}
                        style={{ minWidth: '140px' }}
                      >
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${user.enabled ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => handleToggleUserStatus(user.id, user.enabled)}
                        title={user.enabled ? 'Disable User' : 'Enable User'}
                        style={{ minWidth: '80px' }}
                      >
                        {user.enabled ? <FaToggleOn /> : <FaToggleOff />}
                        <span className="ms-1">{user.enabled ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => openViewModal(user)}
                          title="View Details"
                        >
                          <FaEye /> <span className="d-none d-md-inline">View</span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning me-1"
                          onClick={() => openEditModal(user)}
                          title="Edit User"
                        >
                          <FaEdit /> <span className="d-none d-md-inline">Edit</span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          title="Delete User"
                        >
                          <FaTrash /> <span className="d-none d-md-inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!loading && filteredUsers.length === 0 && (
          <div className="text-center p-4">
            <FaUsers className="empty-icon" />
            <p className="empty-message">No users found</p>
          </div>
        )}
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'} alert-floating`}>
          {message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaUserPlus className="me-2" />
                  Create New User
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Username *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          minLength="6"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Role *</label>
                        <select
                          className="form-select"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                        >
                          {roles.map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <FaSave className="me-2" />
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaEdit className="me-2" />
                  Edit User: {selectedUser.username}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleEditUser}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Username *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">New Password (leave empty to keep current)</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          minLength="6"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Role *</label>
                        <select
                          className="form-select"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                        >
                          {roles.map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <FaSave className="me-2" />
                    {loading ? 'Updating...' : 'Update User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaEye className="me-2" />
                  User Details: {selectedUser.username}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-group">
                      <label>Username:</label>
                      <p>{selectedUser.username}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-group">
                      <label>Email:</label>
                      <p>{selectedUser.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-group">
                      <label>Role:</label>
                      <p>
                        <span 
                          className="role-badge" 
                          style={{ backgroundColor: getRoleInfo(selectedUser.roles[0]).color }}
                        >
                          {getRoleInfo(selectedUser.roles[0]).label}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-group">
                      <label>Permission Level:</label>
                      <p>{selectedUser.permissionLevel}</p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="info-group">
                      <label>Full Name:</label>
                      <p>{selectedUser.fullName || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-group">
                      <label>Phone Number:</label>
                      <p>{selectedUser.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="info-group">
                  <label>Company:</label>
                  <p>{selectedUser.company || 'Not provided'}</p>
                </div>

                <div className="info-group">
                  <label>Bio:</label>
                  <p>{selectedUser.bio || 'No bio provided'}</p>
                </div>

                <div className="info-group">
                  <label>Created At:</label>
                  <p>{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedUser);
                  }}
                >
                  <FaEdit className="me-2" />
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
