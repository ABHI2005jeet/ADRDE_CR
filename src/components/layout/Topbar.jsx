import { useApp } from '../../context/AppContext.jsx';
import Button from '../ui/Button.jsx';

const pageTitles = {
  dashboard: 'Dashboard Home',
  meetings: 'Meeting Management',
  agendas: 'Agenda Management',
  calendar: 'Calendar View',
  timeline: 'Meeting Timeline',
  documents: 'Document Center',
  reports: 'Reports',
  notifications: 'Notifications',
  access: 'Role Based Access',
  profile: 'Profile',
};

export default function Topbar({ onMenuClick }) {
  const { activePage, currentUser, logout, theme, toggleTheme } = useApp();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button className="lg:hidden" icon="menu" iconOnly onClick={onMenuClick} size="icon" variant="ghost">
            Open sidebar
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
              {pageTitles[activePage]}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              Signed in as {currentUser.employeeId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button icon={theme === 'dark' ? 'sun' : 'moon'} onClick={toggleTheme} size="sm" variant="secondary">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
          <Button icon="logout" onClick={logout} size="sm" variant="ghost">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
