// Time helpers shared by the mock FDTL engine and the UI.
// All durations are handled internally as whole minutes.

export const MINUTES_PER_DAY = 24 * 60;

/** "07:30" -> 450 */
export function toMinutes(hhmm) {
  if (!hhmm) return 0;
  const clean = hhmm.replace(':', '');
  const hours = Number(clean.slice(0, -2));
  const minutes = Number(clean.slice(-2));
  return hours * 60 + minutes;
}

/** 450 -> "07:30" (clock time, wraps past midnight) */
export function toClock(totalMinutes) {
  const wrapped = ((totalMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return formatDuration(wrapped);
}

/** 3765 -> "62:45" (durations may exceed 24h) */
export function formatDuration(totalMinutes) {
  const sign = totalMinutes < 0 ? '-' : '';
  const abs = Math.abs(Math.round(totalMinutes));
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** Minutes between two clock times, handling overnight wrap. */
export function durationBetween(from, to) {
  const diff = toMinutes(to) - toMinutes(from);
  return diff >= 0 ? diff : diff + MINUTES_PER_DAY;
}

/** "0730" style compact clock used on calendar chips. */
export function compactClock(hhmm) {
  return hhmm.replace(':', '');
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-09-22" -> "22 Sep 2026" */
export function formatDate(isoDate, { withYear = true } = {}) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-').map(Number);
  return withYear ? `${day} ${MONTHS[month - 1]} ${year}` : `${day} ${MONTHS[month - 1]}`;
}

/** "2026-09-22" -> "22-09-2026" */
export function formatDateDMY(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
}

export function toIsoDate(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
