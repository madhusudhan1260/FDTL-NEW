import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { airportOptions } from '../../services/flightService';
import { flightPlanStatuses } from '../../data/flightData';
import { durationBetween, formatDuration } from '../../utils/time';

const emptyFlight = { callSign: '', date: '2026-09-22', from: 'BLR', to: 'GOI', aircraft: 'VT-ABC', etd: '07:30', eta: '09:15', report: '06:30', captainId: '', coPilotId: '', planStatus: 'Draft' };

export default function FlightFormModal({ open, flight, aircraft = [], crew = [], onClose, onSave, saving }) {
  const [form, setForm] = useState(flight ?? emptyFlight);
  const [error, setError] = useState('');

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.callSign.trim()) return setError('Call sign is required.');
    if (form.from === form.to) return setError('Origin and destination must be different.');
    setError('');
    return onSave(form);
  };

  const crewOptions = crew.map((member) => ({ value: member.id, label: member.name }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={flight ? `Edit ${flight.flightNumber}` : 'Create Flight'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="flight-form" loading={saving}>{flight ? 'Save Changes' : 'Create Flight'}</Button>
        </>
      }
    >
      <form id="flight-form" className="form-grid" onSubmit={handleSubmit} noValidate>
        <Input label="Call Sign *" name="callSign" value={form.callSign} onChange={update('callSign')} placeholder="MDY120" />
        <Input label="Date" name="date" type="date" value={form.date} onChange={update('date')} />
        <Select label="From" name="from" value={form.from} onChange={update('from')} options={airportOptions} />
        <Select label="To" name="to" value={form.to} onChange={update('to')} options={airportOptions} />
        <Select label="Aircraft" name="aircraft" value={form.aircraft} onChange={update('aircraft')} options={aircraft.map((item) => ({ value: item.registration, label: `${item.registration} · ${item.type}` }))} />
        <Select label="Plan Status" name="planStatus" value={form.planStatus} onChange={update('planStatus')} options={flightPlanStatuses} />
        <Input label="ETD" name="etd" type="time" value={form.etd} onChange={update('etd')} />
        <Input label="ETA" name="eta" type="time" value={form.eta} onChange={update('eta')} hint={`Flight time ${formatDuration(durationBetween(form.etd, form.eta))}`} />
        <Select label="Captain" name="captainId" value={form.captainId} onChange={update('captainId')} placeholder="Unassigned" options={crewOptions} />
        <Select label="Co-Pilot" name="coPilotId" value={form.coPilotId} onChange={update('coPilotId')} placeholder="Unassigned" options={crewOptions} />
        {error && <p className="field__error form-grid__full">{error}</p>}
      </form>
    </Modal>
  );
}
