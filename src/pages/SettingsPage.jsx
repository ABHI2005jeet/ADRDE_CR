import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { setActivePage } = useApp();
  const toast = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    contactInfo: user?.contactInfo || '',
  });

  const save = async (event) => {
    event.preventDefault();
    try {
      await updateProfile(form);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader description="Update your account preferences and contact details." eyebrow="Account" title="Settings" />
      <form className="surface max-w-xl space-y-4 p-6" onSubmit={save}>
        <label className="block">
          <span className="label mb-2 block">Name</span>
          <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="block">
          <span className="label mb-2 block">Department</span>
          <input className="field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        </label>
        <label className="block">
          <span className="label mb-2 block">Contact Info</span>
          <input className="field" value={form.contactInfo} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} />
        </label>
        <div className="flex gap-3">
          <Button type="submit">Save changes</Button>
          {user?.role === 'Admin' ? (
            <Button onClick={() => setActivePage('admin-settings')} type="button" variant="secondary">Admin panel</Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
