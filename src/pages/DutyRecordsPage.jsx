import { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { Badge, Button, Card, DatePicker, ErrorState, FilterBar, Input, PageHeader, Select, Table } from '../components/common';
import useAsync from '../hooks/useAsync';
import { getDuties } from '../services/dutyService';
import { getCrew } from '../services/crewService';
import { formatDate } from '../utils/time';
import { useToast } from '../context/ToastContext';

const initialFilters = { search: '', crewId: '', status: '', fromDate: '2026-09-01', toDate: '2026-09-30' };

const columns = [
  { key: 'date', header: 'Date', render: (row) => formatDate(row.date) },
  { key: 'crew', header: 'Crew', render: (row) => <strong>{row.crew}</strong> },
  { key: 'flight', header: 'Flight' },
  { key: 'reportTime', header: 'Report Time' },
  { key: 'releaseTime', header: 'Release Time' },
  { key: 'fdp', header: 'FDP' },
  { key: 'flightTime', header: 'Flight Time' },
  { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
];

export default function DutyRecordsPage() {
  const { notify } = useToast();
  const [filters, setFilters] = useState(initialFilters);
  const { data, loading, error, reload } = useAsync(() => getDuties(filters), [filters.search, filters.crewId, filters.status, filters.fromDate, filters.toDate]);
  const crew = useAsync(() => getCrew(), []);
  const setFilter = (field) => (event) => setFilters((current) => ({ ...current, [field]: event.target.value }));

  return (
    <div className="page">
      <PageHeader
        title="Duty Records"
        subtitle="Historical crew duty periods"
        breadcrumbs={['FDTL', 'Duty Records']}
        actions={<Button variant="secondary" icon={Download} onClick={() => notify('Export queued — see Reports (simulated).', 'info')}>Export</Button>}
      />
      <Card padded={false}>
        <FilterBar actions={<Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Reset</Button>}>
          <Input icon={Search} name="search" placeholder="Search crew or flight…" value={filters.search} onChange={setFilter('search')} className="field--grow" />
          <Select name="crewId" value={filters.crewId} onChange={setFilter('crewId')} placeholder="All crew" options={(crew.data ?? []).map((member) => ({ value: member.id, label: member.name }))} />
          <Select name="status" value={filters.status} onChange={setFilter('status')} placeholder="All statuses" options={['Compliant', 'Warning', 'Violation']} />
          <DatePicker name="fromDate" value={filters.fromDate} onChange={setFilter('fromDate')} aria-label="From date" />
          <DatePicker name="toDate" value={filters.toDate} onChange={setFilter('toDate')} aria-label="To date" />
        </FilterBar>
        {error ? <ErrorState message="Unable to load duty records." onRetry={reload} /> : <Table columns={columns} rows={data} loading={loading} emptyTitle="No duty records for this period" />}
      </Card>
    </div>
  );
}
