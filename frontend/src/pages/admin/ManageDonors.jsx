// pages/admin/ManageDonors.jsx

import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const ManageDonors = () => {
  const [donors, setDonors]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [confirm, setConfirm]     = useState({ open: false, userId: null, isActive: true });

  const loadDonors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/donors", { params: { search } });
      setDonors(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDonors(); }, [search]);

  const toggleUser = async () => {
    try {
      await api.put(`/admin/users/${confirm.userId}/toggle`);
      setConfirm({ open: false, userId: null, isActive: true });
      loadDonors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Manage Donors</h1>
        <p className="page-subtitle">View and manage all registered donors</p>
      </div>

      <div className="section-card">
        <div className="table-toolbar">
          <div className="search-input">
            🔍
            <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>{donors.length} donors</p>
        </div>

        {loading ? <Loader /> : donors.length === 0 ? (
          <EmptyState icon="👤" title="No donors found" message="No donors match your search." />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Blood Group</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((d) => (
                  <tr key={d._id}>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td style={{ color: "var(--color-text-muted)" }}>{d.email}</td>
                    <td>{d.phone}</td>
                    <td><span className="badge badge-primary">{d.profile?.bloodGroup || "—"}</span></td>
                    <td>
                      <span className={`badge ${d.isActive ? "badge-success" : "badge-danger"}`}>
                        {d.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${d.isActive ? "btn-danger" : "btn-success"}`}
                        onClick={() => setConfirm({ open: true, userId: d._id, isActive: d.isActive })}
                      >
                        {d.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        onCancel={() => setConfirm({ open: false, userId: null, isActive: true })}
        onConfirm={toggleUser}
        message={`Are you sure you want to ${confirm.isActive ? "deactivate" : "activate"} this donor?`}
        confirmText={confirm.isActive ? "Deactivate" : "Activate"}
        danger={confirm.isActive}
      />
    </DashboardLayout>
  );
};

export default ManageDonors;
