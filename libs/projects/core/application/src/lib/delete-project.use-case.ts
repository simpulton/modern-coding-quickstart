import { assertCanModifyProject } from '@pm/projects-core-model';
import type { ProjectActor, ProjectRepository } from '@pm/projects-core-model';
import { NotFoundError } from '@pm/shared-kernel';

export interface DeleteProjectInput {
  projectId: string;
  actor: ProjectActor;
}

export interface DeleteProjectDeps {
  projectRepository: ProjectRepository;
}

export async function deleteProjectUseCase(
  input: DeleteProjectInput,
  deps: DeleteProjectDeps,
): Promise<void> {
  const existing = await deps.projectRepository.findById(input.projectId);
  if (!existing) {
    throw new NotFoundError('Project', input.projectId);
  }
  assertCanModifyProject(existing, input.actor);
  await deps.projectRepository.delete(input.projectId);
}
