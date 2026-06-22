import { Container } from 'inversify';
import type { PgliteDatabase } from 'drizzle-orm/pglite';
import { SHARED_TOKENS } from '@pm/shared-kernel';
import {
  BcryptPasswordHasher,
  JwtTokenService,
  SystemClock,
  UuidGenerator,
} from '@pm/shared-infrastructure';
import {
  DrizzleCommentRepository,
  DrizzleProjectRepository,
  DrizzleTaskRepository,
  PROJECTS_TOKENS,
} from '@pm/projects-data';
import { DrizzleUserRepository, USERS_TOKENS } from '@pm/users-data';

export const TEST_JWT_SECRET = 'test-secret-please-do-not-use-in-production';

// The test composition root: the same dependency graph the app wires, but bound
// to a PGLite database. Real repositories run against PGLite; nothing is mocked.
export function createTestContainer(db: PgliteDatabase): Container {
  const container = new Container({ defaultScope: 'Singleton' });

  container.bind(SHARED_TOKENS.Database).toConstantValue(db);
  container.bind(SHARED_TOKENS.JwtSecret).toConstantValue(TEST_JWT_SECRET);
  container.bind(SHARED_TOKENS.Clock).to(SystemClock);
  container.bind(SHARED_TOKENS.IdGenerator).to(UuidGenerator);
  container.bind(SHARED_TOKENS.PasswordHasher).to(BcryptPasswordHasher);
  container.bind(SHARED_TOKENS.TokenSigner).to(JwtTokenService);

  container.bind(PROJECTS_TOKENS.ProjectRepository).to(DrizzleProjectRepository);
  container.bind(PROJECTS_TOKENS.TaskRepository).to(DrizzleTaskRepository);
  container.bind(PROJECTS_TOKENS.CommentRepository).to(DrizzleCommentRepository);
  container.bind(USERS_TOKENS.UserRepository).to(DrizzleUserRepository);

  return container;
}
