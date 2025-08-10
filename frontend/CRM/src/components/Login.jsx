import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaTwitter, FaSpinner } from "react-icons/fa";
import AuthService from "../services/auth.service";
import "./Login.css"; // Import custom CSS

const Login = ({ setCurrentUser }) => {
  useDocumentTitle('Login');
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    AuthService.login(username, password).then(
      (response) => {
        console.log("Login successful, response:", response);
        if (setCurrentUser) {
          setCurrentUser(response); // Update currentUser state in App component
        }
        navigate("/dashboard");
      },
      (error) => {
        console.error("Login error:", error);
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form-section">
          <div className="login-header">
            <h2>Welcome Back!</h2>
            <p>Please sign in to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FaUser />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FaLock />
                  </span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                <div className="input-group-append">
                  <span
                    className="input-group-text"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
            </div>
            <div className="form-group d-flex justify-content-between align-items-center">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              <a href="/forgot-password" className="forgot-password-link">
                Forgot password?
              </a>
            </div>
            <div className="form-group">
              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                  <FaSpinner className="fa-spin me-2" />
                )}
                <span>Login</span>
              </button>
            </div>
            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </form>
          <div className="social-login">
            <p>Or sign in with</p>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <FaGoogle />
              </a>
              <a href="#" className="social-icon">
                <FaFacebookF />
              </a>
              <a href="#" className="social-icon">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
        <div className="login-branding-section">
          <div className="branding-content">
            <h1>CRM Pro</h1>
            <p>Your success, our priority.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
