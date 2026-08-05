// pages/admin/ManageHospitals.jsx

import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

const ManageHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setFilter] = useState(""); // pending, approved, rejected
  const [confirm, setConfirm]     = useState({ open: false, id: null, status: "" });
  
  const { toasts, showToast, removeToast } = useToast();

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/hospitals", {
        params: { search, verificationStatus: statusFilter || undefined }
      });
      setHospitals(res.data.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load hospitals", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHospitals(); }, [search, statusFilter]);

  const handleVerify = async () => {
    try {
      await api.put(`/admin/hospitals/${confirm.id}/verify`, { verificationStatus: confirm.status });
      showToast(`Hospital ${confirm.status} successfully`, "success");
      setConfirm({ open: false, id: null, status: "" });
      loadHospitals();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to verify", "error");
    }
  };

  const statusBadge = (status) => {
    const map = { pending: "badge-warning", approved: "badge-success", rejected: "badge-danger" };
    return <span className={`badge ${map[status] || "badge-muted"}`}>{status}</span>;
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Manage Hospitals</h1>
        <p className="page-subtitle">Verify and manage hospital accounts</p>
      </div>

      <div className="section-card">
        <div className="table-toolbar">
          <div className="search-input">
            🔍
            <input placeholder="Search hospital..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={statusFilter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? <Loader /> : hospitals.length === 0 ? (
          <EmptyState icon="🏥" title="No hospitals found" message="Try changing your search or filter." />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Hospital Name</th>
                  <th>Reg. Number</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((h) => (
                  <tr key={h._id}>
                    <td style={{ fontWeight: 600 }}>{h.profile?.hospitalName || h.name}</td>
                    <td>{h.profile?.registrationNumber || "—"}</td>
                    <td style={{ color: "var(--color-text-muted)" }}>{h.email}</td>
                    <td>{statusBadge(h.profile?.verificationStatus)}</td>
                    <td>
                      <div className="table-actions">
                        {h.profile?.verificationStatus !== "approved" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => setConfirm({ open: true, id: h.profile?._id, status: "approved" })}
                          >
                            Approve
                          </button>
                        )}
                        {h.profile?.verificationStatus !== "rejected" && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setConfirm({ open: true, id: h.profile?._id, status: "rejected" })}
                          >
                            Reject
                          </button>
                        )}
                      </div>
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
        onCancel={() => setConfirm({ open: false, id: null, status: "" })}
        onConfirm={handleVerify}
        message={`Are you sure you want to mark this hospital as ${confirm.status}?`}
        confirmText={confirm.status === "approved" ? "Approve" : "Reject"}
        danger={confirm.status === "rejected"}
      />
      <Toast toasts={toasts} removeToast={removeToast} />
    </DashboardLayout>
  );
};

export default ManageHospitals;
