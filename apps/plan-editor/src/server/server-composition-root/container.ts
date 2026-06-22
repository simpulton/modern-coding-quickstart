import 'reflect-metadata';
import { Container } from 'inversify';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
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
import { applySchema } from './schema-ddl';
import { seedDevData } from './seed-dev-data';

// The single place the application container is assembled (Principle III).
// The workshop runs on an in-memory PGLite seeded once per server process, so a
// fresh `npm run dev` always starts from the documented seed users.
let containerPromise: Promise<Container> | null = null;

export function getContainer(): Promise<Container> {
  if (!containerPromise) {
    containerPromise = buildContainer();
  }
  return containerPromise;
}

async function buildContainer(): Promise<Container> {
  const client = new PGlite();
  const db = drizzle(client);
  await applySchema(client);

  const container = new Container({ defaultScope: 'Singleton' });
  container.bind(SHARED_TOKENS.Database).toConstantValue(db);
  container.bind(SHARED_TOKENS.JwtSecret).toConstantValue(jwtSecret());
  container.bind(SHARED_TOKENS.Clock).to(SystemClock);
  container.bind(SHARED_TOKENS.IdGenerator).to(UuidGenerator);
  container.bind(SHARED_TOKENS.PasswordHasher).to(BcryptPasswordHasher);
  container.bind(SHARED_TOKENS.TokenSigner).to(JwtTokenService);
  container.bind(PROJECTS_TOKENS.ProjectRepository).to(DrizzleProjectRepository);
  container.bind(PROJECTS_TOKENS.TaskRepository).to(DrizzleTaskRepository);
  container.bind(PROJECTS_TOKENS.CommentRepository).to(DrizzleCommentRepository);
  container.bind(USERS_TOKENS.UserRepository).to(DrizzleUserRepository);

  await seedDevData(container);
  return container;
}

function jwtSecret(): string {
  return process.env['JWT_SECRET'] ?? 'dev-secret-change-me';
}
