import { Loader2 } from 'lucide-react';

/**
 * variant: primary | secondary | ghost | danger | success
 * size: sm | md | lg
 */
export default function Button({ variant = 'primary', size = 'md', icon: Icon, loading = false, block = false, className = '', children, disabled, type = 'button', ...rest }) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, block && 'btn--block', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {loading ? <Loader2 size={16} className="spin" /> : Icon && <Icon size={16} />}
      {children && <span>{children}</span>}
    </button>
  );
}
