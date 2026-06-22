# Module 07 — ESM imports   ·   Principle V: ESM Imports

## What you'll learn
- Why relative imports omit file extensions in this codebase
- What `moduleResolution: "bundler"` does for you
- How to spot and remove needless `.js` suffixes

## Why it matters
Extensions on relative imports are noise the bundler doesn't need, and they leak a
build detail (`.js`) into source that's actually `.ts`. Consistent, extension-free
imports read cleanly and match the rest of the tree.

## The principle (from the constitution)
> Relative imports should omit file extensions — the bundler resolves them
> automatically… The project uses `"moduleResolution": "bundler"`.

See [docs/constitution.md](../../docs/constitution.md#v-esm-imports).

## Prerequisites
- Completed Module 06
- `npm run module:begin 07`

## Walkthrough

Someone added `.js` extensions to the relative imports throughout
`libs/projects/data`. It compiles — `bundler` resolution maps `./schema.js` to
`schema.ts` — but it violates the convention and reads as if these were
hand-written JS files.

### 1. Strip the extensions
In every file under `libs/projects/data/src`, change relative imports and exports
from `'./schema.js'` back to `'./schema'`, `'./database.js'` to `'./database'`, and
so on — including the barrel `index.ts`.

### 2. Confirm nothing else needed them
`@pm/*` package imports never carried extensions; leave them alone. The build
stays green because the resolver never needed the suffixes.

## Exercise
Make `libs/projects/data` extension-free on every relative import/export, build
green.

## Run it
```bash
npm run typecheck
npm run build
```

## Compare
```bash
npm run module:compare 07 libs/projects/data
```

## Cheat sheet
- The setting: `tsconfig.base.json` → `"moduleResolution": "bundler"`
- Rule of thumb: relative imports and `export *` carry no extension

## Next
→ [Module 08](../08-code-documentation/README.md)
