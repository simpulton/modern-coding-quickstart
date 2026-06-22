import { inject, injectable } from 'inversify';
import { eq } from 'drizzle-orm';
import { SHARED_TOKENS } from '@pm/shared-kernel';
import type { PgliteDatabase } from 'drizzle-orm/pglite';
import type { User, UserRepository } from '@pm/users-core-model';
import { users } from './schema';

export type Database = PgliteDatabase;

@injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(@inject(SHARED_TOKENS.Database) private readonly db: Database) {}

  async save(user: User): Promise<void> {
    await this.db
      .insert(users)
      .values({
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { name: user.name, passwordHash: user.passwordHash, role: user.role },
      });
  }

  async findById(id: string): Promise<User | null> {
    const rows = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0] ? toUser(rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);
    return rows[0] ? toUser(rows[0]) : null;
  }
}

function toUser(row: typeof users.$inferSelect): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    name: row.name,
    role: row.role,
    createdAt: row.createdAt,
  };
}
