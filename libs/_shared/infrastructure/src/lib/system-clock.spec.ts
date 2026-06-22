import { SystemClock } from './system-clock';
import { UuidGenerator } from './uuid-generator';

describe('shared infrastructure adapters', () => {
  it('SystemClock returns a Date', () => {
    expect(new SystemClock().now()).toBeInstanceOf(Date);
  });

  it('UuidGenerator returns unique ids', () => {
    const gen = new UuidGenerator();
    expect(gen.next()).not.toBe(gen.next());
  });
});
