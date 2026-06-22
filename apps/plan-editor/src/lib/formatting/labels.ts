export function roleLabel(role: 'admin' | 'member'): string {
  return role === 'admin' ? 'Administrator' : 'Member';
}

export function taskCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'task' : 'tasks'}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
}
