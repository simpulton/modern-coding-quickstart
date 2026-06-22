'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trpc } from '../trpc/client';

export function NavBar() {
  const router = useRouter();
  const me = trpc.users.me.useQuery(undefined, { retry: false });

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await me.refetch();
    router.push('/login');
  }

  return (
    <nav className="navbar" data-testid="navbar">
      <Link href="/projects">Projects</Link>
      <Link href="/users">Users</Link>
      <span className="spacer" />
      {me.data ? (
        <>
          <Link href="/profile" data-testid="nav-profile">
            {me.data.name}
          </Link>
          <button type="button" onClick={logout} data-testid="logout">
            Sign out
          </button>
        </>
      ) : (
        <Link href="/login" data-testid="nav-login">
          Sign in
        </Link>
      )}
    </nav>
  );
}
