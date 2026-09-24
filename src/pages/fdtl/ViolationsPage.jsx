import { useState } from 'react';
import { Eye, Filter, AlertOctagon, CheckCircle2, Clock } from 'lucide-react';
import { Badge, Button, Card, DatePicker, ErrorState, FilterBar, PageHeader, Select, StatCard, Table } from '../../components/common';
import ViolationDetails from '../../components/violations/ViolationDetails';
import useAsync from '../../hooks/useAsync';
import { getViolations, updateViolationStatus } from '../../services/violationService';
import { getCrew } from '../../services/crewService';
import { violationSeverities, violationStatuses } from '../../data/violationData';
import { formatDate } from '../../utils/time';
import { useToast } from '../../context/ToastContext';

const initialFilters = { fromDate: '2026-09-01', toDate: '2026-09-30', severity: '', crewId: '', status: '' };

export default function ViolationsPage() {
  const { notify } = useToast();
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(null);
  const { data, loading, error, reload } = useAsync(() => getViolations(appliedFilters), [appliedFilters]);
  const all = useAsync(() => getViolations(), []);
  const crew = useAsync(() => getCrew(), []);

  const setFilter = (field) => (event) => setDraftFilters((current) => ({ ...current, [field]: event.target.value }));

  const handleUpdateStatus = async (violation, status, note) => {
    setSaving(status);
    const updated = await updateViolationStatus(violation.id, status, note);
    setSaving(null);
    setSelected(updated);
    notify(`${violation.id} marked ${status.toLowerCase()}.`);
    reload();
    all.reload();
  };

  const countBy = (status) => all.data?.filter((item) => item.status === status).length ?? '–';

  const columns = [
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date, { withYear: false }) },
    { key: 'crew', header: 'Crew', render: (row) => <strong>{row.crew}</strong> },
    { key: 'flight', header: 'Flight' },
    { key: 'rule', header: 'Rule' },
    { key: 'description', header: 'Description' },
    { key: 'severity', header: 'Severity', render: (row) => <Badge>{row.severity}</Badge> },
    { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
    { key: 'actions', header: 'Actions', align: 'right', render: (row) => <Button variant="ghost" size="sm" icon={Eye} onClick={() => setSelected(row)}>View</Button> },
  ];

  return (
    <div className="page">
      <PageHeader title="FDTL Violations" subtitle="Track and resolve FDTL limit breaches" breadcrumbs={['FDTL', 'Violations']} />

      <div className="stat-grid stat-grid--3">
        <StatCard label="Open" value={countBy('Open')} icon={AlertOctagon} tone="danger" />
        <StatCard label="Acknowledged" value={countBy('Acknowledged')} icon={Clock} tone="info" />
        <StatCard label="Resolved" value={countBy('Resolved')} icon={CheckCircle2} tone="success" />
      </div>

      <Card padded={false}>
        <FilterBar
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={() => { setDraftFilters(initialFilters); setAppliedFilters(initialFilters); }}>Reset</Button>
              <Button icon={Filter} onClick={() => setAppliedFilters(draftFilters)}>Apply</Button>
            </>
          }
        >
          <DatePicker label="From Date" name="fromDate" value={draftFilters.fromDate} onChange={setFilter('fromDate')} />
          <DatePicker label="To Date" name="toDate" value={draftFilters.toDate} onChange={setFilter('toDate')} />
          <Select label="Severity" name="severity" value={draftFilters.severity} onChange={setFilter('severity')} placeholder="All" options={violationSeverities} />
          <Select label="Crew" name="crewId" value={draftFilters.crewId} onChange={setFilter('crewId')} placeholder="All crew" options={(crew.data ?? []).map((member) => ({ value: member.id, label: member.name }))} />
          <Select label="Status" name="status" value={draftFilters.status} onChange={setFilter('status')} placeholder="All" options={violationStatuses} />
        </FilterBar>
        {error ? <ErrorState message="Unable to load violations." onRetry={reload} /> : <Table columns={columns} rows={data} loading={loading} emptyTitle="No violations found" emptyMessage="No FDTL violations match these filters." />}
      </Card>

      {selected && <ViolationDetails key={selected.id + selected.status} violation={selected} saving={saving} onClose={() => setSelected(null)} onUpdateStatus={handleUpdateStatus} />}
    </div>
  );
}
