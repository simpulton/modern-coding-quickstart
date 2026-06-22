# Module 02 — Type safety   ·   Principle IV: Type Safety

## What you'll learn
- Why `any` (even behind an `eslint-disable`) is a hole in your safety net
- How to recover a real type instead of reaching for an escape hatch
- Why a generic `types.ts` dumping ground hurts discoverability

## Why it matters
`any` silently disables every check TypeScript would do downstream. A single
escape hatch can let a wrong shape travel for free until it crashes at runtime.
Colocated types keep the answer to "what shape is this?" next to the code.

## The principle (from the constitution)
> The `any` type is not allowed — always find or define appropriate types. Types
> should be colocated with the code that uses them. Avoid generic type files.

See [docs/constitution.md](../../docs/constitution.md#iv-type-safety).

## Prerequisites
- Completed Module 01
- `npm run module:begin 02`

## Walkthrough

The starting code for `@pm/users-ui` has been degraded on purpose:
- `libs/users/ui/src/lib/UserCard.tsx` types its prop as `any`, hidden behind an
  `// eslint-disable-next-line @typescript-eslint/no-explicit-any`.
- `libs/users/ui/src/lib/types.ts` is a generic dumping ground.

It compiles and even passes lint — because the escape hatch suppresses the rule.
That is exactly the problem.

### 1. Kill the escape hatch
Give `UserCard` a real prop type. The user shape is the `users.detail` output —
derive it: `type UserSummary = NonNullable<inferRouterOutputs<typeof usersRouter>['detail']>`.
Remove the `eslint-disable` line; if lint passes without it, you've succeeded.

### 2. Colocate the type, delete the dumping ground
Move the `UserSummary` type into `UserCard.tsx` (next to its only user) and export
it from there. Delete `types.ts`. Update `src/index.ts` to export the type from
`./lib/UserCard`.

## Exercise
Make `@pm/users-ui` `any`-free with the type colocated and no `types.ts`, and have
`npm run lint` pass with **no** `eslint-disable` directives.

## Run it
```bash
npm run typecheck
npm run lint
```

## Compare
```bash
npm run module:compare 02 libs/users/ui
```

## Cheat sheet
- The rule: `eslint.config.mjs` → `@typescript-eslint/no-explicit-any`
- Deriving server types on the client: `inferRouterOutputs` from `@trpc/server`

## Next
→ [Module 03](../03-cqrs/README.md)
