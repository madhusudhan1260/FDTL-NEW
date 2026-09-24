import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, XCircle, BedDouble, CalendarPlus } from 'lucide-react';
import { Button, Card, ErrorState, LoadingState, PageHeader, StatCard } from '../components/common';
import FlightTable from '../components/dashboard/FlightTable';
import AttentionList from '../components/dashboard/AttentionList';
import UpcomingDuties from '../components/dashboard/UpcomingDuties';
import ComplianceChart from '../components/dashboard/ComplianceChart';
import useAsync from '../hooks/useAsync';
import { getDashboardSummary } from '../services/fdtlService';
import { getTodaysFlights } from '../services/flightService';
import { getCrewAttention, getUpcomingDuties } from '../services/dutyService';

const TODAY = '2026-09-22';

export default function DashboardPage() {
  const navigate = useNavigate();
  const dashboard = useAsync(getDashboardSummary, []);
  const flights = useAsync(() => getTodaysFlights(TODAY), []);
  const attention = useAsync(getCrewAttention, []);
  const upcoming = useAsync(getUpcomingDuties, []);

  const summary = dashboard.data?.summary;

  return (
    <div className="page">
      <PageHeader
        title="FDTL Dashboard"
        subtitle="MADDY AVIATION · Operations overview for 22 Sep 2026"
        breadcrumbs={['MADDY AVIATION', 'Dashboard']}
        actions={<Button icon={CalendarPlus} onClick={() => navigate('/fdtl/duty-planner')}>Plan Duty</Button>}
      />

      {dashboard.error ? (
        <ErrorState message="Unable to load dashboard summary." onRetry={dashboard.reload} />
      ) : dashboard.loading ? (
        <LoadingState message="Loading FDTL summary…" />
      ) : (
        <div className="stat-grid">
          <StatCard label="Compliant Crew" value={summary.compliant} icon={ShieldCheck} tone="success" hint="Within all FDTL limits" onClick={() => navigate('/crew')} />
          <StatCard label="Approaching Limit" value={summary.approaching} icon={AlertTriangle} tone="warning" hint="Above 85% of a limit" onClick={() => navigate('/fdtl/crew-readiness')} />
          <StatCard label="Violations" value={summary.violations} icon={XCircle} tone="danger" hint="Require immediate action" onClick={() => navigate('/fdtl/violations')} />
          <StatCard label="On Rest" value={summary.onRest} icon={BedDouble} tone="info" hint="Mandatory rest period" onClick={() => navigate('/fdtl/calendar')} />
        </div>
      )}

      <div className="grid grid--main-side">
        <Card title="Today's Flights" subtitle="22 Sep 2026" actions={<Button variant="ghost" size="sm" onClick={() => navigate('/flight-planning')}>View all</Button>} padded={false}>
          {flights.error ? (
            <ErrorState message="Unable to load flight data." onRetry={flights.reload} />
          ) : (
            <FlightTable flights={flights.data} loading={flights.loading} onSelect={() => navigate('/fdtl/duty-planner')} />
          )}
        </Card>
        <Card title="Crew Requiring Attention" actions={<Button variant="ghost" size="sm" onClick={() => navigate('/fdtl/violations')}>Violations</Button>} padded={false}>
          {attention.loading ? <LoadingState /> : <AttentionList items={attention.data} onSelect={() => navigate('/fdtl/violations')} />}
        </Card>
      </div>

      <div className="grid grid--main-side">
        <Card title="FDTL Compliance" subtitle="Crew status by day · last 7 days">
          {dashboard.loading ? <LoadingState /> : <ComplianceChart data={dashboard.data?.trend} />}
        </Card>
        <Card title="Upcoming Duties" actions={<Button variant="ghost" size="sm" onClick={() => navigate('/fdtl/calendar')}>Calendar</Button>} padded={false}>
          {upcoming.loading ? <LoadingState /> : <UpcomingDuties duties={upcoming.data} />}
        </Card>
      </div>
    </div>
  );
}
