import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data', message = 'Try adjusting your filters.', icon: Icon = Inbox, action }) {
  return (
    <div className="state-block">
      <Icon size={32} className="state-block__icon" />
      <p className="state-block__title">{title}</p>
      {message && <p className="state-block__message">{message}</p>}
      {action}
    </div>
  );
}
