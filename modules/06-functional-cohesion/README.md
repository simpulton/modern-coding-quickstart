# Module 06 — Functional cohesion   ·   Principle VI: Functional Cohesion

## What you'll learn
- Why a `utils.ts` grab-bag is a smell, not a convenience
- Group by feature, expose a public API through a folder + `index.ts`
- Order a file main-function-first, helpers after their use

## Why it matters
`utils.ts` is where unrelated code goes to hide. It couples callers to a junk
drawer and tells you nothing about intent. Feature modules with a small public API
are discoverable and safe to change.

## The principle (from the constitution)
> Group by feature, not by technical type… Avoid generic utility files
> (`utils.ts`)… Use folder + index to expose public APIs while hiding internals…
> main functions first, helpers after their usage.

See [docs/constitution.md](../../docs/constitution.md#vi-functional-cohesion).

## Prerequisites
- Completed Module 05
- `npm run module:begin 06`

## Walkthrough

`apps/plan-editor/src/lib/utils.ts` is a grab-bag: date formatting, text helpers,
and label logic all in one file. The projects list page imports `formatDate` from
it.

### 1. Group by feature behind a folder + index
Create `apps/plan-editor/src/lib/formatting/` with:
- `date.ts` — `formatDate`
- `labels.ts` — `roleLabel`, `taskCountLabel`, `initials`
- `index.ts` — the public API: `export * from './date'; export * from './labels';`

### 2. Point callers at the public API
Update the projects list page to import from `'../lib/formatting'`, not the old
file. Delete `utils.ts`.

### 3. Read top-to-bottom
Within each file, put the exported function first and any private helper below it.

## Exercise
Replace `utils.ts` with cohesive feature modules exposed through an `index.ts`, and
leave the build green.

## Run it
```bash
npm run typecheck
npm run lint
npm run build
```

## Compare
```bash
npm run module:compare 06 apps/plan-editor/src/lib
```

## Cheat sheet
- Pattern: folder + `index.ts` public API, internals private
- Ordering: main function first, helpers after

## Next
→ [Module 07](../07-esm-imports/README.md)
