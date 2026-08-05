// pages/admin/Reports.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMonthlyDonations,
  fetchBloodGroupDistribution,
  fetchRequestsSummary,
} from "../../redux/slices/reportSlice";
import DashboardLayout from "../../layouts/DashboardLayout";
import BarChart from "../../components/charts/BarChart";
import PieChart from "../../components/charts/PieChart";
import Loader from "../../components/common/Loader";

const Reports = () => {
  const dispatch = useDispatch();
  const { monthlyDonations, bloodGroupDistribution, requestsSummary, loading } = useSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchMonthlyDonations());
    dispatch(fetchBloodGroupDistribution());
    dispatch(fetchRequestsSummary());
  }, [dispatch]);

  if (loading && !monthlyDonations.length) return <DashboardLayout><Loader /></DashboardLayout>;

  // Format data for charts
  const monthlyData = monthlyDonations.map((d) => {
    const date = new Date(d._id.year, d._id.month - 1);
    return {
      label: date.toLocaleString('default', { month: 'short' }) + " " + date.getFullYear(),
      value: d.totalUnits,
    };
  });

  const bloodGroupData = bloodGroupDistribution.map((d) => ({
    label: d.bloodGroup,
    value: d.totalUnits,
  }));

  const requestData = requestsSummary.map((d) => ({
    label: d._id,
    value: d.count,
  }));

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Analytics & Reports</h1>
        <p className="page-subtitle">Visual insights into blood bank operations</p>
      </div>

      <div className="dashboard-grid">
        <div className="section-card">
          <h2 className="section-card-title">Monthly Donations (Units)</h2>
          <div style={{ padding: "16px 0" }}>
            <BarChart data={monthlyData} labelKey="label" valueKey="value" />
          </div>
        </div>

        <div className="section-card">
          <h2 className="section-card-title">Blood Group Availability</h2>
          <div style={{ padding: "16px 0" }}>
            <PieChart data={bloodGroupData} labelKey="label" valueKey="value" />
          </div>
        </div>

        <div className="section-card">
          <h2 className="section-card-title">Hospital Requests Summary</h2>
          <div style={{ padding: "16px 0" }}>
            <PieChart data={requestData} labelKey="label" valueKey="value" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
