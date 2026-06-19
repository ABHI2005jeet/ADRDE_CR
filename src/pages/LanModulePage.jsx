import { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function LanModulePage({ moduleKey }) {
  const { shortcutApi, setActivePage } = useApp();
  const [module, setModule] = useState(null);

  useEffect(() => {
    if (!moduleKey) return;
    shortcutApi.get(moduleKey).then(setModule).catch(() => setModule(null));
  }, [moduleKey, shortcutApi]);

  if (!module) {
    return <div className="surface p-6 text-sm text-slate-500">Loading module...</div>;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        description={module.description}
        eyebrow="ADRDE LAN Portal"
        title={module.title}
        actions={<Button onClick={() => setActivePage('dashboard')} size="sm" variant="secondary">Back to Dashboard</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-2">
          <h2 className="font-semibold">Module Overview</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            This internal module mirrors ADRDE LAN portal services. External integration can be configured by Admin from Settings.
          </p>
          <ul className="mt-4 list-inside list-disc text-sm text-slate-600 dark:text-slate-300">
            <li>Sample content and service description</li>
            <li>Statistics and visit tracking enabled</li>
            <li>Future external URL: {module.externalUrl || 'Not configured yet'}</li>
          </ul>
        </div>
        <div className="surface p-5">
          <h2 className="font-semibold">Statistics</h2>
          <p className="mt-3 text-3xl font-bold text-adrde-navy dark:text-white">{module.stats?.visits || 0}</p>
          <p className="text-sm text-slate-500">Total visits</p>
          {module.stats?.lastVisited ? (
            <p className="mt-2 text-xs text-slate-500">Last visited: {new Date(module.stats.lastVisited).toLocaleString('en-IN')}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
