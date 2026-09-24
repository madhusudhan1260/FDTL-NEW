/**
 * Mock FDTL validation engine.
 *
 * PROTOTYPE LOGIC ONLY. The limits come from src/data/fdtlData.js and are
 * placeholders, not official regulations. The real calculation engine will
 * live in the Django backend (POST /api/fdtl/validate/); only this file
 * needs to change when it does — the UI consumes the returned shape.
 */
import api, { USE_MOCK, mockResponse } from './api';
import { crewData } from '../data/crewData';
import { flightData } from '../data/flightData';
import { aircraftData } from '../data/aircraftData';
import {
  activeLimits,
  rulePacks,
  dashboardSummary,
  complianceTrend,
  notifications,
  fdpLimitTable,
  flightTimeLimits,
  restRules,
  nightRules,
  cumulativeRules,
  extensionRules,
} from '../data/fdtlData';
import { toMinutes, toClock, formatDuration, durationBetween, MINUTES_PER_DAY } from '../utils/time';

export const RESULT = { ELIGIBLE: 'ELIGIBLE', WARNING: 'WARNING', VIOLATION: 'VIOLATION' };
const SEVERITY_ORDER = [RESULT.ELIGIBLE, RESULT.WARNING, RESULT.VIOLATION];

const worst = (statuses) => statuses.reduce((acc, s) => (SEVERITY_ORDER.indexOf(s) > SEVERITY_ORDER.indexOf(acc) ? s : acc), RESULT.ELIGIBLE);

/** Minutes of [start, end] (clock times, may cross midnight) that fall inside the WOCL window. */
function woclOverlap(start, end, limits) {
  const dutyStart = toMinutes(start);
  const dutyEnd = dutyStart + durationBetween(start, end);
  const woclStart = toMinutes(limits.woclStart);
  const woclEnd = toMinutes(limits.woclEnd);
  let overlap = 0;
  // Check the WOCL window on the duty day and the following day.
  for (const offset of [0, MINUTES_PER_DAY]) {
    const from = Math.max(dutyStart, woclStart + offset);
    const to = Math.min(dutyEnd, woclEnd + offset);
    overlap += Math.max(0, to - from);
  }
  return overlap;
}

/** Status of a "must not exceed" parameter. */
function upperLimitStatus(actual, limit, limits) {
  if (actual > limit) return RESULT.VIOLATION;
  if (actual >= limit * limits.warningThreshold) return RESULT.WARNING;
  return RESULT.ELIGIBLE;
}

function buildCheck(key, label, actual, limit, status, message) {
  return {
    key,
    label,
    actual: formatDuration(actual),
    limit: formatDuration(limit),
    remaining: formatDuration(Math.max(0, limit - actual)),
    actualMinutes: actual,
    limitMinutes: limit,
    utilisation: limit ? Math.min(1.2, actual / limit) : 0,
    status,
    message,
  };
}

const descriptor = {
  [RESULT.ELIGIBLE]: 'Within Limits',
  [RESULT.WARNING]: 'Approaching Limit',
  [RESULT.VIOLATION]: 'Limit Exceeded',
};

/**
 * Evaluates one crew member against one flight.
 * Returns a per-parameter breakdown plus an overall ELIGIBLE/WARNING/VIOLATION.
 */
export function evaluateCrew(crew, flight, role, limits = activeLimits) {
  const { dutyState } = crew;
  const flightMinutes = durationBetween(flight.etd, flight.eta);
  const releaseTime = toClock(toMinutes(flight.eta) + limits.postFlightMinutes);

  const fdp = durationBetween(dutyState.reportTime, releaseTime);
  const dailyFlight = dutyState.priorFlightMinutes + flightMinutes;
  const cumulative = dutyState.cumulativeMinutes + flightMinutes;
  const rest = dutyState.restBeforeMinutes;
  const night = woclOverlap(dutyState.reportTime, releaseTime, limits);

  const fdpStatus = upperLimitStatus(fdp, limits.maxFdpMinutes, limits);
  const flightStatus = upperLimitStatus(dailyFlight, limits.maxFlightMinutesPerDay, limits);
  const cumulativeStatus = upperLimitStatus(cumulative, limits.maxCumulativeMinutes28Days, limits);
  const nightStatus = upperLimitStatus(night, limits.maxNightDutyMinutes, limits);
  const restStatus = rest < limits.minRestMinutes ? RESULT.VIOLATION : RESULT.ELIGIBLE;

  const checks = [
    buildCheck('fdp', 'FDP', fdp, limits.maxFdpMinutes, fdpStatus, `Flight duty period ${descriptor[fdpStatus].toLowerCase()}.`),
    buildCheck('flightTime', 'Flight Time', dailyFlight, limits.maxFlightMinutesPerDay, flightStatus, `Daily flight time ${descriptor[flightStatus].toLowerCase()}.`),
    buildCheck('cumulative', 'Cumulative', cumulative, limits.maxCumulativeMinutes28Days, cumulativeStatus,
      cumulativeStatus === RESULT.ELIGIBLE ? '28-day cumulative flight time within limits.' : 'Warning: Crew is approaching cumulative limit.'),
    {
      ...buildCheck('rest', 'Rest Period', rest, limits.minRestMinutes, restStatus, restStatus === RESULT.ELIGIBLE ? 'Adequate rest before duty.' : 'Insufficient rest before duty.'),
      // Rest is a minimum: "remaining" is the surplus above the minimum
      remaining: formatDuration(Math.max(0, rest - limits.minRestMinutes)),
      isMinimum: true,
    },
    buildCheck('night', 'Night Duty', night, limits.maxNightDutyMinutes, nightStatus, `Duty within WOCL ${descriptor[nightStatus].toLowerCase()}.`),
  ];

  // Other applicable limits: aircraft type authorisation
  const aircraft = aircraftData.find((item) => item.registration === flight.aircraft);
  const typeRated = aircraft ? crew.authorizedAircraft.includes(aircraft.typeCode) : true;
  const otherChecks = [
    {
      key: 'typeRating',
      label: 'Aircraft Authorisation',
      status: typeRated ? RESULT.ELIGIBLE : RESULT.VIOLATION,
      message: typeRated ? `Authorised on ${aircraft?.typeCode}.` : `Not authorised on ${aircraft?.typeCode}.`,
    },
  ];

  const status = worst([...checks, ...otherChecks].map((check) => check.status));

  return {
    crewId: crew.id,
    name: crew.name,
    licenceNumber: crew.licenceNumber,
    licenceType: crew.licenceType,
    role,
    status,
    checks,
    otherChecks,
    summary: {
      reportingTime: dutyState.reportTime,
      startOfDuty: dutyState.reportTime,
      flightTime: formatDuration(flightMinutes),
      dutyEnd: releaseTime,
      totalDutyPeriod: formatDuration(fdp),
      restBeforeDuty: formatDuration(rest),
      nightDuty: formatDuration(night),
    },
    restLabel: restStatus === RESULT.ELIGIBLE ? 'Adequate' : 'Insufficient',
    nightLabel: descriptor[nightStatus],
  };
}

const overallMessages = {
  [RESULT.ELIGIBLE]: {
    title: 'FDTL validation completed successfully.',
    detail: 'All selected crew are within FDTL limits. Crew assignment allowed.',
  },
  [RESULT.WARNING]: {
    title: 'Crew assignment allowed with warning.',
    detail: 'Please review crew constraints before final assignment.',
  },
  [RESULT.VIOLATION]: {
    title: 'FDTL limit exceeded.',
    detail: 'Crew assignment is blocked. Change crew or adjust the flight plan.',
  },
};

/**
 * Validates a proposed crew assignment.
 * @param {{ flightId: string, date: string, crew: Array<{ crewId: string, role: string }> }} request
 */
export async function validateFDTL(request) {
  if (!USE_MOCK) {
    const { data } = await api.post('/fdtl/validate/', request);
    return data;
  }
  const flight = flightData.find((item) => item.id === request.flightId);
  if (!flight) throw new Error('Flight not found.');
  const crewResults = request.crew
    .filter((assignment) => assignment.crewId)
    .map(({ crewId, role }) => evaluateCrew(crewData.find((crew) => crew.id === crewId), flight, role));
  const overall = worst(crewResults.map((result) => result.status));
  const rulePack = rulePacks.find((pack) => pack.status === 'Active');
  return mockResponse(
    {
      flightId: flight.id,
      date: request.date,
      validatedAt: new Date().toISOString(),
      rulePack: `${rulePack.name} ${rulePack.version}`,
      overall,
      message: overallMessages[overall],
      crewResults,
    },
    900,
  );
}

export async function getDashboardSummary() {
  if (USE_MOCK) return mockResponse({ summary: dashboardSummary, trend: complianceTrend });
  const { data } = await api.get('/fdtl/dashboard/');
  return data;
}

export async function getNotifications() {
  if (USE_MOCK) return mockResponse(notifications, 150);
  const { data } = await api.get('/notifications/');
  return data;
}

/** Per-crew utilisation snapshot used by the FDTL Overview page. */
export async function getCrewUtilisation() {
  if (USE_MOCK) {
    const limit = activeLimits.maxCumulativeMinutes28Days;
    return mockResponse(
      crewData.map((crew) => ({
        id: crew.id,
        name: crew.name,
        cumulative: formatDuration(crew.dutyState.cumulativeMinutes),
        utilisation: Math.round((crew.dutyState.cumulativeMinutes / limit) * 100),
        status: crew.status,
      })),
    );
  }
  const { data } = await api.get('/fdtl/utilisation/');
  return data;
}

// ---------- Configuration ----------

let rulePackStore = [...rulePacks];

export async function getRulePacks() {
  if (USE_MOCK) return mockResponse(rulePackStore);
  const { data } = await api.get('/fdtl/rule-packs/');
  return data;
}

export async function createRulePackVersion(payload) {
  if (USE_MOCK) {
    const record = { id: `RP-${Date.now()}`, rules: 42, approvedBy: '—', status: 'Draft', lastModified: new Date().toISOString().slice(0, 10), ...payload };
    rulePackStore = [...rulePackStore, record];
    return mockResponse(record, 600);
  }
  const { data } = await api.post('/fdtl/rule-packs/', payload);
  return data;
}

/** Runs the active limits against every crew/flight pairing on the sample day. */
export async function testRulePack(rulePackId) {
  if (!USE_MOCK) {
    const { data } = await api.post(`/fdtl/rule-packs/${rulePackId}/test/`);
    return data;
  }
  const sample = flightData.filter((flight) => flight.date === '2026-09-22');
  const results = sample.flatMap((flight) =>
    [flight.captainId, flight.coPilotId].map((id) => evaluateCrew(crewData.find((crew) => crew.id === id), flight, 'Crew').status),
  );
  const count = (status) => results.filter((result) => result === status).length;
  return mockResponse(
    { scenarios: results.length, eligible: count(RESULT.ELIGIBLE), warning: count(RESULT.WARNING), violation: count(RESULT.VIOLATION) },
    1100,
  );
}

export async function getRuleTables() {
  if (USE_MOCK) {
    return mockResponse({ fdpLimitTable, flightTimeLimits, restRules, nightRules, cumulativeRules, extensionRules });
  }
  const { data } = await api.get('/fdtl/rules/');
  return data;
}
