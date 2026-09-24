import { AlertOctagon, RotateCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="state-block state-block--error" role="alert">
      <AlertOctagon size={32} className="state-block__icon" />
      <p className="state-block__title">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RotateCw} onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
