// pages/donor/DonationHistory.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyDonations } from "../../redux/slices/donorSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const DonationHistory = () => {
  const dispatch = useDispatch();
  const { donations, loading } = useSelector((state) => state.donor);

  useEffect(() => {
    dispatch(fetchMyDonations());
  }, [dispatch]);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Donation History</h1>
        <p className="page-subtitle">All your past blood donations</p>
      </div>

      <div className="section-card">
        {donations.length === 0 ? (
          <EmptyState icon="💉" title="No donations yet" message="Your donation history will appear here." />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Blood Group</th>
                  <th>Units Donated</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d, i) => (
                  <tr key={d._id}>
                    <td style={{ color: "var(--color-text-muted)" }}>{i + 1}</td>
                    <td>{new Date(d.donationDate).toLocaleDateString()}</td>
                    <td><span className="badge badge-primary">{d.inventory?.bloodGroup || "—"}</span></td>
                    <td>{d.quantity} units</td>
                    <td>{d.location || "—"}</td>
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

export default DonationHistory;
