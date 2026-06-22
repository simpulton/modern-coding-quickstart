import { injectable } from 'inversify';
import type { Clock } from '@pm/shared-kernel';

@injectable()
export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
