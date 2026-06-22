# Module 10 — Capstone   ·   Principles I–IX

## What you'll do
Build one complete vertical feature — **comments on a project** — across every
layer, then review your work against the constitution checklist. No new principle;
this is where all nine show up at once.

## Why it matters
Any single module exercises one idea in isolation. Real features touch the whole
stack. The capstone is where the layering, CQRS split, DI, typing, and testing
habits either hold together or don't.

## The principle
All of them. See the checklist in
[docs/constitution.md](../../docs/constitution.md#development-workflow) and §9 below.

## Prerequisites
- Completed Modules 01–09
- `npm run module:begin 10`

## The feature
A project has **comments**: `{ id, projectId, authorId, body, createdAt }`. Anyone
signed in can add a comment; the project detail view lists them oldest-first.

## Walkthrough (build it in dependency order)

1. **core/model** — `comment.ts`: a `Comment` interface, a `createComment` factory
   that trims/validates `body`, and a `CommentRepository` port.
2. **data** — a `comments` table in `schema.ts`; a `DrizzleCommentRepository`
   (`@injectable`, `@inject(SHARED_TOKENS.Database)`); a `listComments(db, projectId)`
   query returning DTOs; a `CommentRepository` token in the tokens file. Add the
   table to both DDL files (`schema-ddl.ts`, `test-database.ts`).
3. **core/application** — `add-comment.use-case.ts`: load the project (404 if
   missing), create the comment, save it.
4. **trpc** — an `addComment` protected mutation (→ use case) and a `comments`
   query (→ direct `listComments`). Note the CQRS split.
5. **DI** — bind `CommentRepository` in both composition roots.
6. **ui** — list comments on the project detail page and add a comment form.
7. **test** — a PGLite integration test: add a comment, then read it back through
   the query. Assert the contract, not the implementation.

## §9 Review gate — your work must satisfy every box
- [ ] Passes `nx run-many -t typecheck` (no `any`) — IV
- [ ] Passes lint, including `enforce-module-boundaries` — I
- [ ] All tests pass; new behavior has tests (contract, not implementation) — VIII
- [ ] Respects DDD layer dependency rules — I
- [ ] Reads = direct queries, writes = use cases — II
- [ ] Services resolved via Inversify, tokens in token files — III
- [ ] Types colocated, no generic `types.ts` — IV
- [ ] Extension-free imports, bundler resolution — V
- [ ] Grouped by feature, folder + index, no `utils.ts`, main-fn-first — VI
- [ ] Self-documenting; comments minimal and file-level only — VII
- [ ] Conventional commits, PR template, hooks not skipped — IX

## Run it
```bash
npm run verify     # typecheck + lint + test + build
```

## Compare
```bash
npm run module:compare 10
```

## Next
You've finished. Your tree should resemble the canonical `10-complete` — and, more
importantly, pass the review gate without anyone telling you how.
