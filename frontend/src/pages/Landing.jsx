// pages/Landing.jsx

import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const features = [
  { icon: "🩸", title: "Smart Inventory", desc: "Real-time blood inventory tracking across all blood groups with low stock alerts." },
  { icon: "🏥", title: "Hospital Network", desc: "Verified hospitals can request blood online and track requests in real time." },
  { icon: "❤️", title: "Donor Management", desc: "Track donor eligibility, donation history, and upcoming eligible dates automatically." },
  { icon: "📊", title: "Analytics Reports", desc: "Visual reports on monthly donations, blood distribution, and request trends." },
  { icon: "🔔", title: "Email Alerts", desc: "Automatic email notifications for approvals, dispatches, and important updates." },
  { icon: "🔒", title: "Secure Access", desc: "Role-based access for Admin, Donors, and Hospitals with JWT authentication." },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Landing = () => (
  <>
    <Navbar />
    <div style={{ paddingTop: "64px" }}>

      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">🩸 Save Lives Today</div>
            <h1 className="hero-title">
              Managing Blood Donations<br />
              <span>Smarter & Safer</span>
            </h1>
            <p className="hero-description">
              A complete Blood Bank Management System that connects donors, hospitals,
              and administrators — ensuring the right blood reaches the right patient at the right time.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">Donate Blood</Link>
              <Link to="/login" className="btn btn-outline btn-lg">Hospital Login</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─────────────────────────────────────────── */}
      <section className="stats-bar">
        <div className="stats-bar-inner">
          {[
            { value: "5,000+", label: "Registered Donors" },
            { value: "200+",   label: "Partner Hospitals" },
            { value: "8",      label: "Blood Groups Covered" },
            { value: "12,000+",label: "Lives Saved" },
          ].map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-item-value">{s.value}</div>
              <div className="stat-item-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────── */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">What We Offer</span>
          <h2 className="section-title">Everything You Need in One Place</h2>
          <p className="section-desc">
            Our platform simplifies blood bank operations for administrators, makes it easy
            for hospitals to request blood, and keeps donors informed.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Blood Groups ──────────────────────────────────────── */}
      <section className="blood-groups-section">
        <div className="section-header">
          <span className="section-tag">Inventory</span>
          <h2 className="section-title">All Blood Groups Available</h2>
          <p className="section-desc">We maintain stock for every blood group.</p>
        </div>
        <div className="blood-groups-grid">
          {BLOOD_GROUPS.map((bg) => (
            <div className="blood-group-chip" key={bg}>{bg}</div>
          ))}
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">Ready to Save Lives?</h2>
          <p className="cta-desc">
            Join as a donor or register your hospital today.
            Every donation matters — be the reason someone smiles.
          </p>
          <div className="cta-actions">
            <Link to="/signup" className="btn-white">Register as Donor</Link>
            <Link to="/signup" style={{ color: "#fff", fontWeight: 600, padding: "12px 28px" }}>
              Register Hospital →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-brand">🩸 BloodBankMS</div>
        <p>© {new Date().getFullYear()} Blood Bank Management System. All rights reserved.</p>
      </footer>

    </div>
  </>
);

export default Landing;
