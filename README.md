# modern-coding-quickstart

A self-paced, hands-on workshop that teaches **nine core architectural principles** — DDD layering,
CQRS, Dependency Injection, Type Safety, ESM Imports, Functional Cohesion, Code Documentation,
Contract Testing, and Git Discipline — against a real, fully-functional reference app. Sibling to
[`modern-e2e-quickstart`](../modern-e2e-quickstart).

> Status: complete — the reference app plus all 11 workshop modules (tags `00-setup` … `10-complete`).

## The reference app

A project-management tool (Users / Projects / Tasks) built _to_ the constitution: an Nx monorepo with
a six-layer DDD architecture, CQRS, Inversify DI, tRPC, Drizzle, and a PGLite-backed test story.

```
libs/
├── projects/{core/model, core/application, data, trpc, ui}     @pm/projects-*
├── users/{core/model, core/application, data, trpc, ui}        @pm/users-*
└── _shared/{kernel, infrastructure, trpc, testing}             @pm/shared-*
apps/
├── plan-editor/        Next.js (App Router) + tRPC handler + Inversify composition root
└── plan-editor-e2e/    Playwright smoke
```

The six-layer dependency rules are **enforced** by `@nx/enforce-module-boundaries` (Principle I), and
`moduleResolution: "bundler"` makes extension-free imports the norm (Principle V).

## Quick start

```bash
nvm use            # Node 20
npm install
npm run dev        # http://localhost:3000  (in-memory PGLite, seeded on first request)
```

### Seed users

| Email | Password | Role |
|---|---|---|
| `admin@example.com` | `Admin123!` | admin |
| `alice@example.com` | `Password1!` | member |
| `bob@example.com` | `Password1!` | member |

## Commands

```bash
npm run verify     # typecheck + lint + test + build, across the workspace
npm run typecheck  # nx run-many -t typecheck   (Principles IV, V)
npm run lint       # nx run-many -t lint        (Principle I boundaries, no-any)
npm run test       # unit (Jest) + integration (PGLite)   (Principles II, VIII)
npm run build      # nx run-many -t build
nx e2e plan-editor-e2e   # Playwright smoke (login -> projects)
```

## Workshop

Modules live under `modules/NN-*/` and are delivered as tagged commits on `main`. Use the harness:

```bash
npm run module:begin 03      # checkout 03-start, create branch my/03
npm run module:compare 03    # diff your work against the canonical 03-complete
npm run module:status
```

Start with **[docs/intro.md](docs/intro.md)**, then:
- [docs/participant-workflow.md](docs/participant-workflow.md) — the tag/branch model and the git under the npm scripts
- [docs/constitution.md](docs/constitution.md) — the nine principles, quoted by each module
- [docs/cheatsheet.md](docs/cheatsheet.md) — commands, seed users, layer map
- [docs/troubleshooting.md](docs/troubleshooting.md) — common snags (dirty tree, red tests, boundaries)
