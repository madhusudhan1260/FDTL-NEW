import api, { USE_MOCK, mockResponse } from './api';
import { recentReports } from '../data/reportData';
import { formatDate, toIsoDate } from '../utils/time';

let reportStore = [...recentReports];

export async function getReports() {
  if (USE_MOCK) return mockResponse(reportStore);
  const { data } = await api.get('/reports/');
  return data;
}

/** Simulates server-side report generation. */
export async function generateReport({ type, from, to, crew, format }) {
  if (USE_MOCK) {
    const now = new Date();
    const isoDate = toIsoDate(now.getFullYear(), now.getMonth(), now.getDate());
    const clock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const generatedOn = `${formatDate(isoDate)} ${clock}`;
    const record = {
      id: `RPT-${1010 + reportStore.length}`,
      name: type,
      from,
      to,
      crew,
      format,
      generatedOn,
      size: `${(Math.random() * 1.8 + 0.2).toFixed(1)} MB`,
    };
    reportStore = [record, ...reportStore];
    return mockResponse(record, 1600);
  }
  const { data } = await api.post('/reports/', { type, from, to, crew, format });
  return data;
}
