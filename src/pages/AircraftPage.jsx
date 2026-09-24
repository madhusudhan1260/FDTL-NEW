import { useState } from 'react';
import { Search, Plane, Wrench, AlertOctagon } from 'lucide-react';
import { Badge, Card, ErrorState, FilterBar, Input, PageHeader, Select, StatCard, Table } from '../components/common';
import useAsync from '../hooks/useAsync';
import { getAircraft } from '../services/aircraftService';
import { aircraftStatuses } from '../data/aircraftData';
import { formatDate } from '../utils/time';

const columns = [
  { key: 'registration', header: 'Registration', render: (row) => <strong>{row.registration}</strong> },
  { key: 'type', header: 'Aircraft Type' },
  { key: 'category', header: 'Category' },
  { key: 'operator', header: 'Operator' },
  { key: 'base', header: 'Base' },
  { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
  { key: 'lastMaintenance', header: 'Last Maintenance', render: (row) => formatDate(row.lastMaintenance) },
  { key: 'nextMaintenance', header: 'Next Due', render: (row) => formatDate(row.nextMaintenance) },
];

export default function AircraftPage() {
  const [filters, setFilters] = useState({ search: '', status: '' });
  const { data, loading, error, reload } = useAsync(() => getAircraft(filters), [filters.search, filters.status]);
  const all = useAsync(() => getAircraft(), []);
  const count = (status) => all.data?.filter((item) => item.status === status).length ?? '–';

  return (
    <div className="page">
      <PageHeader title="Aircraft Management" subtitle="MADDY AVIATION fleet status and maintenance" breadcrumbs={['MADDY AVIATION', 'Aircraft']} />
      <div className="stat-grid stat-grid--3">
        <StatCard label="Active Aircraft" value={count('Active')} icon={Plane} tone="success" />
        <StatCard label="In Maintenance" value={count('Maintenance')} icon={Wrench} tone="warning" />
        <StatCard label="Aircraft on Ground" value={count('AOG')} icon={AlertOctagon} tone="danger" />
      </div>
      <Card padded={false}>
        <FilterBar>
          <Input icon={Search} name="search" placeholder="Search registration or type…" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} className="field--grow" />
          <Select name="status" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} placeholder="All statuses" options={aircraftStatuses} />
        </FilterBar>
        {error ? <ErrorState message="Unable to load aircraft data." onRetry={reload} /> : <Table columns={columns} rows={data} loading={loading} />}
      </Card>
    </div>
  );
}
