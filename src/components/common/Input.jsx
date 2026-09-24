export default function Input({ label, id, icon: Icon, error, hint, className = '', ...rest }) {
  const inputId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && <label htmlFor={inputId} className="field__label">{label}</label>}
      <div className={`field__control ${Icon ? 'has-icon' : ''} ${error ? 'has-error' : ''}`}>
        {Icon && <Icon size={16} className="field__icon" />}
        <input id={inputId} className="input" {...rest} />
      </div>
      {error ? <p className="field__error">{error}</p> : hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}
