import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext.jsx";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", credentials);
      login(res.data.user, res.data.token);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-grid">
        <div className="auth-hero-panel">
          <div className="auth-hero-badge">Welcome back</div>
          <h1>Sign in and continue managing your money like a pro.</h1>
          <p className="auth-hero-copy">
            Keep your budget, expense reports, and PDF exports in one beautiful dashboard.
          </p>
          <div className="auth-feature-list">
            <p>✓ Instant expense tracking</p>
            <p>✓ Smart budget alerts</p>
            <p>✓ Download filtered reports</p>
          </div>
        </div>

        <div className="auth-card">
          <h1>Login</h1>
          <p className="subtitle">Sign in to access your profile and budget tools.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            {error && <div className="error-text">{error}</div>}

            <button type="submit" className="primary-button">Login</button>
          </form>
          <p className="auth-actions">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
