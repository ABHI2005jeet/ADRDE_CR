import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MeetingsPage from './pages/MeetingsPage.jsx';
import AgendaPage from './pages/AgendaPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import TimelinePage from './pages/TimelinePage.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AccessPage from './pages/AccessPage.jsx';
import AppShell from './components/layout/AppShell.jsx';
import { useApp } from './context/AppContext.jsx';

const pages = {
  dashboard: DashboardPage,
  meetings: MeetingsPage,
  agendas: AgendaPage,
  calendar: CalendarPage,
  timeline: TimelinePage,
  documents: DocumentsPage,
  reports: ReportsPage,
  notifications: NotificationsPage,
  profile: ProfilePage,
  access: AccessPage,
};

export default function App() {
  const { currentUser, activePage } = useApp();

  if (!currentUser) {
    return <LoginPage />;
  }

  const ActivePage = pages[activePage] || DashboardPage;

  return (
    <AppShell>
      <ActivePage />
    </AppShell>
  );
}
