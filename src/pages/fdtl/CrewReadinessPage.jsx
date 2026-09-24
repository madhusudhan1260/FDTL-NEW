import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Users, CheckCircle2, FileSearch, GitCommitHorizontal, RotateCcw } from 'lucide-react';
import { Alert, Button, Card, ErrorState, LoadingState, Modal, PageHeader } from '../../components/common';
import FDTLResultCard from '../../components/duty/FDTLResultCard';
import { useDutyPlanner } from '../../context/DutyPlannerContext';
import { useToast } from '../../context/ToastContext';
import { validateFDTL } from '../../services/fdtlService';
import { getFlightById } from '../../services/flightService';
import useAsync from '../../hooks/useAsync';
import { formatDate } from '../../utils/time';

const toneByResult = { ELIGIBLE: 'success', WARNING: 'warning', VIOLATION: 'danger' };

export default function CrewReadinessPage() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { plan, updatePlan } = useDutyPlanner();
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const flight = useAsync(() => getFlightById(plan.flightId), [plan.flightId]);
  const validation = plan.validation;

  // Opening this page directly runs validation for the current plan.
  useEffect(() => {
    if (validation || !plan.flightId) return;
    validateFDTL({
      flightId: plan.flightId,
      date: plan.date,
      crew: [
        { crewId: plan.crew.captain, role: 'Captain' },
        { crewId: plan.crew.coPilot, role: 'Co-Pilot' },
        { crewId: plan.crew.additional, role: 'Additional Crew' },
      ],
    })
      .then((result) => updatePlan({ validation: result }))
      .catch(setError);
  }, [validation, plan, updatePlan]);

  const handleAssign = async () => {
    setAssigning(true);
    // Simulated POST /api/duties/ — replace with dutyService.assignCrew later.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setAssigning(false);
    setConfirmOpen(false);
    updatePlan({ assigned: true });
    notify(`Crew assigned to ${plan.flightId}.`);
  };

  if (!plan.flightId) {
    return (
      <div className="page">
        <PageHeader title="Crew Readiness" breadcrumbs={['FDTL', 'Crew Readiness']} />
        <Alert tone="info" title="No flight selected" action={<Button onClick={() => navigate('/fdtl/duty-planner')}>Open Duty Planner</Button>}>
          Select a flight and crew in the Duty Planner to check readiness.
        </Alert>
      </div>
    );
  }

  if (error) return <div className="page"><ErrorState message={error.message} /></div>;
  if (!validation || flight.loading) return <div className="page"><LoadingState message="Running FDTL validation…" /></div>;

  const f = flight.data;
  const overallTone = toneByResult[validation.overall];

  return (
    <div className="page">
      <PageHeader
        title="Crew Readiness"
        subtitle={`Validated against ${validation.rulePack}`}
        breadcrumbs={['FDTL', 'Duty Planner', 'Crew Readiness']}
        actions={
          <>
            <Button variant="secondary" icon={FileSearch} onClick={() => navigate('/fdtl/calculation-details')}>Calculation Details</Button>
            <Button variant="secondary" icon={GitCommitHorizontal} onClick={() => navigate('/fdtl/duty-sequence')}>Duty Sequence</Button>
          </>
        }
      />

      <Card>
        <div className="flight-strip">
          <span className="flight-strip__icon"><Plane size={22} /></span>
          <div className="flight-strip__item"><small>Flight</small><strong>{f.flightNumber}</strong></div>
          <div className="flight-strip__item"><small>Route</small><strong>{f.from} → {f.to}</strong></div>
          <div className="flight-strip__item"><small>Aircraft</small><strong>{f.aircraft}</strong></div>
          <div className="flight-strip__item"><small>Schedule</small><strong>{f.etd} → {f.eta}</strong></div>
          <div className="flight-strip__item"><small>Flight Time</small><strong>{f.flightTime}</strong></div>
        </div>
      </Card>

      <div className="result-grid">
        {validation.crewResults.map((result) => (
          <FDTLResultCard key={result.crewId} result={result} />
        ))}
      </div>

      <Card title="Overall Result">
        {plan.assigned ? (
          <Alert tone="success" title="Crew assignment confirmed.">
            {validation.crewResults.map((result) => result.name).join(' and ')} assigned to {f.flightNumber}.
          </Alert>
        ) : (
          <Alert tone={overallTone} title={validation.message.title}>{validation.message.detail}</Alert>
        )}
        <div className="step-actions">
          <Button variant="secondary" icon={Users} onClick={() => navigate('/fdtl/duty-planner', { state: { step: 2 } })}>
            Change Crew
          </Button>
          {plan.assigned ? (
            <Button variant="secondary" icon={RotateCcw} onClick={() => { updatePlan({ validation: null, assigned: false }); navigate('/fdtl/duty-planner'); }}>
              Plan Another Duty
            </Button>
          ) : (
            <Button icon={CheckCircle2} disabled={validation.overall === 'VIOLATION'} onClick={() => setConfirmOpen(true)}>
              Proceed to Assign
            </Button>
          )}
        </div>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Crew Assignment"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button loading={assigning} onClick={handleAssign}>Confirm Assignment</Button>
          </>
        }
      >
        <p className="drawer-text">
          Assign {validation.crewResults.map((result) => result.name).join(', ')} to <strong>{f.flightNumber}</strong> ({f.from} → {f.to}) on {formatDate(f.date)}?
        </p>
        {validation.overall === 'WARNING' && (
          <Alert tone="warning" title="Warning: crew approaching limits">This assignment will be recorded with an FDTL warning.</Alert>
        )}
      </Modal>
    </div>
  );
}
