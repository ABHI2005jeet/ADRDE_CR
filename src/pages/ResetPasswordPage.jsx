import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { authApi } from '../services/api.js';
import Button from '../components/ui/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [params] = useSearchParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await authApi.resetPassword({ token, email: params.get('email'), password });
      toast.success('Password updated. Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <form className="surface w-full max-w-md p-6" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <label className="mt-4 block">
          <span className="label mb-2 block">New Password</span>
          <input className="field" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <Button className="mt-6 w-full" disabled={submitting} type="submit">Update password</Button>
        <p className="mt-4 text-sm"><Link className="text-adrde-blue hover:underline" to="/login">Back to login</Link></p>
      </form>
    </main>
  );
}
