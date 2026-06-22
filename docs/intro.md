# Introduction

`modern-coding-quickstart` is a self-paced workshop that teaches **nine core
architectural principles** by having you *write the code that embodies them*
against a real, working reference application.

You don't read about DDD and nod along — you add a slice across six layers and
watch the boundary linter reject a wrong import. You don't read about CQRS — you
rebuild a command as a use case next to a query that reads the DB directly.

## Who this is for
Developers comfortable with TypeScript who want to internalize a specific,
opinionated architecture: six-layer DDD, CQRS, Inversify DI, tRPC, Drizzle, and
PGLite-backed contract tests. No prior exposure to the constitution is assumed.

## The reference app
A project-management tool — **Users, Projects, Tasks** — built *to* the
constitution. You'll extend it. See the top-level [README](../README.md) for the
layer map and quick start, and [cheatsheet.md](./cheatsheet.md) for commands and
seed users.

## The nine principles → modules
Modules are ordered for build-up, not constitution numbering.

| Module | Principle |
|---|---|
| 01 DDD architecture | I — six-layer dependency rules |
| 02 Type safety | IV — no `any`, colocated types |
| 03 CQRS | II — commands vs queries |
| 04 Dependency injection | III — Inversify, tokens, composition roots |
| 05 Contract testing | VIII — TDD against PGLite |
| 06 Functional cohesion | VI — feature modules, folder + index |
| 07 ESM imports | V — extension-free, bundler resolution |
| 08 Code documentation | VII — self-documenting code |
| 09 Git discipline | IX — conventional commits, PR template, hooks |
| 10 Capstone | I–IX — a full vertical feature |

(Module 00 is a no-code setup tour.)

## How a module works
Each module is a pair of git tags. `NN-start` gives you the module README and a
deliberate "hole" — code removed, degraded, or a failing test — with the rest of
the tree green. You fill the hole, then diff your work against the canonical
`NN-complete`.

```bash
npm run module:begin 01      # check out 01-start on a fresh branch my/01
# ...follow modules/01-ddd-architecture/README.md...
npm run module:compare 01    # diff your work vs the canonical answer
```

See [participant-workflow.md](./participant-workflow.md) for the full workflow and
the git commands underneath the npm scripts.

## Prerequisites
- Node 20 (`nvm use`)
- `npm install`
- Run `npm run verify` once to confirm a green baseline.

## How long
Plan ~20–40 minutes per module after setup; the capstone is longer. The modules
are independent enough that you can stop and resume between them.

## The finish line
A developer who has never seen the constitution can complete all 11 modules with
no outside help and end with code that passes the review checklist in
[constitution.md](./constitution.md#development-workflow).
