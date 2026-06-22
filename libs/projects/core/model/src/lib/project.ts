// Project domain entity: identity, factory, and the ownership invariant.

import { ForbiddenError } from '@pm/shared-kernel';

export type UserRole = 'admin' | 'member';

export interface Project {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  ownerId: string;
  createdAt: Date;
}

export interface NewProjectInput {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  ownerId: string;
  now: Date;
}

export function createProject(input: NewProjectInput): Project {
  const name = input.name.trim();
  if (name.length === 0) {
    throw new Error('Project name must not be empty');
  }
  return {
    id: input.id,
    name,
    description: input.description?.trim() || undefined,
    tags: normalizeTags(input.tags),
    ownerId: input.ownerId,
    createdAt: input.now,
  };
}

function normalizeTags(tags: string[] | undefined): string[] {
  if (!tags) {
    return [];
  }
  const seen = new Set<string>();
  for (const tag of tags) {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed.length > 0) {
      seen.add(trimmed);
    }
  }
  return [...seen];
}

export interface ProjectActor {
  id: string;
  role: UserRole;
}

export function assertCanModifyProject(project: Project, actor: ProjectActor): void {
  const isOwner = project.ownerId === actor.id;
  const isAdmin = actor.role === 'admin';
  if (!isOwner && !isAdmin) {
    throw new ProjectAccessError(project.id, actor.id);
  }
}

export class ProjectAccessError extends ForbiddenError {
  constructor(projectId: string, actorId: string) {
    super(`User ${actorId} may not modify project ${projectId}: only the owner or an admin may.`);
    this.name = 'ProjectAccessError';
  }
}

// Repository port: the persistence contract the application layer depends on.
// The Drizzle adapter that implements it lives in the data layer.
export interface ProjectRepository {
  save(project: Project): Promise<void>;
  findById(id: string): Promise<Project | null>;
  delete(id: string): Promise<void>;
}
