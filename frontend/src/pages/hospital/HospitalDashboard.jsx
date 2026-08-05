// pages/hospital/HospitalDashboard.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHospitalProfile } from "../../redux/slices/hospitalSlice";
import { fetchRequests } from "../../redux/slices/requestSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";
import { Link } from "react-router-dom";

const statusBadge = (status) => {
  const map = { Submitted: "badge-warning", Approved: "badge-success", Rejected: "badge-danger", Dispatched: "badge-info" };
  return <span className={`badge ${map[status] || "badge-muted"}`}>{status}</span>;
};

const HospitalDashboard = () => {
  const dispatch = useDispatch();
  const { profile, loading: profileLoading } = useSelector((state) => state.hospital);
  const { requests, loading: reqLoading } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchHospitalProfile());
    dispatch(fetchRequests());
  }, [dispatch]);

  const pending    = requests.filter((r) => r.status === "Submitted").length;
  const approved   = requests.filter((r) => r.status === "Approved").length;
  const dispatched = requests.filter((r) => r.status === "Dispatched").length;

  if (profileLoading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Hospital Dashboard</h1>
        <p className="page-subtitle">Welcome, {profile?.hospitalName || "Hospital"}</p>
      </div>

      {/* Approval warning */}
      {profile?.verificationStatus === "pending" && (
        <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid var(--color-warning)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: "24px", color: "var(--color-warning)" }}>
          ⚠️ Your hospital is pending admin approval. You cannot request blood until approved.
        </div>
      )}

      <div className="stats-grid">
        <StatCard icon="📋" label="Total Requests"   value={requests.length}  colorClass="stat-icon-blue" />
        <StatCard icon="⏳" label="Pending"          value={pending}          colorClass="stat-icon-yellow" />
        <StatCard icon="✅" label="Approved"         value={approved}         colorClass="stat-icon-green" />
        <StatCard icon="🚚" label="Dispatched"       value={dispatched}       colorClass="stat-icon-purple" />
      </div>

      {/* Quick Actions */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title">Quick Actions</h2>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/hospital/request" className="btn btn-primary">➕ New Blood Request</Link>
          <Link to="/hospital/requests" className="btn btn-outline">📋 View All Requests</Link>
          <Link to="/hospital/profile"  className="btn btn-outline">🏥 Update Profile</Link>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title">Recent Requests</h2>
          <Link to="/hospital/requests" style={{ fontSize: "0.85rem", color: "var(--color-primary)" }}>View all →</Link>
        </div>
        {reqLoading ? <Loader text="Loading requests..." /> : (
          requests.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "24px" }}>No requests yet.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr><th>Request ID</th><th>Blood Group</th><th>Qty</th><th>Urgency</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {requests.slice(0, 5).map((r) => (
                    <tr key={r._id}>
                      <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{r.requestId}</td>
                      <td><span className="badge badge-primary">{r.bloodGroup}</span></td>
                      <td>{r.quantity} units</td>
                      <td>{r.urgency}</td>
                      <td>{statusBadge(r.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
