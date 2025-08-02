import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import "./Register.css"; // Import custom CSS

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    AuthService.register(username, email, password).then(
      (response) => {
        setMessage(response.data.message + " You will be redirected to login.");
        setSuccessful(true);
        setLoading(false);
        setTimeout(() => {
          navigate("/login");
          window.location.reload();
        }, 2000);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setSuccessful(false);
        setLoading(false);
      }
    );
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-branding-section">
          <div className="branding-content">
            <h1>Join Us</h1>
            <p>Create an account to start managing your customer relationships.</p>
          </div>
        </div>
        <div className="register-form-section">
          <div className="register-header">
            <h2>Create Account</h2>
          </div>
          <form onSubmit={handleRegister}>
            {!successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"><i className="fas fa-user"></i></span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Choose a username"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"><i className="fas fa-lock"></i></span>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Create a password"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text"><i className="fas fa-check-circle"></i></span>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <button className="btn btn-primary btn-block" disabled={loading}>
                    {loading && <span className="spinner-border spinner-border-sm"></span>}
                    <span>Sign Up</span>
                  </button>
                </div>
              </div>
            )}
            {message && (
              <div className="form-group">
                <div
                  className={successful ? "alert alert-success" : "alert alert-danger"}
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </form>
          <div className="login-link">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
