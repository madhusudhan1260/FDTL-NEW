import api, { USE_MOCK, mockResponse, matchesSearch } from './api';
import { dutyRecords, crewAttention, upcomingDuties, dutySequenceTemplate, auditTrail } from '../data/dutyData';
import { calendarEntries } from '../data/calendarData';
import { durationBetween, formatDuration } from '../utils/time';

export async function getDuties(filters = {}) {
  if (USE_MOCK) {
    const { search, crewId, status, fromDate, toDate } = filters;
    return mockResponse(
      dutyRecords
        .filter(
          (record) =>
            matchesSearch(record, search, ['crew', 'flight']) &&
            (!crewId || record.crewId === crewId) &&
            (!status || record.status === status) &&
            (!fromDate || record.date >= fromDate) &&
            (!toDate || record.date <= toDate),
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    );
  }
  const { data } = await api.get('/duties/', { params: filters });
  return data;
}

export async function getCrewAttention() {
  if (USE_MOCK) return mockResponse(crewAttention);
  const { data } = await api.get('/duties/attention/');
  return data;
}

export async function getUpcomingDuties() {
  if (USE_MOCK) return mockResponse(upcomingDuties);
  const { data } = await api.get('/duties/upcoming/');
  return data;
}

export async function getDutySequence({ crewId, date } = {}) {
  if (USE_MOCK) {
    const activities = dutySequenceTemplate.activities.map((activity) => ({
      ...activity,
      duration: formatDuration(durationBetween(activity.from, activity.to)),
    }));
    return mockResponse({ ...dutySequenceTemplate, crewId: crewId ?? dutySequenceTemplate.crewId, date: date ?? dutySequenceTemplate.date, activities });
  }
  const { data } = await api.get('/duties/sequence/', { params: { crew: crewId, date } });
  return data;
}

export async function getAuditTrail() {
  if (USE_MOCK) return mockResponse(auditTrail);
  const { data } = await api.get('/fdtl/audit/');
  return data;
}

/** @param {string} month "YYYY-MM" */
export async function getCalendar(month) {
  if (USE_MOCK) return mockResponse(calendarEntries.filter((entry) => entry.date.startsWith(month)));
  const { data } = await api.get('/fdtl/calendar/', { params: { month } });
  return data;
}
