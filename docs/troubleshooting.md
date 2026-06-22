# Troubleshooting

## Setup

**`npm install` fails or behaves oddly.** Use Node 20 — `nvm use` reads `.nvmrc`.
Other major versions are unsupported (`engines.node` is pinned).

**`npm run dev` — port 3000 in use.** Stop the other process, or run
`npx nx dev plan-editor --port=3001`.

**The app shows no data.** The dev server seeds an in-memory PGLite on the first
request, so the very first page load primes it. Refresh once. Data resets every
time you restart the server — that's intended for a workshop.

## Modules and the harness

**`module:begin` says "Working tree has uncommitted changes."** Commit or stash
first. The clean-tree rule is what makes `module:reset` a safe undo.

**`Tag 'NN-start' does not exist.`** Run `git fetch --tags`, then
`npm run rebuild-tags` to recreate tags from `scripts/modules.manifest.json`.

**`module:compare` shows a huge or noisy diff.** It diffs the whole tree by
design. Scope it: `npm run module:compare NN <path>` (each module README suggests a
useful path).

**My diff doesn't match `NN-complete` exactly.** That's fine. The canonical answer
is one correct solution, not the only one. As long as your work passes the
module's gate and respects the constitution, you're done.

## Tests

**A module starts with a failing test.** Expected for Modules 04 and 05 — the red
test *is* your target. Make it green by implementing the feature.

**`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` when running tests.** Only the
integration suite (`@pm/shared-testing`) needs Node's VM-modules flag, and its
test target already sets it via `cross-env NODE_OPTIONS=--experimental-vm-modules`.
Run tests through `npm run test` / `nx test`, not a bare `jest`.

**Integration tests feel slow or flaky.** They run serially (`--runInBand`) on a
fresh in-memory PGLite per suite — correct but not instant. That isolation is the
point (Principle VIII).

## Lint and types

**Lint fails with `enforce-module-boundaries`.** You imported across a layer
boundary the wrong way (e.g. `core-model` importing from `data`). That's Principle
I doing its job — fix the import direction. The allowed edges are in
`eslint.config.mjs`.

**`no-explicit-any` error.** Find or define a real type. If you reached for an
`eslint-disable`, that's the escape hatch Module 02 warns about — remove it.

**Typecheck error about `moduleResolution`/extensions.** Relative imports omit
extensions (Principle V). Write `./foo`, not `./foo.ts`.

## Nx

**Stale or confusing task results.** Clear the cache: `npx nx reset`, then re-run.

**`nx` reports a "flaky task."** Re-run it; the integration suite occasionally
trips Nx's flake detector under load even though it's serial. A clean re-run is
authoritative.
