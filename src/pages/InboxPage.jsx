import { useEffect, useMemo, useState } from 'react';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const modeMeta = {
  mail: { title: 'Internal Mail', category: 'mail' },
  chats: { title: 'Chats', category: 'chat' },
  team: { title: 'Team Messages', category: 'team' },
};

export default function InboxPage({ mode = 'mail' }) {
  const { currentUser, messages, users, messageApi, refreshAll, searchQuery } = useApp();
  const toast = useToast();
  const meta = modeMeta[mode] || modeMeta.mail;
  const [form, setForm] = useState({ to: '', subject: '', body: '' });
  const [teamMessages, setTeamMessages] = useState([]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const source = mode === 'team' ? teamMessages : messages.filter((m) => m.category === meta.category || mode === 'mail');
    if (!q) return source;
    return source.filter((m) => `${m.subject} ${m.body} ${m.fromName}`.toLowerCase().includes(q));
  }, [messages, teamMessages, mode, meta.category, searchQuery]);

  useEffect(() => {
    if (mode === 'team') {
      messageApi.team().then(setTeamMessages).catch(() => {});
    }
  }, [mode, messageApi]);

  const sendMessage = async (event) => {
    event.preventDefault();
    try {
      await messageApi.send({ ...form, category: meta.category });
      toast.success('Message sent');
      setForm({ to: '', subject: '', body: '' });
      refreshAll();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader description="Internal communication with realtime updates." eyebrow="Inbox" title={meta.title} />
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="surface p-5" onSubmit={sendMessage}>
          <h2 className="font-semibold">Compose</h2>
          <div className="mt-4 space-y-3">
            <select className="field" required value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}>
              <option value="">Select recipient</option>
              {users.filter((u) => u.id !== currentUser?.id).map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
            <input className="field" placeholder="Subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <textarea className="field min-h-28" placeholder="Message" required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>
          <Button className="mt-4" type="submit">Send</Button>
        </form>
        <div className="space-y-3">
          {filtered.length ? filtered.map((msg) => (
            <article key={msg._id || msg.id} className="surface p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-semibold">{msg.subject}</p>
                <Badge tone={msg.read ? 'neutral' : 'info'}>{msg.read ? 'Read' : 'Unread'}</Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{msg.body}</p>
              <p className="mt-2 text-xs text-slate-500">From {msg.fromName} · {new Date(msg.createdAt || Date.now()).toLocaleString('en-IN')}</p>
            </article>
          )) : (
            <div className="surface p-6 text-sm text-slate-500">No messages in this folder.</div>
          )}
        </div>
      </section>
    </div>
  );
}
