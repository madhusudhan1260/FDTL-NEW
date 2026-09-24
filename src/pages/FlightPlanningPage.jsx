import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, ShieldCheck } from 'lucide-react';
import { Badge, Button, Card, DatePicker, DetailList, Drawer, ErrorState, FilterBar, Input, PageHeader, Select, Table } from '../components/common';
import FlightFormModal from '../components/flight/FlightFormModal';
import useAsync from '../hooks/useAsync';
import { getFlights, saveFlight } from '../services/flightService';
import { getAircraft } from '../services/aircraftService';
import { getCrew } from '../services/crewService';
import { flightPlanStatuses } from '../data/flightData';
import { formatDate } from '../utils/time';
import { useToast } from '../context/ToastContext';
import { useDutyPlanner } from '../context/DutyPlannerContext';

export default function FlightPlanningPage() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { updatePlan } = useDutyPlanner();
  const [filters, setFilters] = useState({ search: '', date: '', status: '' });
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const flights = useAsync(() => getFlights(filters), [filters.search, filters.date, filters.status]);
  const aircraft = useAsync(() => getAircraft(), []);
  const crew = useAsync(() => getCrew(), []);

  const setFilter = (field) => (event) => setFilters((current) => ({ ...current, [field]: event.target.value }));

  const handleSave = async (form) => {
    setSaving(true);
    const saved = await saveFlight(form);
    setSaving(false);
    setEditing(null);
    notify(form.id ? `${saved.flightNumber} updated.` : `${saved.flightNumber} created as ${saved.planStatus}.`);
    flights.reload();
  };

  const planDuty = (flight) => {
    updatePlan({ date: flight.date, flightId: flight.id, validation: null, assigned: false });
    navigate('/fdtl/duty-planner');
  };

  const columns = [
    { key: 'flightNumber', header: 'Flight Number', render: (row) => <strong>{row.flightNumber}</strong> },
    { key: 'callSign', header: 'Call Sign' },
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date) },
    { key: 'from', header: 'From' },
    { key: 'to', header: 'To' },
    { key: 'aircraft', header: 'Aircraft' },
    { key: 'etd', header: 'ETD' },
    { key: 'eta', header: 'ETA' },
    { key: 'flightTime', header: 'Flight Time' },
    { key: 'planStatus', header: 'Status', render: (row) => <Badge>{row.planStatus}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="row-actions">
          <Button variant="ghost" size="sm" icon={Eye} onClick={() => setViewing(row)} aria-label={`View ${row.flightNumber}`} />
          <Button variant="ghost" size="sm" icon={Pencil} onClick={() => setEditing(row)} aria-label={`Edit ${row.flightNumber}`} />
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <PageHeader
        title="Flight Planning"
        subtitle="Create and manage flight plans"
        breadcrumbs={['MADDY AVIATION', 'Flight Planning']}
        actions={<Button icon={Plus} onClick={() => setEditing({})}>Create Flight</Button>}
      />
      <Card padded={false}>
        <FilterBar actions={(filters.search || filters.date || filters.status) && <Button variant="ghost" size="sm" onClick={() => setFilters({ search: '', date: '', status: '' })}>Clear</Button>}>
          <Input icon={Search} name="search" placeholder="Search flight, call sign, route…" value={filters.search} onChange={setFilter('search')} className="field--grow" />
          <DatePicker name="date" value={filters.date} onChange={setFilter('date')} aria-label="Flight date" />
          <Select name="status" value={filters.status} onChange={setFilter('status')} placeholder="All statuses" options={flightPlanStatuses} />
        </FilterBar>
        {flights.error ? (
          <ErrorState message="Unable to load flight data." onRetry={flights.reload} />
        ) : (
          <Table columns={columns} rows={flights.data} loading={flights.loading} emptyTitle="No flights found" />
        )}
      </Card>

      <Drawer
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing ? `${viewing.flightNumber} · ${viewing.callSign}` : ''}
        subtitle={viewing ? `${viewing.fromName} → ${viewing.toName}` : ''}
        footer={
          <>
            <Button variant="secondary" icon={Pencil} onClick={() => { setEditing(viewing); setViewing(null); }}>Edit</Button>
            <Button icon={ShieldCheck} onClick={() => planDuty(viewing)}>Plan Duty & Validate</Button>
          </>
        }
      >
        {viewing && (
          <>
            <div className="violation-head">
              <Badge>{viewing.planStatus}</Badge>
              <Badge>{viewing.status}</Badge>
            </div>
            <DetailList
              items={[
                { label: 'Date', value: formatDate(viewing.date) },
                { label: 'Aircraft', value: `${viewing.aircraft} · ${viewing.aircraftType}` },
                { label: 'From', value: `${viewing.fromName} (${viewing.from})` },
                { label: 'To', value: `${viewing.toName} (${viewing.to})` },
                { label: 'Report', value: viewing.report },
                { label: 'ETD', value: viewing.etd },
                { label: 'ETA', value: viewing.eta },
                { label: 'Flight Time', value: viewing.flightTime },
                { label: 'Captain', value: viewing.captain },
                { label: 'Co-Pilot', value: viewing.coPilot },
              ]}
            />
          </>
        )}
      </Drawer>

      {editing && (
        <FlightFormModal open flight={editing.id ? editing : null} aircraft={aircraft.data ?? []} crew={crew.data ?? []} saving={saving} onClose={() => setEditing(null)} onSave={handleSave} />
      )}
    </div>
  );
}
