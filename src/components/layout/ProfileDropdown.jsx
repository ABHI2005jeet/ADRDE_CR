import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../ui/Button.jsx';

export default function ProfileDropdown() {
  const { currentUser, setActivePage } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-2 py-1.5 text-left transition duration-200 hover:bg-white/15"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-adrde-navy">
          {currentUser.name?.charAt(0) || 'U'}
        </span>
        <span className="hidden sm:block">
          <span className="block text-sm font-semibold text-white">{currentUser.name}</span>
          <span className="block text-xs text-slate-300">{currentUser.role}</span>
        </span>
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-md border border-slate-200 bg-white py-2 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{currentUser.name}</p>
            <p className="mt-1 text-xs text-slate-500">{currentUser.role}</p>
            <p className="text-xs text-slate-500">{currentUser.department}</p>
          </div>
          <button type="button" className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => { setActivePage('profile'); setOpen(false); }}>
            Profile
          </button>
          <button type="button" className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => { setActivePage('settings'); setOpen(false); }}>
            Settings
          </button>
          <div className="px-4 py-2">
            <Button className="w-full" icon="logout" onClick={handleLogout} size="sm" variant="danger">
              Logout
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
