import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Status colours are reserved for FDTL state and always shown with a legend.
const series = [
  { key: 'compliant', label: 'Compliant', color: 'var(--color-success)' },
  { key: 'approaching', label: 'Approaching', color: 'var(--color-warning)' },
  { key: 'violation', label: 'Violation', color: 'var(--color-danger)' },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__title">{label}</p>
      {[...payload].reverse().map((item) => (
        <p key={item.dataKey} className="chart-tooltip__row">
          <span className="chart-tooltip__swatch" style={{ background: item.color }} />
          <span>{item.name}</span>
          <strong>{item.value}</strong>
        </p>
      ))}
      <p className="chart-tooltip__total">
        Compliance <strong>{Math.round((payload.find((p) => p.dataKey === 'compliant')?.value / total) * 100)}%</strong>
      </p>
    </div>
  );
}

export default function ComplianceChart({ data = [] }) {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(20, 118, 212, 0.06)' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: 'var(--color-text-secondary)' }} />
          {series.map((item, index) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.label}
              stackId="crew"
              fill={item.color}
              stroke="var(--color-surface)"
              strokeWidth={2}
              radius={index === series.length - 1 ? [4, 4, 0, 0] : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
