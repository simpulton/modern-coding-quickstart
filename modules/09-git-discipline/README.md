# Module 09 — Git discipline   ·   Principle IX: Git Discipline

## What you'll learn
- Write a conventional commit (`feat:`, `fix:`, `docs:`, `refactor:`)
- Let the pre-commit hook run — and understand why skipping it is a mistake
- Fill out the PR template against the constitution checklist

## Why it matters
The commit log and the hooks are the project's safety rails. A clear, conventional
history makes changes reviewable and revertible; the hook catches what your editor
didn't before it reaches anyone else.

## The principle (from the constitution)
> Follow conventional commit format… Use the PR template… Don't skip pre-commit
> hooks (`--no-verify`) — they exist for a reason. Include `Co-Authored-By` for
> AI-assisted commits.

See [docs/constitution.md](../../docs/constitution.md#ix-git-discipline).

## Prerequisites
- Completed Module 08
- `npm run module:begin 09`

## Walkthrough

This module has no code hole — the deliverable is *process*.

### 1. Make a small, real change
Pick something tiny and true: add yourself to a `CONTRIBUTORS.md`, or tweak a
file-level comment. Stage it.

### 2. Commit conventionally — and let the hook run
```bash
git commit -m "docs: add myself to contributors"
```
Watch `.husky/pre-commit` run `nx affected -t typecheck lint`. If it fails, fix the
code — don't reach for `--no-verify`. (Try `--no-verify` once to see what you'd be
skipping, then undo and commit properly.)

### 3. Fill out the PR template
Open `.github/PULL_REQUEST_TEMPLATE.md` and answer every checklist item honestly
for your change. A model, filled-in version is in
[`EXAMPLE-PR.md`](./EXAMPLE-PR.md) — compare yours against it.

### 4. (Optional bonus) Open a real PR
Push your `my/09` branch to a personal GitHub remote and open a PR using the
template. Not required — the checklist is the graded part.

## Exercise
Produce one well-formed conventional commit on `my/09` (hook not skipped) and a
completed PR checklist.

## Run it
```bash
npm run module:status     # confirm you're on my/09 with a clean, committed change
```

## Compare
```bash
npm run module:compare 09
```
The canonical side adds `EXAMPLE-PR.md` — a reference for what "well-formed" looks
like, not a diff to match line for line.

## Cheat sheet
- Conventional types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- The hook: `.husky/pre-commit`
- The checklist: `.github/PULL_REQUEST_TEMPLATE.md` (mirrors constitution §9)

## Next
→ [Module 10](../10-capstone/README.md)
