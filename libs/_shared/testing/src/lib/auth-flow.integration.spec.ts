import type { Container } from 'inversify';
import { usersRouter } from '@pm/users-trpc';
import { SHARED_TOKENS } from '@pm/shared-kernel';
import type { TokenSigner } from '@pm/shared-kernel';
import { createTestContainer } from './test-container';
import { createTestDatabase } from './test-database';
import { seedUser } from './seed';
import type { TestDatabase } from './test-database';

describe('auth flow (login -> bcrypt verify -> signed JWT)', () => {
  let testDb: TestDatabase;
  let container: Container;

  beforeEach(async () => {
    testDb = await createTestDatabase();
    container = createTestContainer(testDb.db);
    await seedUser(container, { email: 'alice@example.com', password: 'Password1!', name: 'Alice' });
  });

  afterEach(async () => {
    await testDb.close();
  });

  it('issues a verifiable token for valid credentials', async () => {
    const result = await usersRouter
      .createCaller({ container, actor: null })
      .login({ email: 'alice@example.com', password: 'Password1!' });

    expect(result.user.email).toBe('alice@example.com');
    const actor = await container
      .get<TokenSigner>(SHARED_TOKENS.TokenSigner)
      .verify(result.token);
    expect(actor).toEqual({ id: result.user.id, role: 'member' });
  });

  it('rejects an invalid password with UNAUTHORIZED', async () => {
    await expect(
      usersRouter
        .createCaller({ container, actor: null })
        .login({ email: 'alice@example.com', password: 'wrong' }),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });
});
