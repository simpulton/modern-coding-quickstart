# Module 03 — CQRS   ·   Principle II: CQRS

## What you'll learn
- Why writes go through a use case and reads don't
- How a command `useCase(input, deps)` is shaped (pure function, injected deps)
- The contrast: a query that reads the DB directly and returns a DTO

## Why it matters
Reads and writes have different jobs. A write must enforce invariants and stay
honest about state transitions; a read just needs to be fast and shaped for the
screen. Forcing both through the same abstraction adds ceremony to one and risk to
the other.

## The principle (from the constitution)
> Queries can bypass domain layers and query the database directly… Commands go
> through use cases in the Core Application layer… Use cases are pure functions
> with signature `useCase(input, deps)` — not classes.

See [docs/constitution.md](../../docs/constitution.md#ii-cqrs).

## Prerequisites
- Completed Module 02
- `npm run module:begin 03`

## Walkthrough

The "change a task's status" **command** has been removed. The **query** side is
untouched — `getProjectDetail` / `listTasks` in `libs/projects/data` still read
tasks directly and return DTOs. That asymmetry is the point.

### 1. Look at the query side first (no change needed)
`libs/projects/data/src/lib/queries.ts` reads tasks straight from the DB. No use
case, no repository — reads are allowed to be direct.

### 2. Write the command use case
Create `libs/projects/core/application/src/lib/update-task-status.use-case.ts`:
a pure `updateTaskStatusUseCase({ taskId, status }, { taskRepository })` that loads
the task, applies the domain transition `changeTaskStatus` (already in
`@pm/projects-core-model`), saves it, and returns the result. Throw `NotFoundError`
when the task is missing. Export it from the application `index.ts`.

### 3. Wire the mutation
Add an `updateTaskStatus` `protectedProcedure.mutation` to
`libs/projects/trpc/src/lib/projects.router.ts` that resolves the task repository
from the container and calls your use case.

### 4. Re-enable the UI control
Give `TaskList` an `onStatusChange` prop and render the status `<select>` again;
wire the project detail page's mutation to it.

## Exercise
Rebuild the write path as a use case while leaving the read path direct. The diff
should show a command (mutation → use case) next to a query (direct DB read).

## Run it
```bash
npm run typecheck
npm run test          # the projects integration suite exercises the write path
npm run build
```

## Compare
```bash
npm run module:compare 03
```

## Cheat sheet
- Command shape: any `*.use-case.ts` in `libs/projects/core/application`
- Query shape: `libs/projects/data/src/lib/queries.ts`
- Domain transition: `changeTaskStatus` in `@pm/projects-core-model`

## Next
→ [Module 04](../04-dependency-injection/README.md)
