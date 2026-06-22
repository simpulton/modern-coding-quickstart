import type { inferRouterOutputs } from '@trpc/server';
import type { usersRouter } from '@pm/users-trpc';

// The user shape is the server's `users.detail` output, colocated with its only
// consumer rather than parked in a generic types file.
export type UserSummary = NonNullable<inferRouterOutputs<typeof usersRouter>['detail']>;

interface UserCardProps {
  user: UserSummary;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div data-testid="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
