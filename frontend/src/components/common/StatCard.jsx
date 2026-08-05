// components/common/StatCard.jsx
// Dashboard stat card

const StatCard = ({ icon, label, value, colorClass = "stat-icon-red" }) => (
  <div className="stat-card">
    <div className={`stat-icon ${colorClass}`}>{icon}</div>
    <div className="stat-info">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value ?? "—"}</p>
    </div>
  </div>
);

export default StatCard;
