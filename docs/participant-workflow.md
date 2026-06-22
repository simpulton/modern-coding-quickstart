# Participant workflow

The workshop is delivered as **tagged commits on a linear `main` branch**. You
never edit `main`; you branch off a module's start tag, do the work, and compare.

## The tag model

```
reference-complete            ← the finished reference app (Phase A baseline)
   └─ 00-setup
        └─ 01-start → 01-complete
             └─ 02-start → 02-complete
                  └─ … → 10-complete
```

- `NN-start` = the previous module's state + the module README + a deliberate
  hole (removed/degraded code, or a failing test).
- `NN-complete` = `NN-start` + the canonical implementation.

`scripts/modules.manifest.json` maps every tag to its commit. If tags ever get out
of sync (after a pull that rewrote them, say), rebuild them:

```bash
npm run rebuild-tags
```

## The four commands

```bash
npm run module:begin 03      # checkout 03-start, create/switch to branch my/03
npm run module:compare 03    # git diff against 03-complete (whole tree)
npm run module:compare 03 libs/projects   # scope the diff to a path
npm run module:reset 03      # hard-reset my/03 back to 03-start (start over)
npm run module:status        # current module, branch, and clean/dirty state
```

> **Difference from the E2E quickstart harness:** there, all work lives in one
> folder, so `compare` diffs just that folder. Here your work spans `libs/**` and
> `apps/**`, so `module:compare` diffs the **whole tree** by default, with an
> optional path argument to narrow it.

## The git underneath (Principle IX in practice)

The npm scripts are thin wrappers. Knowing the git they run keeps you in control:

| Script | Git |
|---|---|
| `module:begin 03` | `git checkout 03-start && git checkout -b my/03` |
| `module:compare 03` | `git diff 03-complete` |
| `module:reset 03` | `git reset --hard 03-start` |
| `module:status` | `git rev-parse --abbrev-ref HEAD`, `git describe --tags` |

`module:begin` refuses to run with a dirty tree — commit or stash first. That's
deliberate: clean checkpoints are what make `reset` a safe undo.

## A typical module session

1. `npm run module:begin 0N` — land on `my/0N` at the start tag.
2. Read `modules/0N-*/README.md` top to bottom.
3. Make the change. Run the module's "Run it" command until it's green (some
   modules start with a **deliberately red test** — that's your target).
4. Commit your work conventionally (`feat:`, `fix:`, `refactor:`) — let the
   pre-commit hook run; don't `--no-verify`.
5. `npm run module:compare 0N` — compare against the canonical answer. Differences
   are fine as long as yours is correct and principle-faithful; the diff is a
   teacher, not a grader.
6. Move on: `npm run module:begin 0N+1`.

## Recovery

- **Stuck or messy?** `npm run module:reset 0N` puts you back at the start tag.
- **Want the answer?** `git checkout 0N-complete -- <path>` pulls in the canonical
  version of a file.
- **Tags missing after a fetch?** `git fetch --tags` then `npm run rebuild-tags`.
