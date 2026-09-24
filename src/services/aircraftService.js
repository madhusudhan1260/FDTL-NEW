import api, { USE_MOCK, mockResponse, matchesSearch } from './api';
import { aircraftData } from '../data/aircraftData';

export async function getAircraft(filters = {}) {
  if (USE_MOCK) {
    const { search, status } = filters;
    return mockResponse(
      aircraftData.filter(
        (aircraft) =>
          matchesSearch(aircraft, search, ['registration', 'type', 'base']) &&
          (!status || aircraft.status === status),
      ),
    );
  }
  const { data } = await api.get('/aircraft/', { params: filters });
  return data;
}
