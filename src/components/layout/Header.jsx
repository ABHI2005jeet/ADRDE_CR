import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';

export default function Header({ onMenuClick }) {
  const { currentUser, logout, notifications } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm lg:hidden dark:border-slate-700"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            ☰
          </button>
          <div>
            <p className="text-xs uppercase tracking-wide text-adrde-steel">MAC Module</p>
            <p className="text-sm font-semibold text-adrde-navy dark:text-slate-100">
              Meeting Agenda Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden rounded-md bg-adrde-mist px-2 py-1 text-xs font-medium text-adrde-navy sm:inline dark:bg-slate-800 dark:text-slate-200">
            {notifications.length} alerts
          </span>
          <ThemeToggle />
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu((open) => !open)}
              className="flex items-center gap-2 rounded-md border border-slate-300 px-2 py-1.5 text-left text-sm dark:border-slate-700"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-adrde-navy text-xs font-semibold text-white">
                {currentUser?.name?.charAt(0) || 'U'}
              </span>
              <span className="hidden sm:block">
                <span className="block font-medium text-slate-800 dark:text-slate-100">
                  {currentUser?.name}
                </span>
                <span className="block text-xs text-slate-500">{currentUser?.role}</span>
              </span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
