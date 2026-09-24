import api, { USE_MOCK, mockResponse, matchesSearch } from './api';
import { flightData, airports } from '../data/flightData';
import { crewData } from '../data/crewData';
import { aircraftData } from '../data/aircraftData';
import { durationBetween, formatDuration } from '../utils/time';

let flightStore = [...flightData];

const crewName = (id) => crewData.find((crew) => crew.id === id)?.name ?? '—';

/** Shapes a raw flight into the view model the UI consumes (same as the future API serializer). */
function toFlightView(flight) {
  const aircraft = aircraftData.find((item) => item.registration === flight.aircraft);
  return {
    ...flight,
    fop: flight.fop ?? flight.etd,
    fromName: airports[flight.from],
    toName: airports[flight.to],
    route: `${flight.from} → ${flight.to}`,
    aircraftType: aircraft?.type ?? '—',
    aircraftTypeCode: aircraft?.typeCode ?? '',
    flightTime: formatDuration(durationBetween(flight.etd, flight.eta)),
    flightMinutes: durationBetween(flight.etd, flight.eta),
    captain: crewName(flight.captainId),
    coPilot: crewName(flight.coPilotId),
  };
}

export async function getFlights(filters = {}) {
  if (USE_MOCK) {
    const { search, date, status } = filters;
    const result = flightStore
      .map(toFlightView)
      .filter(
        (flight) =>
          matchesSearch(flight, search, ['flightNumber', 'callSign', 'from', 'to', 'aircraft', 'captain']) &&
          (!date || flight.date === date) &&
          (!status || flight.planStatus === status),
      )
      .sort((a, b) => (a.date + a.etd).localeCompare(b.date + b.etd));
    return mockResponse(result);
  }
  const { data } = await api.get('/flights/', { params: filters });
  return data;
}

export async function getTodaysFlights(date = '2026-09-22') {
  return getFlights({ date });
}

export async function getFlightById(id) {
  if (USE_MOCK) {
    const flight = flightStore.find((item) => item.id === id);
    return mockResponse(flight ? toFlightView(flight) : null);
  }
  const { data } = await api.get(`/flights/${id}/`);
  return data;
}

export async function saveFlight(payload) {
  if (USE_MOCK) {
    if (payload.id) {
      flightStore = flightStore.map((flight) => (flight.id === payload.id ? { ...flight, ...payload } : flight));
      return mockResponse(toFlightView(flightStore.find((flight) => flight.id === payload.id)));
    }
    const nextNumber = String(flightStore.length + 1).padStart(3, '0');
    const record = { status: 'Compliant', planStatus: 'Draft', ...payload, id: `FPL${nextNumber}`, flightNumber: `FPL${nextNumber}` };
    flightStore = [...flightStore, record];
    return mockResponse(toFlightView(record));
  }
  const { data } = payload.id
    ? await api.patch(`/flights/${payload.id}/`, payload)
    : await api.post('/flights/', payload);
  return data;
}

export const airportOptions = Object.entries(airports).map(([code, name]) => ({ value: code, label: `${name} (${code})` }));
