import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading…' }) {
  return (
    <div className="state-block" role="status">
      <Loader2 size={28} className="spin state-block__icon state-block__icon--primary" />
      <p className="state-block__message">{message}</p>
    </div>
  );
}
