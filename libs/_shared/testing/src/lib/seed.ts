import type { Container } from 'inversify';
import { SHARED_TOKENS } from '@pm/shared-kernel';
import type { Clock, IdGenerator, PasswordHasher } from '@pm/shared-kernel';
import type { User, UserRole } from '@pm/users-core-model';
import { registerUserUseCase } from '@pm/users-core-application';
import type { UserRepository } from '@pm/users-core-model';
import { USERS_TOKENS } from '@pm/users-data';
import type { Project } from '@pm/projects-core-model';
import type { ProjectRepository } from '@pm/projects-core-model';
import { createProjectUseCase } from '@pm/projects-core-application';
import { PROJECTS_TOKENS } from '@pm/projects-data';

export interface SeedUserInput {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export function seedUser(container: Container, input: SeedUserInput): Promise<User> {
  return registerUserUseCase(
    { email: input.email, password: input.password, name: input.name, role: input.role },
    {
      userRepository: container.get<UserRepository>(USERS_TOKENS.UserRepository),
      passwordHasher: container.get<PasswordHasher>(SHARED_TOKENS.PasswordHasher),
      clock: container.get<Clock>(SHARED_TOKENS.Clock),
      idGenerator: container.get<IdGenerator>(SHARED_TOKENS.IdGenerator),
    },
  );
}

export interface SeedProjectInput {
  name: string;
  description?: string;
  ownerId: string;
}

export function seedProject(container: Container, input: SeedProjectInput): Promise<Project> {
  return createProjectUseCase(
    { name: input.name, description: input.description, actorId: input.ownerId },
    {
      projectRepository: container.get<ProjectRepository>(PROJECTS_TOKENS.ProjectRepository),
      clock: container.get<Clock>(SHARED_TOKENS.Clock),
      idGenerator: container.get<IdGenerator>(SHARED_TOKENS.IdGenerator),
    },
  );
}
