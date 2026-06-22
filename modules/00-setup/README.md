# Module 00 — Setup & architecture tour   ·   Principle —

## What you'll learn
- How to run the reference app and sign in as each seed user
- The six-layer DDD shape and where each principle lives in the tree
- How to run the three test gates (typecheck, lint, unit/integration)
- The module workflow: `module:begin`, `module:compare`, `module:reset`

## Why it matters
You can't refactor toward principles you can't see. This module orients you in a
complete, principle-faithful codebase so that every later module is a small,
focused change against a working whole — never a blank page.

## The principle (from the constitution)
> The system follows a six-layer DDD architecture with strict dependency rules.

See [docs/constitution.md](../../docs/constitution.md#i-ddd-architecture).

## Prerequisites
- Node 20 (`nvm use`)
- `npm install`

## Walkthrough

### 1. Run the app
```bash
npm run dev          # http://localhost:3000
```
Sign in at `/login` as each seed user and notice what changes:

| Email | Password | Role |
|---|---|---|
| `admin@example.com` | `Admin123!` | admin |
| `alice@example.com` | `Password1!` | member |
| `bob@example.com` | `Password1!` | member |

Open a project owned by Alice while signed in as Bob — the edit is refused. That
refusal is the ownership invariant, enforced in a use case (Principle II/VIII).

### 2. Walk the six layers
Open `libs/projects/` and read top-to-bottom:

| Layer | Package | Depends on |
|---|---|---|
| `core/model` | `@pm/projects-core-model` | nothing (entities, factories, invariants, repository ports) |
| `core/application` | `@pm/projects-core-application` | core-model (use cases) |
| `data` | `@pm/projects-data` | core-model (Drizzle adapters + queries) |
| `trpc` | `@pm/projects-trpc` | application + data (routers) |
| `ui` | `@pm/projects-ui` | trpc (presentational components) |
| `_shared/infrastructure` | `@pm/shared-infrastructure` | kernel (Clock, IdGenerator, hashers) |

The arrows only point one way. The next module makes you feel that.

### 3. Run the gates
```bash
npm run typecheck    # bundler resolution, no any
npm run lint         # enforce-module-boundaries + no-explicit-any
npm run test         # Jest unit + PGLite integration
npm run build
```

### 4. Learn the workflow
```bash
npm run module:status        # where am I?
npm run module:begin 01      # start Module 01 on branch my/01
npm run module:compare 01    # diff your work vs the canonical answer
npm run module:reset 01      # discard and restart
```

## Exercise
No code this module. Confirm all four gates are green and that you can locate, for
each of the nine principles, one file in the tree that embodies it.

## Run it
```bash
npm run verify
```

## Compare
Nothing to compare — Module 00 writes no code.

## Cheat sheet
- Seed users + commands: [docs/cheatsheet.md](../../docs/cheatsheet.md)
- Layer map: this README, step 2

## Next
→ [Module 01](../01-ddd-architecture/README.md)
