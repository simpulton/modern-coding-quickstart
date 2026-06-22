// Grab-bag of unrelated helpers — Module 06 asks you to break this up into
// cohesive feature modules behind a folder + index.

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

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
