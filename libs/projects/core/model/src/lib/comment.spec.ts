import { createComment } from './comment';

describe('createComment', () => {
  const base = { id: 'c1', projectId: 'p1', authorId: 'u1', now: new Date('2026-06-22T00:00:00Z') };

  it('trims the body', () => {
    expect(createComment({ ...base, body: '  hi  ' }).body).toBe('hi');
  });

  it('rejects an empty body', () => {
    expect(() => createComment({ ...base, body: '   ' })).toThrow(/must not be empty/);
  });
});
