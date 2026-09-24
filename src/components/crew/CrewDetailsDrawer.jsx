import { Pencil } from 'lucide-react';
import Drawer from '../common/Drawer';
import Button from '../common/Button';
import Badge from '../common/Badge';
import DetailList from '../common/DetailList';
import { formatDate, formatDuration } from '../../utils/time';

export default function CrewDetailsDrawer({ crew, onClose, onEdit }) {
  if (!crew) return null;
  return (
    <Drawer
      open
      onClose={onClose}
      title={crew.name}
      subtitle={`${crew.rank} · ${crew.employeeId || 'New crew'}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button icon={Pencil} onClick={() => onEdit(crew)}>Edit Crew</Button>
        </>
      }
    >
      <div className="violation-head">
        <Badge>{crew.status}</Badge>
      </div>
      <h3 className="drawer-section__title">Licence</h3>
      <DetailList
        items={[
          { label: 'Licence Number', value: crew.licenceNumber },
          { label: 'Licence Type', value: crew.licenceType },
          { label: 'Licence Expiry', value: formatDate(crew.licenceExpiry) },
          { label: 'Medical Expiry', value: formatDate(crew.medicalExpiry) },
          { label: 'Authorized Aircraft', value: crew.authorizedAircraft.join(', ') },
          { label: 'Base', value: crew.base },
        ]}
      />
      <h3 className="drawer-section__title">Current FDTL Position</h3>
      <DetailList
        items={[
          { label: 'Reporting Time', value: crew.dutyState.reportTime },
          { label: 'Flight Time Today', value: formatDuration(crew.dutyState.priorFlightMinutes) },
          { label: '28-Day Cumulative', value: formatDuration(crew.dutyState.cumulativeMinutes) },
          { label: 'Rest Before Duty', value: formatDuration(crew.dutyState.restBeforeMinutes) },
        ]}
      />
      <h3 className="drawer-section__title">Contact</h3>
      <DetailList items={[{ label: 'Email', value: crew.email }, { label: 'Phone', value: crew.phone }]} columns={1} />
    </Drawer>
  );
}
