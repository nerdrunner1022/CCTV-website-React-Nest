import { useState, type FormEvent } from 'react';

interface AdminLoginProps {
  error: string | null;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (credentials: { email: string; password: string }) => void;
}

export function AdminLogin({
  error,
  isSubmitting,
  onBack,
  onSubmit,
}: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <section className="min-h-screen bg-surface px-6 py-16 text-on-surface">
      <div className="mx-auto max-w-md rounded-xl border border-surface-container-high bg-surface-container-low p-8 shadow-2xl">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
          Staff access
        </p>
        <h1 className="mt-3 text-2xl font-extrabold">Admin Console sign in</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Demo access only. Enter any email and password to explore the sample lead dashboard. Refreshing clears your changes.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm">
            Email
            <input
              autoComplete="username"
              className="mt-1 w-full rounded border border-surface-container-high bg-surface-container px-3 py-2 text-on-surface"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              autoComplete="current-password"
              className="mt-1 w-full rounded border border-surface-container-high bg-surface-container px-3 py-2 text-on-surface"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error && (
            <p className="rounded border border-error/40 bg-error-container/20 p-3 text-sm text-error">
              {error}
            </p>
          )}
          <button
            className="w-full rounded bg-primary-container px-4 py-3 font-mono text-sm font-bold uppercase text-on-primary-container disabled:cursor-wait disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Opening demo…' : 'Open demo console'}
          </button>
        </form>
        <button
          className="mt-5 text-sm text-on-surface-variant hover:text-primary"
          onClick={onBack}
          type="button"
        >
          Return to public site
        </button>
      </div>
    </section>
  );
}
