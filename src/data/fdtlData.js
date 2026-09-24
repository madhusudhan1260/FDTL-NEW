// Mock FDTL rule configuration.
//
// IMPORTANT: every number in this file is a PROTOTYPE PLACEHOLDER chosen to
// exercise the UI. They are NOT the official DGCA / regulatory FDTL limits.
// The real, approved limits will be served by the backend rule engine.

export const PROTOTYPE_DISCLAIMER =
  'Prototype values for demonstration only. These are not official regulatory FDTL limits.';

/** Limits used by the mock validation engine (minutes). */
export const activeLimits = {
  maxFdpMinutes: 9 * 60,
  maxFlightMinutesPerDay: 8 * 60,
  maxCumulativeMinutes28Days: 88 * 60,
  minRestMinutes: 10 * 60,
  maxNightDutyMinutes: 3 * 60,
  // Window of circadian low used by the mock engine
  woclStart: '02:00',
  woclEnd: '05:00',
  // Crew are released this long after on-blocks
  postFlightMinutes: 30,
  // Utilisation above this ratio is flagged as "approaching limit"
  warningThreshold: 0.85,
};

export const rulePacks = [
  { id: 'RP-003', name: 'NSOP India', version: '2025.01', effectiveFrom: '2026-01-01', approvedBy: 'Chief Pilot', status: 'Active', rules: 42, lastModified: '2025-12-18' },
  { id: 'RP-002', name: 'NSOP India', version: '2024.02', effectiveFrom: '2025-01-01', approvedBy: 'Chief Pilot', status: 'Inactive', rules: 40, lastModified: '2024-12-11' },
  { id: 'RP-004', name: 'Internal Training', version: '1.0', effectiveFrom: '—', approvedBy: '—', status: 'Draft', rules: 18, lastModified: '2026-09-10' },
];

export const fdpLimitTable = [
  { reportingWindow: '06:00 – 07:59', oneTwoSectors: '09:00', threeSectors: '08:30', fourSectors: '08:00', fivePlusSectors: '07:30' },
  { reportingWindow: '08:00 – 12:59', oneTwoSectors: '09:30', threeSectors: '09:00', fourSectors: '08:30', fivePlusSectors: '08:00' },
  { reportingWindow: '13:00 – 17:59', oneTwoSectors: '09:00', threeSectors: '08:30', fourSectors: '08:00', fivePlusSectors: '07:30' },
  { reportingWindow: '18:00 – 21:59', oneTwoSectors: '08:30', threeSectors: '08:00', fourSectors: '07:30', fivePlusSectors: '07:00' },
  { reportingWindow: '22:00 – 05:59', oneTwoSectors: '08:00', threeSectors: '07:30', fourSectors: '07:00', fivePlusSectors: '06:30' },
];

export const flightTimeLimits = [
  { period: 'Single day', crew: 'Single pilot', limit: '07:00' },
  { period: 'Single day', crew: 'Two pilots', limit: '08:00' },
  { period: '7 consecutive days', crew: 'All', limit: '30:00' },
  { period: '28 consecutive days', crew: 'All', limit: '88:00' },
  { period: '365 consecutive days', crew: 'All', limit: '900:00' },
];

export const restRules = [
  { rule: 'Minimum rest before FDP', value: '10:00', note: 'Or duration of preceding duty, whichever is greater' },
  { rule: 'Minimum weekly rest', value: '36:00', note: 'Including two local nights' },
  { rule: 'Rest away from base', value: '10:00', note: 'Including 8h sleep opportunity' },
  { rule: 'Split duty rest (min)', value: '03:00', note: 'Suitable accommodation required' },
];

export const nightRules = [
  { rule: 'WOCL window', value: '02:00 – 05:00', note: 'Prototype window' },
  { rule: 'Max night duty per FDP', value: '03:00', note: 'Duty overlapping WOCL' },
  { rule: 'Consecutive night duties', value: '2', note: 'Followed by 36h rest' },
  { rule: 'FDP reduction when encroaching WOCL', value: '50%', note: 'Of encroachment, up to 2h' },
];

export const cumulativeRules = [
  { window: '7 days', dutyLimit: '60:00', flightLimit: '30:00' },
  { window: '14 days', dutyLimit: '110:00', flightLimit: '55:00' },
  { window: '28 days', dutyLimit: '190:00', flightLimit: '88:00' },
  { window: '365 days', dutyLimit: '1800:00', flightLimit: '900:00' },
];

export const extensionRules = [
  { rule: 'Commander discretion (max)', value: '01:00', approval: 'Commander + report within 24h' },
  { rule: 'Extensions per 7 days', value: '2', approval: 'Operations Manager' },
  { rule: 'Extension with in-flight rest', value: '02:00', approval: 'Chief Pilot' },
];

export const dashboardSummary = {
  compliant: 18,
  approaching: 4,
  violations: 2,
  onRest: 9,
};

export const complianceTrend = [
  { day: '16 Sep', compliant: 21, approaching: 3, violation: 1 },
  { day: '17 Sep', compliant: 20, approaching: 4, violation: 0 },
  { day: '18 Sep', compliant: 19, approaching: 3, violation: 2 },
  { day: '19 Sep', compliant: 22, approaching: 2, violation: 0 },
  { day: '20 Sep', compliant: 20, approaching: 3, violation: 1 },
  { day: '21 Sep', compliant: 19, approaching: 4, violation: 1 },
  { day: '22 Sep', compliant: 18, approaching: 4, violation: 2 },
];

export const notifications = [
  { id: 'N1', type: 'violation', title: 'FDP limit exceeded', detail: 'Capt. Pranav TP · FPL003', time: '10 min ago' },
  { id: 'N2', type: 'warning', title: 'Approaching cumulative limit', detail: 'Capt. Arun S · 78:15 / 88:00', time: '42 min ago' },
  { id: 'N3', type: 'info', title: 'Rule pack NSOP India 2025.01 active', detail: 'Approved by Chief Pilot', time: 'Yesterday' },
];
