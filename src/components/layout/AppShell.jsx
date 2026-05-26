import PortalNavbar from './PortalNavbar.jsx';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PortalNavbar />
      <main className="mx-auto w-full max-w-7xl animate-fade-in px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
