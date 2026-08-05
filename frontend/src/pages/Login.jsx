// pages/Login.jsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../redux/slices/authSlice";
import AuthLayout from "../layouts/AuthLayout";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin")    navigate("/admin/dashboard");
      else if (user.role === "donor")    navigate("/donor/dashboard");
      else if (user.role === "hospital") navigate("/hospital/dashboard");
    }
  }, [user, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🩸</span>
          <span className="auth-logo-text">BloodBankMS</span>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Login to access your dashboard</p>

        {/* Error message */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid var(--color-danger)", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: "16px", color: "var(--color-danger)", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Register here</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
