import { useMemo, useState } from 'react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import PermissionNotice from '../components/ui/PermissionNotice.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatDate, priorityTone } from '../utils/formatters.js';
import { can } from '../utils/permissions.js';

const emptyForm = {
  meetingId: '',
  title: '',
  date: '',
  time: '',
  venue: '',
  department: '',
  priority: 'Medium',
  description: '',
  agendaNotes: '',
  participants: '',
};

const statusTone = {
  Draft: 'neutral',
  'Under Review': 'info',
  'Pending Approval': 'warning',
  Approved: 'success',
  Rejected: 'danger',
  Published: 'success',
};

export default function MeetingsPage({ mode = 'all' }) {
  const { currentUser, meetings, searchQuery, meetingApi, refreshAll } = useApp();
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const canCreate = can(currentUser, 'create_meeting');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const query = searchQuery.trim().toLowerCase();

  const sortedMeetings = useMemo(
    () =>
      [...meetings]
        .filter((meeting) => {
          if (mode === 'upcoming' && new Date(`${meeting.date}T00:00:00`) < today) return false;
          if (!query) return true;
          const haystack = `${meeting.meetingId || meeting.id} ${meeting.title} ${meeting.venue} ${meeting.description}`.toLowerCase();
          return haystack.includes(query);
        })
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    [meetings, mode, query, today],
  );

  const showForm = mode === 'create';
  const pageTitle =
    mode === 'create' ? 'Create Meeting' : mode === 'upcoming' ? 'Upcoming Meetings' : 'Meeting Management';

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canCreate) return;
    try {
      await meetingApi.create({
        meetingId: form.meetingId,
        title: form.title,
        date: form.date,
        time: form.time,
        venue: form.venue,
        department: form.department || currentUser.department,
        priority: form.priority,
        description: form.description,
        agendaNotes: form.agendaNotes,
        participants: form.participants.split(',').map((p) => p.trim()).filter(Boolean),
      });
      toast.success('Meeting created');
      setForm(emptyForm);
      refreshAll();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const runAction = async (id, action, note = '') => {
    try {
      await meetingApi.action(id, { action, note });
      toast.success(`Meeting ${action.replace('_', ' ')}`);
      refreshAll();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader description="Meeting workflow: Staff creates → Scientist reviews → Para Head approves → Published." eyebrow="Scheduling" title={pageTitle} />
      {!canCreate && showForm ? <PermissionNotice>Your role cannot create meetings.</PermissionNotice> : null}

      <section className={`mt-6 grid gap-6 ${showForm ? 'xl:grid-cols-[0.9fr_1.1fr]' : ''}`}>
        {showForm && canCreate ? (
          <form className="surface p-5" onSubmit={handleSubmit}>
            <h2 className="text-base font-semibold">Create Meeting</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['Meeting ID', 'meetingId'],
                ['Title', 'title'],
                ['Date', 'date'],
                ['Time', 'time'],
                ['Venue', 'venue'],
                ['Department', 'department'],
              ].map(([label, key]) => (
                <label key={key} className="block">
                  <span className="label mb-2 block">{label}</span>
                  <input className="field" required={key !== 'department'} type={key === 'date' ? 'date' : key === 'time' ? 'time' : 'text'} value={form[key]} onChange={(e) => updateField(key, e.target.value)} />
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="label mb-2 block">Participants (comma separated)</span>
                <input className="field" value={form.participants} onChange={(e) => updateField('participants', e.target.value)} />
              </label>
              <label className="block sm:col-span-2">
                <span className="label mb-2 block">Description</span>
                <textarea className="field min-h-24" required value={form.description} onChange={(e) => updateField('description', e.target.value)} />
              </label>
            </div>
            <Button className="mt-4" icon="plus" type="submit">Create</Button>
          </form>
        ) : null}

        <section className="space-y-4">
          {sortedMeetings.map((meeting) => (
            <article key={meeting.id} className="surface p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge tone={priorityTone(meeting.priority)}>{meeting.priority}</Badge>
                    <Badge tone={statusTone[meeting.status] || 'neutral'}>{meeting.status}</Badge>
                    <span className="text-xs font-semibold text-slate-500">{meeting.meetingId || meeting.id}</span>
                  </div>
                  <h2 className="text-lg font-semibold">{meeting.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{meeting.description}</p>
                  <p className="mt-3 text-sm">{formatDate(meeting.date)} | {meeting.time} | {meeting.venue}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {meeting.status === 'Draft' ? <Button onClick={() => runAction(meeting.id, 'submit_review')} size="sm" variant="secondary">Submit for review</Button> : null}
                  {can(currentUser, 'review_meeting') && meeting.status === 'Under Review' ? (
                    <>
                      <Button onClick={() => runAction(meeting.id, 'review')} size="sm">Review</Button>
                      <Button onClick={() => runAction(meeting.id, 'request_changes', 'Please update agenda')} size="sm" variant="secondary">Request changes</Button>
                    </>
                  ) : null}
                  {can(currentUser, 'approve_meeting') && meeting.status === 'Pending Approval' ? (
                    <>
                      <Button onClick={() => runAction(meeting.id, 'approve')} size="sm">Approve</Button>
                      <Button onClick={() => runAction(meeting.id, 'reject', 'Rejected')} size="sm" variant="danger">Reject</Button>
                    </>
                  ) : null}
                  {can(currentUser, 'approve_meeting') && meeting.status === 'Approved' ? (
                    <Button onClick={() => runAction(meeting.id, 'publish')} size="sm">Publish</Button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
          {!sortedMeetings.length ? <div className="surface p-6 text-sm text-slate-500">No meetings found.</div> : null}
        </section>
      </section>
    </div>
  );
}
