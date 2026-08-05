// components/charts/BarChart.jsx
// Pure SVG bar chart — no external library needed

const BarChart = ({ data = [], labelKey = "label", valueKey = "value", title = "" }) => {
  if (!data.length) return <p style={{ color: "var(--color-text-muted)", textAlign: "center" }}>No data</p>;

  const maxValue = Math.max(...data.map((d) => d[valueKey] || 0)) || 1;
  const barWidth  = 40;
  const barGap    = 20;
  const chartH    = 180;
  const paddingL  = 40;
  const paddingB  = 40;
  const totalW    = data.length * (barWidth + barGap) + paddingL;

  return (
    <div>
      {title && <p style={{ fontWeight: 600, marginBottom: "12px" }}>{title}</p>}
      <div style={{ overflowX: "auto" }}>
        <svg width={totalW} height={chartH + paddingB} style={{ display: "block" }}>
          {/* Y-axis lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = chartH - chartH * pct;
            return (
              <g key={pct}>
                <line x1={paddingL} y1={y} x2={totalW} y2={y} stroke="var(--color-border)" strokeDasharray="4,4" />
                <text x={paddingL - 4} y={y + 4} fontSize="10" fill="var(--color-text-muted)" textAnchor="end">
                  {Math.round(maxValue * pct)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, i) => {
            const value   = item[valueKey] || 0;
            const barH    = (value / maxValue) * chartH;
            const x       = paddingL + i * (barWidth + barGap);
            const y       = chartH - barH;
            const label   = item[labelKey] || "";

            return (
              <g key={i}>
                <rect x={x} y={y} width={barWidth} height={barH}
                  fill="var(--color-primary)" rx="4" opacity="0.85" />
                {/* Value on top */}
                <text x={x + barWidth / 2} y={y - 4} fontSize="10" fill="var(--color-text)" textAnchor="middle">
                  {value}
                </text>
                {/* Label below */}
                <text x={x + barWidth / 2} y={chartH + 16} fontSize="10" fill="var(--color-text-muted)" textAnchor="middle">
                  {label.length > 6 ? label.slice(0, 6) + "…" : label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default BarChart;
