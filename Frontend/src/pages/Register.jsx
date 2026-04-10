import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext.jsx";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-grid">
        <div className="auth-hero-panel">
          <div className="auth-hero-badge">Join SmartSpend</div>
          <h1>Create your account and master your spending.</h1>
          <p className="auth-hero-copy">
            Save your profile, budget goals, and expenses in a secure, easy-to-use dashboard.
          </p>
          <div className="auth-feature-list">
            <p>✓ Fast onboarding</p>
            <p>✓ Budget planning tools</p>
            <p>✓ Export ready financial reports</p>
          </div>
        </div>

        <div className="auth-card">
          <h1>Create account</h1>
          <p className="subtitle">Register and save your profile, budget, and expenses.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Choose a secure password"
              required
            />

            {error && <div className="error-text">{error}</div>}

            <button type="submit" className="primary-button">Register</button>
          </form>
          <p className="auth-actions">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
