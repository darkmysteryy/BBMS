// pages/hospital/HospitalDashboard.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchHospitalProfile } from "../../redux/slices/hospitalSlice";
import { fetchOpenRequests, fetchAcceptedRequests } from "../../redux/slices/requestSlice";
import { fetchHospitalInventory } from "../../redux/slices/hospitalInventorySlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";

const HospitalDashboard = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.hospital);
  const { openRequests, acceptedRequests } = useSelector((state) => state.requests);
  const { inventory, lowStockCount } = useSelector((state) => state.hospitalInventory);

  useEffect(() => {
    dispatch(fetchHospitalProfile());
    dispatch(fetchOpenRequests());
    dispatch(fetchAcceptedRequests());
    dispatch(fetchHospitalInventory());
  }, [dispatch]);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  const pendingFulfil = acceptedRequests.filter((r) => r.status === "Accepted").length;
  const totalUnits = inventory.reduce((sum, i) => i.status === "available" ? sum + i.units : sum, 0);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Hospital Dashboard</h1>
        <p className="page-subtitle">{profile?.hospitalName || "Hospital"}</p>
        {profile?.verificationStatus !== "approved" && (
          <div className="alert alert-warning" style={{ marginTop: 12 }}>
            ⚠️ Your hospital is <strong>{profile?.verificationStatus}</strong>. You cannot accept blood requests until admin approves your account.
          </div>
        )}
      </div>

      <div className="stats-grid">
        <StatCard icon="📋" label="Open Requests"      value={openRequests.length}  colorClass="stat-icon-blue" />
        <StatCard icon="⏳" label="Pending Fulfilment" value={pendingFulfil}          colorClass="stat-icon-yellow" />
        <StatCard icon="🩸" label="Total Blood Units"  value={totalUnits}           colorClass="stat-icon-red" />
        <StatCard icon="⚠️" label="Low Stock Groups"  value={lowStockCount}        colorClass="stat-icon-orange" />
      </div>

      {/* Quick Actions */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title">Quick Actions</h2>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/hospital/open-requests"    className="btn btn-primary">📋 Open Requests</Link>
          <Link to="/hospital/accepted-requests" className="btn btn-secondary">✅ My Accepted Requests</Link>
          <Link to="/hospital/inventory"         className="btn btn-secondary">🩸 My Inventory</Link>
          <Link to="/hospital/record-donation"   className="btn btn-secondary">💉 Record Donation</Link>
        </div>
      </div>

      {/* Recent Open Requests */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title">Latest Open Blood Requests</h2>
          <Link to="/hospital/open-requests" style={{ fontSize: "0.875rem", color: "var(--color-primary)" }}>View all</Link>
        </div>
        {openRequests.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", textAlign: "center", padding: 24 }}>No open requests right now.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Patient</th><th>Blood Group</th><th>Qty</th><th>Urgency</th><th>Location</th><th>Required By</th></tr>
              </thead>
              <tbody>
                {openRequests.slice(0, 5).map((r) => (
                  <tr key={r._id}>
                    <td>{r.patientName}</td>
                    <td><span className="badge badge-primary">{r.bloodGroup}</span></td>
                    <td>{r.quantity} units</td>
                    <td>{r.urgency}</td>
                    <td>{r.location}</td>
                    <td>{new Date(r.requiredDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
