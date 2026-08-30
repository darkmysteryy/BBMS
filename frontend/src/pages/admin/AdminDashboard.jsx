// pages/admin/AdminDashboard.jsx
// Admin's simplified dashboard — focus on hospital account approvals

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";
import api from "../../api/axiosConfig";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats").then((res) => {
      setStats(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage hospital account registrations</p>
      </div>

      <div className="stats-grid">
        <StatCard icon="⏳" label="Pending Approvals"   value={stats?.pendingHospitals || 0}  colorClass="stat-icon-yellow" />
        <StatCard icon="✅" label="Approved Hospitals"  value={stats?.approvedHospitals || 0} colorClass="stat-icon-green" />
        <StatCard icon="🏥" label="Total Hospitals"     value={stats?.totalHospitals || 0}    colorClass="stat-icon-blue" />
        <StatCard icon="👤" label="Total Donors"        value={stats?.totalDonors || 0}       colorClass="stat-icon-red" />
      </div>

      {stats?.pendingHospitals > 0 && (
        <div className="section-card">
          <div className="section-card-header">
            <h2 className="section-card-title">Pending Approvals</h2>
            <Link to="/admin/hospitals" style={{ fontSize: "0.875rem", color: "var(--color-primary)" }}>Manage Hospitals</Link>
          </div>
          <div className="alert alert-warning">
            You have {stats.pendingHospitals} hospital(s) waiting for approval.
          </div>
          <Link to="/admin/hospitals" className="btn btn-primary" style={{ marginTop: 12 }}>
            Review Applications
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title">Quick Actions</h2>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/admin/hospitals" className="btn btn-primary">🏥 Manage Hospitals</Link>
          <Link to="/admin/donors" className="btn btn-secondary">👤 View All Donors</Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
