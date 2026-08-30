// pages/Signup.jsx
// Two tabs: Donor registration and Hospital registration

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerDonor, registerHospital, clearError } from "../redux/slices/authSlice";
import AuthLayout from "../layouts/AuthLayout";
import api from "../api/axiosConfig";
import useToast from "../hooks/useToast";
import Toast from "../components/common/Toast";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Signup = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const { toasts, showToast, removeToast } = useToast();

  // Which tab is active: "donor", "hospital", "admin"
  const [tab, setTab] = useState("donor");

  const [donorForm, setDonorForm] = useState({
    name: "", email: "", password: "", phone: "",
    bloodGroup: "", dob: "", gender: "", address: "",
  });

  const [hospitalForm, setHospitalForm] = useState({
    hospitalName: "", email: "",
    password: "", phone: "", address: "", contactPerson: "",
  });

  const [adminForm, setAdminForm] = useState({
    name: "", email: "", password: "", phone: "", seedKey: "",
  });

  // Redirect when registered
  useEffect(() => {
    if (user) {
      if (user.role === "donor")    navigate("/donor/dashboard");
      if (user.role === "hospital") navigate("/hospital/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleDonorChange  = (e) => setDonorForm({ ...donorForm, [e.target.name]: e.target.value });
  const handleHospitalChange = (e) => setHospitalForm({ ...hospitalForm, [e.target.name]: e.target.value });
  const handleAdminChange = (e) => setAdminForm({ ...adminForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === "donor") {
      dispatch(registerDonor(donorForm));
    } else if (tab === "hospital") {
      dispatch(registerHospital(hospitalForm));
    } else if (tab === "admin") {
      try {
        await api.post("/admin/seed", adminForm);
        showToast("Admin account created successfully! Please login.", "success");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        showToast(err.response?.data?.message || "Failed to setup admin account.", "error");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card" style={{ maxWidth: "540px" }}>
        <div className="auth-logo">
          <span className="auth-logo-icon">🩸</span>
          <span className="auth-logo-text">BloodBankMS</span>
        </div>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join our blood bank network</p>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "donor" ? "active" : ""}`} onClick={() => setTab("donor")}>
            👤 Donor
          </button>
          <button className={`auth-tab ${tab === "hospital" ? "active" : ""}`} onClick={() => setTab("hospital")}>
            🏥 Hospital
          </button>
          <button className={`auth-tab ${tab === "admin" ? "active" : ""}`} onClick={() => setTab("admin")}>
            🛡️ Admin
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid var(--color-danger)", borderRadius: "var(--radius-sm)", padding: "10px 14px", marginBottom: "16px", color: "var(--color-danger)", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ── Donor Form ── */}
          {tab === "donor" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-input" placeholder="John Doe" value={donorForm.name} onChange={handleDonorChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" name="phone" className="form-input" placeholder="+91 9876543210" value={donorForm.phone} onChange={handleDonorChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-input" placeholder="you@example.com" value={donorForm.email} onChange={handleDonorChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-input" placeholder="••••••••" value={donorForm.password} onChange={handleDonorChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select name="bloodGroup" className="form-select" value={donorForm.bloodGroup} onChange={handleDonorChange} required>
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select name="gender" className="form-select" value={donorForm.gender} onChange={handleDonorChange} required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" name="dob" className="form-input" value={donorForm.dob} onChange={handleDonorChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input type="text" name="address" className="form-input" placeholder="City, State" value={donorForm.address} onChange={handleDonorChange} required />
                </div>
              </div>
            </>
          )}

          {/* ── Hospital Form ── */}
          {tab === "hospital" && (
            <>
              <div className="form-group">
                <label className="form-label">Hospital Name</label>
                <input type="text" name="hospitalName" className="form-input" placeholder="City Hospital" value={hospitalForm.hospitalName} onChange={handleHospitalChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-input" placeholder="hospital@example.com" value={hospitalForm.email} onChange={handleHospitalChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-input" placeholder="••••••••" value={hospitalForm.password} onChange={handleHospitalChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" name="phone" className="form-input" placeholder="+91 9876543210" value={hospitalForm.phone} onChange={handleHospitalChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input type="text" name="contactPerson" className="form-input" placeholder="Dr. Smith" value={hospitalForm.contactPerson} onChange={handleHospitalChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input type="text" name="address" className="form-input" placeholder="Full hospital address" value={hospitalForm.address} onChange={handleHospitalChange} required />
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--color-warning)", marginBottom: "8px" }}>
                ⚠️ Hospital accounts require admin approval before you can request blood.
              </p>
            </>
          )}

          {/* ── Admin Form ── */}
          {tab === "admin" && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-input" required value={adminForm.name} onChange={handleAdminChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-input" required value={adminForm.email} onChange={handleAdminChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" name="phone" className="form-input" required value={adminForm.phone} onChange={handleAdminChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-input" required value={adminForm.password} onChange={handleAdminChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Admin Token (Seed Key)</label>
                <input type="password" name="seedKey" className="form-input" required placeholder="Enter the secret admin setup token" value={adminForm.seedKey} onChange={handleAdminChange} />
                <small style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>
                  This is the secure token defined in the backend environment variables.
                </small>
              </div>
            </>
          )}

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? "Creating account..." : `Register as ${tab === "donor" ? "Donor" : tab === "hospital" ? "Hospital" : "Admin"}`}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </AuthLayout>
  );
};

export default Signup;
