import Select from '../common/Select';
import Badge from '../common/Badge';

const roles = [
  { key: 'captain', label: 'Captain', required: true },
  { key: 'coPilot', label: 'Co-Pilot', required: true },
  { key: 'additional', label: 'Additional Crew', required: false },
];

/** Picks crew per role; a crew member can only hold one role. */
export default function CrewSelector({ crew = [], selection, onChange, aircraftTypeCode }) {
  const takenIds = Object.values(selection).filter(Boolean);

  return (
    <div className="crew-selector">
      {roles.map((role) => {
        const options = crew
          .filter((member) => member.id === selection[role.key] || !takenIds.includes(member.id))
          .map((member) => ({
            value: member.id,
            label: `${member.name} · ${member.licenceNumber}${member.authorizedAircraft.includes(aircraftTypeCode) ? '' : ' (not type-rated)'}`,
          }));
        const selected = crew.find((member) => member.id === selection[role.key]);
        return (
          <div key={role.key} className="crew-selector__row">
            <Select
              label={`${role.label}${role.required ? ' *' : ' (optional)'}`}
              name={role.key}
              value={selection[role.key]}
              placeholder={role.required ? 'Select crew member' : 'None'}
              options={options}
              onChange={(event) => onChange({ ...selection, [role.key]: event.target.value })}
            />
            {selected && (
              <div className="crew-selector__info">
                <span>{selected.licenceType} · {selected.authorizedAircraft.join(', ')}</span>
                <Badge size="sm">{selected.status}</Badge>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
