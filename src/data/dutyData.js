// Mock duty records & duty sequences. Mirrors GET /api/duties/.

export const dutyRecords = [
  { id: 'DR001', date: '2026-09-22', crewId: 'CRW001', crew: 'Capt. Raj Kumar', flight: 'FPL001', reportTime: '06:30', releaseTime: '12:00', fdp: '05:30', flightTime: '03:15', status: 'Compliant' },
  { id: 'DR002', date: '2026-09-22', crewId: 'CRW002', crew: 'Capt. Arun S', flight: 'FPL002', reportTime: '08:00', releaseTime: '15:20', fdp: '07:20', flightTime: '04:10', status: 'Warning' },
  { id: 'DR003', date: '2026-09-22', crewId: 'CRW003', crew: 'Capt. Pranav TP', flight: 'FPL003', reportTime: '00:30', releaseTime: '11:35', fdp: '11:05', flightTime: '05:25', status: 'Violation' },
  { id: 'DR004', date: '2026-09-21', crewId: 'CRW002', crew: 'Capt. Arun S', flight: 'FPL011', reportTime: '05:45', releaseTime: '10:50', fdp: '05:05', flightTime: '02:40', status: 'Compliant' },
  { id: 'DR005', date: '2026-09-21', crewId: 'CRW008', crew: 'F/O Suresh M', flight: 'FPL012', reportTime: '05:45', releaseTime: '10:50', fdp: '05:05', flightTime: '02:40', status: 'Compliant' },
  { id: 'DR006', date: '2026-09-20', crewId: 'CRW004', crew: 'Capt. Vikram R', flight: 'FPL021', reportTime: '07:00', releaseTime: '14:30', fdp: '07:30', flightTime: '04:35', status: 'Compliant' },
  { id: 'DR007', date: '2026-09-19', crewId: 'CRW005', crew: 'F/O Neha S', flight: 'FPL018', reportTime: '06:00', releaseTime: '13:45', fdp: '07:45', flightTime: '05:05', status: 'Warning' },
  { id: 'DR008', date: '2026-09-18', crewId: 'CRW004', crew: 'Capt. Vikram R', flight: 'FPL009', reportTime: '05:30', releaseTime: '13:10', fdp: '07:40', flightTime: '04:50', status: 'Violation' },
  { id: 'DR009', date: '2026-09-18', crewId: 'CRW001', crew: 'Capt. Raj Kumar', flight: 'FPL014', reportTime: '06:30', releaseTime: '12:40', fdp: '06:10', flightTime: '03:45', status: 'Compliant' },
  { id: 'DR010', date: '2026-09-17', crewId: 'CRW007', crew: 'Capt. Anita K', flight: 'FPL013', reportTime: '08:00', releaseTime: '14:15', fdp: '06:15', flightTime: '03:20', status: 'Compliant' },
  { id: 'DR011', date: '2026-09-16', crewId: 'CRW010', crew: 'Capt. Rohit G', flight: 'FPL011', reportTime: '07:15', releaseTime: '13:00', fdp: '05:45', flightTime: '03:30', status: 'Compliant' },
  { id: 'DR012', date: '2026-09-15', crewId: 'CRW005', crew: 'F/O Neha S', flight: 'FPL007', reportTime: '01:30', releaseTime: '08:40', fdp: '07:10', flightTime: '04:00', status: 'Violation' },
  { id: 'DR013', date: '2026-09-14', crewId: 'CRW008', crew: 'F/O Suresh M', flight: 'FPL006', reportTime: '06:00', releaseTime: '12:30', fdp: '06:30', flightTime: '03:50', status: 'Compliant' },
  { id: 'DR014', date: '2026-09-12', crewId: 'CRW009', crew: 'F/O Deepa V', flight: 'FPL004', reportTime: '09:00', releaseTime: '15:10', fdp: '06:10', flightTime: '03:40', status: 'Compliant' },
];

export const crewAttention = [
  { id: 'CRW003', name: 'Capt. Pranav TP', issue: 'FDP limit exceeded on FPL003', metric: 'FDP 11:05 / 09:00', severity: 'Violation' },
  { id: 'CRW002', name: 'Capt. Arun S', issue: 'Approaching 28-day cumulative limit', metric: '78:15 / 88:00', severity: 'Warning' },
  { id: 'CRW008', name: 'F/O Suresh M', issue: 'Rest period close to minimum', metric: 'Rest 10:40 / 10:00', severity: 'Warning' },
  { id: 'CRW005', name: 'F/O Neha S', issue: 'Night duty approaching WOCL limit', metric: 'Night 02:40 / 03:00', severity: 'Warning' },
];

export const upcomingDuties = [
  { id: 'UD1', date: '2026-09-23', crew: 'Capt. Vikram R', flight: 'FPL007', route: 'BLR → IXE', report: '06:00' },
  { id: 'UD2', date: '2026-09-23', crew: 'Capt. Raj Kumar', flight: 'FPL008', route: 'BLR → BOM', report: '08:10' },
  { id: 'UD3', date: '2026-09-23', crew: 'Capt. Rohit G', flight: 'FPL009', route: 'BLR → TRV', report: '11:30' },
  { id: 'UD4', date: '2026-09-24', crew: 'Capt. Vikram R', flight: 'FPL010', route: 'BLR → GOI', report: '06:30' },
];

/**
 * Duty sequence template for a crew duty day. The service fills
 * in crew/flight context; activities are in chronological order.
 */
export const dutySequenceTemplate = {
  crewId: 'CRW001',
  date: '2026-09-22',
  activities: [
    { type: 'rest', label: 'Rest', from: '20:45', to: '06:30', details: 'Rest at home base (BLR) · 09:45' },
    { type: 'reporting', label: 'Reporting', from: '06:30', to: '07:30', details: 'Briefing, flight planning & pre-flight checks' },
    { type: 'flight', label: 'Flight 1', route: 'BLR → GOI', flight: 'FPL001', from: '07:30', to: '09:15', details: 'VT-ABC · KING AIR B200' },
    { type: 'turnaround', label: 'Turnaround', from: '09:15', to: '10:00', details: 'Refuel & passenger handling at GOI' },
    { type: 'flight', label: 'Flight 2', route: 'GOI → BLR', flight: 'FPL004', from: '10:00', to: '11:30', details: 'VT-ABC · KING AIR B200' },
    { type: 'release', label: 'Release', from: '11:30', to: '12:00', details: 'Post-flight duties & debrief' },
    { type: 'rest', label: 'Rest', from: '12:00', to: '06:00', details: 'Rest before next duty · 18:00' },
  ],
};

export const auditTrail = [
  { id: 'AUD1', time: '22 Sep 2026 05:12', user: 'Pranav TP', action: 'Duty plan created for FPL001', source: 'Duty Planner' },
  { id: 'AUD2', time: '22 Sep 2026 05:14', user: 'System', action: 'FDTL validation run (NSOP India 2025.01)', source: 'FDTL Engine' },
  { id: 'AUD3', time: '22 Sep 2026 05:14', user: 'System', action: 'Result: ELIGIBLE — all parameters within limits', source: 'FDTL Engine' },
  { id: 'AUD4', time: '22 Sep 2026 05:20', user: 'Pranav TP', action: 'Crew assignment confirmed', source: 'Duty Planner' },
];
