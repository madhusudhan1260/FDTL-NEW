// Mock FDTL calendar entries. Mirrors GET /api/fdtl/calendar/?month=2026-09.
// A small deterministic generator keeps the month populated without
// hand-writing ~80 records; specific days are overridden below.

const aircraftTypes = {
  'VT-ABC': 'KING AIR B200',
  'VT-XYZ': 'KING AIR B200',
  'VT-DEF': 'CESSNA C208',
  'VT-HLX': 'LEONARDO AW139',
};

const sectorTemplates = [
  { aircraft: 'VT-ABC', from: 'BLR', to: 'GOI', etd: '07:30', eta: '09:15' },
  { aircraft: 'VT-ABC', from: 'GOI', to: 'BLR', etd: '10:10', eta: '12:10' },
  { aircraft: 'VT-XYZ', from: 'BLR', to: 'HYD', etd: '14:00', eta: '16:15' },
  { aircraft: 'VT-XYZ', from: 'HYD', to: 'BLR', etd: '17:00', eta: '18:20' },
  { aircraft: 'VT-DEF', from: 'BLR', to: 'MAA', etd: '08:45', eta: '09:50' },
  { aircraft: 'VT-HLX', from: 'MAA', to: 'COK', etd: '11:15', eta: '13:00' },
];

const crewPairs = [
  { captain: 'Capt. Raj Kumar', coPilot: 'Capt. Arun S' },
  { captain: 'Capt. Vikram R', coPilot: 'F/O Neha S' },
  { captain: 'Capt. Anita K', coPilot: 'Capt. Rohit G' },
  { captain: 'Capt. Pranav TP', coPilot: 'F/O Suresh M' },
];

// Days with a non-compliant flight in the mock month
const statusOverrides = {
  '2026-09-04': { 1: 'approaching' },
  '2026-09-09': { 0: 'approaching' },
  '2026-09-11': { 2: 'violation' },
  '2026-09-15': { 0: 'violation', 1: 'approaching' },
  '2026-09-21': { 0: 'approaching' },
  '2026-09-22': { 2: 'violation', 1: 'approaching' },
  '2026-09-26': { 1: 'approaching' },
};

function buildEntry(date, template, index, status) {
  const crew = crewPairs[(Number(date.slice(-2)) + index) % crewPairs.length];
  return {
    id: `CAL-${date}-${index + 1}`,
    date,
    callSign: `MDY${100 + ((Number(date.slice(-2)) * 3 + index) % 90)}`,
    aircraft: template.aircraft,
    aircraftType: aircraftTypes[template.aircraft],
    from: template.from,
    to: template.to,
    etd: template.etd,
    eta: template.eta,
    sector: `${index + 1} of 2`,
    captain: crew.captain,
    coPilot: crew.coPilot,
    status,
    previousDuty: index % 2 === 0 ? '05:10' : '06:20',
  };
}

function generateMonth(year, monthIndex) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const entries = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const weekday = new Date(year, monthIndex, day).getDay();
    // Lighter schedule on Sundays, heavier mid-week
    const count = weekday === 0 ? 1 : 2 + ((day * 7) % 3);
    const offset = day % 2 === 0 ? 0 : 2;
    for (let i = 0; i < count; i += 1) {
      const template = sectorTemplates[(i + offset) % sectorTemplates.length];
      const status = statusOverrides[date]?.[i] ?? 'within';
      entries.push(buildEntry(date, template, i, status));
    }
  }
  return entries;
}

// 18 Sep 2026 is a reference day and uses fixed data.
const referenceDay = [
  { ...buildEntry('2026-09-18', sectorTemplates[0], 0, 'within'), callSign: 'MDY101', captain: 'Capt. Raj Kumar', coPilot: 'Capt. Arun S', sector: '1 of 2' },
  { ...buildEntry('2026-09-18', sectorTemplates[1], 1, 'within'), callSign: 'MDY104', captain: 'Capt. Raj Kumar', coPilot: 'Capt. Arun S', sector: '2 of 2' },
  { ...buildEntry('2026-09-18', sectorTemplates[2], 2, 'approaching'), callSign: 'MDY106', captain: 'Capt. Vikram R', coPilot: 'F/O Neha S', sector: '1 of 2' },
  { ...buildEntry('2026-09-18', sectorTemplates[3], 3, 'violation'), callSign: 'MDY109', captain: 'Capt. Vikram R', coPilot: 'F/O Neha S', sector: '2 of 2' },
];

export const calendarEntries = [
  ...generateMonth(2026, 7),
  ...generateMonth(2026, 8).filter((entry) => entry.date !== '2026-09-18'),
  ...referenceDay,
  ...generateMonth(2026, 9),
];

export const calendarStatusLegend = [
  { status: 'within', label: 'Within Limits' },
  { status: 'approaching', label: 'Approaching Limit' },
  { status: 'violation', label: 'Violation' },
];
