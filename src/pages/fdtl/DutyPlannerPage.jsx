import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, CalendarDays, Plane, Users } from 'lucide-react';
import { Alert, Button, Card, DatePicker, DetailList, ErrorState, LoadingState, PageHeader } from '../../components/common';
import DutyStepper from '../../components/duty/DutyStepper';
import FlightSelector from '../../components/duty/FlightSelector';
import CrewSelector from '../../components/duty/CrewSelector';
import useAsync from '../../hooks/useAsync';
import { getFlights } from '../../services/flightService';
import { getCrew } from '../../services/crewService';
import { validateFDTL } from '../../services/fdtlService';
import { useDutyPlanner } from '../../context/DutyPlannerContext';
import { formatDate, formatDateDMY } from '../../utils/time';

const STEPS = ['Select Date', 'Select Flight', 'Select Crew', 'Review & Assign'];

export default function DutyPlannerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, updatePlan } = useDutyPlanner();
  const [step, setStep] = useState(location.state?.step ?? 0);
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  const flights = useAsync(() => getFlights({ date: plan.date }), [plan.date]);
  const crew = useAsync(() => getCrew(), []);

  const selectedFlight = flights.data?.find((flight) => flight.id === plan.flightId);
  const crewName = (id) => crew.data?.find((member) => member.id === id)?.name;

  // Clear the flight when the date changes to one without it.
  useEffect(() => {
    if (flights.data && plan.flightId && !flights.data.some((flight) => flight.id === plan.flightId)) {
      updatePlan({ flightId: '' });
    }
  }, [flights.data, plan.flightId, updatePlan]);

  const canContinue = [
    Boolean(plan.date),
    Boolean(selectedFlight),
    Boolean(plan.crew.captain && plan.crew.coPilot),
    true,
  ][step];

  const handleValidate = async () => {
    setValidating(true);
    setValidationError('');
    try {
      const result = await validateFDTL({
        flightId: plan.flightId,
        date: plan.date,
        crew: [
          { crewId: plan.crew.captain, role: 'Captain' },
          { crewId: plan.crew.coPilot, role: 'Co-Pilot' },
          { crewId: plan.crew.additional, role: 'Additional Crew' },
        ],
      });
      updatePlan({ validation: result, assigned: false });
      navigate('/fdtl/crew-readiness');
    } catch (error) {
      setValidationError(error.message);
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="page">
      <PageHeader title="Duty Planner" subtitle="Plan crew duty and validate FDTL before assignment" breadcrumbs={['FDTL', 'Duty Planner']} />

      <Card>
        <DutyStepper steps={STEPS} current={step} onStepClick={setStep} />
      </Card>

      <div className="grid grid--main-side">
        <Card
          title={STEPS[step]}
          subtitle={['Choose the duty date', 'Choose the flight to crew', 'Assign flight crew', 'Confirm details and run FDTL validation'][step]}
        >
          {step === 0 && (
            <div className="step-body">
              <DatePicker label="Duty Date" name="dutyDate" value={plan.date} onChange={(event) => updatePlan({ date: event.target.value })} />
              <p className="muted">Selected: {formatDateDMY(plan.date)} · {flights.data?.length ?? '–'} flight(s) planned</p>
            </div>
          )}

          {step === 1 &&
            (flights.loading ? <LoadingState message="Loading flights…" /> : flights.error ? <ErrorState message="Unable to load flight data." onRetry={flights.reload} /> : (
              <FlightSelector flights={flights.data} selectedId={plan.flightId} onSelect={(flightId) => updatePlan({ flightId })} />
            ))}

          {step === 2 &&
            (crew.loading ? <LoadingState message="Loading crew…" /> : crew.error ? <ErrorState message="Unable to load crew data." onRetry={crew.reload} /> : (
              <CrewSelector crew={crew.data} selection={plan.crew} aircraftTypeCode={selectedFlight?.aircraftTypeCode} onChange={(selection) => updatePlan({ crew: selection })} />
            ))}

          {step === 3 && selectedFlight && (
            <div className="step-body">
              <DetailList
                items={[
                  { label: 'Date', value: formatDateDMY(plan.date) },
                  { label: 'Flight', value: selectedFlight.flightNumber },
                  { label: 'Route', value: `${selectedFlight.fromName} (${selectedFlight.from}) → ${selectedFlight.toName} (${selectedFlight.to})` },
                  { label: 'Aircraft', value: selectedFlight.aircraft },
                  { label: 'ETD', value: selectedFlight.etd },
                  { label: 'ETA', value: selectedFlight.eta },
                  { label: 'Flight Time', value: selectedFlight.flightTime },
                  { label: 'Captain', value: crewName(plan.crew.captain) },
                  { label: 'Co-Pilot', value: crewName(plan.crew.coPilot) },
                  { label: 'Additional Crew', value: crewName(plan.crew.additional) ?? 'None' },
                ]}
              />
              {validationError && <Alert tone="danger" title="Validation failed">{validationError}</Alert>}
            </div>
          )}

          <div className="step-actions">
            <Button variant="secondary" icon={ArrowLeft} disabled={step === 0} onClick={() => setStep((current) => current - 1)}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button disabled={!canContinue} onClick={() => setStep((current) => current + 1)}>
                Continue <ArrowRight size={16} />
              </Button>
            ) : (
              <Button icon={ShieldCheck} loading={validating} onClick={handleValidate}>
                {validating ? 'Validating…' : 'Validate FDTL'}
              </Button>
            )}
          </div>
        </Card>

        <Card title="Duty Summary">
          <ul className="summary-list">
            <li>
              <CalendarDays size={18} />
              <span><small>Date</small><strong>{plan.date ? formatDate(plan.date) : 'Not selected'}</strong></span>
            </li>
            <li>
              <Plane size={18} />
              <span>
                <small>Flight</small>
                <strong>{selectedFlight ? `${selectedFlight.flightNumber} · ${selectedFlight.route}` : 'Not selected'}</strong>
                {selectedFlight && <small>{selectedFlight.aircraft} · {selectedFlight.etd} → {selectedFlight.eta} · {selectedFlight.flightTime}</small>}
              </span>
            </li>
            <li>
              <Users size={18} />
              <span>
                <small>Crew</small>
                <strong>{crewName(plan.crew.captain) ?? 'Captain not selected'}</strong>
                <strong>{crewName(plan.crew.coPilot) ?? 'Co-pilot not selected'}</strong>
                {plan.crew.additional && <strong>{crewName(plan.crew.additional)}</strong>}
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
