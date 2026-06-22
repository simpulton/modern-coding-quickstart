# Architecture Principles

These are the architectural principles and development standards for this project. Read sections I-IX to understand the core conventions, and refer back to specific sections during code review.

## Contents

- [I. DDD Architecture](#i-ddd-architecture)
- [II. CQRS](#ii-cqrs)
- [III. Dependency Injection](#iii-dependency-injection)
- [IV. Type Safety](#iv-type-safety)
- [V. ESM Imports](#v-esm-imports)
- [VI. Functional Cohesion](#vi-functional-cohesion)
- [VII. Code Documentation](#vii-code-documentation)
- [VIII. Contract Testing](#viii-contract-testing)
- [IX. Git Discipline](#ix-git-discipline)
- [Testing Standards](#testing-standards)
- [Development Workflow](#development-workflow)
- [Related Documents](#related-documents)

---

## Core Principles

### I. DDD Architecture

The system follows a six-layer DDD architecture with strict dependency rules:

- **Core Model** (`libs/<subdomain>/core/model`): Domain entities with no external dependencies
- **Core Application** (`libs/<subdomain>/core/application`): Use cases depending only on Core Model
- **Data Layer** (`libs/<subdomain>/data`): Persistence depending on Core Model
- **tRPC Layer** (`libs/<subdomain>/trpc`): API boundary depending on Core Application and Data
- **UI Layer** (`libs/<subdomain>/ui`): Presentation depending on tRPC
- **Infrastructure** (`libs/<subdomain>/infrastructure`): Technical implementations depending on Core Model, Core Application, and Data

**Rationale**: Maintaining clean boundaries ensures testability, maintainability, and prevents circular dependencies that complicate reasoning about the system.

### II. CQRS

We separate reads (queries) and writes (commands) into distinct paths:

- **Queries** are optimized for reading. They can bypass domain layers and query the database directly, returning DTOs without going through use cases or repositories.
- **Commands** go through use cases in the Core Application layer. Use cases enforce domain invariants and orchestrate writes. Repositories are an implementation detail within the application/data layers.
- Use cases are **pure functions** with signature `useCase(input, deps)` — not classes.

**Rationale**: Reads and writes have fundamentally different concerns. Reads benefit from direct, optimized data access. Writes need domain logic, validation, and invariant enforcement. Separating them keeps each path simple and avoids unnecessary abstraction on the read side.

### III. Dependency Injection

Service dependencies should be managed via Inversify DI container:

- Injectable services use `@injectable()` decorator
- Dependencies injected via constructor with `@inject(TOKEN)` decorator
- Tokens defined in dedicated token files for discoverability
- Composition root in `apps/plan-editor/src/server-composition-root/`

**Rationale**: DI enables testability, loose coupling, and makes dependency graphs explicit and manageable.

### IV. Type Safety

TypeScript types should be used throughout without escape hatches:

- The `any` type is not allowed — always find or define appropriate types
- Types should be colocated with the code that uses them
- Avoid generic type files (`types.ts`, `interfaces.ts`) — embed types in feature modules

**Rationale**: Strict typing catches errors at compile time and serves as living documentation. Colocation improves discoverability and maintainability.

### V. ESM Imports

Relative imports should omit file extensions — the bundler resolves them automatically:

- Relative `import` paths: `import { Foo } from './foo'`
- Relative `export` paths: `export * from './module'`
- Package imports (e.g., `@pm/projects-core-model`) also do not need extensions

**Rationale**: The project uses `"moduleResolution": "bundler"` in `tsconfig.base.json`, which handles extension resolution. Bundlers (Next.js, esbuild, Vite) resolve `.ts`/`.js` files without explicit extensions.

### VI. Functional Cohesion

Code organization should maximize functional cohesion:

- Group by feature/functionality, not by technical type
- Each module should encapsulate a complete responsibility
- Avoid generic utility files (`utils.ts`) — create feature-specific modules
- Use folder + index pattern to expose public APIs while hiding internals
- Within files: main functions first, helpers after their usage (top-to-bottom readability)

**Rationale**: High cohesion reduces coupling, makes code easier to understand and modify, and naturally guides good separation of concerns.

**Within a single file:**

```typescript
// Main entry points first
export function processUserData(data: UserData): ProcessedData {
  const validated = validateUserData(data);
  const transformed = transformUserData(validated);
  return enrichUserData(transformed);
}

// Helper functions after usage
function validateUserData(data: UserData): ValidatedData {
  // validation logic
}
```

**Module organization:**

```
user-manager/
├── index.ts              (public API exports)
├── user-validation.ts    (UserValidator type + validation functions)
├── user-transformation.ts (UserTransformer type + transformation logic)
└── user-persistence.ts   (UserRepository interface + operations)
```

**General principles:**

- Use clear, descriptive names (avoid abbreviations)
- Extract complex logic into well-named functions
- Break down large functions into smaller, focused ones
- Eliminate code duplication

### VII. Code Documentation

Code should be self-documenting through explicit naming and minimal comments:

- Comments should be minimal — provide only a high-level overview of the file's responsibility
- Use explicit, descriptive names that make the code's intent clear
- Avoid inline comments explaining what code does — the code itself should be clear
- File-level comments should describe the module's purpose, not implementation details
- Don't duplicate in comments what the code already expresses through naming

**Rationale**: Self-documenting code through explicit naming reduces maintenance burden, prevents comment drift, and improves readability.

### VIII. Contract Testing

We practice Test-Driven Development (TDD) for all new features. The key expectation is **testing contracts, not implementations** — verify what the code does (behavior/output), not how it does it.

- Write tests first — they should fail before implementation
- Use PGLite in-memory database for integration test isolation
- Verify behavior and output, not internal method calls

See [Testing Standards](#testing-standards) below for detailed guidance and examples.

**Rationale**: TDD ensures features are testable, properly scoped, and implementation-agnostic. Testing contracts rather than implementations makes tests resilient to refactoring.

### IX. Git Discipline

Version control should follow these conventions:

- Follow conventional commit format (e.g., `feat:`, `fix:`, `refactor:`)
- Use the GitHub PR template for all pull requests
- Don't skip pre-commit hooks (`--no-verify`) — they exist for a reason
- Never force push to main/master branches
- Never amend commits created by other developers
- Include `Co-Authored-By` attribution for AI-assisted commits

**Rationale**: Discipline in version control prevents data loss, maintains audit trails, and ensures all safety checks execute properly.

---

## Testing Standards

We use three types of tests, each serving a different purpose:

### Unit tests

Unit tests validate pure functions and domain logic in isolation. They run with Jest and are the fastest feedback loop.

**When to write them:**

- Domain entity factory functions and validation (Core Model)
- Pure transformation or computation functions
- Utility functions with well-defined inputs and outputs

**Where they live:** Colocated with the code they test (e.g., `create-project.use-case.test.ts` next to `create-project.use-case.ts`).

### Integration tests

Integration tests verify that layers work together correctly using a real (in-memory) database. They often use Jest with PGLite, which spins up a fresh in-memory PostgreSQL instance per test suite — no Docker required.

**When to write them:**

- New or modified tRPC route contracts
- Repository implementations (save/retrieve/delete operations)
- Use case orchestration in Core Application layer
- Cross-layer interactions (e.g., tRPC -> Application -> Repository)

**How they work:** A test composition root creates an Inversify container wired to PGLite instead of a real database. Real repository implementations run against PGLite while external services (SharePoint, AI) are mocked. Seed helpers make it easy to set up test data.

### E2E tests

E2E tests verify complete user workflows through the browser. They use Playwright with worker-scoped Next.js servers — each Playwright worker gets its own server instance on a dedicated port, enabling parallel test execution.

**When to write them:**

- Critical user-facing workflows (creating documents, generating content, assessments)
- Flows that involve multiple pages or navigation
- Interactions that depend on real browser behavior (drag-and-drop, keyboard shortcuts)

**Key rules:**

- Never use `page.waitForTimeout()` — use proper wait conditions (`toBeVisible()`, `waitForLoadState()`, custom predicates) instead. Inline timeouts create flaky tests.
- Use `data-testid`, ARIA roles, or text content for selectors
- Shared fixtures in `@pm/shared-testing` handle server startup, authentication, and database resets

### Contract testing

Across all test types, **always test the contract, not the implementation.** Focus on what the code does from a consumer's perspective, not how it does it internally.

**Good** — verify the output:

```typescript
it('should generate content when API returns successful response', async () => {
  mockService.process.mockResolvedValue('Generated content');

  const result = await service.generateContent({ prompt: 'Test' });

  expect(result).toBe('Generated content');
});
```

**Bad** — testing implementation details:

```typescript
it('should call API with correct parameters', async () => {
  await service.generateContent({ prompt: 'Test' });

  expect(mockAPI.post).toHaveBeenCalledWith('/endpoint', {
    method: 'POST',
    body: JSON.stringify({ prompt: 'Test' }),
  });
});
```

Tests should be resilient to refactoring. If the implementation changes but the behavior stays the same, your tests should still pass.

---

## Development Workflow

### Code review requirements

All changes should:

- Pass TypeScript type checking (`nx run-many --target=typecheck --all`)
- Pass linting (`yarn lint`)
- Pass all existing tests
- Include tests for new functionality
- Follow DDD layer dependency rules
- Maintain functional cohesion
- Document any justified deviations from these principles in the PR description

### Architecture decisions

New architectural patterns should:

1. Align with DDD principles
2. Be documented in CLAUDE.md with examples
3. Be validated in at least one concrete implementation
4. Not violate existing layer boundaries

### Database changes

Schema modifications should:

1. Be defined in `libs/projects/data/src/lib/schema.ts`
2. Generate migration: `yarn drizzle:generate`
3. Be tested in development: `yarn drizzle:push`
4. Include rollback plan for production migrations

---

## Related Documents

- `README.md` — Project setup and essential commands
- `AGENTS.md` — Development workflow and review guidelines for LLM agents
- `onboarding/ARCHITECTURE_GUIDE.md` — Comprehensive system architecture reference
