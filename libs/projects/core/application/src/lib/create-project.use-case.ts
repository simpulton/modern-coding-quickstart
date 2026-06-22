import { createProject } from '@pm/projects-core-model';
import type { Project, ProjectRepository } from '@pm/projects-core-model';
import type { Clock, IdGenerator } from '@pm/shared-kernel';

export interface CreateProjectInput {
  name: string;
  description?: string;
  actorId: string;
}

export interface CreateProjectDeps {
  projectRepository: ProjectRepository;
  clock: Clock;
  idGenerator: IdGenerator;
}

export async function createProjectUseCase(
  input: CreateProjectInput,
  deps: CreateProjectDeps,
): Promise<Project> {
  const project = createProject({
    id: deps.idGenerator.next(),
    name: input.name,
    description: input.description,
    ownerId: input.actorId,
    now: deps.clock.now(),
  });
  await deps.projectRepository.save(project);
  return project;
}
