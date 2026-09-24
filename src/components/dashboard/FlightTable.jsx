import Table from '../common/Table';
import Badge from '../common/Badge';

const columns = [
  { key: 'flightNumber', header: 'FPL', render: (row) => <strong>{row.flightNumber}</strong> },
  { key: 'route', header: 'Route' },
  { key: 'aircraft', header: 'Aircraft' },
  { key: 'captain', header: 'Crew' },
  { key: 'report', header: 'Report' },
  { key: 'fop', header: 'FOP' },
  { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
];

export default function FlightTable({ flights, loading, onSelect }) {
  return <Table columns={columns} rows={flights} loading={loading} onRowClick={onSelect} emptyTitle="No flights scheduled today" compact />;
}
