import { useState } from 'react';
import logoUrl from '../assets/adrde-logo.svg';
import Button from '../components/ui/Button.jsx';
import { useApp } from '../context/AppContext.jsx';

const roles = ['Admin', 'Para Head', 'Staff', 'Employee'];

export default function LoginPage() {
  const { login, theme, toggleTheme } = useApp();
  const [form, setForm] = useState({
    username: 'ADRDE-ADM-001',
    password: 'password',
    role: 'Admin',
  });

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    login(form);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md animate-slide-up">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="ADRDE logo placeholder" className="h-14 w-14 rounded-lg shadow-soft" />
                <div>
                  <p className="text-lg font-bold text-slate-950 dark:text-white">ADRDE Agra</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">MAC Agenda Dashboard</p>
                </div>
              </div>
              <Button icon={theme === 'dark' ? 'sun' : 'moon'} iconOnly onClick={toggleTheme} size="icon" variant="secondary">
                Toggle dark mode
              </Button>
            </div>

            <form className="surface p-6" onSubmit={handleSubmit}>
              <div className="mb-6">
                <p className="label mb-2">Secure prototype access</p>
                <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Sign in</h1>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="label mb-2 block">Username / Employee ID</span>
                  <input
                    className="field"
                    onChange={(event) => updateField('username', event.target.value)}
                    placeholder="ADRDE-EMP-000"
                    type="text"
                    value={form.username}
                  />
                </label>

                <label className="block">
                  <span className="label mb-2 block">Password</span>
                  <input
                    className="field"
                    onChange={(event) => updateField('password', event.target.value)}
                    placeholder="Enter password"
                    type="password"
                    value={form.password}
                  />
                </label>

                <label className="block">
                  <span className="label mb-2 block">Role</span>
                  <select
                    className="field"
                    onChange={(event) => updateField('role', event.target.value)}
                    value={form.role}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <Button className="mt-6 w-full" icon="shield" type="submit">
                Login
              </Button>
            </form>
          </div>
        </section>

        <section className="hidden bg-adrde-navy px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">Internal prototype</p>
            <h2 className="mt-5 text-4xl font-bold leading-tight">
              Meeting agenda control for structured MAC reviews.
            </h2>
            <p className="mt-5 text-base leading-7 text-blue-100">
              Manage schedules, agenda approvals, document flow, reports, notifications, and role-based oversight
              from a single responsive workspace.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Meetings', 'Agendas', 'Reports'].map((item) => (
              <div key={item} className="rounded-lg border border-white/15 bg-white/10 p-4">
                <p className="text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
