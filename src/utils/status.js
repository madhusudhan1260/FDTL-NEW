// Maps the various status vocabularies used across the app to a badge tone.
const toneByStatus = {
  compliant: 'success',
  eligible: 'success',
  within: 'success',
  active: 'success',
  resolved: 'success',
  completed: 'success',
  scheduled: 'info',
  adequate: 'success',
  'within limits': 'success',
  warning: 'warning',
  approaching: 'warning',
  'approaching limit': 'warning',
  medium: 'warning',
  maintenance: 'warning',
  acknowledged: 'info',
  'on hold': 'warning',
  violation: 'danger',
  'limit exceeded': 'danger',
  insufficient: 'danger',
  high: 'danger',
  open: 'danger',
  aog: 'danger',
  cancelled: 'neutral',
  low: 'info',
  draft: 'neutral',
  inactive: 'neutral',
  'on rest': 'info',
};

export function statusTone(status) {
  return toneByStatus[String(status).toLowerCase()] ?? 'neutral';
}

export const calendarStatusTone = { within: 'success', approaching: 'warning', violation: 'danger' };
