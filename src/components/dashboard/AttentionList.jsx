import { AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';

export default function AttentionList({ items = [], onSelect }) {
  if (items.length === 0) return <EmptyState title="All crew within limits" message="No crew currently require attention." />;
  return (
    <ul className="attention-list">
      {items.map((item) => {
        const Icon = item.severity === 'Violation' ? XCircle : AlertTriangle;
        return (
          <li key={item.id}>
            <button type="button" className="attention-list__item" onClick={() => onSelect?.(item)}>
              <span className={`attention-list__icon attention-list__icon--${item.severity === 'Violation' ? 'danger' : 'warning'}`}>
                <Icon size={18} />
              </span>
              <span className="attention-list__text">
                <strong>{item.name}</strong>
                <small>{item.issue}</small>
              </span>
              <span className="attention-list__meta">
                <Badge size="sm">{item.severity}</Badge>
                <small>{item.metric}</small>
              </span>
              <ChevronRight size={16} className="attention-list__chevron" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
