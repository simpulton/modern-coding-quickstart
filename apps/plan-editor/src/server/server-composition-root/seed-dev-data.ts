import type { Container } from 'inversify';
import { SHARED_TOKENS } from '@pm/shared-kernel';
import type { Clock, IdGenerator, PasswordHasher } from '@pm/shared-kernel';
import type { UserRepository } from '@pm/users-core-model';
import { registerUserUseCase } from '@pm/users-core-application';
import { USERS_TOKENS } from '@pm/users-data';
import type { ProjectRepository } from '@pm/projects-core-model';
import { addTaskUseCase, createProjectUseCase } from '@pm/projects-core-application';
import { PROJECTS_TOKENS } from '@pm/projects-data';
import type { TaskRepository } from '@pm/projects-core-model';

// The seed users documented in docs/cheatsheet.md, identical to the E2E quickstart.
export async function seedDevData(container: Container): Promise<void> {
  const userRepository = container.get<UserRepository>(USERS_TOKENS.UserRepository);
  const passwordHasher = container.get<PasswordHasher>(SHARED_TOKENS.PasswordHasher);
  const clock = container.get<Clock>(SHARED_TOKENS.Clock);
  const idGenerator = container.get<IdGenerator>(SHARED_TOKENS.IdGenerator);
  const projectRepository = container.get<ProjectRepository>(PROJECTS_TOKENS.ProjectRepository);
  const taskRepository = container.get<TaskRepository>(PROJECTS_TOKENS.TaskRepository);
  const userDeps = { userRepository, passwordHasher, clock, idGenerator };

  const admin = await registerUserUseCase(
    { email: 'admin@example.com', password: 'Admin123!', name: 'Admin', role: 'admin' },
    userDeps,
  );
  const alice = await registerUserUseCase(
    { email: 'alice@example.com', password: 'Password1!', name: 'Alice' },
    userDeps,
  );
  await registerUserUseCase(
    { email: 'bob@example.com', password: 'Password1!', name: 'Bob' },
    userDeps,
  );

  const apollo = await createProjectUseCase(
    {
      name: 'Apollo',
      description: 'Launch the new dashboard',
      tags: ['frontend', 'q3'],
      actorId: alice.id,
    },
    { projectRepository, clock, idGenerator },
  );
  await createProjectUseCase(
    { name: 'Gemini', description: 'Internal tooling', actorId: admin.id },
    { projectRepository, clock, idGenerator },
  );

  const taskDeps = { projectRepository, taskRepository, clock, idGenerator };
  await addTaskUseCase({ projectId: apollo.id, title: 'Design schema', priority: 'high' }, taskDeps);
  await addTaskUseCase({ projectId: apollo.id, title: 'Wire the API', priority: 'medium' }, taskDeps);
}
