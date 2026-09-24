import { useState } from 'react';
import { UserPlus, Search, Eye, Pencil } from 'lucide-react';
import { Badge, Button, Card, ErrorState, FilterBar, Input, PageHeader, Select, Table } from '../components/common';
import CrewFormModal from '../components/crew/CrewFormModal';
import CrewDetailsDrawer from '../components/crew/CrewDetailsDrawer';
import useAsync from '../hooks/useAsync';
import { getCrew, createCrew, updateCrew } from '../services/crewService';
import { crewStatuses, licenceTypes } from '../data/crewData';
import { useToast } from '../context/ToastContext';

export default function CrewPage() {
  const { notify } = useToast();
  const [filters, setFilters] = useState({ search: '', status: '', licenceType: '' });
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, crew = edit
  const [saving, setSaving] = useState(false);
  const { data: crew, loading, error, reload } = useAsync(() => getCrew(filters), [filters.search, filters.status, filters.licenceType]);

  const setFilter = (field) => (event) => setFilters((current) => ({ ...current, [field]: event.target.value }));

  const handleSave = async (form) => {
    setSaving(true);
    if (form.id) {
      await updateCrew(form.id, form);
      notify(`${form.name} updated.`);
    } else {
      await createCrew(form);
      notify(`${form.name} added to crew roster.`);
    }
    setSaving(false);
    setEditing(null);
    setViewing(null);
    reload();
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <div className="cell-stack">
          <strong>{row.name}</strong>
          <small>{row.rank} · {row.employeeId}</small>
        </div>
      ),
    },
    { key: 'licenceNumber', header: 'Licence Number' },
    { key: 'licenceType', header: 'Licence Type' },
    { key: 'authorizedAircraft', header: 'Authorized Aircraft', render: (row) => row.authorizedAircraft.join(', ') },
    { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="row-actions">
          <Button variant="ghost" size="sm" icon={Eye} onClick={() => setViewing(row)}>View</Button>
          <Button variant="ghost" size="sm" icon={Pencil} onClick={() => setEditing(row)}>Edit</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <PageHeader
        title="Crew Management"
        subtitle="Flight crew roster, licences and FDTL status"
        breadcrumbs={['MADDY AVIATION', 'Crew']}
        actions={<Button icon={UserPlus} onClick={() => setEditing({})}>Add Crew</Button>}
      />
      <Card padded={false}>
        <FilterBar>
          <Input icon={Search} name="search" placeholder="Search name, licence or aircraft…" value={filters.search} onChange={setFilter('search')} className="field--grow" />
          <Select name="status" value={filters.status} onChange={setFilter('status')} placeholder="All statuses" options={crewStatuses} />
          <Select name="licenceType" value={filters.licenceType} onChange={setFilter('licenceType')} placeholder="All licence types" options={licenceTypes} />
        </FilterBar>
        {error ? (
          <ErrorState message="Unable to load crew data." onRetry={reload} />
        ) : (
          <Table columns={columns} rows={crew} loading={loading} emptyTitle="No crew match your filters" />
        )}
      </Card>

      <CrewDetailsDrawer crew={viewing} onClose={() => setViewing(null)} onEdit={(row) => { setViewing(null); setEditing(row); }} />
      {editing && <CrewFormModal open crew={editing.id ? editing : null} saving={saving} onClose={() => setEditing(null)} onSave={handleSave} />}
    </div>
  );
}
