import { useApp } from '../../context/AppContext.jsx';

/** Compact light/dark mode switch used in login and shell header */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span aria-hidden>{isDark ? '☀' : '☾'}</span>
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}
