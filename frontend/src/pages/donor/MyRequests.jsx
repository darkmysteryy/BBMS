// pages/donor/MyRequests.jsx
// Donor's list of their own blood requests with status tracking

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyRequests, cancelBloodRequest } from "../../redux/slices/requestSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const STATUS_BADGE = {
  Open:      "badge-primary",
  Accepted:  "badge-warning",
  Fulfilled: "badge-success",
  Cancelled: "badge-danger",
};

const URGENCY_BADGE = {
  Normal:   "badge-primary",
  Urgent:   "badge-warning",
  Critical: "badge-danger",
};

const MyRequests = () => {
  const dispatch = useDispatch();
  const { myRequests, loading, error } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchMyRequests());
  }, [dispatch]);

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      dispatch(cancelBloodRequest(id));
    }
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Blood Requests</h1>
        <p className="page-subtitle">Track the status of your blood requests</p>
        <Link to="/donor/request-blood" className="btn btn-primary" style={{ marginTop: 8 }}>+ New Request</Link>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="section-card">
        {myRequests.length === 0 ? (
          <EmptyState icon="🩸" title="No requests yet" message="Post a blood request and nearby hospitals will respond." />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Blood Group</th>
                  <th>Qty</th>
                  <th>Urgency</th>
                  <th>Required By</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Accepted By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600 }}>{r.patientName}</td>
                    <td><span className="badge badge-primary">{r.bloodGroup}</span></td>
                    <td>{r.quantity} units</td>
                    <td><span className={`badge ${URGENCY_BADGE[r.urgency]}`}>{r.urgency}</span></td>
                    <td>{new Date(r.requiredDate).toLocaleDateString()}</td>
                    <td>{r.location}</td>
                    <td><span className={`badge ${STATUS_BADGE[r.status]}`}>{r.status}</span></td>
                    <td>
                      {r.acceptedBy
                        ? <span style={{ color: "var(--color-success)", fontWeight: 600 }}>{r.acceptedBy.hospitalName}</span>
                        : <span style={{ color: "var(--color-text-muted)" }}>Waiting...</span>}
                    </td>
                    <td>
                      {r.status === "Open" && (
                        <button className="btn btn-sm btn-danger" onClick={() => handleCancel(r._id)}>Cancel</button>
                      )}
                    </td>
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

export default MyRequests;
