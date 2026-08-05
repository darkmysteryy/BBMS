// layouts/DashboardLayout.jsx
// Layout with Navbar + Sidebar for all dashboard pages

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const DashboardLayout = ({ children }) => (
  <>
    <Navbar />
    <Sidebar />
    <main className="dashboard-layout">
      <div className="dashboard-content">{children}</div>
    </main>
  </>
);

export default DashboardLayout;
