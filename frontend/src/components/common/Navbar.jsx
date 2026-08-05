// components/common/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, isLoggedIn, isAdmin, isDonor, isHospital, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate("/login");
  };

  // Get first letter of name for avatar
  const avatarLetter = user?.name ? user.name[0].toUpperCase() : "U";

  // Dashboard path based on role
  const dashboardPath =
    isAdmin    ? "/admin/dashboard"
    : isDonor  ? "/donor/dashboard"
    : isHospital ? "/hospital/dashboard"
    : "/";

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-brand">
        🩸 <span>BloodBank</span>MS
      </Link>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        {isLoggedIn && <Link to={dashboardPath}>Dashboard</Link>}
        {(isAdmin || isLoggedIn) && <Link to="/inventory">Inventory</Link>}
      </div>

      {/* Auth Actions */}
      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <div className="navbar-user">
              <div className="navbar-avatar">{avatarLetter}</div>
              <span className="navbar-name">{user?.name}</span>
            </div>
            <button className="btn btn-outline btn-sm" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
