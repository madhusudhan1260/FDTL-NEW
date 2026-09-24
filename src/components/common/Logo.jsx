/** MADDY AVIATION placeholder mark: stylised wing + horizon. */
export default function Logo({ size = 36, showText = true, inverted = true, subtitle }) {
  return (
    <div className={`logo ${inverted ? 'logo--inverted' : ''}`}>
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="11" fill="#1476D4" />
        <path d="M9 30 L24 11 L39 30 L31 30 L24 21 L17 30 Z" fill="#FFFFFF" />
        <path d="M13 36 H35" stroke="#9FD0FF" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {showText && (
        <div className="logo__text">
          <span className="logo__name">MADDY AVIATION</span>
          {subtitle && <span className="logo__subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
