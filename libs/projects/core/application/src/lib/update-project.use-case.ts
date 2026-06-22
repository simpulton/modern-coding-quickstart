import { assertCanModifyProject } from '@pm/projects-core-model';
import type { Project, ProjectActor, ProjectRepository } from '@pm/projects-core-model';
import { NotFoundError } from '@pm/shared-kernel';

export interface UpdateProjectInput {
  projectId: string;
  name?: string;
  description?: string;
  actor: ProjectActor;
}

export interface UpdateProjectDeps {
  projectRepository: ProjectRepository;
}

export async function updateProjectUseCase(
  input: UpdateProjectInput,
  deps: UpdateProjectDeps,
): Promise<Project> {
  const existing = await deps.projectRepository.findById(input.projectId);
  if (!existing) {
    throw new NotFoundError('Project', input.projectId);
  }
  assertCanModifyProject(existing, input.actor);

  const updated: Project = {
    ...existing,
    name: input.name?.trim() || existing.name,
    description:
      input.description === undefined ? existing.description : input.description.trim() || undefined,
  };
  await deps.projectRepository.save(updated);
  return updated;
}
