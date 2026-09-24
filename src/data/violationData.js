// Mock FDTL violations. Mirrors GET /api/violations/.

export const violationData = [
  {
    id: 'VIO-0142', date: '2026-09-22', crewId: 'CRW003', crew: 'Capt. Pranav TP', flight: 'FPL003',
    rule: 'FDP Limit', description: 'Exceeded applicable FDP', severity: 'High', status: 'Open',
    actual: '11:05', limit: '09:00', exceededBy: '02:05', aircraft: 'VT-DEF', route: 'BLR → MAA',
    detectedAt: '22 Sep 2026 05:14', detectedBy: 'FDTL Engine',
    recommendation: 'Reassign FPL003 to a crew member with sufficient FDP remaining, or split the duty.',
  },
  {
    id: 'VIO-0141', date: '2026-09-21', crewId: 'CRW002', crew: 'Capt. Arun S', flight: 'FPL002',
    rule: 'Cumulative', description: 'Approaching cumulative limit', severity: 'Medium', status: 'Open',
    actual: '78:15', limit: '88:00', exceededBy: '—', aircraft: 'VT-XYZ', route: 'BLR → HYD',
    detectedAt: '21 Sep 2026 18:40', detectedBy: 'FDTL Engine',
    recommendation: 'Limit further flight assignments for the next 5 days to stay within the 28-day window.',
  },
  {
    id: 'VIO-0137', date: '2026-09-18', crewId: 'CRW004', crew: 'Vikram R', flight: 'FPL009',
    rule: 'Rest', description: 'Insufficient rest period', severity: 'High', status: 'Resolved',
    actual: '08:50', limit: '10:00', exceededBy: '01:10', aircraft: 'VT-BLH', route: 'BLR → TRV',
    detectedAt: '18 Sep 2026 04:55', detectedBy: 'FDTL Engine',
    recommendation: 'Duty start delayed by 1h 15m to restore the minimum rest period.',
    resolution: 'Reporting time moved from 05:30 to 06:45. Approved by Chief Pilot.',
  },
  {
    id: 'VIO-0131', date: '2026-09-15', crewId: 'CRW005', crew: 'Neha S', flight: 'FPL007',
    rule: 'Night Duty', description: 'Exceeded WOCL limit', severity: 'Medium', status: 'Resolved',
    actual: '03:30', limit: '03:00', exceededBy: '00:30', aircraft: 'VT-ABC', route: 'BLR → IXE',
    detectedAt: '15 Sep 2026 01:10', detectedBy: 'FDTL Engine',
    recommendation: 'Swap to a crew member not scheduled in the WOCL window.',
    resolution: 'Crew swapped with F/O Deepa V.',
  },
  {
    id: 'VIO-0128', date: '2026-09-11', crewId: 'CRW008', crew: 'F/O Suresh M', flight: 'FPL005',
    rule: 'Flight Time', description: 'Daily flight time exceeded', severity: 'High', status: 'Resolved',
    actual: '08:20', limit: '08:00', exceededBy: '00:20', aircraft: 'VT-CGA', route: 'HYD → BLR',
    detectedAt: '11 Sep 2026 16:22', detectedBy: 'FDTL Engine',
    recommendation: 'Record commander discretion report.',
    resolution: 'Commander discretion report filed (CDR-0091).',
  },
  {
    id: 'VIO-0124', date: '2026-09-08', crewId: 'CRW010', crew: 'Capt. Rohit G', flight: 'FPL002',
    rule: 'FDP Limit', description: 'FDP extension used', severity: 'Low', status: 'Acknowledged',
    actual: '09:40', limit: '09:00', exceededBy: '00:40', aircraft: 'VT-BLH', route: 'BLR → HYD',
    detectedAt: '08 Sep 2026 14:02', detectedBy: 'FDTL Engine',
    recommendation: 'Extension within discretion allowance; monitor weekly extensions.',
  },
];

export const violationSeverities = ['High', 'Medium', 'Low'];
export const violationStatuses = ['Open', 'Acknowledged', 'Resolved'];
