/** Label/value grid used in drawers and summary cards. items: [{ label, value }] */
export default function DetailList({ items, columns = 2 }) {
  return (
    <dl className={`detail-list detail-list--cols-${columns}`}>
      {items.map((item) => (
        <div key={item.label} className="detail-list__item">
          <dt>{item.label}</dt>
          <dd>{item.value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}
