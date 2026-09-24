import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

const icons = { success: CheckCircle2, warning: AlertTriangle, danger: XCircle, info: Info };

/** Inline banner. tone: success | warning | danger | info */
export default function Alert({ tone = 'info', title, children, action }) {
  const Icon = icons[tone];
  return (
    <div className={`alert alert--${tone}`} role={tone === 'danger' ? 'alert' : 'status'}>
      <Icon size={20} className="alert__icon" />
      <div className="alert__content">
        {title && <p className="alert__title">{title}</p>}
        {children && <div className="alert__text">{children}</div>}
      </div>
      {action && <div className="alert__action">{action}</div>}
    </div>
  );
}
