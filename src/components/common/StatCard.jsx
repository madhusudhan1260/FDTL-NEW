/** KPI tile. tone: success | warning | danger | info */
export default function StatCard({ label, value, icon: Icon, tone = 'info', hint, onClick }) {
  const Element = onClick ? 'button' : 'div';
  return (
    <Element type={onClick ? 'button' : undefined} className={`stat-card stat-card--${tone}`} onClick={onClick}>
      {Icon && (
        <span className="stat-card__icon">
          <Icon size={22} />
        </span>
      )}
      <div>
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__label">{label}</p>
        {hint && <p className="stat-card__hint">{hint}</p>}
      </div>
    </Element>
  );
}
