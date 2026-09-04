// components/common/Sidebar.jsx
// Navigation sidebar for dashboard pages

import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Links for each role
const adminLinks = [
  { to: "/admin/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/admin/hospitals",  icon: "🏥", label: "Hospitals" },
  { to: "/admin/donors",     icon: "👤", label: "Donors" },
  { to: "/admin/inventory",  icon: "🩸", label: "Inventory" },
];

const donorLinks = [
  { to: "/donor/dashboard",     icon: "📊", label: "Dashboard" },
  { to: "/donor/request-blood", icon: "🩸", label: "Request Blood" },
  { to: "/donor/my-requests",   icon: "📋", label: "My Requests" },
  { to: "/donor/donations",     icon: "💉", label: "Donation History" },
];

const hospitalLinks = [
  { to: "/hospital/dashboard",         icon: "📊", label: "Dashboard" },
  { to: "/hospital/open-requests",     icon: "📋", label: "Open Requests" },
  { to: "/hospital/accepted-requests", icon: "✅", label: "Accepted Requests" },
  { to: "/hospital/inventory",         icon: "🩸", label: "My Inventory" },
  { to: "/hospital/record-donation",   icon: "💉", label: "Record Donation" },
];

const Sidebar = () => {
  const { isAdmin, isDonor, isHospital } = useAuth();

  const links = isAdmin    ? adminLinks
              : isDonor    ? donorLinks
              : isHospital ? hospitalLinks
              : [];

  return (
    <aside className="sidebar">
      <p className="sidebar-section-title">Navigation</p>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <span className="sidebar-icon">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
