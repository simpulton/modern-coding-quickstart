// CQRS read path for users: direct DB reads returning DTOs (never the password hash).

import { asc, eq } from 'drizzle-orm';
import type { PgliteDatabase } from 'drizzle-orm/pglite';
import { users } from './schema';

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
}

export async function listUsers(db: PgliteDatabase): Promise<UserSummary[]> {
  return db
    .select({ id: users.id, email: users.email, name: users.name, role: users.role })
    .from(users)
    .orderBy(asc(users.name));
}

export async function getUser(db: PgliteDatabase, id: string): Promise<UserSummary | null> {
  const rows = await db
    .select({ id: users.id, email: users.email, name: users.name, role: users.role })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return rows[0] ?? null;
}
