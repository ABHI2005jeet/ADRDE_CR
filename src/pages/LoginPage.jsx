import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import adrdeLogo from '../assets/adrde-logo.png';
import drdoLogo from '../assets/drdo-logo.svg';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      toast.success('Login successful');
      navigate('/app');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md animate-slide-up">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={drdoLogo} alt="DRDO logo" className="h-12 w-12 rounded-lg border border-slate-200 bg-white p-0.5" />
                <img src={adrdeLogo} alt="ADRDE logo" className="h-12 w-12 rounded-full border border-slate-200 bg-white object-cover" />
                <div>
                  <p className="text-lg font-bold">ADRDE Agra</p>
                  <p className="text-sm text-slate-500">Dashboard Portal</p>
                </div>
              </div>
            </div>
            <form className="surface p-6" onSubmit={handleSubmit}>
              <h1 className="text-2xl font-bold">Sign in</h1>
              <p className="mt-2 text-sm text-slate-500">Registered users only — email and password.</p>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="label mb-2 block">Email</span>
                  <input className="field" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
                <label className="block">
                  <span className="label mb-2 block">Password</span>
                  <input className="field" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </label>
              </div>
              <Button className="mt-6 w-full" disabled={submitting} type="submit">
                {submitting ? 'Signing in...' : 'Login'}
              </Button>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link className="text-adrde-blue hover:underline" to="/register">Register</Link>
                <Link className="text-adrde-blue hover:underline" to="/forgot-password">Forgot password?</Link>
              </div>
            </form>
          </div>
        </section>
        <section className="hidden bg-adrde-navy px-10 py-12 text-white lg:flex lg:flex-col lg:justify-center">
          <h2 className="text-4xl font-bold">ADRDE Agra Internal Dashboard Portal</h2>
          <p className="mt-4 text-blue-100">Internal monitoring and workflow management with secure authentication.</p>
        </section>
      </div>
    </main>
  );
}
