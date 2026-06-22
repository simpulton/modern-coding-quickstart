# Cheat sheet

## Seed users

| Email | Password | Role |
|---|---|---|
| `admin@example.com` | `Admin123!` | admin |
| `alice@example.com` | `Password1!` | member |
| `bob@example.com` | `Password1!` | member |

## Commands

```bash
npm run dev          # Next.js dev server, http://localhost:3000
npm run verify       # typecheck + lint + test + build
npm run typecheck    # nx run-many -t typecheck
npm run lint         # nx run-many -t lint
npm run test         # nx run-many -t test  (Jest unit + PGLite integration)
npm run build        # nx run-many -t build
nx e2e plan-editor-e2e
```

## Module workflow

```bash
npm run module:begin NN      # checkout NN-start, create branch my/NN
npm run module:compare NN    # diff your work against canonical NN-complete (whole tree)
npm run module:compare NN libs/projects   # scope the diff to a path
npm run module:reset NN      # hard-reset my/NN back to NN-start
npm run module:status        # current module + branch + dirty state
```

## Layer map (`@pm/*` packages)

| Layer | projects | users | shared |
|---|---|---|---|
| core/model | `@pm/projects-core-model` | `@pm/users-core-model` | `@pm/shared-kernel` |
| core/application | `@pm/projects-core-application` | `@pm/users-core-application` | — |
| data | `@pm/projects-data` | `@pm/users-data` | — |
| trpc | `@pm/projects-trpc` | `@pm/users-trpc` | `@pm/shared-trpc` |
| ui | `@pm/projects-ui` | `@pm/users-ui` | — |
| infrastructure | — | — | `@pm/shared-infrastructure` |
| test support | — | — | `@pm/shared-testing` |

Dependency direction: `ui → trpc → {application, data} → core-model → shared-kernel`.
`infrastructure` implements the seams in `shared-kernel`. Reads bypass the domain
(direct queries in `data`); writes go through use cases in `core/application`.

## Composition roots

- App: `apps/plan-editor/src/server/server-composition-root/` (PGLite, seeded on boot).
- Test: `@pm/shared-testing` `createTestContainer()` (PGLite, per-suite isolation).
