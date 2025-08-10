import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LeadManagement from "../LeadManagement";
import UserManagement from "./UserManagement";
import SystemSettings from "./SystemSettings";
import ReportsView from "./ReportsView";
import "./AdminDashboard.css";

const AdminDashboard = ({ currentUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 156,
    totalLeads: 2341,
    totalOpportunities: 1205,
    monthlyRevenue: 45780,
    activeUsers: 89,
    newSignups: 23
  });

  useEffect(() => {
    console.log("AdminDashboard - currentUser:", currentUser);
    // TODO: Fetch real data from backend
    // fetchAdminStats();
  }, [currentUser]);

  const fetchAdminStats = async () => {
    try {
      // TODO: Implement real API calls
      // For now using mock data
      setStats({
        totalUsers: 156,
        totalCustomers: 89,
        totalLeads: 234,
        totalOpportunities: 45,
        newUsersThisMonth: 12,
        activeUsers: 134
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "leads":
        return <LeadManagement />;
      case "users":
        return <UserManagement />;
      case "settings":
        return <SystemSettings />;
      case "reports":
        return <ReportsView />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div>
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalUsers}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Active Users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.activeUsers}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-user-check fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Total Customers
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.totalCustomers}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-handshake fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    New Users (This Month)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stats.newUsersThisMonth}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-user-plus fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-primary btn-block"
                    onClick={() => navigate('/dashboard/users')}
                  >
                    <i className="fas fa-users-cog mr-2"></i>
                    Manage Users
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-info btn-block"
                    onClick={() => navigate('/dashboard/leads')}
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    Manage Leads
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-success btn-block"
                    onClick={() => setActiveTab("settings")}
                  >
                    <i className="fas fa-cog mr-2"></i>
                    System Settings
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-info btn-block"
                    onClick={() => setActiveTab("reports")}
                  >
                    <i className="fas fa-chart-line mr-2"></i>
                    View Reports
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-warning btn-block">
                    <i className="fas fa-database mr-2"></i>
                    Database Backup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row">
        <div className="col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Recent User Activities</h6>
            </div>
            <div className="card-body">
              <div className="list-group">
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">New user registered</h6>
                    <small>5 mins ago</small>
                  </div>
                  <p className="mb-1">john.doe@example.com</p>
                  <small>Pending approval</small>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">User role updated</h6>
                    <small>1 hour ago</small>
                  </div>
                  <p className="mb-1">jane.smith promoted to Sales Manager</p>
                  <small>By admin</small>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Failed login attempts</h6>
                    <small>2 hours ago</small>
                  </div>
                  <p className="mb-1">5 failed attempts from IP 192.168.1.100</p>
                  <small>Security Alert</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">System Status</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Database Connection</span>
                  <span className="badge badge-success">Healthy</span>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Server Load</span>
                  <span className="badge badge-warning">Medium</span>
                </div>
                <div className="progress mt-1">
                  <div className="progress-bar bg-warning" style={{width: "65%"}}></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Memory Usage</span>
                  <span className="badge badge-info">Normal</span>
                </div>
                <div className="progress mt-1">
                  <div className="progress-bar bg-info" style={{width: "45%"}}></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Storage Space</span>
                  <span className="badge badge-success">Good</span>
                </div>
                <div className="progress mt-1">
                  <div className="progress-bar bg-success" style={{width: "30%"}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!currentUser || (currentUser.permissionLevel < 8 && !currentUser.roles?.includes('ROLE_ADMIN'))) {
    return (
      <div className="container-fluid mt-4">
        <div className="alert alert-danger">
          <h4>Access Denied</h4>
          <p>You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      {/* Header */}
      <div className="row">
        <div className="col-12">
          <h2>Admin Dashboard</h2>
          <p className="text-muted">
            Welcome {currentUser.username} | Permission Level: {currentUser.permissionLevel}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <i className="fas fa-tachometer-alt mr-2"></i>
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "leads" ? "active" : ""}`}
                onClick={() => setActiveTab("leads")}
              >
                <i className="fas fa-user-plus mr-2"></i>
                Lead Management
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                <i className="fas fa-users mr-2"></i>
                User Management
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <i className="fas fa-cog mr-2"></i>
                Settings
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "reports" ? "active" : ""}`}
                onClick={() => setActiveTab("reports")}
              >
                <i className="fas fa-chart-bar mr-2"></i>
                Reports
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
