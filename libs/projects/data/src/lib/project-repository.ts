import { inject, injectable } from 'inversify';
import { eq } from 'drizzle-orm';
import { SHARED_TOKENS } from '@pm/shared-kernel';
import type { Project, ProjectRepository } from '@pm/projects-core-model';
import type { Database } from './database';
import { projects } from './schema';

@injectable()
export class DrizzleProjectRepository implements ProjectRepository {
  constructor(@inject(SHARED_TOKENS.Database) private readonly db: Database) {}

  async save(project: Project): Promise<void> {
    await this.db
      .insert(projects)
      .values({
        id: project.id,
        name: project.name,
        description: project.description ?? null,
        ownerId: project.ownerId,
        createdAt: project.createdAt,
      })
      .onConflictDoUpdate({
        target: projects.id,
        set: { name: project.name, description: project.description ?? null },
      });
  }

  async findById(id: string): Promise<Project | null> {
    const rows = await this.db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return rows[0] ? toProject(rows[0]) : null;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(projects).where(eq(projects.id, id));
  }
}

function toProject(row: typeof projects.$inferSelect): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    ownerId: row.ownerId,
    createdAt: row.createdAt,
  };
}
