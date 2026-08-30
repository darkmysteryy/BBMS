// pages/hospital/MyAcceptedRequests.jsx
// Requests this hospital has accepted. Hospital can mark them as Fulfilled.

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAcceptedRequests, fulfilRequest, clearRequestError } from "../../redux/slices/requestSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const STATUS_BADGE = {
  Accepted:  "badge-warning",
  Fulfilled: "badge-success",
};

const MyAcceptedRequests = () => {
  const dispatch = useDispatch();
  const { acceptedRequests, loading, error, successMessage } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchAcceptedRequests());
  }, [dispatch]);

  const handleFulfil = (id) => {
    if (window.confirm("Mark this request as fulfilled? This will deduct units from your inventory.")) {
      dispatch(clearRequestError());
      dispatch(fulfilRequest(id));
    }
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Accepted Requests</h1>
        <p className="page-subtitle">Blood requests your hospital has accepted. Mark them as Fulfilled once you've provided the blood.</p>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}
      {successMessage && <div className="alert alert-success" style={{ marginBottom: 16 }}>✅ {successMessage}</div>}

      <div className="section-card">
        {acceptedRequests.length === 0 ? (
          <EmptyState icon="✅" title="No accepted requests" message="Accept an open request from the Open Requests page." />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Blood Group</th>
                  <th>Qty</th>
                  <th>Urgency</th>
                  <th>Location</th>
                  <th>Required By</th>
                  <th>Accepted At</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {acceptedRequests.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600 }}>{r.patientName}</td>
                    <td><span className="badge badge-primary">{r.bloodGroup}</span></td>
                    <td>{r.quantity} units</td>
                    <td>{r.urgency}</td>
                    <td>{r.location}</td>
                    <td>{new Date(r.requiredDate).toLocaleDateString()}</td>
                    <td>{r.acceptedAt ? new Date(r.acceptedAt).toLocaleDateString() : "—"}</td>
                    <td><span className={`badge ${STATUS_BADGE[r.status] || "badge-primary"}`}>{r.status}</span></td>
                    <td>
                      {r.status === "Accepted" && (
                        <button className="btn btn-sm btn-success" onClick={() => handleFulfil(r._id)} disabled={loading}>
                          Mark Fulfilled
                        </button>
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

export default MyAcceptedRequests;
