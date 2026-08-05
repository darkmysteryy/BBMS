// pages/hospital/RequestHistory.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequests } from "../../redux/slices/requestSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const statusBadge = (status) => {
  const map = { Submitted: "badge-warning", Approved: "badge-success", Rejected: "badge-danger", Dispatched: "badge-info" };
  return <span className={`badge ${map[status] || "badge-muted"}`}>{status}</span>;
};

const urgencyBadge = (urgency) => {
  const map = { Normal: "badge-muted", Urgent: "badge-warning", Critical: "badge-danger" };
  return <span className={`badge ${map[urgency] || "badge-muted"}`}>{urgency}</span>;
};

const RequestHistory = () => {
  const dispatch = useDispatch();
  const { requests, loading } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Request History</h1>
        <p className="page-subtitle">Track all your blood requests</p>
      </div>

      <div className="section-card">
        {requests.length === 0 ? (
          <EmptyState icon="📋" title="No requests yet" message="Submit your first blood request." />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Blood Group</th>
                  <th>Qty</th>
                  <th>Urgency</th>
                  <th>Required By</th>
                  <th>Status</th>
                  <th>Dispatched</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{r.requestId}</td>
                    <td><span className="badge badge-primary">{r.bloodGroup}</span></td>
                    <td>{r.quantity}</td>
                    <td>{urgencyBadge(r.urgency)}</td>
                    <td>{new Date(r.requiredDate).toLocaleDateString()}</td>
                    <td>{statusBadge(r.status)}</td>
                    <td>{r.dispatchDate ? new Date(r.dispatchDate).toLocaleDateString() : "—"}</td>
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

export default RequestHistory;
