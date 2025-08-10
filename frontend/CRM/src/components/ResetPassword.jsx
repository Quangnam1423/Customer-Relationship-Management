import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);

  useEffect(() => {
    if (!token) {
      setMessage('Invalid reset link.');
      setValidatingToken(false);
      return;
    }

    // Validate token on component mount
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      await axios.post(`http://localhost:8080/api/auth/validate-reset-token?token=${token}`);
      setTokenValid(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid or expired reset link.';
      setMessage(errorMessage);
      setTokenValid(false);
    } finally {
      setValidatingToken(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setIsSuccess(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
        token: token,
        newPassword: newPassword
      });
      
      setMessage(response.data.message);
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-box">
          <div className="loading-wrapper">
            <FaSpinner className="fa-spin loading-icon" />
            <p>Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-box">
          <div className="error-wrapper">
            <div className="icon-wrapper error">
              <FaLock />
            </div>
            <h2>Invalid Link</h2>
            <p>{message}</p>
            <Link to="/forgot-password" className="btn btn-primary">
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-box">
          <div className="success-wrapper">
            <div className="icon-wrapper success">
              <FaCheckCircle />
            </div>
            <h2>Password Reset Successful!</h2>
            <p>{message}</p>
            <p className="redirect-info">You will be redirected to login in a few seconds...</p>
            <Link to="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <div className="reset-password-header">
          <div className="icon-wrapper">
            <FaLock className="main-icon" />
          </div>
          <h2>Reset Password</h2>
          <p>Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FaLock />
                </span>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                minLength={6}
                disabled={loading}
              />
              <div className="input-group-append">
                <span
                  className="input-group-text password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FaLock />
                </span>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                minLength={6}
                disabled={loading}
              />
              <div className="input-group-append">
                <span
                  className="input-group-text password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading || !newPassword || !confirmPassword}
            >
              {loading && <FaSpinner className="fa-spin me-2" />}
              Reset Password
            </button>
          </div>

          {message && !isSuccess && (
            <div className="alert alert-danger">
              {message}
            </div>
          )}
        </form>

        <div className="back-to-login">
          <Link to="/login" className="back-link">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
