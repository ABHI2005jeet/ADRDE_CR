import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import { downloadMeetingReport } from '../services/reportService.js';
import { can } from '../utils/permissions.js';
import { formatDate } from '../utils/formatters.js';

export default function ReportsPage() {
  const { currentUser, meetings, agendas } = useApp();
  const [meetingId, setMeetingId] = useState(meetings[0]?.id || '');
  const [summary, setSummary] = useState(
    'Meeting proceedings were recorded. Action items assigned to respective departments with follow-up timelines.',
  );

  const meeting = meetings.find((m) => m.id === meetingId);
  const meetingAgendas = agendas.filter((a) => a.meetingId === meetingId);
  const canDownload = can(currentUser, 'download_reports');

  const generateReport = () => {
    if (!meeting) return;
    downloadMeetingReport({
      meeting,
      attendees: meeting.attendees || [],
      agendas: meetingAgendas,
      summary,
    });
  };

  if (!can(currentUser, 'view_reports')) {
    return (
      <div className="surface p-6 text-sm text-slate-600 dark:text-slate-400">
        Your role does not have permission to view reports.
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Reporting"
        title="Downloadable Reports"
        description="Generate MAC meeting reports as PDF (mock data)"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface space-y-4 p-5">
          <div>
            <label className="label">Select Meeting</label>
            <select className="field mt-1" value={meetingId} onChange={(e) => setMeetingId(e.target.value)}>
              {meetings.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} — {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Meeting Summary</label>
            <textarea
              className="field mt-1 min-h-[120px]"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          {canDownload && (
            <button
              type="button"
              onClick={generateReport}
              className="rounded-md bg-adrde-navy px-4 py-2 text-sm font-semibold text-white hover:bg-adrde-blue"
            >
              Download PDF Report
            </button>
          )}
        </div>

        <div className="surface p-5">
          <h2 className="mb-3 text-sm font-semibold text-adrde-navy dark:text-slate-100">Report Preview</h2>
          {meeting ? (
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold">Title:</span> {meeting.title}
              </p>
              <p>
                <span className="font-semibold">ID:</span> {meeting.id}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {formatDate(meeting.date)} {meeting.time}
              </p>
              <p>
                <span className="font-semibold">Venue:</span> {meeting.venue}
              </p>
              <div>
                <p className="font-semibold">Attendees</p>
                <ul className="mt-1 list-inside list-disc text-slate-600 dark:text-slate-400">
                  {(meeting.attendees || []).map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold">Agenda Items</p>
                <ul className="mt-1 list-inside list-disc text-slate-600 dark:text-slate-400">
                  {meetingAgendas.map((a) => (
                    <li key={a.id}>
                      {a.topic} ({a.status})
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                <span className="font-semibold">Summary:</span> {summary}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Select a meeting to preview the report.</p>
          )}
        </div>
      </div>
    </div>
  );
}
