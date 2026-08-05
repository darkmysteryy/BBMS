// pages/admin/ManageRequests.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequests, updateRequestStatus } from "../../redux/slices/requestSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import useToast from "../../hooks/useToast";
import Toast from "../../components/common/Toast";

const ManageRequests = () => {
  const dispatch = useDispatch();
  const { requests, loading } = useSelector((state) => state.requests);
  const { toasts, showToast, removeToast } = useToast();

  const [confirm, setConfirm] = useState({ open: false, id: null, status: "" });

  useEffect(() => { dispatch(fetchRequests()); }, [dispatch]);

  const handleUpdateStatus = async () => {
    const result = await dispatch(updateRequestStatus({ id: confirm.id, status: confirm.status }));
    if (result.error) {
      showToast(result.payload, "error");
    } else {
      showToast(`Request ${confirm.status}`, "success");
    }
    setConfirm({ open: false, id: null, status: "" });
  };

  const statusBadge = (status) => {
    const map = { Submitted: "badge-warning", Approved: "badge-success", Rejected: "badge-danger", Dispatched: "badge-info" };
    return <span className={`badge ${map[status] || "badge-muted"}`}>{status}</span>;
  };

  if (loading && requests.length === 0) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Manage Blood Requests</h1>
        <p className="page-subtitle">Review, approve, and dispatch hospital requests</p>
      </div>

      <div className="section-card">
        {requests.length === 0 ? (
          <EmptyState icon="📋" title="No requests found" message="There are no hospital blood requests yet." />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Hospital</th>
                  <th>Blood Group</th>
                  <th>Qty</th>
                  <th>Required By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{r.requestId}</td>
                    <td style={{ fontWeight: 600 }}>{r.hospital?.hospitalName || "Unknown"}</td>
                    <td><span className="badge badge-primary">{r.bloodGroup}</span></td>
                    <td>{r.quantity}</td>
                    <td>{new Date(r.requiredDate).toLocaleDateString()}</td>
                    <td>{statusBadge(r.status)}</td>
                    <td>
                      <div className="table-actions">
                        {r.status === "Submitted" && (
                          <>
                            <button className="btn btn-sm btn-success" onClick={() => setConfirm({ open: true, id: r._id, status: "Approved" })}>Approve</button>
                            <button className="btn btn-sm btn-danger" onClick={() => setConfirm({ open: true, id: r._id, status: "Rejected" })}>Reject</button>
                          </>
                        )}
                        {r.status === "Approved" && (
                          <button className="btn btn-sm btn-info" style={{ background: "var(--color-info)", color: "#fff" }} onClick={() => setConfirm({ open: true, id: r._id, status: "Dispatched" })}>
                            Dispatch
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
        onConfirm={handleUpdateStatus}
        message={`Are you sure you want to mark this request as ${confirm.status}? ${confirm.status === "Dispatched" ? "This will deduct stock from the inventory." : ""}`}
        confirmText={confirm.status}
        danger={confirm.status === "Rejected"}
      />
      <Toast toasts={toasts} removeToast={removeToast} />
    </DashboardLayout>
  );
};

export default ManageRequests;
