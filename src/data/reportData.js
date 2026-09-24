// Mock report catalogue & history. Mirrors GET /api/reports/.

export const reportTypes = [
  'Crew FDTL Report',
  'Violations Report',
  'Cumulative Limits',
  'Rest Period Report',
  'Duty Records Export',
];

export const reportFormats = ['PDF', 'Excel', 'CSV'];

export const recentReports = [
  { id: 'RPT-1009', name: 'Crew FDTL Report', from: '2026-09-01', to: '2026-09-30', generatedOn: '22 Sep 2026 09:12', format: 'PDF', crew: 'All', size: '1.4 MB' },
  { id: 'RPT-1008', name: 'Violations Report', from: '2026-09-01', to: '2026-09-30', generatedOn: '21 Sep 2026 17:40', format: 'Excel', crew: 'All', size: '220 KB' },
  { id: 'RPT-1007', name: 'Cumulative Limits', from: '2026-06-01', to: '2026-09-30', generatedOn: '20 Sep 2026 11:05', format: 'PDF', crew: 'All', size: '2.1 MB' },
  { id: 'RPT-1006', name: 'Rest Period Report', from: '2026-09-01', to: '2026-09-30', generatedOn: '19 Sep 2026 08:30', format: 'PDF', crew: 'All', size: '860 KB' },
];
