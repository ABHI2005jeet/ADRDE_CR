const tones = {
  danger: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200',
  warning: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  info: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200',
  success: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
};

export default function Badge({ children, tone = 'neutral' }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold ${tones[tone] || tones.neutral}`}
    >
      {children}
    </span>
  );
}
