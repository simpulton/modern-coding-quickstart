// Module 02 starting point: the prop is typed `any` behind an escape hatch.
// Your job is to give it a real, colocated type and remove the disable directive.

interface UserCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
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
