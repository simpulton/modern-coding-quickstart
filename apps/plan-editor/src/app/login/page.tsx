'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push('/projects');
        router.refresh();
      } else {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Login failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1>Sign in</h1>
      <p>Seed users: admin@example.com / Admin123!, alice@example.com / Password1!</p>
      <form onSubmit={(e) => { void handleSubmit(e); }}>
        <div>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="login-email"
            required
          />
        </div>
        <div>
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="login-password"
            required
          />
        </div>
        {error && (
          <p data-testid="login-error" style={{ color: 'red' }}>
            {error}
          </p>
        )}
        <button type="submit" data-testid="login-submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}
