import { z } from 'zod';
import type { Container } from 'inversify';
import { protectedProcedure, publicProcedure, router } from '@pm/shared-trpc';
import { SHARED_TOKENS } from '@pm/shared-kernel';
import type { PasswordHasher, TokenSigner } from '@pm/shared-kernel';
import type { UserRepository } from '@pm/users-core-model';
import { authenticateUseCase } from '@pm/users-core-application';
import { getUser, listUsers, USERS_TOKENS } from '@pm/users-data';
import type { Database } from '@pm/users-data';

function db(container: Container): Database {
  return container.get<Database>(SHARED_TOKENS.Database);
}

export const usersRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await authenticateUseCase(input, {
        userRepository: ctx.container.get<UserRepository>(USERS_TOKENS.UserRepository),
        passwordHasher: ctx.container.get<PasswordHasher>(SHARED_TOKENS.PasswordHasher),
      });
      const token = await ctx.container
        .get<TokenSigner>(SHARED_TOKENS.TokenSigner)
        .sign({ id: user.id, role: user.role });
      return {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      };
    }),

  me: protectedProcedure.query(({ ctx }) => getUser(db(ctx.container), ctx.actor.id)),

  list: publicProcedure.query(({ ctx }) => listUsers(db(ctx.container))),

  detail: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => getUser(db(ctx.container), input.userId)),
});
