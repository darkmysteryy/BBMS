// pages/admin/AdminDashboard.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "../../redux/slices/reportSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { adminStats, loading } = useSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading && !adminStats) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Blood Bank Management Overview</p>
      </div>

      <div className="stats-grid">
        <StatCard icon="👤" label="Total Donors"       value={adminStats?.totalDonors}        colorClass="stat-icon-blue" />
        <StatCard icon="🏥" label="Total Hospitals"    value={adminStats?.totalHospitals}      colorClass="stat-icon-green" />
        <StatCard icon="🩸" label="Blood Units"        value={adminStats?.totalBloodUnits}     colorClass="stat-icon-red" />
        <StatCard icon="📋" label="Pending Requests"   value={adminStats?.pendingRequests}     colorClass="stat-icon-yellow" />
        <StatCard icon="⚠️" label="Low Stock Alerts"  value={adminStats?.lowStockAlerts}      colorClass="stat-icon-red" />
        <StatCard icon="💉" label="Donations This Month" value={adminStats?.donationsThisMonth} colorClass="stat-icon-purple" />
      </div>

      {/* Low Stock Warning */}
      {adminStats?.lowStockAlerts > 0 && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid var(--color-danger)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: "24px", color: "var(--color-danger)" }}>
          🚨 <strong>{adminStats.lowStockAlerts}</strong> blood group(s) have low stock (less than 10 units). Please update inventory.
        </div>
      )}

      {/* Quick Actions */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title">Quick Actions</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
          {[
            { label: "Manage Donors",    href: "/admin/donors",    icon: "👤", color: "var(--color-info)" },
            { label: "Approve Hospitals",href: "/admin/hospitals",  icon: "🏥", color: "var(--color-success)" },
            { label: "Manage Inventory", href: "/admin/inventory",  icon: "🩸", color: "var(--color-primary)" },
            { label: "Review Requests",  href: "/admin/requests",   icon: "📋", color: "var(--color-warning)" },
            { label: "View Reports",     href: "/admin/reports",    icon: "📊", color: "var(--color-info)" },
          ].map((action) => (
            <a key={action.label} href={action.href}
              style={{ background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "16px", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s", textDecoration: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.transform = "none"; }}
            >
              <span style={{ fontSize: "1.5rem" }}>{action.icon}</span>
              <span style={{ fontWeight: 600 }}>{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
