import { useNavigate } from 'react-router-dom';
import { CalendarPlus, UserCheck, CalendarDays, ClipboardList, AlertOctagon, Settings, ChevronRight, ShieldCheck, AlertTriangle, XCircle, BedDouble } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Alert, Badge, Card, LoadingState, PageHeader, StatCard } from '../../components/common';
import useAsync from '../../hooks/useAsync';
import { getCrewUtilisation, getDashboardSummary } from '../../services/fdtlService';
import { activeLimits, PROTOTYPE_DISCLAIMER } from '../../data/fdtlData';

const modules = [
  { path: '/fdtl/duty-planner', label: 'Duty Planner', description: 'Plan a duty and validate FDTL before assignment', icon: CalendarPlus },
  { path: '/fdtl/crew-readiness', label: 'Crew Readiness', description: 'Eligibility of selected crew for a flight', icon: UserCheck },
  { path: '/fdtl/calendar', label: 'FDTL Calendar', description: 'Monthly schedule with compliance status', icon: CalendarDays },
  { path: '/duty-records', label: 'Duty Records', description: 'Historical duty periods', icon: ClipboardList },
  { path: '/fdtl/violations', label: 'Violations', description: 'Open and resolved FDTL violations', icon: AlertOctagon },
  { path: '/fdtl/configuration', label: 'Configuration', description: 'Rule packs and FDTL limits', icon: Settings },
];

const toneColor = (percent) => {
  if (percent > 100) return 'var(--color-danger)';
  if (percent >= activeLimits.warningThreshold * 100) return 'var(--color-warning)';
  return 'var(--color-primary)';
};

function UtilTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__title">{row.name}</p>
      <p className="chart-tooltip__row"><span>28-day flight time</span><strong>{row.cumulative}</strong></p>
      <p className="chart-tooltip__row"><span>Utilisation</span><strong>{row.utilisation}%</strong></p>
    </div>
  );
}

export default function FDTLOverviewPage() {
  const navigate = useNavigate();
  const utilisation = useAsync(getCrewUtilisation, []);
  const dashboard = useAsync(getDashboardSummary, []);
  const summary = dashboard.data?.summary;

  return (
    <div className="page">
      <PageHeader title="FDTL Overview" subtitle="Flight Duty Time Limit monitoring · Rule pack NSOP India 2025.01" breadcrumbs={['FDTL', 'Overview']} />

      {summary && (
        <div className="stat-grid">
          <StatCard label="Compliant Crew" value={summary.compliant} icon={ShieldCheck} tone="success" />
          <StatCard label="Approaching Limit" value={summary.approaching} icon={AlertTriangle} tone="warning" />
          <StatCard label="Violations" value={summary.violations} icon={XCircle} tone="danger" />
          <StatCard label="On Rest" value={summary.onRest} icon={BedDouble} tone="info" />
        </div>
      )}

      <div className="module-grid">
        {modules.map(({ path, label, description, icon: Icon }) => (
          <button key={path} type="button" className="module-card" onClick={() => navigate(path)}>
            <span className="module-card__icon"><Icon size={20} /></span>
            <span className="module-card__text">
              <strong>{label}</strong>
              <small>{description}</small>
            </span>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>

      <Card title="28-Day Cumulative Flight Time Utilisation" subtitle={`Percentage of the ${activeLimits.maxCumulativeMinutes28Days / 60}:00 prototype limit · dashed line = warning threshold`}>
        {utilisation.loading ? (
          <LoadingState />
        ) : (
          <>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={utilisation.data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barCategoryGap="30%">
                  <CartesianGrid vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} tickFormatter={(name) => name.replace(/^(Capt\.|F\/O) /, '')} />
                  <YAxis unit="%" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                  <Tooltip content={<UtilTooltip />} cursor={{ fill: 'rgba(20, 118, 212, 0.06)' }} />
                  <ReferenceLine y={activeLimits.warningThreshold * 100} stroke="var(--color-warning)" strokeDasharray="4 4" />
                  <Bar dataKey="utilisation" radius={[4, 4, 0, 0]}>
                    {utilisation.data?.map((row) => <Cell key={row.id} fill={toneColor(row.utilisation)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="legend-row">
              <Badge tone="info">Within limits</Badge>
              <Badge tone="warning">Approaching (≥ 85%)</Badge>
              <Badge tone="danger">Exceeded</Badge>
            </div>
          </>
        )}
      </Card>

      <Alert tone="info" title="Prototype rules">{PROTOTYPE_DISCLAIMER}</Alert>
    </div>
  );
}
