import type { PgliteDatabase } from 'drizzle-orm/pglite';

// The workshop uses PGLite (in-memory Postgres) for both dev and tests, so the
// repository type is uniform across the app and the test composition root.
export type Database = PgliteDatabase;
