// pages/hospital/HospitalProfile.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHospitalProfile, updateHospitalProfile } from "../../redux/slices/hospitalSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/common/Loader";

const statusColor = { pending: "badge-warning", approved: "badge-success", rejected: "badge-danger" };

const HospitalProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.hospital);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ address: "", contactPerson: "", phone: "" });

  useEffect(() => { dispatch(fetchHospitalProfile()); }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        address: profile.address || "",
        contactPerson: profile.contactPerson || "",
        phone: profile.userId?.phone || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateHospitalProfile(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading && !profile) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Hospital Profile</h1>
        <p className="page-subtitle">Manage your hospital's details</p>
      </div>

      <div className="section-card" style={{ maxWidth: "600px" }}>
        {/* Verification Status Banner */}
        {profile && (
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Verification Status:</span>
            <span className={`badge ${statusColor[profile.verificationStatus] || "badge-muted"}`}>
              {profile.verificationStatus}
            </span>
          </div>
        )}

        {/* Read-only info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Hospital Name",        value: profile?.hospitalName },
            { label: "Registration Number",  value: profile?.registrationNumber },
            { label: "Email",                value: profile?.userId?.email },
          ].map((item) => (
            <div key={item.label} style={{ padding: "10px", background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>{item.label}</p>
              <p style={{ fontWeight: 600 }}>{item.value || "—"}</p>
            </div>
          ))}
        </div>

        {/* Editable */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input type="tel" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Person</label>
            <input type="text" name="contactPerson" className="form-input" value={form.contactPerson} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input type="text" name="address" className="form-input" value={form.address} onChange={handleChange} />
          </div>

          {saved && <p style={{ color: "var(--color-success)", marginBottom: "8px" }}>✅ Profile updated!</p>}
          {error && <p style={{ color: "var(--color-danger)", marginBottom: "8px" }}>{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default HospitalProfile;
