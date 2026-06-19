import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const roles = ['Para Head', 'Scientist', 'Technical Officer', 'Staff', 'Contractual Worker', 'Intern'];

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', employeeId: '', password: '', role: 'Staff' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      toast.success('Registration successful');
      navigate('/app');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <form className="surface w-full max-w-md p-6 animate-slide-up" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="mt-2 text-sm text-slate-500">Create your ADRDE portal account.</p>
        <div className="mt-4 space-y-3">
          {[
            ['Full Name', 'name', 'text'],
            ['Email Address', 'email', 'email'],
            ['Employee ID', 'employeeId', 'text'],
            ['Password', 'password', 'password'],
          ].map(([label, key, type]) => (
            <label key={key} className="block">
              <span className="label mb-2 block">{label}</span>
              <input className="field" type={type} required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </label>
          ))}
          <label className="block">
            <span className="label mb-2 block">Role</span>
            <select className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </label>
        </div>
        <Button className="mt-6 w-full" disabled={submitting} type="submit">{submitting ? 'Creating...' : 'Register'}</Button>
        <p className="mt-4 text-sm"><Link className="text-adrde-blue hover:underline" to="/login">Back to login</Link></p>
      </form>
    </main>
  );
}
