import AccessPage from '../pages/AccessPage.jsx';
import AgendaPage from '../pages/AgendaPage.jsx';
import CalendarPage from '../pages/CalendarPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import DocumentsPage from '../pages/DocumentsPage.jsx';
import InventoryPage from '../pages/InventoryPage.jsx';
import LettersPage from '../pages/LettersPage.jsx';
import MeetingsPage from '../pages/MeetingsPage.jsx';
import NotificationsPage from '../pages/NotificationsPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import ReportsPage from '../pages/ReportsPage.jsx';
import TimelinePage from '../pages/TimelinePage.jsx';
import UsersPage from '../pages/UsersPage.jsx';
import SearchPage from '../pages/SearchPage.jsx';

export function resolvePage(activePage) {
  if (activePage === 'search') return SearchPage;
  if (activePage === 'dashboard' || activePage === 'agendas') {
    return activePage === 'agendas' ? AgendaPage : DashboardPage;
  }
  if (activePage.startsWith('meetings')) {
    return () => <MeetingsPage mode={activePage.replace('meetings-', '') || 'all'} />;
  }
  if (activePage === 'calendar') return CalendarPage;
  if (activePage === 'timeline') return TimelinePage;
  if (activePage === 'meetings-reports') {
    return () => <ReportsPage variant="meeting" />;
  }
  if (activePage.startsWith('documents')) {
    return () => <DocumentsPage mode={activePage.replace('documents-', '') || 'view'} />;
  }
  if (activePage.startsWith('letters')) {
    return () => <LettersPage mode={activePage.replace('letters-', '')} />;
  }
  if (activePage.startsWith('inventory')) {
    return () => <InventoryPage mode={activePage.replace('inventory-', '')} />;
  }
  if (activePage.startsWith('users')) {
    return () => <UsersPage mode={activePage.replace('users-', '')} />;
  }
  if (activePage === 'access') return AccessPage;
  if (activePage.startsWith('reports')) {
    return () => <ReportsPage variant={activePage.replace('reports-', '')} />;
  }
  if (activePage.startsWith('notifications')) {
    return () => <NotificationsPage filter={activePage.replace('notifications-', '')} />;
  }
  if (activePage === 'profile') return ProfilePage;
  return DashboardPage;
}
