// pages/hospital/OpenRequests.jsx
// Hospital sees all public blood requests and can accept one (first-come-first-served)

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOpenRequests, acceptRequest, clearRequestError } from "../../redux/slices/requestSlice";
import { fetchHospitalProfile } from "../../redux/slices/hospitalSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const URGENCY_COLOR = {
  Normal:   { bg: "#e8f5e9", color: "#2e7d32" },
  Urgent:   { bg: "#fff8e1", color: "#f57f17" },
  Critical: { bg: "#ffebee", color: "#c62828" },
};

const OpenRequests = () => {
  const dispatch = useDispatch();
  const { openRequests, loading, error, successMessage } = useSelector((state) => state.requests);
  const { profile } = useSelector((state) => state.hospital);

  useEffect(() => {
    dispatch(fetchOpenRequests());
    // Must fetch profile to determine isApproved — even on direct navigation
    dispatch(fetchHospitalProfile());
  }, [dispatch]);

  const handleAccept = async (id) => {
    dispatch(clearRequestError());
    await dispatch(acceptRequest(id));
  };

  const isApproved = profile?.verificationStatus === "approved";

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Open Blood Requests</h1>
        <p className="page-subtitle">Public requests from donors and patients. Accept one to claim it — only your hospital can fulfil it once accepted.</p>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {successMessage && <div className="alert alert-success" style={{ marginBottom: 16 }}>✅ {successMessage}</div>}

      {!isApproved && (
        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
          ⚠️ Your hospital is not approved yet. You cannot accept requests until admin approves your account.
        </div>
      )}

      {openRequests.length === 0 ? (
        <div className="section-card">
          <EmptyState icon="📋" title="No open requests" message="There are no open blood requests right now. Check back later." />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {openRequests.map((r) => {
            const urg = URGENCY_COLOR[r.urgency] || URGENCY_COLOR.Normal;
            return (
              <div key={r._id} className="section-card" style={{ borderLeft: `4px solid ${urg.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>{r.patientName}</p>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>📍 {r.location}</p>
                  </div>
                  <span style={{ background: urg.bg, color: urg.color, padding: "2px 10px", borderRadius: 99, fontSize: "0.8rem", fontWeight: 600 }}>
                    {r.urgency}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Blood Group</p>
                    <span className="badge badge-primary" style={{ fontSize: "1rem" }}>{r.bloodGroup}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Quantity</p>
                    <p style={{ fontWeight: 600 }}>{r.quantity} units</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Required By</p>
                    <p style={{ fontWeight: 600 }}>{new Date(r.requiredDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Posted</p>
                    <p style={{ fontWeight: 600 }}>{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {r.notes && (
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: 12, fontStyle: "italic" }}>
                    "{r.notes}"
                  </p>
                )}

                <button
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  onClick={() => handleAccept(r._id)}
                  disabled={!isApproved || loading}
                >
                  ✅ Accept This Request
                </button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default OpenRequests;
