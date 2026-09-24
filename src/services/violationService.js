import api, { USE_MOCK, mockResponse } from './api';
import { violationData } from '../data/violationData';

let violationStore = [...violationData];

export async function getViolations(filters = {}) {
  if (USE_MOCK) {
    const { fromDate, toDate, severity, crewId, status } = filters;
    return mockResponse(
      violationStore
        .filter(
          (violation) =>
            (!fromDate || violation.date >= fromDate) &&
            (!toDate || violation.date <= toDate) &&
            (!severity || violation.severity === severity) &&
            (!crewId || violation.crewId === crewId) &&
            (!status || violation.status === status),
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    );
  }
  const { data } = await api.get('/violations/', { params: filters });
  return data;
}

export async function updateViolationStatus(id, status, note) {
  if (USE_MOCK) {
    violationStore = violationStore.map((violation) =>
      violation.id === id ? { ...violation, status, resolution: note || violation.resolution } : violation,
    );
    return mockResponse(violationStore.find((violation) => violation.id === id), 500);
  }
  const { data } = await api.patch(`/violations/${id}/`, { status, note });
  return data;
}
