import { router } from '@pm/shared-trpc';
import { projectsRouter } from '@pm/projects-trpc';
import { usersRouter } from '@pm/users-trpc';

export const appRouter = router({
  projects: projectsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
