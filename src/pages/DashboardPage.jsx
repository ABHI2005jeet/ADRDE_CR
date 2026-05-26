import ActivityFeed from '../components/dashboard/ActivityFeed.jsx';
import BarChart from '../components/dashboard/BarChart.jsx';
import DonutChart from '../components/dashboard/DonutChart.jsx';
import ParticipationChart from '../components/dashboard/ParticipationChart.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import ChartCard from '../components/ui/ChartCard.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { departmentParticipation, monthlyMeetingTrend } from '../mockData/index.js';
import { can, permissionLabels, rolePermissions } from '../utils/permissions.js';

export default function DashboardPage() {
  const { activities, agendas, currentUser, documents, meetings, notifications, setActivePage } = useApp();
  const today = new Date('2026-05-23T00:00:00');
  const upcomingMeetings = meetings.filter((meeting) => new Date(`${meeting.date}T00:00:00`) >= today).length;
  const participants = new Set(meetings.flatMap((meeting) => meeting.attendees)).size;
  const pendingActions =
    agendas.filter((agenda) => agenda.status === 'Pending').length +
    documents.filter((document) => document.status !== 'Approved' && document.status !== 'Archived').length;
  const completedAgendas = agendas.filter((agenda) => agenda.status === 'Completed' || agenda.status === 'Approved').length;
  const completion = Math.round((completedAgendas / agendas.length) * 100);
  const permissions = rolePermissions[currentUser.role] || [];

  return (
    <div className="animate-fade-in">
      <PageHeader
        description="Internal monitoring and workflow management portal"
        eyebrow="ADRDE Agra"
        title="ADRDE Agra Internal Dashboard"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          helper="Scheduled from mock data"
          icon="calendar"
          label="Upcoming Meetings"
          onClick={() => setActivePage('meetings-upcoming')}
          tone="navy"
          value={upcomingMeetings}
        />
        <StatCard helper="Unique departments and groups" icon="users" label="Participants" tone="green" value={participants} />
        <StatCard
          helper="PDF, DOC, image records"
          icon="document"
          label="Documents"
          onClick={() => setActivePage('documents-view')}
          tone="slate"
          value={documents.filter((doc) => doc.status !== 'Archived').length}
        />
        <StatCard helper="Agendas and document reviews" icon="bell" label="Pending Actions" tone="amber" value={pendingActions} />
        <StatCard
          helper="Click to open agenda workspace"
          icon="agenda"
          label="Agendas"
          onClick={() => setActivePage('agendas')}
          tone="blue"
          value={agendas.length}
        />
      </section>

      <section className="mt-4 flex flex-wrap gap-3">
        <Button icon="calendar" onClick={() => setActivePage('calendar')} size="sm" variant="secondary">
          Open Calendar
        </Button>
        <Button icon="timeline" onClick={() => setActivePage('timeline')} size="sm" variant="secondary">
          Open Timeline
        </Button>
        <Button icon="bell" onClick={() => setActivePage('notifications-alerts')} size="sm" variant="secondary">
          View Notifications
        </Button>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard subtitle="Weekly distribution for the current mock month" title="Meetings This Month">
          <BarChart data={monthlyMeetingTrend} />
        </ChartCard>
        <ChartCard subtitle="Completed agendas against total agenda pool" title="Agenda Completion">
          <DonutChart label="Completed" value={completion} />
        </ChartCard>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <ChartCard subtitle="Department participation statistics" title="Participation by Department">
          <ParticipationChart data={departmentParticipation} />
        </ChartCard>

        <div className="surface p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">Notifications</h2>
            <button
              className="text-sm font-semibold text-adrde-blue hover:underline dark:text-blue-300"
              onClick={() => setActivePage('notifications-alerts')}
              type="button"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</p>
                  <Badge tone="info">{notification.category || notification.type}</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{notification.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="surface p-5">
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">Role Workspace</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{currentUser.role} permissions</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {permissions.map((permission) => (
              <Badge key={permission} tone={can(currentUser, permission) ? 'success' : 'neutral'}>
                {permissionLabels[permission] || permission}
              </Badge>
            ))}
          </div>
        </div>
        <ActivityFeed activities={activities.slice(0, 5)} title="Recent Activity" />
      </section>
    </div>
  );
}
