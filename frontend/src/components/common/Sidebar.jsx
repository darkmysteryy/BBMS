// components/common/Sidebar.jsx
// Navigation sidebar for dashboard pages

import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Links for each role
const adminLinks = [
  { to: "/admin/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/admin/donors",     icon: "👤", label: "Donors" },
  { to: "/admin/hospitals",  icon: "🏥", label: "Hospitals" },
  { to: "/admin/inventory",  icon: "🩸", label: "Inventory" },
  { to: "/admin/requests",   icon: "📋", label: "Requests" },
  { to: "/admin/reports",    icon: "📈", label: "Reports" },
];

const donorLinks = [
  { to: "/donor/dashboard",  icon: "📊", label: "Dashboard" },
  { to: "/donor/profile",    icon: "👤", label: "My Profile" },
  { to: "/donor/donations",  icon: "🩸", label: "Donations" },
];

const hospitalLinks = [
  { to: "/hospital/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/hospital/profile",   icon: "🏥", label: "Profile" },
  { to: "/hospital/request",   icon: "➕", label: "Request Blood" },
  { to: "/hospital/requests",  icon: "📋", label: "My Requests" },
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

      <hr className="sidebar-divider" />

      <NavLink to="/inventory" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
        <span className="sidebar-icon">📦</span>
        Blood Inventory
      </NavLink>
    </aside>
  );
};

export default Sidebar;
