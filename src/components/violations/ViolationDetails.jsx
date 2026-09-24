import { useState } from 'react';
import { CheckCircle2, Eye } from 'lucide-react';
import Drawer from '../common/Drawer';
import Button from '../common/Button';
import Badge from '../common/Badge';
import DetailList from '../common/DetailList';
import Alert from '../common/Alert';
import { formatDate } from '../../utils/time';

export default function ViolationDetails({ violation, onClose, onUpdateStatus, saving }) {
  const [note, setNote] = useState('');
  if (!violation) return null;

  const isResolved = violation.status === 'Resolved';

  return (
    <Drawer
      open
      width={520}
      onClose={onClose}
      title={`Violation ${violation.id}`}
      subtitle={`${violation.rule} · ${formatDate(violation.date)}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {!isResolved && violation.status !== 'Acknowledged' && (
            <Button variant="secondary" icon={Eye} loading={saving === 'Acknowledged'} onClick={() => onUpdateStatus(violation, 'Acknowledged', note)}>
              Acknowledge
            </Button>
          )}
          {!isResolved && (
            <Button variant="success" icon={CheckCircle2} loading={saving === 'Resolved'} onClick={() => onUpdateStatus(violation, 'Resolved', note)}>
              Mark Resolved
            </Button>
          )}
        </>
      }
    >
      <div className="violation-head">
        <Badge>{violation.severity}</Badge>
        <Badge>{violation.status}</Badge>
      </div>

      <Alert tone={violation.severity === 'High' ? 'danger' : 'warning'} title={violation.description}>
        Actual <strong>{violation.actual}</strong> against limit <strong>{violation.limit}</strong>
        {violation.exceededBy !== '—' && <> · exceeded by <strong>{violation.exceededBy}</strong></>}
      </Alert>

      <h3 className="drawer-section__title">Details</h3>
      <DetailList
        items={[
          { label: 'Crew', value: violation.crew },
          { label: 'Flight', value: violation.flight },
          { label: 'Route', value: violation.route },
          { label: 'Aircraft', value: violation.aircraft },
          { label: 'Rule', value: violation.rule },
          { label: 'Severity', value: violation.severity },
          { label: 'Detected At', value: violation.detectedAt },
          { label: 'Detected By', value: violation.detectedBy },
        ]}
      />

      <h3 className="drawer-section__title">Recommended Action</h3>
      <p className="drawer-text">{violation.recommendation}</p>

      {violation.resolution && (
        <>
          <h3 className="drawer-section__title">Resolution</h3>
          <p className="drawer-text">{violation.resolution}</p>
        </>
      )}

      {!isResolved && (
        <div className="field">
          <label htmlFor="violation-note" className="field__label">Resolution note</label>
          <textarea id="violation-note" className="input textarea" rows={3} value={note} placeholder="Describe the corrective action taken…" onChange={(event) => setNote(event.target.value)} />
        </div>
      )}
    </Drawer>
  );
}
