// pages/donor/DonorDashboard.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchDonorProfile, fetchMyDonations } from "../../redux/slices/donorSlice";
import { fetchMyRequests } from "../../redux/slices/requestSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";


const STATUS_BADGE = {
  Open:      "badge-primary",
  Accepted:  "badge-warning",
  Fulfilled: "badge-success",
  Cancelled: "badge-danger",
};

const DonorDashboard = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.donor);
  const { myRequests } = useSelector((state) => state.requests);
  // auth.user.name is always available from localStorage-persisted auth state
  const { user: authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDonorProfile());
    dispatch(fetchMyDonations());
    dispatch(fetchMyRequests());
  }, [dispatch]);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  const today = new Date();
  const eligibleAfter = profile?.eligibleAfter ? new Date(profile.eligibleAfter) : null;
  const isEligible = !eligibleAfter || today >= eligibleAfter;

  const openCount     = myRequests.filter((r) => r.status === "Open").length;
  const acceptedCount = myRequests.filter((r) => r.status === "Accepted").length;
  const fulfilledCount= myRequests.filter((r) => r.status === "Fulfilled").length;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Donor Dashboard</h1>
        <p className="page-subtitle">Welcome back, {authUser?.name || profile?.userId?.name || "Donor"}!</p>
      </div>

      <div className="stats-grid">
        <StatCard icon="🆔" label="Registration ID" value={authUser?.registrationId || "\u2014"}      colorClass="stat-icon-blue" />
        <StatCard icon="🩸" label="Blood Group"     value={profile?.bloodGroup || "\u2014"}         colorClass="stat-icon-red" />
        <StatCard icon="📋" label="Open Requests"   value={openCount}                             colorClass="stat-icon-blue" />
        <StatCard icon="✅" label="Fulfilled"       value={fulfilledCount}                        colorClass="stat-icon-green" />
      </div>

      {/* Quick Actions */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title">Quick Actions</h2>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/donor/request-blood" className="btn btn-primary">🩸 Request Blood</Link>
          <Link to="/donor/my-requests"   className="btn btn-secondary">📋 My Requests</Link>
          <Link to="/donor/donations"     className="btn btn-secondary">💉 Donation History</Link>
        </div>
      </div>

      {/* Recent Blood Requests */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title">Recent Blood Requests</h2>
          <Link to="/donor/my-requests" style={{ fontSize: "0.875rem", color: "var(--color-primary)" }}>View all</Link>
        </div>
        {myRequests.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "24px" }}>
            No blood requests yet. <Link to="/donor/request-blood" style={{ color: "var(--color-primary)" }}>Post one now.</Link>
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Blood Group</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.slice(0, 5).map((r) => (
                  <tr key={r._id}>
                    <td>{r.patientName}</td>
                    <td><span className="badge badge-primary">{r.bloodGroup}</span></td>
                    <td>{r.urgency}</td>
                    <td><span className={`badge ${STATUS_BADGE[r.status] || "badge-primary"}`}>{r.status}</span></td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Eligibility Card */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title">Donation Eligibility</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "8px 0" }}>
          <span style={{ fontSize: "2rem" }}>{isEligible ? "✅" : "⏳"}</span>
          <div>
            <p style={{ fontWeight: 600 }}>{isEligible ? "You are eligible to donate!" : "Not eligible yet"}</p>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
              {eligibleAfter && !isEligible ? `Eligible after: ${eligibleAfter.toLocaleDateString()}` : "You can donate blood now."}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DonorDashboard;
