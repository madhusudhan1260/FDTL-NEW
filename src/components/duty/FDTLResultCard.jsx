import { UserRound, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import Badge from '../common/Badge';
import { statusTone } from '../../utils/status';

const statusIcon = { ELIGIBLE: CheckCircle2, WARNING: AlertTriangle, VIOLATION: XCircle };

function Meter({ check }) {
  const tone = statusTone(check.status);
  const percent = Math.min(100, Math.round(check.utilisation * 100));
  return (
    <div className="meter">
      <div className="meter__head">
        <span>{check.label}</span>
        <strong>
          {check.actual} <small>/ {check.limit}</small>
        </strong>
      </div>
      <div className="meter__track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={check.label}>
        <span className={`meter__fill meter__fill--${tone}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

/** Crew readiness card built from one fdtlService crew result. */
export default function FDTLResultCard({ result }) {
  const Icon = statusIcon[result.status];
  const meters = result.checks.filter((check) => ['fdp', 'flightTime', 'cumulative'].includes(check.key));
  const tone = statusTone(result.status);

  return (
    <article className={`result-card result-card--${tone}`}>
      <header className="result-card__header">
        <span className="result-card__avatar">
          <UserRound size={22} />
        </span>
        <div>
          <p className="result-card__role">{result.role}</p>
          <h3>{result.name}</h3>
          <p className="result-card__licence">{result.licenceNumber}</p>
        </div>
        <span className={`result-card__status result-card__status--${tone}`}>
          <Icon size={16} /> {result.status}
        </span>
      </header>

      <div className="result-card__meters">
        {meters.map((check) => (
          <Meter key={check.key} check={check} />
        ))}
      </div>

      <dl className="result-card__facts">
        <div>
          <dt>Rest</dt>
          <dd><Badge size="sm">{result.restLabel}</Badge></dd>
        </div>
        <div>
          <dt>Night Duty</dt>
          <dd><Badge size="sm">{result.nightLabel}</Badge></dd>
        </div>
        {result.otherChecks.map((check) => (
          <div key={check.key}>
            <dt>{check.label}</dt>
            <dd><Badge size="sm" tone={statusTone(check.status)}>{check.status === 'ELIGIBLE' ? 'Authorised' : 'Not Authorised'}</Badge></dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
