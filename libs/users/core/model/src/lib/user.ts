// User domain entity: identity, role, and the factory that enforces its invariants.

export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface NewUserInput {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  now: Date;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createUser(input: NewUserInput): User {
  const email = input.email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    throw new Error(`Invalid email: ${input.email}`);
  }
  const name = input.name.trim();
  if (name.length === 0) {
    throw new Error('User name must not be empty');
  }
  if (input.passwordHash.length === 0) {
    throw new Error('User must have a password hash');
  }
  return {
    id: input.id,
    email,
    passwordHash: input.passwordHash,
    name,
    role: input.role,
    createdAt: input.now,
  };
}

export function isAdmin(user: Pick<User, 'role'>): boolean {
  return user.role === 'admin';
}

// Repository port implemented by the data layer's Drizzle adapter.
export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
