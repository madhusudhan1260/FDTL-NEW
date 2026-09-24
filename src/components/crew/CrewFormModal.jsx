import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { licenceTypes, crewRanks, crewStatuses } from '../../data/crewData';

const aircraftTypeOptions = ['B200', 'C208', 'AW139', 'B412'];

const emptyCrew = { name: '', rank: 'Captain', employeeId: '', licenceNumber: '', licenceType: 'CPL', licenceExpiry: '', authorizedAircraft: [], base: 'BLR', email: '', status: 'Compliant' };

/** Add / edit crew. Pass `crew` to edit, omit to create. */
export default function CrewFormModal({ open, crew, onClose, onSave, saving }) {
  const [form, setForm] = useState(crew ?? emptyCrew);
  const [errors, setErrors] = useState({});

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const toggleAircraft = (code) =>
    setForm((current) => ({
      ...current,
      authorizedAircraft: current.authorizedAircraft.includes(code)
        ? current.authorizedAircraft.filter((item) => item !== code)
        : [...current.authorizedAircraft, code],
    }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!form.licenceNumber.trim()) nextErrors.licenceNumber = 'Licence number is required.';
    if (form.authorizedAircraft.length === 0) nextErrors.authorizedAircraft = 'Select at least one aircraft type.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSave(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={crew ? `Edit ${crew.name}` : 'Add Crew Member'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="crew-form" loading={saving}>{crew ? 'Save Changes' : 'Add Crew'}</Button>
        </>
      }
    >
      <form id="crew-form" className="form-grid" onSubmit={handleSubmit} noValidate>
        <Input label="Full Name *" name="name" value={form.name} onChange={update('name')} error={errors.name} placeholder="Capt. First Last" />
        <Select label="Rank" name="rank" value={form.rank} onChange={update('rank')} options={crewRanks} />
        <Input label="Employee ID" name="employeeId" value={form.employeeId} onChange={update('employeeId')} placeholder="MA-P-0000" />
        <Input label="Email" name="email" type="email" value={form.email} onChange={update('email')} placeholder="name@maddyaviation.com" />
        <Input label="Licence Number *" name="licenceNumber" value={form.licenceNumber} onChange={update('licenceNumber')} error={errors.licenceNumber} placeholder="CPL-00000" />
        <Select label="Licence Type" name="licenceType" value={form.licenceType} onChange={update('licenceType')} options={licenceTypes} />
        <Input label="Licence Expiry" name="licenceExpiry" type="date" value={form.licenceExpiry} onChange={update('licenceExpiry')} />
        <Select label="Status" name="status" value={form.status} onChange={update('status')} options={crewStatuses} />
        <fieldset className="field form-grid__full">
          <legend className="field__label">Authorized Aircraft *</legend>
          <div className="chip-toggle-group">
            {aircraftTypeOptions.map((code) => (
              <label key={code} className={`chip-toggle ${form.authorizedAircraft.includes(code) ? 'is-on' : ''}`}>
                <input type="checkbox" checked={form.authorizedAircraft.includes(code)} onChange={() => toggleAircraft(code)} />
                {code}
              </label>
            ))}
          </div>
          {errors.authorizedAircraft && <p className="field__error">{errors.authorizedAircraft}</p>}
        </fieldset>
      </form>
    </Modal>
  );
}
