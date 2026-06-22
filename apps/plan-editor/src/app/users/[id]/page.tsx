'use client';

import { useParams } from 'next/navigation';
import { trpc } from '../../../trpc/client';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params['id'] as string;

  const user = trpc.users.detail.useQuery({ userId });

  if (user.isLoading) {
    return <p>Loading user…</p>;
  }

  if (!user.data) {
    return <p>User not found.</p>;
  }

  return (
    <section>
      <h1 data-testid="user-name">{user.data.name}</h1>
      <p data-testid="user-email">{user.data.email}</p>
      <p data-testid="user-role">{user.data.role}</p>
      <p data-testid="user-id">ID: {user.data.id}</p>
    </section>
  );
}
