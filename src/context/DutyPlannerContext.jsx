import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Holds the in-progress duty assignment so Duty Planner, Crew Readiness,
 * Calculation Details and Duty Sequence all share the same selection.
 */
const DutyPlannerContext = createContext(null);

const initialState = {
  date: '2026-09-22',
  flightId: 'FPL001',
  crew: { captain: 'CRW001', coPilot: 'CRW002', additional: '' },
  validation: null,
  assigned: false,
};

export function DutyPlannerProvider({ children }) {
  const [plan, setPlan] = useState(initialState);

  const updatePlan = useCallback((changes) => {
    // Changing the date, flight or crew invalidates any previous validation.
    const selectionChanged = ['date', 'flightId', 'crew'].some((key) => key in changes);
    const reset = selectionChanged && !('validation' in changes) ? { validation: null, assigned: false } : {};
    setPlan((current) => ({ ...current, ...reset, ...changes }));
  }, []);
  const resetPlan = useCallback(() => setPlan(initialState), []);

  const value = useMemo(() => ({ plan, updatePlan, resetPlan }), [plan, updatePlan, resetPlan]);
  return <DutyPlannerContext.Provider value={value}>{children}</DutyPlannerContext.Provider>;
}

export function useDutyPlanner() {
  const context = useContext(DutyPlannerContext);
  if (!context) throw new Error('useDutyPlanner must be used inside DutyPlannerProvider');
  return context;
}
