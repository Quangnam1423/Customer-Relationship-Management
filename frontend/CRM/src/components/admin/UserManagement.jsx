import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthService from "../../services/auth.service";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    permissionLevel: 0
  });

  const roleOptions = [
    { value: 0, label: "User", description: "Basic user access" },
    { value: 1, label: "Admin", description: "Full system access" },
    { value: 2, label: "Marketing", description: "Marketing team access" },
    { value: 3, label: "Telesales", description: "Telesales team access" },
    { value: 4, label: "Sales", description: "Sales team access" }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/test/users");
      // For now, parse the string response
      const userStrings = response.data;
      const parsedUsers = userStrings.map((str, index) => {
        const parts = str.split(", ");
        return {
          id: index + 1,
          username: parts[0]?.split(": ")[1] || "",
          email: parts[1]?.split(": ")[1] || "",
          permissionLevel: parseInt(parts[2]?.split(": ")[1]) || 0,
          enabled: true
        };
      });
      setUsers(parsedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermission = async (userId, newPermissionLevel) => {
    try {
      const token = AuthService.getCurrentUser()?.accessToken;
      await axios.put(
        `http://localhost:8080/api/admin/users/${userId}/permission?permissionLevel=${newPermissionLevel}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, permissionLevel: newPermissionLevel }
          : user
      ));
      
      alert("User permission updated successfully!");
    } catch (error) {
      console.error("Error updating permission:", error);
      alert("Failed to update user permission. " + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/signup", newUser);
      alert("User created successfully!");
      setShowModal(false);
      setNewUser({ username: "", email: "", password: "", permissionLevel: 0 });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. " + (error.response?.data?.message || error.message));
    }
  };

  const getRoleLabel = (permissionLevel) => {
    const role = roleOptions.find(r => r.value === permissionLevel);
    return role ? role.label : "Unknown";
  };

  const getRoleBadgeClass = (permissionLevel) => {
    switch (permissionLevel) {
      case 1: return "badge-danger"; // Admin
      case 2: return "badge-warning"; // Marketing
      case 3: return "badge-info"; // Telesales
      case 4: return "badge-success"; // Sales
      default: return "badge-secondary"; // User
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h4>User Management</h4>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="fas fa-plus mr-2"></i>
            Add New User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card shadow">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">All Users</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Permission Level</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${getRoleBadgeClass(user.permissionLevel)}`}>
                        {getRoleLabel(user.permissionLevel)}
                      </span>
                    </td>
                    <td>{user.permissionLevel}</td>
                    <td>
                      <span className={`badge ${user.enabled ? "badge-success" : "badge-danger"}`}>
                        {user.enabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button 
                          className="btn btn-sm btn-info"
                          onClick={() => setEditingUser(user)}
                          data-toggle="modal" 
                          data-target="#editUserModal"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => {
                            const newLevel = prompt(`Enter new permission level for ${user.username} (0-4):`, user.permissionLevel);
                            if (newLevel !== null && !isNaN(newLevel)) {
                              handleUpdatePermission(user.id, parseInt(newLevel));
                            }
                          }}
                        >
                          <i className="fas fa-user-cog"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete user ${user.username}?`)) {
                              // TODO: Implement delete user
                              alert("Delete functionality will be implemented");
                            }
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New User</h5>
                <button 
                  type="button" 
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      className="form-control"
                      value={newUser.permissionLevel}
                      onChange={(e) => setNewUser({...newUser, permissionLevel: parseInt(e.target.value)})}
                    >
                      {roleOptions.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label} - {role.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleCreateUser}
                >
                  Create User
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
