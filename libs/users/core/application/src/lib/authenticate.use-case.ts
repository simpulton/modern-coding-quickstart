import type { User, UserRepository } from '@pm/users-core-model';
import { UnauthorizedError } from '@pm/shared-kernel';
import type { PasswordHasher } from '@pm/shared-kernel';

export interface AuthenticateInput {
  email: string;
  password: string;
}

export interface AuthenticateDeps {
  userRepository: UserRepository;
  passwordHasher: PasswordHasher;
}

export async function authenticateUseCase(
  input: AuthenticateInput,
  deps: AuthenticateDeps,
): Promise<User> {
  const user = await deps.userRepository.findByEmail(input.email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }
  const matches = await deps.passwordHasher.verify(input.password, user.passwordHash);
  if (!matches) {
    throw new UnauthorizedError('Invalid email or password');
  }
  return user;
}
