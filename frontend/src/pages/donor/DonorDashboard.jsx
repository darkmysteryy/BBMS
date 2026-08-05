// pages/donor/DonorDashboard.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDonorProfile, fetchMyDonations } from "../../redux/slices/donorSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";

const DonorDashboard = () => {
  const dispatch = useDispatch();
  const { profile, donations, loading } = useSelector((state) => state.donor);

  useEffect(() => {
    dispatch(fetchDonorProfile());
    dispatch(fetchMyDonations());
  }, [dispatch]);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  // Check eligibility
  const today = new Date();
  const eligibleAfter = profile?.eligibleAfter ? new Date(profile.eligibleAfter) : null;
  const isEligible = !eligibleAfter || today >= eligibleAfter;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Donor Dashboard</h1>
        <p className="page-subtitle">Welcome back, {profile?.userId?.name || "Donor"}!</p>
      </div>

      <div className="stats-grid">
        <StatCard icon="🩸" label="Blood Group"      value={profile?.bloodGroup || "—"}     colorClass="stat-icon-red" />
        <StatCard icon="💉" label="Total Donations"  value={donations.length}                colorClass="stat-icon-green" />
        <StatCard icon="✅" label="Eligibility"      value={isEligible ? "Eligible" : "Not Yet"} colorClass={isEligible ? "stat-icon-green" : "stat-icon-yellow"} />
        <StatCard icon="📅" label="Next Eligible"    value={eligibleAfter ? eligibleAfter.toLocaleDateString() : "Now"} colorClass="stat-icon-blue" />
      </div>

      {/* Recent Donations */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title">Recent Donations</h2>
        </div>

        {donations.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", textAlign: "center", padding: "24px" }}>
            No donations recorded yet.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice(0, 5).map((d) => (
                  <tr key={d._id}>
                    <td>{new Date(d.donationDate).toLocaleDateString()}</td>
                    <td><span className="badge badge-primary">{d.inventory?.bloodGroup}</span></td>
                    <td>{d.quantity}</td>
                    <td>{d.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile Summary */}
      {profile && (
        <div className="section-card">
          <div className="section-card-header">
            <h2 className="section-card-title">Profile Summary</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { label: "Gender",        value: profile.gender },
              { label: "Date of Birth", value: profile.dob ? new Date(profile.dob).toLocaleDateString() : "—" },
              { label: "Address",       value: profile.address },
              { label: "Status",        value: profile.medicalStatus },
              { label: "Available",     value: profile.availability ? "Yes" : "No" },
              { label: "Weight",        value: profile.weight ? `${profile.weight} kg` : "Not set" },
            ].map((item) => (
              <div key={item.label} style={{ padding: "10px", background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "4px" }}>{item.label}</p>
                <p style={{ fontWeight: 600 }}>{item.value || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DonorDashboard;
