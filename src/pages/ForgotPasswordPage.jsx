import { Link } from 'react-router-dom';
import { useState } from 'react';
import { authApi } from '../services/api.js';
import Button from '../components/ui/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const result = await authApi.forgotPassword({ email });
      toast.success(result.message);
      if (result.previewUrl) setPreviewUrl(result.previewUrl);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <form className="surface w-full max-w-md p-6" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your registered email to receive a reset link.</p>
        <label className="mt-4 block">
          <span className="label mb-2 block">Email</span>
          <input className="field" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <Button className="mt-6 w-full" disabled={submitting} type="submit">Send reset link</Button>
        {previewUrl ? (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            Mock email mode — reset link: <a className="underline" href={previewUrl}>{previewUrl}</a>
          </div>
        ) : null}
        <p className="mt-4 text-sm"><Link className="text-adrde-blue hover:underline" to="/login">Back to login</Link></p>
      </form>
    </main>
  );
}
