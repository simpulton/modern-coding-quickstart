import { protectedProcedure, publicProcedure, router } from './trpc';

describe('shared-trpc foundation', () => {
  it('exposes router and procedures', () => {
    expect(typeof router).toBe('function');
    expect(publicProcedure).toBeDefined();
    expect(protectedProcedure).toBeDefined();
  });
});
