import { inject, injectable } from 'inversify';
import { eq } from 'drizzle-orm';
import { SHARED_TOKENS } from '@pm/shared-kernel';
import type { Task, TaskRepository } from '@pm/projects-core-model';
import type { Database } from './database.js';
import { tasks } from './schema.js';

@injectable()
export class DrizzleTaskRepository implements TaskRepository {
  constructor(@inject(SHARED_TOKENS.Database) private readonly db: Database) {}

  async save(task: Task): Promise<void> {
    await this.db
      .insert(tasks)
      .values({
        id: task.id,
        title: task.title,
        description: task.description ?? null,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ?? null,
        projectId: task.projectId,
        assigneeId: task.assigneeId ?? null,
        createdAt: task.createdAt,
      })
      .onConflictDoUpdate({
        target: tasks.id,
        set: {
          title: task.title,
          description: task.description ?? null,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ?? null,
          assigneeId: task.assigneeId ?? null,
        },
      });
  }

  async findById(id: string): Promise<Task | null> {
    const rows = await this.db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    return rows[0] ? toTask(rows[0]) : null;
  }
}

function toTask(row: typeof tasks.$inferSelect): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status,
    priority: row.priority,
    dueDate: row.dueDate ?? undefined,
    projectId: row.projectId,
    assigneeId: row.assigneeId ?? undefined,
    createdAt: row.createdAt,
  };
}
