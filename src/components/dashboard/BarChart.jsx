export default function BarChart({ data }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="flex h-64 items-end gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
          <div className="flex h-48 w-full items-end rounded-md bg-slate-100 p-1 dark:bg-slate-800">
            <div
              className="w-full rounded bg-adrde-blue transition-all duration-500 dark:bg-blue-400"
              style={{ height: `${Math.max((item.value / max) * 100, 8)}%` }}
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{item.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
