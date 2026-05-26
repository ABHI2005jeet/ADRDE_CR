import { useMemo, useState } from 'react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import PermissionNotice from '../components/ui/PermissionNotice.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatDate, priorityTone } from '../utils/formatters.js';
import { can } from '../utils/permissions.js';

const emptyForm = {
  id: '',
  title: '',
  date: '',
  time: '',
  venue: '',
  priority: 'Medium',
  description: '',
};

export default function MeetingsPage({ mode = 'all' }) {
  const { addActivity, currentUser, meetings, searchQuery, setMeetings } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const canCreate = can(currentUser, 'create_meeting');
  const canEdit = can(currentUser, 'edit_meeting');
  const canDelete = can(currentUser, 'delete_meeting');

  const today = new Date('2026-05-23T00:00:00');
  const query = searchQuery.trim().toLowerCase();

  const sortedMeetings = useMemo(() => {
    return [...meetings]
      .filter((meeting) => {
        if (mode === 'upcoming' && new Date(`${meeting.date}T00:00:00`) < today) return false;
        if (!query) return true;
        const haystack = `${meeting.id} ${meeting.title} ${meeting.venue} ${meeting.description}`.toLowerCase();
        return haystack.includes(query);
      })
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  }, [meetings, mode, query, today]);

  const showForm = mode === 'create' || mode === 'all';
  const pageTitle =
    mode === 'create' ? 'Create Meeting' : mode === 'upcoming' ? 'Upcoming Meetings' : 'Meeting Management';

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canCreate && !editingId) return;
    if (!canEdit && editingId) return;

    if (editingId) {
      setMeetings((items) => items.map((meeting) => (meeting.id === editingId ? { ...meeting, ...form } : meeting)));
      addActivity(`Meeting ${editingId} updated`, currentUser.name);
    } else {
      setMeetings((items) => [
        {
          ...form,
          attendees: ['MAC Secretariat', currentUser.department],
        },
        ...items,
      ]);
      addActivity(`Meeting #${form.id.replace(/\D/g, '').slice(-3) || form.id} created`, currentUser.name);
    }

    resetForm();
  };

  const startEdit = (meeting) => {
    setEditingId(meeting.id);
    setForm({
      id: meeting.id,
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      venue: meeting.venue,
      priority: meeting.priority,
      description: meeting.description,
    });
  };

  const deleteMeeting = (meetingId) => {
    setMeetings((items) => items.filter((meeting) => meeting.id !== meetingId));
    addActivity(`Meeting ${meetingId} deleted`, currentUser.name);
    if (editingId === meetingId) resetForm();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        description="Create, update, and maintain meeting schedules with priority and venue details."
        eyebrow="Scheduling"
        title={pageTitle}
      />

      {!canCreate && showForm ? (
        <PermissionNotice>Meeting creation is available to Scientist and Technical Engineer roles in this prototype.</PermissionNotice>
      ) : null}

      <section className={`mt-6 grid gap-6 ${showForm ? 'xl:grid-cols-[0.9fr_1.1fr]' : ''}`}>
        {showForm ? (
        <form className="surface p-5" onSubmit={handleSubmit}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">
              {editingId ? 'Edit Meeting' : 'Create Meeting'}
            </h2>
            {editingId ? (
              <Button onClick={resetForm} size="sm" type="button" variant="secondary">
                Cancel
              </Button>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label mb-2 block">Meeting ID</span>
              <input className="field" onChange={(event) => updateField('id', event.target.value)} required value={form.id} />
            </label>
            <label className="block">
              <span className="label mb-2 block">Priority</span>
              <select className="field" onChange={(event) => updateField('priority', event.target.value)} value={form.priority}>
                {['Critical', 'High', 'Medium', 'Low'].map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="label mb-2 block">Meeting Title</span>
              <input className="field" onChange={(event) => updateField('title', event.target.value)} required value={form.title} />
            </label>
            <label className="block">
              <span className="label mb-2 block">Date</span>
              <input className="field" onChange={(event) => updateField('date', event.target.value)} required type="date" value={form.date} />
            </label>
            <label className="block">
              <span className="label mb-2 block">Time</span>
              <input className="field" onChange={(event) => updateField('time', event.target.value)} required type="time" value={form.time} />
            </label>
            <label className="block sm:col-span-2">
              <span className="label mb-2 block">Venue</span>
              <input className="field" onChange={(event) => updateField('venue', event.target.value)} required value={form.venue} />
            </label>
            <label className="block sm:col-span-2">
              <span className="label mb-2 block">Description</span>
              <textarea
                className="field min-h-28 resize-y"
                onChange={(event) => updateField('description', event.target.value)}
                required
                value={form.description}
              />
            </label>
          </div>

          <Button
            className="mt-5 w-full sm:w-auto"
            disabled={editingId ? !canEdit : !canCreate}
            icon={editingId ? 'edit' : 'plus'}
            type="submit"
          >
            {editingId ? 'Update' : 'Create'}
          </Button>
        </form>
        ) : null}

        <section className="space-y-4">
          {sortedMeetings.map((meeting) => (
            <article key={meeting.id} className="surface p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge tone={priorityTone(meeting.priority)}>{meeting.priority}</Badge>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{meeting.id}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{meeting.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{meeting.description}</p>
                  <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                    {formatDate(meeting.date)} | {meeting.time} | {meeting.venue}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button disabled={!canEdit} icon="edit" onClick={() => startEdit(meeting)} size="sm" variant="secondary">
                    Edit
                  </Button>
                  <Button disabled={!canDelete} icon="trash" onClick={() => deleteMeeting(meeting.id)} size="sm" variant="danger">
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </section>
    </div>
  );
}
