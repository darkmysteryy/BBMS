// pages/donor/PostBloodRequest.jsx
// Donor posts a public blood request — visible to all approved hospitals

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postBloodRequest, clearRequestError, clearRequestSuccess } from "../../redux/slices/requestSlice";
import DashboardLayout from "../../layouts/DashboardLayout";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const PostBloodRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.requests);

  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: "",
    quantity: 1,
    urgency: "Normal",
    requiredDate: "",
    location: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearRequestError());
    const result = await dispatch(postBloodRequest(form));
    if (postBloodRequest.fulfilled.match(result)) {
      setTimeout(() => {
        dispatch(clearRequestSuccess());
        navigate("/donor/my-requests");
      }, 1500);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Request Blood</h1>
        <p className="page-subtitle">Your request will be broadcast to all approved hospitals. The first nearby hospital to accept will fulfil it.</p>
      </div>

      <div className="section-card" style={{ maxWidth: 600 }}>
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>
        )}
        {successMessage && (
          <div className="alert alert-success" style={{ marginBottom: 16 }}>✅ {successMessage}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Patient Name *</label>
            <input className="form-input" name="patientName" value={form.patientName}
              onChange={handleChange} placeholder="Name of the patient who needs blood" required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Blood Group *</label>
              <select className="form-input" name="bloodGroup" value={form.bloodGroup}
                onChange={handleChange} required>
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity (units) *</label>
              <input className="form-input" type="number" name="quantity" min={1} value={form.quantity}
                onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Urgency *</label>
              <select className="form-input" name="urgency" value={form.urgency} onChange={handleChange}>
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Required By *</label>
              <input className="form-input" type="date" name="requiredDate" value={form.requiredDate}
                onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location / City *</label>
            <input className="form-input" name="location" value={form.location}
              onChange={handleChange} placeholder="e.g. Mumbai, Bandra" required />
          </div>

          <div className="form-group">
            <label className="form-label">Additional Notes</label>
            <textarea className="form-input" name="notes" value={form.notes}
              onChange={handleChange} rows={3} placeholder="Any additional information..." />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Posting..." : "🩸 Post Blood Request"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PostBloodRequest;
