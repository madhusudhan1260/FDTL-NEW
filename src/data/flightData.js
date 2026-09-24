// Mock flight plans. Mirrors the future GET /api/flights/ payload.
// Crew are referenced by id (captainId / coPilotId) like a relational API would.

export const airports = {
  BLR: 'Bengaluru',
  GOI: 'Goa',
  HYD: 'Hyderabad',
  MAA: 'Chennai',
  COK: 'Kochi',
  BOM: 'Mumbai',
  IXE: 'Mangaluru',
  TRV: 'Thiruvananthapuram',
};

export const flightData = [
  { id: 'FPL001', flightNumber: 'FPL001', callSign: 'MDY101', date: '2026-09-22', from: 'BLR', to: 'GOI', aircraft: 'VT-ABC', etd: '07:30', eta: '09:15', report: '06:30', fop: '07:10', captainId: 'CRW001', coPilotId: 'CRW002', status: 'Compliant', planStatus: 'Scheduled' },
  { id: 'FPL002', flightNumber: 'FPL002', callSign: 'MDY102', date: '2026-09-22', from: 'BLR', to: 'HYD', aircraft: 'VT-XYZ', etd: '08:30', eta: '09:50', report: '08:00', fop: '08:30', captainId: 'CRW002', coPilotId: 'CRW008', status: 'Approaching', planStatus: 'Scheduled' },
  { id: 'FPL003', flightNumber: 'FPL003', callSign: 'MDY103', date: '2026-09-22', from: 'BLR', to: 'MAA', aircraft: 'VT-DEF', etd: '10:00', eta: '11:05', report: '09:30', fop: '10:00', captainId: 'CRW003', coPilotId: 'CRW005', status: 'Violation', planStatus: 'On Hold' },
  { id: 'FPL004', flightNumber: 'FPL004', callSign: 'MDY104', date: '2026-09-22', from: 'GOI', to: 'BLR', aircraft: 'VT-ABC', etd: '10:00', eta: '11:30', report: '09:30', captainId: 'CRW001', coPilotId: 'CRW002', status: 'Compliant', planStatus: 'Scheduled' },
  { id: 'FPL005', flightNumber: 'FPL005', callSign: 'MDY105', date: '2026-09-22', from: 'MAA', to: 'COK', aircraft: 'VT-HLX', etd: '11:15', eta: '13:00', report: '10:15', captainId: 'CRW007', coPilotId: 'CRW010', status: 'Compliant', planStatus: 'Scheduled' },
  { id: 'FPL006', flightNumber: 'FPL006', callSign: 'MDY106', date: '2026-09-22', from: 'HYD', to: 'BLR', aircraft: 'VT-XYZ', etd: '14:00', eta: '15:20', report: '13:15', captainId: 'CRW004', coPilotId: 'CRW005', status: 'Compliant', planStatus: 'Scheduled' },
  { id: 'FPL007', flightNumber: 'FPL007', callSign: 'MDY107', date: '2026-09-23', from: 'BLR', to: 'IXE', aircraft: 'VT-ABC', etd: '07:00', eta: '08:05', report: '06:00', captainId: 'CRW004', coPilotId: 'CRW009', status: 'Compliant', planStatus: 'Scheduled' },
  { id: 'FPL008', flightNumber: 'FPL008', callSign: 'MDY108', date: '2026-09-23', from: 'BLR', to: 'BOM', aircraft: 'VT-XYZ', etd: '09:10', eta: '11:00', report: '08:10', captainId: 'CRW001', coPilotId: 'CRW005', status: 'Compliant', planStatus: 'Scheduled' },
  { id: 'FPL009', flightNumber: 'FPL009', callSign: 'MDY109', date: '2026-09-23', from: 'BLR', to: 'TRV', aircraft: 'VT-BLH', etd: '12:30', eta: '14:40', report: '11:30', captainId: 'CRW010', coPilotId: 'CRW003', status: 'Approaching', planStatus: 'Draft' },
  { id: 'FPL010', flightNumber: 'FPL010', callSign: 'MDY110', date: '2026-09-24', from: 'BLR', to: 'GOI', aircraft: 'VT-ABC', etd: '07:30', eta: '09:15', report: '06:30', captainId: 'CRW004', coPilotId: 'CRW005', status: 'Compliant', planStatus: 'Draft' },
  { id: 'FPL011', flightNumber: 'FPL011', callSign: 'MDY111', date: '2026-09-21', from: 'BLR', to: 'HYD', aircraft: 'VT-XYZ', etd: '06:45', eta: '08:05', report: '05:45', captainId: 'CRW002', coPilotId: 'CRW008', status: 'Approaching', planStatus: 'Completed' },
  { id: 'FPL012', flightNumber: 'FPL012', callSign: 'MDY112', date: '2026-09-21', from: 'HYD', to: 'BLR', aircraft: 'VT-XYZ', etd: '09:00', eta: '10:20', report: '08:30', captainId: 'CRW002', coPilotId: 'CRW008', status: 'Compliant', planStatus: 'Completed' },
];

export const flightPlanStatuses = ['Draft', 'Scheduled', 'On Hold', 'Completed', 'Cancelled'];
