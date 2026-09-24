export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => {
        const key = tab.key ?? tab;
        const label = tab.label ?? tab;
        return (
          <button key={key} type="button" role="tab" aria-selected={active === key} className={`tabs__tab ${active === key ? 'is-active' : ''}`} onClick={() => onChange(key)}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
