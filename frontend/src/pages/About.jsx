// pages/About.jsx

import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const About = () => (
  <>
    <Navbar />
    <div style={{ paddingTop: "64px" }}>
      <div className="container" style={{ padding: "48px 16px", maxWidth: "800px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "8px" }}>About BloodBankMS</h1>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "32px" }}>
          Our mission is to bridge the gap between blood donors and hospitals
        </p>

        <div className="section-card" style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>🩸 What We Do</h2>
          <p style={{ color: "var(--color-text-muted)", lineHeight: "1.8" }}>
            BloodBankMS is a comprehensive Blood Bank Management System that connects
            blood donors, hospitals, and administrators in one unified platform.
            We track blood inventory in real time, manage donation records, process
            hospital blood requests, and ensure every drop counts.
          </p>
        </div>

        <div className="section-card" style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>👥 Who Can Use This?</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { role: "Donors", desc: "Register and track your donation history. Get notified when you're eligible to donate again (every 56 days).", icon: "👤" },
              { role: "Hospitals", desc: "Register your hospital, submit blood requests, and track the status of each request from submitted to dispatched.", icon: "🏥" },
              { role: "Administrators", desc: "Manage the entire blood bank — approve hospitals, record donations, manage inventory, and view analytics.", icon: "⚙️" },
            ].map((item) => (
              <div key={item.role} style={{ display: "flex", gap: "12px", padding: "12px", background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
                <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                <div>
                  <p style={{ fontWeight: 700 }}>{item.role}</p>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "12px" }}>📋 Key Rules</h2>
          <ul style={{ display: "flex", flexDirection: "column", gap: "8px", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            <li>• A donor must wait <strong>56 days</strong> between donations</li>
            <li>• Hospitals must be <strong>approved by Admin</strong> before requesting blood</li>
            <li>• Blood requests go through: <strong>Submitted → Approved → Dispatched</strong></li>
            <li>• Inventory is automatically updated when donations are recorded or requests are dispatched</li>
            <li>• Low stock alerts trigger when units drop below <strong>10</strong></li>
          </ul>
        </div>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link to="/signup" className="btn btn-primary btn-lg">Join Us Today</Link>
        </div>
      </div>
    </div>
  </>
);

export default About;
