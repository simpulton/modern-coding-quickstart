import type { inferRouterOutputs } from '@trpc/server';
import type { usersRouter } from '@pm/users-trpc';

type UsersOutputs = inferRouterOutputs<typeof usersRouter>;

// Generic dumping ground — unrelated shapes piled into one file. Module 02 asks
// you to colocate these next to the code that uses them and delete this file.
export type UserSummary = NonNullable<UsersOutputs['detail']>;
export type UserList = UsersOutputs['list'];
export type AnyUserField = string | number | boolean | null;
