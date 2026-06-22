import { randomUUID } from 'node:crypto';
import { injectable } from 'inversify';
import type { IdGenerator } from '@pm/shared-kernel';

@injectable()
export class UuidGenerator implements IdGenerator {
  next(): string {
    return randomUUID();
  }
}
