import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import PermissionNotice from '../components/ui/PermissionNotice.jsx';

export default function AdminSettingsPage() {
  const { users, shortcuts, userApi, shortcutApi, refreshAll } = useApp();
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ key: '', title: '', description: '', externalUrl: '' });

  if (user?.role !== 'Admin') {
    return <PermissionNotice>Admin Settings are restricted to administrators.</PermissionNotice>;
  }

  const saveShortcut = async (event) => {
    event.preventDefault();
    try {
      await shortcutApi.upsert(form);
      toast.success('Shortcut saved');
      setForm({ key: '', title: '', description: '', externalUrl: '' });
      refreshAll();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await userApi.update(id, { role });
      toast.success('Role updated');
      refreshAll();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader description="Manage users, LAN shortcuts, and portal configuration." eyebrow="Administration" title="Admin Settings" />
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="surface p-5">
          <h2 className="font-semibold">Manage Users</h2>
          <div className="mt-4 space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 p-3 dark:border-slate-800">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <select className="field w-auto" value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}>
                  {['Admin', 'Para Head', 'Scientist', 'Technical Officer', 'Staff', 'Contractual Worker', 'Intern'].map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
        <form className="surface p-5" onSubmit={saveShortcut}>
          <h2 className="font-semibold">Manage LAN Shortcuts</h2>
          <div className="mt-4 space-y-3">
            <input className="field" placeholder="Key (e.g. drona-home)" required value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
            <input className="field" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="field min-h-20" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="field" placeholder="External URL (optional)" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} />
          </div>
          <Button className="mt-4" type="submit">Save Shortcut</Button>
          <p className="mt-4 text-xs text-slate-500">{shortcuts.length} shortcuts configured</p>
        </form>
      </section>
    </div>
  );
}
