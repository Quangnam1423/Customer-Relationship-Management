import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AuthService from './services/auth.service';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('App mounted - checking for existing auth...');
    
    // Auto-login on app start
    AuthService.autoLogin()
      .then(user => {
        if (user) {
          console.log('Auto-login successful:', user);
          setCurrentUser(user);
        } else {
          console.log('No valid stored auth found');
          setCurrentUser(null);
        }
      })
      .catch(error => {
        console.error('Auto-login error:', error);
        setCurrentUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Update currentUser state
  const handleLogin = (userData) => {
    console.log('App.jsx - handleLogin called with:', userData);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    console.log('App.jsx - handleLogout called');
    AuthService.logout();
    setCurrentUser(null);
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  console.log('App.jsx render - currentUser:', currentUser);

  return (
    <div className="App">
      {currentUser ? (
        // Dashboard Layout for authenticated users
        <DashboardLayout currentUser={currentUser} onLogout={handleLogout}>
          <Routes>
            <Route path="/dashboard/*" element={<Dashboard currentUser={currentUser} />} />
            <Route path="/profile" element={<Profile currentUser={currentUser} />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DashboardLayout>
      ) : (
        // Public Layout for unauthenticated users
        <>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="container">
              <a href="/" className="navbar-brand">
                CRM Pro
              </a>
              <div className="navbar-nav ms-auto">
                <a href="/login" className="nav-link">
                  Login
                </a>
                <a href="/register" className="nav-link">
                  Sign Up
                </a>
              </div>
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setCurrentUser={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
