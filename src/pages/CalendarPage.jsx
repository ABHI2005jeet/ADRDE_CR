import { useMemo, useState } from 'react';
import CalendarGrid from '../components/calendar/CalendarGrid.jsx';
import Badge from '../components/ui/Badge.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatDate, priorityTone } from '../utils/formatters.js';

export default function CalendarPage() {
  const { meetings } = useApp();
  const [selectedDate, setSelectedDate] = useState(meetings[0]?.date || '2026-05-23');
  const [monthDate, setMonthDate] = useState(new Date(`${selectedDate.slice(0, 7)}-01T00:00:00`));

  const selectedMeetings = useMemo(
    () => meetings.filter((meeting) => meeting.date === selectedDate),
    [meetings, selectedDate],
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        description="Monthly meeting calendar with highlighted dates and scheduled meeting details."
        eyebrow="Schedule"
        title="Calendar View"
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <CalendarGrid
          meetings={meetings}
          monthDate={monthDate}
          onMonthChange={setMonthDate}
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
        />

        <aside className="surface p-5">
          <p className="label mb-2">Selected date</p>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{formatDate(selectedDate)}</h2>
          <div className="mt-5 space-y-4">
            {selectedMeetings.length ? (
              selectedMeetings.map((meeting) => (
                <article key={meeting.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge tone={priorityTone(meeting.priority)}>{meeting.priority}</Badge>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{meeting.id}</span>
                  </div>
                  <h3 className="font-semibold text-slate-950 dark:text-white">{meeting.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {meeting.time} | {meeting.venue}
                  </p>
                </article>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No meetings scheduled for this date.
              </p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
