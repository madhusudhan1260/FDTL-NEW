import { useMemo } from 'react';
import { compactClock, toIsoDate } from '../../utils/time';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MAX_VISIBLE = 3;

/** Builds a Monday-first grid of weeks for the month, padding with null days. */
function buildGrid(year, monthIndex) {
  const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function Calendar({ year, monthIndex, entries = [], today, onSelectEntry, onShowDay }) {
  const cells = useMemo(() => buildGrid(year, monthIndex), [year, monthIndex]);
  const entriesByDate = useMemo(() => {
    const grouped = {};
    entries.forEach((entry) => {
      (grouped[entry.date] ??= []).push(entry);
    });
    Object.values(grouped).forEach((list) => list.sort((a, b) => a.etd.localeCompare(b.etd)));
    return grouped;
  }, [entries]);

  return (
    <div className="calendar-scroll">
      <div className="calendar" role="grid">
        {WEEKDAYS.map((day) => (
          <div key={day} className="calendar__weekday" role="columnheader">
            <span className="calendar__weekday-full">{day}</span>
            <span className="calendar__weekday-short">{day.slice(0, 3)}</span>
          </div>
        ))}
        {cells.map((day, index) => {
          if (!day) return <div key={`blank-${index}`} className="calendar__cell is-blank" />;
          const iso = toIsoDate(year, monthIndex, day);
          const dayEntries = entriesByDate[iso] ?? [];
          const hidden = dayEntries.length - MAX_VISIBLE;
          return (
            <div key={iso} className={`calendar__cell ${iso === today ? 'is-today' : ''}`} role="gridcell">
              <span className="calendar__date">{day}</span>
              <div className="calendar__entries">
                {dayEntries.slice(0, MAX_VISIBLE).map((entry) => (
                  <button key={entry.id} type="button" className={`calendar__entry calendar__entry--${entry.status}`} onClick={() => onSelectEntry(entry)} title={`${entry.callSign} ${entry.from}→${entry.to}`}>
                    <span className="calendar__entry-dot" />
                    {entry.aircraft} {compactClock(entry.etd)}–{compactClock(entry.eta)}
                  </button>
                ))}
                {hidden > 0 && (
                  <button type="button" className="calendar__more" onClick={() => onShowDay(iso, dayEntries)}>
                    +{hidden} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
