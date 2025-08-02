import React, { useState, useEffect } from "react";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "CRM System",
    siteDescription: "Customer Relationship Management System",
    defaultUserRole: 0,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    emailNotifications: true,
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: "daily",
    maxFileSize: 10
  });

  const [activeSection, setActiveSection] = useState("general");

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // TODO: Implement API call to save settings
    alert("Settings saved successfully!");
    console.log("Saving settings:", settings);
  };

  const renderGeneralSettings = () => (
    <div className="card">
      <div className="card-header">
        <h6 className="m-0 font-weight-bold text-primary">General Settings</h6>
      </div>
      <div className="card-body">
        <div className="form-group">
          <label>Site Name</label>
          <input
            type="text"
            className="form-control"
            value={settings.siteName}
            onChange={(e) => handleSettingChange("siteName", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Site Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={settings.siteDescription}
            onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Default User Role</label>
          <select
            className="form-control"
            value={settings.defaultUserRole}
            onChange={(e) => handleSettingChange("defaultUserRole", parseInt(e.target.value))}
          >
            <option value={0}>User</option>
            <option value={1}>Admin</option>
            <option value={2}>Marketing</option>
            <option value={3}>Telesales</option>
            <option value={4}>Sales</option>
          </select>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => handleSettingChange("maintenanceMode", e.target.checked)}
          />
          <label className="form-check-label">
            Maintenance Mode
          </label>
          <small className="form-text text-muted">
            When enabled, only admins can access the system
          </small>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="card">
      <div className="card-header">
        <h6 className="m-0 font-weight-bold text-primary">Security Settings</h6>
      </div>
      <div className="card-body">
        <div className="form-group">
          <label>Maximum Login Attempts</label>
          <input
            type="number"
            className="form-control"
            min="1"
            max="10"
            value={settings.maxLoginAttempts}
            onChange={(e) => handleSettingChange("maxLoginAttempts", parseInt(e.target.value))}
          />
          <small className="form-text text-muted">
            Number of failed login attempts before account lockout
          </small>
        </div>
        <div className="form-group">
          <label>Session Timeout (minutes)</label>
          <input
            type="number"
            className="form-control"
            min="5"
            max="480"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
          />
          <small className="form-text text-muted">
            Auto-logout users after this period of inactivity
          </small>
        </div>
        <div className="form-group">
          <label>Maximum File Upload Size (MB)</label>
          <input
            type="number"
            className="form-control"
            min="1"
            max="100"
            value={settings.maxFileSize}
            onChange={(e) => handleSettingChange("maxFileSize", parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="card">
      <div className="card-header">
        <h6 className="m-0 font-weight-bold text-primary">Notification Settings</h6>
      </div>
      <div className="card-body">
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
          />
          <label className="form-check-label">
            Enable Email Notifications
          </label>
          <small className="form-text text-muted">
            Send email notifications for important system events
          </small>
        </div>
        
        <div className="alert alert-info">
          <h6>Email Notification Types:</h6>
          <ul className="mb-0">
            <li>New user registrations</li>
            <li>Failed login attempts</li>
            <li>System maintenance notifications</li>
            <li>Data backup completion</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="card">
      <div className="card-header">
        <h6 className="m-0 font-weight-bold text-primary">Backup Settings</h6>
      </div>
      <div className="card-body">
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={settings.autoBackup}
            onChange={(e) => handleSettingChange("autoBackup", e.target.checked)}
          />
          <label className="form-check-label">
            Enable Automatic Backup
          </label>
        </div>
        
        {settings.autoBackup && (
          <div className="form-group">
            <label>Backup Frequency</label>
            <select
              className="form-control"
              value={settings.backupFrequency}
              onChange={(e) => handleSettingChange("backupFrequency", e.target.value)}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}
        
        <div className="mt-3">
          <button className="btn btn-warning mr-2">
            <i className="fas fa-download mr-2"></i>
            Create Manual Backup
          </button>
          <button className="btn btn-info">
            <i className="fas fa-history mr-2"></i>
            View Backup History
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "security":
        return renderSecuritySettings();
      case "notifications":
        return renderNotificationSettings();
      case "backup":
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h4>System Settings</h4>
          <button 
            className="btn btn-success"
            onClick={handleSaveSettings}
          >
            <i className="fas fa-save mr-2"></i>
            Save All Settings
          </button>
        </div>
      </div>

      <div className="row">
        {/* Settings Navigation */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h6 className="m-0 font-weight-bold text-primary">Settings Categories</h6>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action ${activeSection === "general" ? "active" : ""}`}
                  onClick={() => setActiveSection("general")}
                >
                  <i className="fas fa-cog mr-2"></i>
                  General
                </button>
                <button
                  className={`list-group-item list-group-item-action ${activeSection === "security" ? "active" : ""}`}
                  onClick={() => setActiveSection("security")}
                >
                  <i className="fas fa-shield-alt mr-2"></i>
                  Security
                </button>
                <button
                  className={`list-group-item list-group-item-action ${activeSection === "notifications" ? "active" : ""}`}
                  onClick={() => setActiveSection("notifications")}
                >
                  <i className="fas fa-bell mr-2"></i>
                  Notifications
                </button>
                <button
                  className={`list-group-item list-group-item-action ${activeSection === "backup" ? "active" : ""}`}
                  onClick={() => setActiveSection("backup")}
                >
                  <i className="fas fa-database mr-2"></i>
                  Backup
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="col-md-9">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
