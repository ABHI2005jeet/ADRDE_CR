export default function DonutChart({ label, value }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4">
      <div className="relative h-44 w-44">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-slate-200 dark:text-slate-800"
            cx="50"
            cy="50"
            fill="none"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
          />
          <circle
            className="text-emerald-600 dark:text-emerald-400"
            cx="50"
            cy="50"
            fill="none"
            r={radius}
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth="10"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-950 dark:text-white">{value}%</span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        </div>
      </div>
    </div>
  );
}
