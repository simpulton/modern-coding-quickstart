import type { UserSummary } from './types';

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
