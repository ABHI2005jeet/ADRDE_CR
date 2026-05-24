import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { agendaCompletion } from '../../mockData/index.js';

export default function AgendaCompletionChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={agendaCompletion}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={2}
          >
            {agendaCompletion.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-slate-600 dark:text-slate-400">
        {agendaCompletion.map((item) => (
          <li key={item.name} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
            {item.name} ({item.value}%)
          </li>
        ))}
      </ul>
    </div>
  );
}
