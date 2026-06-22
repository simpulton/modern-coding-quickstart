import { createUser } from '@pm/users-core-model';
import type { User, UserRepository, UserRole } from '@pm/users-core-model';
import { AppError } from '@pm/shared-kernel';
import type { Clock, IdGenerator, PasswordHasher } from '@pm/shared-kernel';

export interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface RegisterUserDeps {
  userRepository: UserRepository;
  passwordHasher: PasswordHasher;
  clock: Clock;
  idGenerator: IdGenerator;
}

export async function registerUserUseCase(
  input: RegisterUserInput,
  deps: RegisterUserDeps,
): Promise<User> {
  const existing = await deps.userRepository.findByEmail(input.email);
  if (existing) {
    throw new AppError('CONFLICT', `A user with email ${input.email} already exists`);
  }
  const passwordHash = await deps.passwordHasher.hash(input.password);
  const user = createUser({
    id: deps.idGenerator.next(),
    email: input.email,
    passwordHash,
    name: input.name,
    role: input.role ?? 'member',
    now: deps.clock.now(),
  });
  await deps.userRepository.save(user);
  return user;
}
