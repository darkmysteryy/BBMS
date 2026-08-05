// components/charts/PieChart.jsx
// CSS conic-gradient pie chart — no external library needed

const COLORS = [
  "#e63946", "#f59e0b", "#22c55e", "#3b82f6",
  "#a855f7", "#ec4899", "#14b8a6", "#f97316",
];

const PieChart = ({ data = [], labelKey = "label", valueKey = "value", title = "" }) => {
  if (!data.length) return <p style={{ color: "var(--color-text-muted)", textAlign: "center" }}>No data</p>;

  const total = data.reduce((sum, d) => sum + (d[valueKey] || 0), 0) || 1;

  // Build conic-gradient string
  let cumulativePct = 0;
  const gradientParts = data.map((item, i) => {
    const pct   = ((item[valueKey] || 0) / total) * 100;
    const start = cumulativePct;
    const end   = cumulativePct + pct;
    cumulativePct = end;
    return `${COLORS[i % COLORS.length]} ${start}% ${end}%`;
  });

  return (
    <div>
      {title && <p style={{ fontWeight: 600, marginBottom: "12px" }}>{title}</p>}
      <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
        {/* Pie */}
        <div style={{
          width: "140px", height: "140px", borderRadius: "50%", flexShrink: 0,
          background: `conic-gradient(${gradientParts.join(", ")})`,
        }} />

        {/* Legend */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {data.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
              <span style={{ color: "var(--color-text-muted)" }}>{item[labelKey]}</span>
              <span style={{ fontWeight: 600 }}>{item[valueKey]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
