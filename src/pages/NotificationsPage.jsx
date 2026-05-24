import PageHeader from '../components/ui/PageHeader.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useApp } from '../context/AppContext.jsx';

const typeTone = {
  Meeting: 'info',
  Agenda: 'success',
  Action: 'warning',
  Document: 'neutral',
};

export default function NotificationsPage() {
  const { notifications } = useApp();

  return (
    <div>
      <PageHeader
        eyebrow="Alerts"
        title="Notifications"
        description="System alerts for meetings, agendas, deadlines, and documents"
      />

      <div className="space-y-3">
        {notifications.map((item) => (
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
      </div>
    </div>
  );
}
