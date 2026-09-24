/**
 * options: array of strings or { value, label }.
 * placeholder renders an empty first option (e.g. "All statuses").
 */
export default function Select({ label, id, options = [], placeholder, className = '', ...rest }) {
  const selectId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={selectId} className="field__label">{label}</label>}
      <div className="field__control">
        <select id={selectId} className="input select" {...rest}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => {
            const value = typeof option === 'string' ? option : option.value;
            const text = typeof option === 'string' ? option : option.label;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
