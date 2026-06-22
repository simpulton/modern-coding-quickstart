# Example PR — what "well-formed" looks like

A reference for Module 09. This is how a small, honest PR reads when it follows the
constitution. Yours won't match line-for-line; the point is the shape.

---

**Commit**

```
docs: add myself to contributors

Adds my name to CONTRIBUTORS.md as part of Module 09.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

**Title:** `docs: add myself to contributors`

# Summary

Adds my name to `CONTRIBUTORS.md`. Documentation only — no code paths touched.

## Constitution checklist

- [x] Passes `nx run-many -t typecheck` (no `any`) — Principle IV
- [x] Passes lint, including `enforce-module-boundaries` — Principle I
- [x] All tests pass; new behavior has tests (contract, not implementation) — Principle VIII
  - _N/A: docs-only change, no new behavior._
- [x] Respects DDD layer dependency rules — Principle I
- [x] Reads = direct queries, writes = use cases — Principle II
- [x] Services resolved via Inversify, tokens in token files — Principle III
- [x] Types colocated, no generic `types.ts` — Principle IV
- [x] Extension-free imports, bundler resolution — Principle V
- [x] Grouped by feature, folder + index, no `utils.ts`, main-fn-first — Principle VI
- [x] Self-documenting; comments minimal and file-level only — Principle VII
- [x] Conventional commits, PR template used, hooks not skipped — Principle IX

## Notes

Pre-commit hook ran and passed; `--no-verify` was not used. No deviations from the
constitution.
