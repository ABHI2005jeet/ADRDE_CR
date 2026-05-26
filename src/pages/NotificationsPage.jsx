import PageHeader from '../components/ui/PageHeader.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useApp } from '../context/AppContext.jsx';

const typeTone = {
  Meeting: 'info',
  Agenda: 'success',
  Action: 'warning',
  Document: 'neutral',
  Inventory: 'neutral',
};

const filterMeta = {
  alerts: { title: 'Alerts', category: 'Alerts' },
  updates: { title: 'Updates', category: 'Updates' },
  messages: { title: 'Messages', category: 'Messages' },
};

export default function NotificationsPage({ filter = 'alerts' }) {
  const { notifications, searchQuery } = useApp();
  const meta = filterMeta[filter] || filterMeta.alerts;
  const query = searchQuery.trim().toLowerCase();

  const filtered = notifications.filter((item) => {
    const matchesCategory = item.category === meta.category;
    if (!matchesCategory) return false;
    if (!query) return true;
    return `${item.title} ${item.message} ${item.type}`.toLowerCase().includes(query);
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Notifications"
        title={meta.title}
        description="System alerts, workflow updates, and internal messages"
      />

      <div className="space-y-3">
        {filtered.map((item) => (
          <article key={item.id} className="surface flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-adrde-navy dark:text-slate-100">{item.title}</h2>
                <Badge tone={typeTone[item.type] || 'neutral'}>{item.type}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.message}</p>
            </div>
            <p className="shrink-0 text-xs text-slate-500">{item.time}</p>
          </article>
        ))}
        {!filtered.length ? <p className="text-sm text-slate-500">No notifications in this category.</p> : null}
      </div>
    </div>
  );
}
