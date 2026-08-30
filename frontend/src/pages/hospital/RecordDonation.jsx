// pages/hospital/RecordDonation.jsx
// Hospital records a walk-in donor donation — adds blood to hospital's own inventory

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordDonation, clearHospitalInventoryError, clearHospitalInventorySuccess } from "../../redux/slices/hospitalInventorySlice";
import DashboardLayout from "../../layouts/DashboardLayout";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const RecordDonation = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.hospitalInventory);

  const [form, setForm] = useState({
    donorUserId: "",
    bloodGroup: "",
    quantity: 1,
    collectionDate: new Date().toISOString().split("T")[0],
    location: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearHospitalInventoryError());
    const result = await dispatch(recordDonation(form));
    if (recordDonation.fulfilled.match(result)) {
      setForm({ donorUserId: "", bloodGroup: "", quantity: 1, collectionDate: new Date().toISOString().split("T")[0], location: "" });
      setTimeout(() => dispatch(clearHospitalInventorySuccess()), 3000);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Record Donation</h1>
        <p className="page-subtitle">Record blood donated by a walk-in donor. The units will be added to your hospital's inventory.</p>
      </div>

      <div className="section-card" style={{ maxWidth: 540 }}>
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
        {successMessage && <div className="alert alert-success" style={{ marginBottom: 16 }}>✅ {successMessage}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Donor User ID *</label>
            <input className="form-input" name="donorUserId" value={form.donorUserId}
              onChange={handleChange} placeholder="Donor's system user ID" required />
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: 4 }}>
              Ask the donor for their registered User ID from their profile.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Blood Group *</label>
              <select className="form-input" name="bloodGroup" value={form.bloodGroup}
                onChange={handleChange} required>
                <option value="">Select</option>
                {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Units *</label>
              <input className="form-input" type="number" name="quantity" min={1}
                value={form.quantity} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Collection Date *</label>
            <input className="form-input" type="date" name="collectionDate"
              value={form.collectionDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Location / Ward</label>
            <input className="form-input" name="location" value={form.location}
              onChange={handleChange} placeholder="e.g. Blood Bank Wing, OPD" />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Recording..." : "💉 Record Donation"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default RecordDonation;
