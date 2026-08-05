// pages/NotFound.jsx

import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const NotFound = () => (
  <>
    <Navbar />
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "64px" }}>
      <h1 style={{ fontSize: "6rem", fontWeight: 700, color: "var(--color-primary)", lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "16px" }}>Page Not Found</h2>
      <p style={{ color: "var(--color-text-muted)", marginBottom: "32px" }}>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">Return to Home</Link>
    </div>
  </>
);

export default NotFound;
