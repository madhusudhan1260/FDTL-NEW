import { BedDouble, ClipboardCheck, Plane, RefreshCw, LogOut } from 'lucide-react';
import { durationBetween } from '../../utils/time';

const icons = { rest: BedDouble, reporting: ClipboardCheck, flight: Plane, turnaround: RefreshCw, release: LogOut };

// Rest blocks are long; draw them with a fixed visual weight so duty detail stays readable.
const REST_DISPLAY_MINUTES = 60;

/** Horizontal duty sequence. activities: [{ type, label, from, to, route?, duration }] */
export default function Timeline({ activities = [] }) {
  const weights = activities.map((activity) => (activity.type === 'rest' ? REST_DISPLAY_MINUTES : Math.max(20, durationBetween(activity.from, activity.to))));

  return (
    <div className="timeline-wrap">
      <div className="timeline">
        {activities.map((activity, index) => {
          const Icon = icons[activity.type];
          return (
            <div key={`${activity.label}-${index}`} className={`timeline__segment timeline__segment--${activity.type}`} style={{ flexGrow: weights[index] }}>
              <div className="timeline__label">
                <Icon size={15} />
                <span>{activity.label}</span>
              </div>
              <div className="timeline__bar" />
              <div className="timeline__detail">
                {activity.route && <strong>{activity.route}</strong>}
                <span>{activity.type === 'rest' ? activity.duration : `${activity.from} → ${activity.to}`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
