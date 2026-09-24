import { statusTone } from '../../utils/status';

/** Status pill. Tone is derived from the label unless given explicitly. */
export default function Badge({ children, tone, dot = true, size = 'md' }) {
  const resolvedTone = tone ?? statusTone(children);
  return (
    <span className={`badge badge--${resolvedTone} badge--${size}`}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
