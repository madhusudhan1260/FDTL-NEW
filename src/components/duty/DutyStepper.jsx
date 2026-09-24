import { Check } from 'lucide-react';

export default function DutyStepper({ steps, current, onStepClick }) {
  return (
    <ol className="stepper">
      {steps.map((step, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'upcoming';
        const clickable = index < current && onStepClick;
        return (
          <li key={step} className={`stepper__step is-${state}`}>
            <button type="button" className="stepper__button" disabled={!clickable} onClick={() => clickable && onStepClick(index)}>
              <span className="stepper__circle">{state === 'done' ? <Check size={16} /> : index + 1}</span>
              <span className="stepper__text">
                <small>Step {index + 1}</small>
                <strong>{step}</strong>
              </span>
            </button>
            {index < steps.length - 1 && <span className="stepper__line" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
