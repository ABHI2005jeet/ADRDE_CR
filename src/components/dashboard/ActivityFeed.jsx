import { useApp } from '../../context/AppContext.jsx';

export default function ActivityFeed({ activities: activitiesProp, limit, title = 'Recent Activity' }) {
  const { activities: contextActivities } = useApp();
  const source = activitiesProp || contextActivities;
  const items = limit ? source.slice(0, limit) : source;

  return (
    <div className="surface p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-white">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-md border border-slate-100 bg-slate-50/80 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/60"
          >
            <p className="text-sm text-slate-800 dark:text-slate-200">{item.text}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {item.actor} | {item.time}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
