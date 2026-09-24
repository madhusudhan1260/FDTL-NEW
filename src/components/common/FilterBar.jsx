/** Horizontal row of filter controls that wraps on narrow screens. */
export default function FilterBar({ children, actions }) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__fields">{children}</div>
      {actions && <div className="filter-bar__actions">{actions}</div>}
    </div>
  );
}
