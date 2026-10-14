import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Section } from '../components/ui/Layout';
import { apiFetch } from '../lib/api';

interface LoginResponse {
  accessToken: string;
  user: { id: string; name: string; email: string; role: string };
}

export function Login(): React.ReactNode {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('cctv-token', result.accessToken);
      localStorage.setItem('cctv-user', JSON.stringify(result.user));
      navigate(result.user.role === 'CUSTOMER' ? '/portal' : '/admin');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section>
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold text-fg">
          Log in to your account
        </h1>
        <p className="mt-2 text-sm text-muted">
          Customers can view invoices, warranty, and AMC details. Staff can
          manage leads.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-fg-soft">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              autoComplete="email"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-fg-soft">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </Button>
        </form>
      </div>
    </Section>
  );
}

const inputClass =
  'w-full rounded-lg border border-line-strong bg-navy/60 px-3 py-2 text-sm text-fg placeholder:text-subtle outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 [color-scheme:dark]';
