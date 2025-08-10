import React, { useState, useEffect } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaEdit, FaSave, FaTimes, FaCamera, FaUserShield, FaKey } from 'react-icons/fa';
import AuthService from '../services/auth.service';
import axios from 'axios';
import './Profile.css';

const Profile = ({ currentUser }) => {
  useDocumentTitle('My Profile');
  const user = currentUser || AuthService.getCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    company: user?.company || '',
    bio: user?.bio || ''
  });

  const [originalData, setOriginalData] = useState({...formData});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = user?.token;
      const response = await axios.put(
        'http://localhost:8080/api/users/profile', 
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setMessage('Profile updated successfully!');
      setIsSuccess(true);
      setOriginalData({...formData});
      setIsEditing(false);
      
      // Update local storage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile.';
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({...originalData});
    setIsEditing(false);
    setMessage('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match.');
      setIsSuccess(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const currentUser = AuthService.getCurrentUser();
      const token = currentUser?.accessToken || currentUser?.token;
      
      if (!token) {
        setMessage('Authentication token not found. Please login again.');
        setIsSuccess(false);
        return;
      }

      await axios.post('http://localhost:8080/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('Password changed successfully!');
      setIsSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        setShowChangePassword(false);
        setMessage('');
      }, 2000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change password.';
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePasswordModal = () => {
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage('');
  };

  const getRoleDisplayName = (roles) => {
    if (!roles || roles.length === 0) return 'User';
    return roles.map(role => {
      switch(role) {
        case 'ROLE_ADMIN': return 'Administrator';
        case 'ROLE_MARKETING': return 'Marketing Manager';
        case 'ROLE_SALES': return 'Sales Manager';
        case 'ROLE_TELESALES': return 'Telesales';
        default: return 'User';
      }
    }).join(', ');
  };

  const getPermissionLevelDisplay = (level) => {
    switch(level) {
      case 8: return { label: 'Administrator', color: '#dc3545' };
      case 4: return { label: 'Marketing Manager', color: '#fd7e14' };
      case 2: return { label: 'Sales Manager', color: '#28a745' };
      case 1: return { label: 'Telesales', color: '#17a2b8' };
      default: return { label: 'User', color: '#6c757d' };
    }
  };

  const permissionLevel = getPermissionLevelDisplay(user?.permissionLevel);

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              <FaUser className="avatar-icon" />
              <div className="camera-overlay">
                <FaCamera />
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-info">
          <h2 className="profile-name">
            {user?.fullName || user?.username || 'User'}
          </h2>
          <div className="profile-role">
            <FaUserShield className="role-icon" />
            <span 
              className="role-badge"
              style={{ backgroundColor: permissionLevel.color }}
            >
              {permissionLevel.label}
            </span>
          </div>
          <p className="profile-bio">
            {formData.bio || 'No bio added yet.'}
          </p>
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <div className="action-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit className="me-2" />
                Edit Profile
              </button>
              <button 
                className="btn btn-outline-secondary ms-2"
                onClick={() => setShowChangePassword(true)}
              >
                <FaKey className="me-2" />
                Change Password
              </button>
            </div>
          ) : (
            <div className="edit-actions">
              <button 
                className="btn btn-success"
                onClick={handleSave}
                disabled={loading}
              >
                <FaSave className="me-2" />
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                <FaTimes className="me-2" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="row">
          {/* Basic Information */}
          <div className="col-lg-8">
            <div className="profile-card">
              <div className="card-header">
                <h5>Personal Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Full Name</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <FaUser />
                          </span>
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          className="form-control"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email Address</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <FaEnvelope />
                          </span>
                        </div>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <FaPhone />
                          </span>
                        </div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          className="form-control"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Company</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <FaBuilding />
                          </span>
                        </div>
                        <input
                          type="text"
                          name="company"
                          className="form-control"
                          value={formData.company}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your company"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="form-group">
                      <label>Bio</label>
                      <textarea
                        name="bio"
                        className="form-control"
                        rows="4"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="col-lg-4">
            <div className="profile-card">
              <div className="card-header">
                <h5>Account Information</h5>
              </div>
              <div className="card-body">
                <div className="account-info">
                  <div className="info-item">
                    <span className="label">Username</span>
                    <span className="value">{user?.username}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">User ID</span>
                    <span className="value">#{user?.id}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Permission Level</span>
                    <span className="value">{user?.permissionLevel || 0}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Roles</span>
                    <span className="value">{getRoleDisplayName(user?.roles)}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Status</span>
                    <span className="value status-active">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="profile-card">
              <div className="card-header">
                <h5>Activity Stats</h5>
              </div>
              <div className="card-body">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Leads Created</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Leads Assigned</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Tasks Completed</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Reports Generated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'} alert-floating`}>
          {message}
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaKey className="me-2" />
                  Change Password
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClosePasswordModal}
                ></button>
              </div>
              <form onSubmit={handleChangePassword}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                      placeholder="Confirm new password"
                    />
                  </div>
                  {message && (
                    <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
                      {message}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClosePasswordModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <FaKey className="me-2" />
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
