// pages/donor/DonorProfile.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDonorProfile, updateDonorProfile } from "../../redux/slices/donorSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/common/Loader";

const DonorProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.donor);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({ address: "", weight: "", medicalStatus: "", availability: true, phone: "" });

  useEffect(() => {
    dispatch(fetchDonorProfile());
  }, [dispatch]);

  // Pre-fill form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        address:       profile.address || "",
        weight:        profile.weight || "",
        medicalStatus: profile.medicalStatus || "",
        availability:  profile.availability ?? true,
        phone:         profile.userId?.phone || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateDonorProfile(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading && !profile) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Update your donor information</p>
      </div>

      <div className="section-card" style={{ maxWidth: "600px" }}>
        {/* Read-only info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Registration ID", value: profile?.userId?.registrationId || "\u2014" },
            { label: "Name",        value: profile?.userId?.name },
            { label: "Email",       value: profile?.userId?.email },
            { label: "Blood Group", value: profile?.bloodGroup },
            { label: "Gender",      value: profile?.gender },
            { label: "Date of Birth", value: profile?.dob ? new Date(profile.dob).toLocaleDateString() : "—" },
            { label: "Last Donation", value: profile?.lastDonationDate ? new Date(profile.lastDonationDate).toLocaleDateString() : "Never" },
          ].map((item) => (
            <div key={item.label} style={{ padding: "10px", background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
              <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>{item.label}</p>
              <p style={{ fontWeight: 600 }}>{item.value || "—"}</p>
            </div>
          ))}
        </div>

        {/* Editable fields */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input type="tel" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input type="text" name="address" className="form-input" value={form.address} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input type="number" name="weight" className="form-input" value={form.weight} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Medical Status</label>
              <input type="text" name="medicalStatus" className="form-input" value={form.medicalStatus} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" name="availability" id="availability" checked={form.availability} onChange={handleChange} />
            <label htmlFor="availability" style={{ fontWeight: 500 }}>Available to donate</label>
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

export default DonorProfile;
