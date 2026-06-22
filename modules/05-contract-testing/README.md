# Module 05 — Contract testing (TDD)   ·   Principle VIII: Contract Testing

## What you'll learn
- Write the test first; watch it fail for the right reason
- Test the *contract* (assignment is visible to a reader), not the implementation
- Use PGLite for a real, isolated integration test — no Docker, no mocks

## Why it matters
A test written after the code tends to assert what the code happens to do. A test
written first asserts what you *meant*. And when it checks behavior rather than
internal calls, it keeps passing through refactors.

## The principle (from the constitution)
> Write tests first — they should fail before implementation. Use PGLite for
> integration isolation. Verify behavior and output, not internal method calls.

See [docs/constitution.md](../../docs/constitution.md#viii-contract-testing).

## Prerequisites
- Completed Module 04
- `npm run module:begin 05`

## Walkthrough

A failing test is already here:
`libs/_shared/testing/src/lib/task-assignment.integration.spec.ts`. It assigns a
task to a user and expects a reader (`projects.detail`) to see the assignee. Run
`npm run test` — it's **red** because `assignTask` is a stub that throws.

### 1. Confirm the red
```bash
npm run test
```
Read the failure. It fails because the behavior isn't implemented — not because
the test is wrong.

### 2. Add the domain transition
In `@pm/projects-core-model` (`task.ts`), add `assignTask(task, assigneeId): Task`
that returns the task with its `assigneeId` set.

### 3. Add the command use case
Create `assign-task.use-case.ts` in `@pm/projects-core-application`:
`assignTaskUseCase({ taskId, assigneeId }, { taskRepository })` — load, transition,
save, return. Throw `NotFoundError` for a missing task. Export it.

### 4. Replace the stub
In `libs/projects/trpc/src/lib/projects.router.ts`, make `assignTask` call your
use case instead of throwing.

### 5. Green
```bash
npm run test
```
Now refactor freely — because the test asserts the *contract* (the assignee is
visible), not how you stored it, it stays green.

## Exercise
Drive the assignment feature from red to green. Do not change the test's
assertions to make it pass.

## Run it
```bash
npm run test
```

## Compare
```bash
npm run module:compare 05
```

## Cheat sheet
- The test: `libs/_shared/testing/src/lib/task-assignment.integration.spec.ts`
- Domain transitions live in `@pm/projects-core-model` `task.ts`

## Next
→ [Module 06](../06-functional-cohesion/README.md)
