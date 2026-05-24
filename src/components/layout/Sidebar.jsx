import logoUrl from '../../assets/adrde-logo.svg';
import { useApp } from '../../context/AppContext.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'meetings', label: 'Meetings', icon: 'calendar' },
  { id: 'agendas', label: 'Agendas', icon: 'agenda' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'timeline', label: 'Timeline', icon: 'timeline' },
  { id: 'documents', label: 'Documents', icon: 'document' },
  { id: 'reports', label: 'Reports', icon: 'report' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'access', label: 'Role Access', icon: 'shield' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { activePage, currentUser, setActivePage } = useApp();

  const selectPage = (page) => {
    setActivePage(page);
    onClose?.();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white shadow-soft transition-transform duration-200 dark:border-slate-800 dark:bg-slate-950 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5 dark:border-slate-800">
          <img src={logoUrl} alt="ADRDE logo placeholder" className="h-12 w-12 rounded-lg" />
          <div>
            <p className="text-sm font-bold text-slate-950 dark:text-white">ADRDE Agra</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">MAC Agenda Dashboard</p>
          </div>
          <Button className="ml-auto lg:hidden" icon="x" iconOnly onClick={onClose} size="icon" variant="ghost">
            Close sidebar
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => {
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold transition ${
                  active
                    ? 'bg-adrde-navy text-white dark:bg-blue-500'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
                }`}
                onClick={() => selectPage(item.id)}
                type="button"
              >
                <Icon name={item.icon} className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">{currentUser.name}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {currentUser.role} | {currentUser.department}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
