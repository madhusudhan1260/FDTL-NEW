import api, { USE_MOCK, mockResponse, matchesSearch } from './api';
import { crewData } from '../data/crewData';

// In-memory store so create/update persist for the session in mock mode.
let crewStore = [...crewData];

export async function getCrew(filters = {}) {
  if (USE_MOCK) {
    const { search, status, licenceType } = filters;
    const result = crewStore.filter(
      (crew) =>
        matchesSearch(crew, search, ['name', 'licenceNumber', 'employeeId', 'authorizedAircraft']) &&
        (!status || crew.status === status) &&
        (!licenceType || crew.licenceType === licenceType),
    );
    return mockResponse(result);
  }
  const { data } = await api.get('/crew/', { params: filters });
  return data;
}

export async function getCrewById(id) {
  if (USE_MOCK) return mockResponse(crewStore.find((crew) => crew.id === id) ?? null);
  const { data } = await api.get(`/crew/${id}/`);
  return data;
}

export async function createCrew(payload) {
  if (USE_MOCK) {
    const id = `CRW${String(crewStore.length + 1).padStart(3, '0')}`;
    const record = {
      ...payload,
      id,
      status: payload.status || 'Compliant',
      dutyState: { reportTime: '07:00', priorFlightMinutes: 0, cumulativeMinutes: 0, restBeforeMinutes: 1440 },
    };
    crewStore = [record, ...crewStore];
    return mockResponse(record);
  }
  const { data } = await api.post('/crew/', payload);
  return data;
}

export async function updateCrew(id, payload) {
  if (USE_MOCK) {
    crewStore = crewStore.map((crew) => (crew.id === id ? { ...crew, ...payload } : crew));
    return mockResponse(crewStore.find((crew) => crew.id === id));
  }
  const { data } = await api.patch(`/crew/${id}/`, payload);
  return data;
}
