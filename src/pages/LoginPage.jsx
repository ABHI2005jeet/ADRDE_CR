import { useState } from 'react';
import adrdeLogo from '../assets/adrde-logo.png';
import drdoLogo from '../assets/drdo-logo.svg';
import Button from '../components/ui/Button.jsx';
import { useApp } from '../context/AppContext.jsx';
import { loginRoles } from '../services/authService.js';

export default function LoginPage() {
  const { login, theme, toggleTheme } = useApp();
  const [form, setForm] = useState({
    name: '',
    employeeId: '',
    password: '',
    role: 'Scientist',
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
                <img src={drdoLogo} alt="DRDO logo placeholder" className="h-12 w-12 rounded-lg border border-slate-200 bg-white p-0.5" />
                <img src={adrdeLogo} alt="ADRDE logo" className="h-12 w-12 rounded-full border border-slate-200 bg-white object-cover" />
                <div>
                  <p className="text-lg font-bold text-slate-950 dark:text-white">ADRDE Agra</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Dashboard Portal</p>
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
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Enter your details below. Your workspace is saved locally per Employee ID (password is not stored).
                </p>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="label mb-2 block">Name</span>
                  <input
                    className="field"
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="Your full name"
                    required
                    type="text"
                    value={form.name}
                  />
                </label>

                <label className="block">
                  <span className="label mb-2 block">Employee ID</span>
                  <input
                    className="field"
                    onChange={(event) => updateField('employeeId', event.target.value)}
                    placeholder="ADRDE-EMP-000"
                    required
                    type="text"
                    value={form.employeeId}
                  />
                </label>

                <label className="block">
                  <span className="label mb-2 block">Password</span>
                  <input
                    className="field"
                    onChange={(event) => updateField('password', event.target.value)}
                    placeholder="Enter password"
                    required
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
                    {loginRoles.map((role) => (
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">ADRDE Agra · DRDO</p>
            <h2 className="mt-5 text-4xl font-bold leading-tight">Internal monitoring and workflow management portal</h2>
            <p className="mt-5 text-base leading-7 text-blue-100">
              Meetings, documents, letters, inventory, reports, and notifications in a single responsive government-style
              workspace with role-aware mock permissions.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Meetings', 'Documents', 'Inventory'].map((item) => (
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
