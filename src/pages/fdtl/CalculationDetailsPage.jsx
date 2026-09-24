import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GitCommitHorizontal } from 'lucide-react';
import { Alert, Badge, Button, Card, DetailList, ErrorState, LoadingState, PageHeader, Table, Tabs } from '../../components/common';
import Timeline from '../../components/duty/Timeline';
import { useDutyPlanner } from '../../context/DutyPlannerContext';
import { validateFDTL, RESULT } from '../../services/fdtlService';
import { getFlightById } from '../../services/flightService';
import { getCrewById } from '../../services/crewService';
import { getAuditTrail, getDutySequence } from '../../services/dutyService';
import { activeLimits, PROTOTYPE_DISCLAIMER } from '../../data/fdtlData';
import useAsync from '../../hooks/useAsync';
import { formatDate, formatDuration } from '../../utils/time';

const TABS = ['Summary', 'Timeline', 'Rule Evaluation', 'Inputs', 'Audit Trail'];
const statusLabel = { [RESULT.ELIGIBLE]: 'Compliant', [RESULT.WARNING]: 'Warning', [RESULT.VIOLATION]: 'Violation' };

const limitColumns = [
  { key: 'label', header: 'Parameter', render: (row) => <strong>{row.label}</strong> },
  { key: 'actual', header: 'Actual' },
  { key: 'limit', header: 'Limit', render: (row) => (row.isMinimum ? `${row.limit} (min)` : row.limit) },
  { key: 'remaining', header: 'Remaining', render: (row) => (row.isMinimum ? `+${row.remaining}` : row.remaining) },
  { key: 'status', header: 'Status', render: (row) => <Badge>{statusLabel[row.status]}</Badge> },
];

const ruleColumns = [
  { key: 'rule', header: 'Rule' },
  { key: 'expression', header: 'Evaluation', render: (row) => <code className="code">{row.expression}</code> },
  { key: 'message', header: 'Outcome' },
  { key: 'status', header: 'Result', render: (row) => <Badge>{statusLabel[row.status]}</Badge> },
];

const auditColumns = [
  { key: 'time', header: 'Timestamp' },
  { key: 'user', header: 'User' },
  { key: 'action', header: 'Action' },
  { key: 'source', header: 'Source' },
];

export default function CalculationDetailsPage() {
  const navigate = useNavigate();
  const { plan, updatePlan } = useDutyPlanner();
  const [tab, setTab] = useState(TABS[0]);
  const [crewIndex, setCrewIndex] = useState(0);
  const flight = useAsync(() => getFlightById(plan.flightId || 'FPL001'), [plan.flightId]);
  const audit = useAsync(getAuditTrail, []);
  const sequence = useAsync(() => getDutySequence({ date: plan.date }), [plan.date]);
  const validation = plan.validation;
  const result = validation?.crewResults[crewIndex];
  const crew = useAsync(() => (result ? getCrewById(result.crewId) : Promise.resolve(null)), [result?.crewId]);

  useEffect(() => {
    if (validation || !plan.flightId) return;
    validateFDTL({
      flightId: plan.flightId,
      date: plan.date,
      crew: [
        { crewId: plan.crew.captain, role: 'Captain' },
        { crewId: plan.crew.coPilot, role: 'Co-Pilot' },
      ],
    }).then((response) => updatePlan({ validation: response }));
  }, [validation, plan, updatePlan]);

  if (!plan.flightId) return <div className="page"><ErrorState message="No flight selected. Open the Duty Planner first." /></div>;
  if (!result || flight.loading) return <div className="page"><LoadingState message="Loading calculation…" /></div>;

  const f = flight.data;
  const ruleRows = [
    ...result.checks.map((check) => ({
      id: check.key,
      rule: check.label,
      expression: check.isMinimum ? `${check.actual} ≥ ${check.limit}` : `${check.actual} ≤ ${check.limit}`,
      message: check.message,
      status: check.status,
    })),
    ...result.otherChecks.map((check) => ({ id: check.key, rule: check.label, expression: `${f.aircraftTypeCode} ∈ authorised types`, message: check.message, status: check.status })),
  ];

  return (
    <div className="page">
      <PageHeader
        title="FDTL Calculation Details"
        subtitle={`${f.flightNumber} · ${formatDate(plan.date)} · ${validation.rulePack}`}
        breadcrumbs={['FDTL', 'Crew Readiness', 'Calculation Details']}
        actions={
          <>
            <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/fdtl/crew-readiness')}>Back to Readiness</Button>
            <Button variant="secondary" icon={GitCommitHorizontal} onClick={() => navigate('/fdtl/duty-sequence')}>Duty Sequence</Button>
          </>
        }
      />

      {validation.crewResults.length > 1 && (
        <div className="segmented" role="group" aria-label="Crew member">
          {validation.crewResults.map((item, index) => (
            <button key={item.crewId} type="button" className={index === crewIndex ? 'is-active' : ''} onClick={() => setCrewIndex(index)}>
              {item.role}: {item.name}
            </button>
          ))}
        </div>
      )}

      <Card padded={false}>
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        <div className="card__body">
          {tab === 'Summary' && (
            <div className="stack">
              <DetailList
                columns={4}
                items={[
                  { label: 'Crew', value: `${result.name} (${result.licenceNumber})` },
                  { label: 'Flight', value: `${f.flightNumber} · ${f.from} → ${f.to}` },
                  { label: 'Duty Date', value: formatDate(plan.date) },
                  { label: 'Aircraft', value: `${f.aircraft} · ${f.aircraftType}` },
                ]}
              />
              <div className="grid grid--side-main">
                <div>
                  <h3 className="section-title">Duty Summary</h3>
                  <DetailList
                    columns={1}
                    items={[
                      { label: 'Reporting Time', value: result.summary.reportingTime },
                      { label: 'Start of Duty', value: result.summary.startOfDuty },
                      { label: 'Flight Time', value: result.summary.flightTime },
                      { label: 'Duty End', value: result.summary.dutyEnd },
                      { label: 'Total Duty Period', value: result.summary.totalDutyPeriod },
                      { label: 'Rest Before Duty', value: result.summary.restBeforeDuty },
                      { label: 'Night Duty', value: result.summary.nightDuty },
                    ]}
                  />
                </div>
                <div>
                  <h3 className="section-title">FDTL Limits & Result</h3>
                  <Table columns={limitColumns} rows={result.checks} rowKey="key" compact />
                  <Alert tone={{ ELIGIBLE: 'success', WARNING: 'warning', VIOLATION: 'danger' }[result.status]} title={`Result: ${result.status}`}>
                    {result.status === RESULT.ELIGIBLE ? 'All parameters are within the configured limits.' : 'One or more parameters require attention.'}
                  </Alert>
                </div>
              </div>
            </div>
          )}

          {tab === 'Timeline' && (sequence.data ? <Timeline activities={sequence.data.activities} /> : <LoadingState />)}

          {tab === 'Rule Evaluation' && <Table columns={ruleColumns} rows={ruleRows} compact />}

          {tab === 'Inputs' && crew.data && (
            <div className="grid grid--two">
              <div>
                <h3 className="section-title">Crew Inputs</h3>
                <DetailList
                  columns={1}
                  items={[
                    { label: 'Reporting Time', value: crew.data.dutyState.reportTime },
                    { label: 'Prior Flight Time (today)', value: formatDuration(crew.data.dutyState.priorFlightMinutes) },
                    { label: '28-Day Cumulative (before flight)', value: formatDuration(crew.data.dutyState.cumulativeMinutes) },
                    { label: 'Rest Before Duty', value: formatDuration(crew.data.dutyState.restBeforeMinutes) },
                    { label: 'Authorised Aircraft', value: crew.data.authorizedAircraft.join(', ') },
                  ]}
                />
              </div>
              <div>
                <h3 className="section-title">Configured Limits</h3>
                <DetailList
                  columns={1}
                  items={[
                    { label: 'Max FDP', value: formatDuration(activeLimits.maxFdpMinutes) },
                    { label: 'Max Daily Flight Time', value: formatDuration(activeLimits.maxFlightMinutesPerDay) },
                    { label: 'Max 28-Day Cumulative', value: formatDuration(activeLimits.maxCumulativeMinutes28Days) },
                    { label: 'Min Rest', value: formatDuration(activeLimits.minRestMinutes) },
                    { label: 'WOCL Window', value: `${activeLimits.woclStart} – ${activeLimits.woclEnd}` },
                    { label: 'Warning Threshold', value: `${activeLimits.warningThreshold * 100}%` },
                  ]}
                />
              </div>
              <Alert tone="info" title="Prototype rules">{PROTOTYPE_DISCLAIMER}</Alert>
            </div>
          )}

          {tab === 'Audit Trail' && <Table columns={auditColumns} rows={audit.data} loading={audit.loading} compact />}
        </div>
      </Card>
    </div>
  );
}
