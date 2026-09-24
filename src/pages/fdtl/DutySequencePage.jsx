import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, Card, ErrorState, LoadingState, PageHeader, Table } from '../../components/common';
import Timeline from '../../components/duty/Timeline';
import useAsync from '../../hooks/useAsync';
import { getDutySequence } from '../../services/dutyService';
import { getCrewById } from '../../services/crewService';
import { formatDate } from '../../utils/time';

const columns = [
  { key: 'label', header: 'Activity', render: (row) => <span className={`activity-tag activity-tag--${row.type}`}>{row.label}</span> },
  { key: 'from', header: 'From' },
  { key: 'to', header: 'To' },
  { key: 'duration', header: 'Duration' },
  { key: 'details', header: 'Details', render: (row) => (row.route ? `${row.route} · ${row.details}` : row.details) },
];

export default function DutySequencePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const date = params.get('date') ?? undefined;
  const sequence = useAsync(() => getDutySequence({ date }), [date]);
  const crew = useAsync(() => (sequence.data ? getCrewById(sequence.data.crewId) : Promise.resolve(null)), [sequence.data?.crewId]);

  if (sequence.loading) return <div className="page"><LoadingState message="Loading duty sequence…" /></div>;
  if (sequence.error) return <div className="page"><ErrorState message="Unable to load duty sequence." onRetry={sequence.reload} /></div>;

  const rows = sequence.data.activities.map((activity, index) => ({ ...activity, id: `${activity.type}-${index}` }));

  return (
    <div className="page">
      <PageHeader
        title="Duty Sequence"
        subtitle={`${crew.data?.name ?? ''} · ${formatDate(sequence.data.date)}`}
        breadcrumbs={['FDTL', 'Duty Sequence']}
        actions={<Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(-1)}>Back</Button>}
      />
      <Card title="Duty Timeline" subtitle="Rest → Reporting → Flights → Release → Rest">
        <Timeline activities={sequence.data.activities} />
      </Card>
      <Card title="Duty Sequence Details" padded={false}>
        <Table columns={columns} rows={rows} compact />
      </Card>
    </div>
  );
}
