'use client';

import Link from 'next/link';
import { trpc } from '../../trpc/client';
import { UserCard } from '@pm/users-ui';

export default function UsersPage() {
  const users = trpc.users.list.useQuery();

  if (users.isLoading) {
    return <p>Loading users…</p>;
  }

  return (
    <section>
      <h1>Users</h1>
      <ul data-testid="user-list">
        {users.data?.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>
              <UserCard user={user} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
