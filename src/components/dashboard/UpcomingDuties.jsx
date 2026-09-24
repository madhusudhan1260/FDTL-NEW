import { CalendarClock } from 'lucide-react';
import { formatDate } from '../../utils/time';
import EmptyState from '../common/EmptyState';

export default function UpcomingDuties({ duties = [] }) {
  if (duties.length === 0) return <EmptyState title="No upcoming duties" />;
  return (
    <ul className="upcoming-list">
      {duties.map((duty) => (
        <li key={duty.id} className="upcoming-list__item">
          <span className="upcoming-list__date">
            <CalendarClock size={16} />
            {formatDate(duty.date, { withYear: false })}
          </span>
          <span className="upcoming-list__main">
            <strong>{duty.crew}</strong>
            <small>{duty.flight} · {duty.route}</small>
          </span>
          <span className="upcoming-list__time">Report {duty.report}</span>
        </li>
      ))}
    </ul>
  );
}
