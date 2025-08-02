import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import AuthService from '../../services/auth.service';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const currentUser = AuthService.getCurrentUser();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
    window.location.reload(); // Force refresh to update App state
  };

  return (
    <div className="dashboard-layout">
      <Sidebar currentUser={currentUser} onLogout={handleLogout} />
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <h4>Dashboard</h4>
          </div>
          <div className="topbar-right">
            <div className="user-info">
              <span className="user-name">Welcome, {currentUser?.username || 'Guest'}</span>
              <span className="user-role">
                {currentUser?.roles?.[0] || 'User'} | Level: {currentUser?.permissionLevel || 0}
              </span>
            </div>
            <button className="btn btn-outline-danger btn-sm ml-3" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
