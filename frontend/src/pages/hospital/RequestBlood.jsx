// pages/hospital/RequestBlood.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBloodRequest } from "../../redux/slices/requestSlice";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const RequestBlood = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error } = useSelector((state) => state.requests);

  const [form, setForm] = useState({
    bloodGroup: "", quantity: "", urgency: "Normal", requiredDate: "", notes: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createBloodRequest(form));
    if (!result.error) {
      setSuccess(true);
      setTimeout(() => navigate("/hospital/requests"), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Request Blood</h1>
        <p className="page-subtitle">Submit a new blood request for your hospital</p>
      </div>

      <div className="section-card" style={{ maxWidth: "560px" }}>
        {success && (
          <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid var(--color-success)", borderRadius: "var(--radius-sm)", padding: "12px", marginBottom: "16px", color: "var(--color-success)" }}>
            ✅ Request submitted! Redirecting...
          </div>
        )}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid var(--color-danger)", borderRadius: "var(--radius-sm)", padding: "12px", marginBottom: "16px", color: "var(--color-danger)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select name="bloodGroup" className="form-select" value={form.bloodGroup} onChange={handleChange} required>
                <option value="">Select</option>
                {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Quantity (Units)</label>
              <input type="number" name="quantity" className="form-input" min="1" placeholder="e.g. 2" value={form.quantity} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Urgency Level</label>
              <select name="urgency" className="form-select" value={form.urgency} onChange={handleChange}>
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Required By Date</label>
              <input type="date" name="requiredDate" className="form-input" value={form.requiredDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Notes (Optional)</label>
            <textarea name="notes" className="form-textarea" placeholder="Any special requirements..." value={form.notes} onChange={handleChange} />
          </div>

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default RequestBlood;
