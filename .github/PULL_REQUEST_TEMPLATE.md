# Summary

<!-- What does this change do, and why? -->

## Constitution checklist

- [ ] Passes `nx run-many -t typecheck` (no `any`) — Principle IV
- [ ] Passes lint, including `enforce-module-boundaries` — Principle I
- [ ] All tests pass; new behavior has tests (contract, not implementation) — Principle VIII
- [ ] Respects DDD layer dependency rules — Principle I
- [ ] Reads = direct queries, writes = use cases — Principle II
- [ ] Services resolved via Inversify, tokens in token files — Principle III
- [ ] Types colocated, no generic `types.ts` — Principle IV
- [ ] Extension-free imports, bundler resolution — Principle V
- [ ] Grouped by feature, folder + index, no `utils.ts`, main-fn-first — Principle VI
- [ ] Self-documenting; comments minimal and file-level only — Principle VII
- [ ] Conventional commits, PR template used, hooks not skipped — Principle IX

## Notes

<!-- Any justified deviations from the constitution, documented per the Development Workflow. -->
