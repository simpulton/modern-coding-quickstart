import type { inferRouterOutputs } from '@trpc/server';
import type { usersRouter } from '@pm/users-trpc';

type UsersOutputs = inferRouterOutputs<typeof usersRouter>;

export type UserSummary = NonNullable<UsersOutputs['detail']>;
