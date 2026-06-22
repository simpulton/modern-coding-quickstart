# Module 04 — Dependency injection   ·   Principle III: Dependency Injection

## What you'll learn
- How a service becomes resolvable: `@injectable()` + a token + a binding
- Why the composition root is the one place the graph is assembled
- That the app root and the test root wire the *same* graph to different databases

## Why it matters
DI keeps use cases pure and testable: they ask for a `TaskRepository`, not a
specific Drizzle class. Swapping the real DB for PGLite in tests is then just a
different binding — no code under test changes.

## The principle (from the constitution)
> Injectable services use `@injectable()`… Dependencies injected via constructor
> with `@inject(TOKEN)`… Tokens defined in dedicated token files… Composition root
> in the app.

See [docs/constitution.md](../../docs/constitution.md#iii-dependency-injection).

## Prerequisites
- Completed Module 03
- `npm run module:begin 04`

## Walkthrough

The `TaskRepository` binding has been pulled out. The code still **compiles** —
the token and every consumer are intact — but `npm run test` is **red**: the
container can't resolve `TaskRepository`, so any flow that adds a task fails. That
red is the missing binding talking.

### 1. Make the adapter injectable
In `libs/projects/data/src/lib/task-repository.ts`, restore `@injectable()` on
`DrizzleTaskRepository`. Its constructor already asks for the database via
`@inject(SHARED_TOKENS.Database)`.

### 2. Bind it in the app composition root
In `apps/plan-editor/src/server/server-composition-root/container.ts`, bind the
token to the adapter:
```ts
container.bind(PROJECTS_TOKENS.TaskRepository).to(DrizzleTaskRepository);
```

### 3. Bind it in the test composition root
Do the same in `libs/_shared/testing/src/lib/test-container.ts`. Same graph,
PGLite database. This is what lets integration tests run real repositories.

## Exercise
Make the container resolve `TaskRepository` in both roots so `npm run test` is
green again. Notice you touched a decorator and two bindings — never a use case.

## Run it
```bash
npm run test          # the test composition root must resolve the graph
```

## Compare
```bash
npm run module:compare 04
```

## Cheat sheet
- Token file: `libs/projects/data/src/lib/projects.tokens.ts`
- App root: `apps/plan-editor/src/server/server-composition-root/container.ts`
- Test root: `libs/_shared/testing/src/lib/test-container.ts`

## Next
→ [Module 05](../05-contract-testing/README.md)
