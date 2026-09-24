import { CheckCircle2, AlertTriangle, XCircle, GitCommitHorizontal } from 'lucide-react';
import Drawer from '../common/Drawer';
import Button from '../common/Button';
import DetailList from '../common/DetailList';
import { formatDate, durationBetween, formatDuration, toClock, toMinutes } from '../../utils/time';

const statusMeta = {
  within: { label: 'FDTL COMPLIANT', short: 'COMPLIANT', tone: 'success', icon: CheckCircle2 },
  approaching: { label: 'APPROACHING LIMIT', short: 'WARNING', tone: 'warning', icon: AlertTriangle },
  violation: { label: 'FDTL VIOLATION', short: 'VIOLATION', tone: 'danger', icon: XCircle },
};

/** Derives the FDTL summary for a calendar entry (mock values from schedule times). */
function summarise(entry) {
  const reporting = toClock(toMinutes(entry.etd) - 60);
  const release = toClock(toMinutes(entry.eta) + 30);
  const fdp = durationBetween(reporting, release);
  const rest = entry.status === 'violation' ? 540 : 750;
  return {
    reporting,
    release,
    fdp: formatDuration(fdp),
    flightTime: formatDuration(durationBetween(entry.etd, entry.eta)),
    rest: formatDuration(rest),
  };
}

export default function FlightDetailsPanel({ entry, onClose, onViewSequence }) {
  if (!entry) return null;
  const meta = statusMeta[entry.status];
  const summary = summarise(entry);
  const StatusIcon = meta.icon;

  return (
    <Drawer
      open={Boolean(entry)}
      onClose={onClose}
      title={`Flight Details – ${formatDate(entry.date)}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button icon={GitCommitHorizontal} onClick={() => onViewSequence(entry)}>View Full Duty Sequence</Button>
        </>
      }
    >
      <div className={`status-banner status-banner--${meta.tone}`}>
        <StatusIcon size={20} />
        <strong>{meta.label}</strong>
      </div>

      <h3 className="drawer-section__title">Flight Information</h3>
      <DetailList
        items={[
          { label: 'Call Sign', value: entry.callSign },
          { label: 'Aircraft', value: entry.aircraft },
          { label: 'Aircraft Type', value: entry.aircraftType },
          { label: 'From', value: entry.from },
          { label: 'To', value: entry.to },
          { label: 'ETD', value: entry.etd },
          { label: 'ETA', value: entry.eta },
          { label: 'Flight Time', value: summary.flightTime },
          { label: 'Sector', value: entry.sector },
        ]}
      />

      <h3 className="drawer-section__title">Crew Details</h3>
      <DetailList items={[{ label: 'Captain', value: entry.captain }, { label: 'Co-Pilot', value: entry.coPilot }]} />

      <h3 className="drawer-section__title">FDTL Summary</h3>
      <DetailList
        items={[
          { label: 'Reporting Time', value: summary.reporting },
          { label: 'Release Time', value: summary.release },
          { label: 'Flight Duty Period', value: summary.fdp },
          { label: 'Flight Time', value: summary.flightTime },
          { label: 'Previous Duty', value: entry.previousDuty },
          { label: 'Rest Available', value: summary.rest },
        ]}
      />

      <div className="fdtl-status-row">
        <span>FDTL Status</span>
        <span className={`result-card__status result-card__status--${meta.tone}`}>
          <StatusIcon size={16} /> {meta.short}
        </span>
      </div>
    </Drawer>
  );
}
