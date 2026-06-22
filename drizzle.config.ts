import { defineConfig } from 'drizzle-kit';

// The workshop runs on PGLite (in-memory Postgres) for both dev and tests.
// `npm run drizzle:generate` writes SQL migrations from the schemas; the test
// composition root and the app apply the schema directly for zero-setup runs.
export default defineConfig({
  dialect: 'postgresql',
  driver: 'pglite',
  schema: ['./libs/projects/data/src/lib/schema.ts', './libs/users/data/src/lib/schema.ts'],
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'memory://',
  },
});
