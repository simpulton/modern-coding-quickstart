// Shared application error hierarchy. Layers throw these; the tRPC boundary maps them.

export type AppErrorCode = 'NOT_FOUND' | 'FORBIDDEN' | 'VALIDATION' | 'CONFLICT' | 'UNAUTHORIZED';

export class AppError extends Error {
  constructor(
    readonly code: AppErrorCode,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, id: string) {
    super('NOT_FOUND', `${entity} ${id} was not found`);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super('FORBIDDEN', message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super('VALIDATION', message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super('UNAUTHORIZED', message);
  }
}
