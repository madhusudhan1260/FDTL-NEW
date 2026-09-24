import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge, Button, Card, Drawer, ErrorState, LoadingState, PageHeader, Select } from '../../components/common';
import Calendar from '../../components/calendar/Calendar';
import FlightDetailsPanel from '../../components/calendar/FlightDetailsPanel';
import useAsync from '../../hooks/useAsync';
import { getCalendar } from '../../services/dutyService';
import { calendarStatusLegend } from '../../data/calendarData';
import { calendarStatusTone } from '../../utils/status';
import { formatDate } from '../../utils/time';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const TODAY = '2026-09-22';

export default function FDTLCalendarPage() {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState({ year: 2026, monthIndex: 8 });
  const [aircraftFilter, setAircraftFilter] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [dayList, setDayList] = useState(null);
  const monthKey = `${cursor.year}-${String(cursor.monthIndex + 1).padStart(2, '0')}`;
  const { data, loading, error, reload } = useAsync(() => getCalendar(monthKey), [monthKey]);

  const shiftMonth = (delta) =>
    setCursor(({ year, monthIndex }) => {
      const next = new Date(year, monthIndex + delta, 1);
      return { year: next.getFullYear(), monthIndex: next.getMonth() };
    });

  const entries = (data ?? []).filter((entry) => !aircraftFilter || entry.aircraft === aircraftFilter);
  const aircraftOptions = [...new Set((data ?? []).map((entry) => entry.aircraft))].sort();
  const counts = calendarStatusLegend.map((item) => ({ ...item, count: entries.filter((entry) => entry.status === item.status).length }));

  return (
    <div className="page">
      <PageHeader title="FDTL Calendar" subtitle="Monthly flight schedule with FDTL status" breadcrumbs={['FDTL', 'Calendar']} />

      <Card padded={false}>
        <div className="calendar-toolbar">
          <div className="calendar-toolbar__nav">
            <Button variant="secondary" size="sm" icon={ChevronLeft} onClick={() => shiftMonth(-1)} aria-label="Previous month" />
            <h2>{MONTH_NAMES[cursor.monthIndex]} {cursor.year}</h2>
            <Button variant="secondary" size="sm" icon={ChevronRight} onClick={() => shiftMonth(1)} aria-label="Next month" />
            <Button variant="ghost" size="sm" onClick={() => setCursor({ year: 2026, monthIndex: 8 })}>Today</Button>
          </div>
          <div className="calendar-toolbar__filters">
            <div className="legend-row">
              {counts.map((item) => (
                <Badge key={item.status} tone={calendarStatusTone[item.status]}>{item.label} ({item.count})</Badge>
              ))}
            </div>
            <Select name="aircraft" value={aircraftFilter} onChange={(event) => setAircraftFilter(event.target.value)} placeholder="All aircraft" options={aircraftOptions} />
          </div>
        </div>
        {error ? (
          <ErrorState message="Unable to load calendar." onRetry={reload} />
        ) : loading ? (
          <LoadingState message="Loading calendar…" />
        ) : (
          <Calendar year={cursor.year} monthIndex={cursor.monthIndex} entries={entries} today={TODAY} onSelectEntry={setSelectedEntry} onShowDay={(date, list) => setDayList({ date, list })} />
        )}
      </Card>

      <Drawer open={Boolean(dayList)} onClose={() => setDayList(null)} title={dayList ? `Flights – ${formatDate(dayList.date)}` : ''} width={400}>
        <div className="day-list">
          {dayList?.list.map((entry) => (
            <button key={entry.id} type="button" className={`calendar__entry calendar__entry--${entry.status} calendar__entry--large`} onClick={() => { setDayList(null); setSelectedEntry(entry); }}>
              <span className="calendar__entry-dot" />
              <strong>{entry.aircraft}</strong> {entry.etd}–{entry.eta} · {entry.from} → {entry.to}
            </button>
          ))}
        </div>
      </Drawer>

      <FlightDetailsPanel entry={selectedEntry} onClose={() => setSelectedEntry(null)} onViewSequence={(entry) => navigate(`/fdtl/duty-sequence?date=${entry.date}`)} />
    </div>
  );
}
