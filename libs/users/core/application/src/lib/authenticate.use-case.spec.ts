import type { User, UserRepository } from '@pm/users-core-model';
import { UnauthorizedError } from '@pm/shared-kernel';
import type { PasswordHasher } from '@pm/shared-kernel';
import { authenticateUseCase } from './authenticate.use-case';

const user: User = {
  id: 'u1',
  email: 'alice@example.com',
  passwordHash: 'hash:Password1!',
  name: 'Alice',
  role: 'member',
  createdAt: new Date('2026-06-22T00:00:00Z'),
};

const saved: User[] = [];
const userRepository: UserRepository = {
  async save(user) {
    saved.push(user);
  },
  async findById() {
    return null;
  },
  async findByEmail(email) {
    return email === user.email ? user : null;
  },
};

const passwordHasher: PasswordHasher = {
  async hash(plain) {
    return `hash:${plain}`;
  },
  async verify(plain, hash) {
    return `hash:${plain}` === hash;
  },
};

describe('authenticateUseCase', () => {
  it('returns the user on matching credentials', async () => {
    const result = await authenticateUseCase(
      { email: 'alice@example.com', password: 'Password1!' },
      { userRepository, passwordHasher },
    );
    expect(result.id).toBe('u1');
  });

  it('rejects a wrong password without revealing which field failed', async () => {
    await expect(
      authenticateUseCase(
        { email: 'alice@example.com', password: 'wrong' },
        { userRepository, passwordHasher },
      ),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it('rejects an unknown email', async () => {
    await expect(
      authenticateUseCase(
        { email: 'ghost@example.com', password: 'x' },
        { userRepository, passwordHasher },
      ),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
