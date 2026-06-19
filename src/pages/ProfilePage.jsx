import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader.jsx';
import ActivityFeed from '../components/dashboard/ActivityFeed.jsx';
import Button from '../components/ui/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { tasks } from '../mockData/tasks.js';
import { can } from '../utils/permissions.js';
import { formatDate } from '../utils/formatters.js';

export default function ProfilePage() {
  const { currentUser, addActivity, setActivePage } = useApp();
  const [suggestion, setSuggestion] = useState('');

  const fields = [
    ['Name', currentUser?.name],
    ['Employee ID', currentUser?.employeeId],
    ['Department', currentUser?.department],
    ['Role', currentUser?.role],
    ['Email', currentUser?.email || '—'],
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Your portal account information and workspace tools"
        actions={<Button onClick={() => setActivePage('settings')} size="sm" variant="secondary">Edit in Settings</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface p-6">
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-adrde-navy text-2xl font-semibold text-white">
              {currentUser?.name?.charAt(0)}
            </span>
            <div>
              <p className="text-lg font-semibold">{currentUser?.name}</p>
              <p className="text-sm text-slate-500">{currentUser?.role}</p>
              <p className="text-xs text-slate-500">{currentUser?.department}</p>
            </div>
          </div>
          <dl className="space-y-3">
            {fields.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800 sm:flex-row sm:justify-between">
                <dt className="label">{label}</dt>
                <dd className="text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-6">
          {can(currentUser, 'manage_tasks') ? (
            <div className="surface p-6">
              <h2 className="mb-4 text-sm font-semibold">Assigned Tasks</h2>
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li key={task.id} className="rounded-md border border-slate-100 px-3 py-2 dark:border-slate-800">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-slate-500">Due {formatDate(task.dueDate)} · {task.status}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {can(currentUser, 'submit_suggestion') ? (
            <div className="surface p-6">
              <h2 className="mb-3 text-sm font-semibold">Submit Suggestion</h2>
              <textarea className="field min-h-[90px]" placeholder="Share process or workflow suggestions..." value={suggestion} onChange={(e) => setSuggestion(e.target.value)} />
              <Button className="mt-3" onClick={() => { if (!suggestion.trim()) return; addActivity(`Suggestion submitted: ${suggestion.slice(0, 60)}...`, currentUser.name); setSuggestion(''); }} size="sm">Submit</Button>
            </div>
          ) : null}

          <ActivityFeed limit={8} title="Recent Activity Feed" />
        </div>
      </div>
    </div>
  );
}
