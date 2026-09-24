import { Plane, Clock } from 'lucide-react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';

export default function FlightSelector({ flights = [], selectedId, onSelect }) {
  if (flights.length === 0) {
    return <EmptyState icon={Plane} title="No flights on this date" message="Choose another date or create a flight in Flight Planning." />;
  }
  return (
    <div className="option-grid">
      {flights.map((flight) => (
        <button
          key={flight.id}
          type="button"
          className={`option-card ${selectedId === flight.id ? 'is-selected' : ''}`}
          onClick={() => onSelect(flight.id)}
          aria-pressed={selectedId === flight.id}
        >
          <span className="option-card__top">
            <strong>{flight.flightNumber}</strong>
            <Badge size="sm" tone="neutral" dot={false}>{flight.aircraft}</Badge>
          </span>
          <span className="option-card__route">
            {flight.fromName} ({flight.from}) → {flight.toName} ({flight.to})
          </span>
          <span className="option-card__meta">
            <Clock size={14} /> {flight.etd} → {flight.eta} · {flight.flightTime}
          </span>
        </button>
      ))}
    </div>
  );
}
