// pages/hospital/ManageInventory.jsx
// Hospital views its own blood inventory

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHospitalInventory } from "../../redux/slices/hospitalInventorySlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { Link } from "react-router-dom";

const STATUS_BADGE = {
  available: "badge-success",
  expired:   "badge-danger",
  used:      "badge-primary",
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const ManageInventory = () => {
  const dispatch = useDispatch();
  const { inventory, lowStockCount, loading } = useSelector((state) => state.hospitalInventory);

  useEffect(() => {
    dispatch(fetchHospitalInventory());
  }, [dispatch]);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  // Blood group summary
  const summary = BLOOD_GROUPS.map((group) => {
    const total = inventory
      .filter((i) => i.bloodGroup === group && i.status === "available")
      .reduce((sum, i) => sum + i.units, 0);
    return { group, total };
  });

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Blood Inventory</h1>
        <p className="page-subtitle">Your hospital's blood stock</p>
        <Link to="/hospital/record-donation" className="btn btn-primary" style={{ marginTop: 8 }}>💉 Record Donation</Link>
      </div>

      {/* Blood Group Summary Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12, marginBottom: 24 }}>
        {summary.map(({ group, total }) => (
          <div key={group} style={{
            background: total === 0 ? "var(--color-surface)" : total < 10 ? "#fff3e0" : "var(--color-surface)",
            border: `1px solid ${total === 0 ? "var(--color-border)" : total < 10 ? "#ff9800" : "var(--color-border)"}`,
            borderRadius: "var(--radius)", padding: 16, textAlign: "center"
          }}>
            <p style={{ fontSize: "1.4rem", fontWeight: 700, color: total < 10 && total > 0 ? "#e65100" : "var(--color-text)" }}>{group}</p>
            <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{total} units</p>
            {total < 10 && total > 0 && <p style={{ fontSize: "0.7rem", color: "#e65100" }}>Low Stock</p>}
            {total === 0 && <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>Empty</p>}
          </div>
        ))}
      </div>

      {/* Detailed Inventory Table */}
      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title">Inventory Details</h2>
          {lowStockCount > 0 && (
            <span className="badge badge-warning">⚠️ {lowStockCount} low stock</span>
          )}
        </div>
        {inventory.length === 0 ? (
          <EmptyState icon="🩸" title="No inventory" message="Record donor donations to add blood to your inventory." />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Collected</th>
                  <th>Expires</th>
                  <th>Donor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item._id}>
                    <td><span className="badge badge-primary">{item.bloodGroup}</span></td>
                    <td style={{ fontWeight: 600 }}>{item.units}</td>
                    <td>{new Date(item.collectionDate).toLocaleDateString()}</td>
                    <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                    <td>{item.donor?.name || "—"}</td>
                    <td><span className={`badge ${STATUS_BADGE[item.status]}`}>{item.status}</span></td>
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

export default ManageInventory;
