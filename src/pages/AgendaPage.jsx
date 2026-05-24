import { useMemo, useState } from 'react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import PermissionNotice from '../components/ui/PermissionNotice.jsx';
import { useApp } from '../context/AppContext.jsx';
import { priorityTone } from '../utils/formatters.js';
import { can } from '../utils/permissions.js';

const statusTone = {
  Pending: 'warning',
  Approved: 'info',
  Completed: 'success',
};

export default function AgendaPage() {
  const { addActivity, agendas, currentUser, setAgendas } = useApp();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const canApprove = can(currentUser, 'approve_agenda');

  const filteredAgendas = useMemo(() => {
    return agendas.filter((agenda) => {
      const searchable = `${agenda.id} ${agenda.topic} ${agenda.department}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesStatus = status === 'All' || agenda.status === status;
      const matchesPriority = priority === 'All' || agenda.priority === priority;
      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [agendas, priority, query, status]);

  const approveAgenda = (agendaId) => {
    setAgendas((items) => items.map((agenda) => (agenda.id === agendaId ? { ...agenda, status: 'Approved' } : agenda)));
    addActivity(`Agenda ${agendaId} approved`, currentUser.role);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        description="Search, filter, and approve agenda items across departments."
        eyebrow="Workflow"
        title="Agenda Management"
      />

      {!canApprove ? <PermissionNotice>Agenda approval is available to Admin and Para Head roles.</PermissionNotice> : null}

      <section className="surface mt-6 overflow-hidden">
        <div className="grid gap-3 border-b border-slate-200 p-5 dark:border-slate-800 md:grid-cols-[1fr_180px_180px]">
          <label className="relative block">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="field pl-9"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search agendas, departments, IDs"
              value={query}
            />
          </label>
          <select className="field" onChange={(event) => setStatus(event.target.value)} value={status}>
            {['All', 'Pending', 'Approved', 'Completed'].map((item) => (
              <option key={item} value={item}>
                {item} Status
              </option>
            ))}
          </select>
          <select className="field" onChange={(event) => setPriority(event.target.value)} value={priority}>
            {['All', 'Critical', 'High', 'Medium', 'Low'].map((item) => (
              <option key={item} value={item}>
                {item} Priority
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left dark:divide-slate-800">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">Agenda ID</th>
                <th className="px-5 py-3">Topic</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredAgendas.map((agenda) => (
                <tr key={agenda.id} className="align-top">
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">{agenda.id}</td>
                  <td className="max-w-sm px-5 py-4 text-sm text-slate-700 dark:text-slate-200">{agenda.topic}</td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{agenda.department}</td>
                  <td className="px-5 py-4">
                    <Badge tone={priorityTone(agenda.priority)}>{agenda.priority}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={statusTone[agenda.status]}>{agenda.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      disabled={!canApprove || agenda.status !== 'Pending'}
                      onClick={() => approveAgenda(agenda.id)}
                      size="sm"
                      variant="secondary"
                    >
                      Approve
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
