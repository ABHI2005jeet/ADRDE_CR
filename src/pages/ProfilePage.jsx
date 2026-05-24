import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader.jsx';
import ActivityFeed from '../components/dashboard/ActivityFeed.jsx';
import { useApp } from '../context/AppContext.jsx';
import { tasks } from '../mockData/tasks.js';
import { can } from '../utils/permissions.js';
import { formatDate } from '../utils/formatters.js';

export default function ProfilePage() {
  const { currentUser, addActivity } = useApp();
  const [suggestion, setSuggestion] = useState('');

  const fields = [
    ['Name', currentUser?.name],
    ['Employee ID', currentUser?.employeeId],
    ['Department', currentUser?.department],
    ['Role', currentUser?.role],
    ['Email', currentUser?.email],
    ['Phone', currentUser?.phone],
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Your MAC module account information and role-specific workspace"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface p-6">
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-adrde-navy text-2xl font-semibold text-white">
              {currentUser?.name?.charAt(0)}
            </span>
            <div>
              <p className="text-lg font-semibold text-adrde-navy dark:text-slate-100">
                {currentUser?.name}
              </p>
              <p className="text-sm text-slate-500">{currentUser?.role}</p>
            </div>
          </div>
          <dl className="space-y-3">
            {fields.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800 sm:flex-row sm:justify-between">
                <dt className="label">{label}</dt>
                <dd className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-6">
          {can(currentUser, 'manage_tasks') && (
            <div className="surface p-6">
              <h2 className="mb-4 text-sm font-semibold text-adrde-navy dark:text-slate-100">
                Assigned Tasks
              </h2>
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="rounded-md border border-slate-100 px-3 py-2 dark:border-slate-800"
                  >
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-slate-500">
                      Due {formatDate(task.dueDate)} · {task.status}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {can(currentUser, 'submit_suggestion') && (
            <div className="surface p-6">
              <h2 className="mb-3 text-sm font-semibold text-adrde-navy dark:text-slate-100">
                Submit Suggestion
              </h2>
              <textarea
                className="field min-h-[90px]"
                placeholder="Share agenda or process suggestions..."
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
              />
              <button
                type="button"
                className="mt-3 rounded-md bg-adrde-navy px-4 py-2 text-sm font-semibold text-white hover:bg-adrde-blue"
                onClick={() => {
                  if (!suggestion.trim()) return;
                  addActivity(`Suggestion submitted: ${suggestion.slice(0, 60)}...`, currentUser.role);
                  setSuggestion('');
                }}
              >
                Submit
              </button>
            </div>
          )}

          <ActivityFeed limit={8} title="Recent Activity Feed" />
        </div>
      </div>
    </div>
  );
}
