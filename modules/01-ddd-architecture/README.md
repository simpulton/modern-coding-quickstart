# Module 01 — DDD architecture   ·   Principle I: DDD Architecture

## What you'll learn
- How a feature flows through all the layers, one direction only
- Where each layer lives and what it may import
- How `enforce-module-boundaries` turns the dependency rules into a failing test

## Why it matters
Layer boundaries are what keep a codebase reasoned-about as it grows. When the
rules are enforced by lint instead of by good intentions, a wrong import is a red
build, not a slow erosion.

## The principle (from the constitution)
> The system follows a six-layer DDD architecture with strict dependency rules…
> Maintaining clean boundaries ensures testability, maintainability, and prevents
> circular dependencies.

See [docs/constitution.md](../../docs/constitution.md#i-ddd-architecture).

## Prerequisites
- Completed Module 00
- `npm run module:begin 01`

## Walkthrough

You'll add a small new capability — **tags on a project** — wired through every
layer, respecting the dependency direction `ui → trpc → {application, data} →
core-model`.

### 1. Core model — the shape and its factory
In `libs/projects/core/model/src/lib/project.ts`, add `tags: string[]` to
`Project` and to `NewProjectInput` (optional), and have `createProject` default it
to `[]`. The model has **no imports from other layers** — that's the rule.

Because `tags` is a **required** field on `Project`, every place that builds a
`Project` literal now needs it — including the existing test fixtures in
`project.spec.ts` and `update-project.use-case.spec.ts`. Add `tags: []` to those
fixtures (and, if you like, a test for tag normalization). `npm run test` will tell
you if you missed one.

### 2. Data — persistence
In `libs/projects/data/src/lib/schema.ts` add a `tags` column
(`text('tags').array().notNull().default([])`), map it in `project-repository.ts`,
and surface it from `getProjectDetail` in `queries.ts`. Add the column to the DDL
in `apps/plan-editor/src/server/server-composition-root/schema-ddl.ts` and
`libs/_shared/testing/src/lib/test-database.ts`.

### 3. Application — the write path
Thread `tags` through `createProjectUseCase` input.

### 4. tRPC — the boundary
Accept `tags: z.array(z.string()).optional()` in the `create` input and pass it on.

### 5. UI — presentation
Show the tags on the project detail page.

### 6. Feel the boundary (the important bit)
Now break a rule on purpose. In `project.ts` add:
```ts
import '@pm/projects-data';
```
Run `npm run lint`. It fails — `core-model` may not depend on `data`. **Delete the
line.** That red is Principle I doing its job; it is the same check CI runs.

## Exercise
Wire `tags` end to end so a project's tags round-trip from the create mutation to
the detail page. Keep `core/model` import-free; never reach "up" a layer.

## Run it
```bash
npm run typecheck
npm run lint          # includes enforce-module-boundaries
npm run test          # confirms the Project fixtures were updated too
npm run build
```

## Compare
```bash
npm run module:compare 01
```

## Cheat sheet
- Layer import rules: `eslint.config.mjs` → `@nx/enforce-module-boundaries`
- Tables: `libs/projects/data/src/lib/schema.ts`
- DDL for PGLite: `…/server-composition-root/schema-ddl.ts`, `…/testing/.../test-database.ts`

## Next
→ [Module 02](../02-type-safety/README.md)
