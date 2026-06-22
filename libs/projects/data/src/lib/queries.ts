// CQRS read path: thin query functions that read the DB directly and return
// DTOs. No use cases, no repositories — reads bypass the domain layer.

import { asc, desc, eq } from 'drizzle-orm';
import type { Database } from './database';
import { projects, tasks } from './schema';

export interface ProjectSummary {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
}

export interface TaskSummary {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  dueDate?: Date;
}

export interface ProjectDetail extends ProjectSummary {
  description?: string;
  tags: string[];
  tasks: TaskSummary[];
}

export async function listProjects(db: Database): Promise<ProjectSummary[]> {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      ownerId: projects.ownerId,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .orderBy(desc(projects.createdAt));
}

export async function getProjectDetail(db: Database, projectId: string): Promise<ProjectDetail | null> {
  const projectRows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  const project = projectRows[0];
  if (!project) {
    return null;
  }
  const taskRows = await listTasks(db, projectId);
  return {
    id: project.id,
    name: project.name,
    description: project.description ?? undefined,
    tags: project.tags,
    ownerId: project.ownerId,
    createdAt: project.createdAt,
    tasks: taskRows,
  };
}

export async function listTasks(db: Database, projectId: string): Promise<TaskSummary[]> {
  const rows = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      status: tasks.status,
      priority: tasks.priority,
      assigneeId: tasks.assigneeId,
      dueDate: tasks.dueDate,
    })
    .from(tasks)
    .where(eq(tasks.projectId, projectId))
    .orderBy(asc(tasks.createdAt));

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    priority: row.priority,
    assigneeId: row.assigneeId ?? undefined,
    dueDate: row.dueDate ?? undefined,
  }));
}
