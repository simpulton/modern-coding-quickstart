import { compare, hash } from 'bcryptjs';
import { injectable } from 'inversify';
import type { PasswordHasher } from '@pm/shared-kernel';

const SALT_ROUNDS = 10;

@injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  hash(plain: string): Promise<string> {
    return hash(plain, SALT_ROUNDS);
  }

  verify(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
}
