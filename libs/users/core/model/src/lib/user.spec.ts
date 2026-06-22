import { createUser, isAdmin } from './user';

describe('createUser', () => {
  const base = {
    id: 'u1',
    passwordHash: 'hashed',
    name: 'Alice',
    role: 'member' as const,
    now: new Date('2026-06-22T00:00:00Z'),
  };

  it('normalizes the email to lowercase and trims it', () => {
    const user = createUser({ ...base, email: '  Alice@Example.com ' });
    expect(user.email).toBe('alice@example.com');
  });

  it('rejects a malformed email', () => {
    expect(() => createUser({ ...base, email: 'not-an-email' })).toThrow(/Invalid email/);
  });

  it('rejects an empty password hash', () => {
    expect(() => createUser({ ...base, email: 'a@b.co', passwordHash: '' })).toThrow(/password hash/);
  });

  it('identifies admins', () => {
    expect(isAdmin({ role: 'admin' })).toBe(true);
    expect(isAdmin({ role: 'member' })).toBe(false);
  });
});
