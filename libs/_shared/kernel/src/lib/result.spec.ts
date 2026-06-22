import { err, ok } from './result';
import { ForbiddenError, NotFoundError } from './errors';

describe('Result', () => {
  it('wraps success values', () => {
    const result = ok(42);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(42);
    }
  });

  it('wraps errors', () => {
    const result = err(new NotFoundError('Project', 'p1'));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('NOT_FOUND');
      expect(result.error.message).toMatch(/Project p1/);
    }
  });
});

describe('AppError hierarchy', () => {
  it('carries a stable code and name', () => {
    const error = new ForbiddenError('nope');
    expect(error.code).toBe('FORBIDDEN');
    expect(error.name).toBe('ForbiddenError');
    expect(error).toBeInstanceOf(Error);
  });
});
