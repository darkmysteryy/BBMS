// components/common/EmptyState.jsx
// Shown when a list or table has no data

const EmptyState = ({ icon = "📭", title = "No data found", message = "Nothing to show here yet." }) => (
  <div style={{ textAlign: "center", padding: "48px 16px" }}>
    <div style={{ fontSize: "3rem", marginBottom: "16px" }}>{icon}</div>
    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>{title}</h3>
    <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>{message}</p>
  </div>
);

export default EmptyState;
