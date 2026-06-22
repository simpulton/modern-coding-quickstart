// Technical seams shared across subdomains, injected via the container so that
// use cases stay pure and tests stay deterministic.

import type { AuthActor } from './identity';

export interface Clock {
  now(): Date;
}

export interface IdGenerator {
  next(): string;
}

export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  verify(plain: string, hash: string): Promise<boolean>;
}

export interface TokenSigner {
  sign(actor: AuthActor): Promise<string>;
  verify(token: string): Promise<AuthActor | null>;
}
