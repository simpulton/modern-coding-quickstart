// Cross-cutting DI tokens. Subdomain-specific tokens live in their own data
// layers; these are the technical seams shared by every subdomain.

export const SHARED_TOKENS = {
  Database: Symbol.for('pm.Database'),
  Clock: Symbol.for('pm.Clock'),
  IdGenerator: Symbol.for('pm.IdGenerator'),
  PasswordHasher: Symbol.for('pm.PasswordHasher'),
  TokenSigner: Symbol.for('pm.TokenSigner'),
  JwtSecret: Symbol.for('pm.JwtSecret'),
} as const;
