// components/common/Loader.jsx
// Simple loading spinner

const Loader = ({ text = "Loading..." }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px", gap: "16px" }}>
    <div style={{
      width: "40px", height: "40px",
      border: "3px solid var(--color-border)",
      borderTop: "3px solid var(--color-primary)",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite"
    }} />
    <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>{text}</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Loader;
