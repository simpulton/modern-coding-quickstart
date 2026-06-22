# Module 08 — Code documentation   ·   Principle VII: Code Documentation

## What you'll learn
- Why "what" comments rot and names don't
- Replace narration with descriptive identifiers
- Keep one short file-level comment about *purpose*, not mechanics

## Why it matters
A comment that restates the next line is a second thing to keep in sync, and it's
usually the one that goes stale. Names carry intent everywhere the code is read;
comments only where you happen to look.

## The principle (from the constitution)
> Comments should be minimal… Use explicit, descriptive names… Avoid inline
> comments explaining what code does. File-level comments should describe the
> module's purpose, not implementation details.

See [docs/constitution.md](../../docs/constitution.md#vii-code-documentation).

## Prerequisites
- Completed Module 07
- `npm run module:begin 08`

## Walkthrough

`libs/projects/core/application/src/lib/add-task.use-case.ts` has been "documented"
the wrong way: a what-comment on every line and single-letter names (`i`, `d`,
`p`, `t`).

### 1. Let names do the work
Rename `i → input`, `d → deps`, `p → project`, `t → task`. Now most comments are
saying what the names already say.

### 2. Delete the narration
Remove the line-by-line comments. Keep (or write) one short file-level comment that
says what the module is *for*.

## Exercise
Make the file self-documenting: descriptive names, no what-comments, at most a
one-line purpose comment at the top. Behavior must not change.

## Run it
```bash
npm run typecheck
npm run lint
npm run test
```

## Compare
```bash
npm run module:compare 08 libs/projects/core/application
```

## Cheat sheet
- Good file-level comment: one line on responsibility (see the other use cases)
- If a comment restates the code, the code should be clearer instead

## Next
→ [Module 09](../09-git-discipline/README.md)
