export default function ParticipationChart({ data }) {
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.department}>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">{item.department}</span>
            <span className="text-slate-500 dark:text-slate-400">{item.value}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-adrde-blue transition-all duration-500 dark:bg-blue-400"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
