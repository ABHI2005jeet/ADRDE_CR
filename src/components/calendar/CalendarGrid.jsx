import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { formatMonthYear, toDateKey } from '../../utils/formatters.js';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarGrid({ meetings, monthDate, onMonthChange, onSelectDate, selectedDate }) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingSlots = (firstDay.getDay() + 6) % 7;
  const meetingDateSet = new Set(meetings.map((meeting) => meeting.date));
  const cells = [
    ...Array.from({ length: leadingSlots }, (_, index) => ({ blank: true, key: `blank-${index}` })),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(year, month, index + 1);
      const key = toDateKey(date);
      return { day: index + 1, key, hasMeeting: meetingDateSet.has(key) };
    }),
  ];

  return (
    <section className="surface p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Button
          icon="chevronLeft"
          iconOnly
          onClick={() => onMonthChange(new Date(year, month - 1, 1))}
          size="icon"
          variant="secondary"
        >
          Previous month
        </Button>
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{formatMonthYear(monthDate)}</h2>
        <Button
          icon="chevronRight"
          iconOnly
          onClick={() => onMonthChange(new Date(year, month + 1, 1))}
          size="icon"
          variant="secondary"
        >
          Next month
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        {weekdays.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell) =>
          cell.blank ? (
            <div key={cell.key} className="aspect-square rounded-md bg-slate-50 dark:bg-slate-900/50" />
          ) : (
            <button
              key={cell.key}
              className={`flex aspect-square min-h-14 flex-col items-center justify-center rounded-md border text-sm font-semibold transition ${
                selectedDate === cell.key
                  ? 'border-adrde-blue bg-adrde-blue text-white dark:border-blue-400 dark:bg-blue-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-adrde-blue hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:bg-slate-900'
              }`}
              onClick={() => onSelectDate(cell.key)}
            >
              <span>{cell.day}</span>
              {cell.hasMeeting ? (
                <span className={`mt-1 h-1.5 w-1.5 rounded-full ${selectedDate === cell.key ? 'bg-white' : 'bg-emerald-500'}`} />
              ) : null}
            </button>
          ),
        )}
      </div>
      <div className="mt-4">
        <Badge tone="info">Highlighted dates contain scheduled meetings</Badge>
      </div>
    </section>
  );
}
