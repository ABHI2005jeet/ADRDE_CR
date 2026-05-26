import { useMemo, useState } from 'react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import PermissionNotice from '../components/ui/PermissionNotice.jsx';
import { useApp } from '../context/AppContext.jsx';
import { formatDate } from '../utils/formatters.js';
import { can } from '../utils/permissions.js';

const modeMeta = {
  incoming: { title: 'Incoming Letters', direction: 'Incoming' },
  outgoing: { title: 'Outgoing Letters', direction: 'Outgoing' },
  draft: { title: 'Draft Letters', direction: 'Draft' },
};

const emptyForm = {
  subject: '',
  reference: '',
  department: '',
};

const statusTone = {
  Received: 'info',
  Dispatched: 'success',
  Draft: 'warning',
  Approved: 'success',
};

export default function LettersPage({ mode = 'incoming' }) {
  const { addActivity, currentUser, letters, searchQuery, setLetters } = useApp();
  const [form, setForm] = useState(emptyForm);
  const meta = modeMeta[mode] || modeMeta.incoming;
  const canCreate = can(currentUser, 'create_letter');
  const canApprove = can(currentUser, 'approve_letter');

  const filteredLetters = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return letters.filter((letter) => {
      const matchesMode = letter.direction === meta.direction;
      if (!matchesMode) return false;
      if (!query) return true;
      const haystack = `${letter.id} ${letter.subject} ${letter.reference} ${letter.department}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [letters, meta.direction, searchQuery]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canCreate) return;

    const newLetter = {
      id: `LTR-${mode === 'draft' ? 'DR' : mode === 'outgoing' ? 'OUT' : 'IN'}-${Date.now().toString().slice(-3)}`,
      direction: meta.direction,
      subject: form.subject,
      reference: form.reference,
      status: mode === 'draft' ? 'Draft' : mode === 'outgoing' ? 'Dispatched' : 'Received',
      date: new Date().toISOString().slice(0, 10),
      department: form.department || currentUser.department,
    };

    setLetters((items) => [newLetter, ...items]);
    addActivity(`Letter created: ${newLetter.reference}`, currentUser.name);
    setForm(emptyForm);
  };

  const approveLetter = (letterId) => {
    setLetters((items) =>
      items.map((letter) => (letter.id === letterId ? { ...letter, status: 'Approved' } : letter)),
    );
    addActivity('Letter approved', currentUser.name);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        description="Track incoming, outgoing, and draft correspondence with mock workflow actions."
        eyebrow="Correspondence"
        title={meta.title}
      />

      {!canCreate ? <PermissionNotice>Letter creation is limited for your role in this prototype.</PermissionNotice> : null}

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {canCreate ? (
          <form className="surface p-5" onSubmit={handleSubmit}>
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">Create / Register Letter</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="label mb-2 block">Subject</span>
                <input
                  className="field"
                  onChange={(event) => updateField('subject', event.target.value)}
                  required
                  value={form.subject}
                />
              </label>
              <label className="block">
                <span className="label mb-2 block">Reference Number</span>
                <input
                  className="field"
                  onChange={(event) => updateField('reference', event.target.value)}
                  required
                  value={form.reference}
                />
              </label>
              <label className="block">
                <span className="label mb-2 block">Department</span>
                <input
                  className="field"
                  onChange={(event) => updateField('department', event.target.value)}
                  placeholder={currentUser.department}
                  value={form.department}
                />
              </label>
            </div>
            <Button className="mt-5" icon="plus" type="submit">
              Save Letter
            </Button>
          </form>
        ) : null}

        <div className="surface overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLetters.map((letter) => (
                <tr key={letter.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium">{letter.id}</td>
                  <td className="px-4 py-3">{letter.subject}</td>
                  <td className="px-4 py-3">{letter.reference}</td>
                  <td className="px-4 py-3">{formatDate(letter.date)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone[letter.status] || 'neutral'}>{letter.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {canApprove && letter.status !== 'Approved' ? (
                      <Button onClick={() => approveLetter(letter.id)} size="sm" variant="secondary">
                        Approve
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredLetters.length ? (
            <p className="p-6 text-sm text-slate-500">No letters match the current filters.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
