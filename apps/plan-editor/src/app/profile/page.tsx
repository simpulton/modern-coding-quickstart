'use client';

import Link from 'next/link';
import { trpc } from '../../trpc/client';

export default function ProfilePage() {
  const me = trpc.users.me.useQuery(undefined, { retry: false });

  if (me.isLoading) {
    return <p>Loading…</p>;
  }

  if (!me.data) {
    return (
      <section>
        <p>Not signed in.</p>
        <Link href="/login">Sign in</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Profile</h1>
      <p data-testid="profile-name">{me.data.name}</p>
      <p data-testid="profile-email">{me.data.email}</p>
      <p data-testid="profile-role">{me.data.role}</p>
    </section>
  );
}
