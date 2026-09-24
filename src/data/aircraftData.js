// Mock fleet data. Mirrors the future GET /api/aircraft/ payload.

export const aircraftData = [
  { id: 'AC001', registration: 'VT-ABC', type: 'KING AIR B200', typeCode: 'B200', category: 'Fixed Wing', seats: 9, operator: 'MADDY AVIATION', base: 'BLR', status: 'Active', lastMaintenance: '2026-09-02', nextMaintenance: '2026-10-02', hoursFlown: 6420 },
  { id: 'AC002', registration: 'VT-XYZ', type: 'KING AIR B200', typeCode: 'B200', category: 'Fixed Wing', seats: 9, operator: 'MADDY AVIATION', base: 'BLR', status: 'Active', lastMaintenance: '2026-08-27', nextMaintenance: '2026-09-27', hoursFlown: 5180 },
  { id: 'AC003', registration: 'VT-DEF', type: 'CESSNA C208', typeCode: 'C208', category: 'Fixed Wing', seats: 12, operator: 'MADDY AVIATION', base: 'BLR', status: 'Maintenance', lastMaintenance: '2026-09-20', nextMaintenance: '2026-09-25', hoursFlown: 8710 },
  { id: 'AC004', registration: 'VT-HLX', type: 'LEONARDO AW139', typeCode: 'AW139', category: 'Rotary Wing', seats: 15, operator: 'MADDY AVIATION', base: 'MAA', status: 'Active', lastMaintenance: '2026-09-11', nextMaintenance: '2026-10-11', hoursFlown: 3240 },
  { id: 'AC005', registration: 'VT-BLH', type: 'BELL 412', typeCode: 'B412', category: 'Rotary Wing', seats: 13, operator: 'MADDY AVIATION', base: 'BLR', status: 'Active', lastMaintenance: '2026-09-05', nextMaintenance: '2026-10-05', hoursFlown: 4105 },
  { id: 'AC006', registration: 'VT-CGA', type: 'CESSNA C208', typeCode: 'C208', category: 'Fixed Wing', seats: 12, operator: 'MADDY AVIATION', base: 'HYD', status: 'AOG', lastMaintenance: '2026-08-18', nextMaintenance: '2026-09-24', hoursFlown: 9320 },
];

export const aircraftStatuses = ['Active', 'Maintenance', 'AOG'];
