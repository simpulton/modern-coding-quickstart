import { initTRPC, TRPCError } from '@trpc/server';
import type { Container } from 'inversify';
import { AppError } from '@pm/shared-kernel';
import type { AppErrorCode, AuthActor } from '@pm/shared-kernel';

// The request context: the composition-root container plus the authenticated
// actor (null when the request carries no valid token). Routers resolve the
// services they need from the container, so this foundation stays free of any
// data- or domain-layer dependency.
export interface TrpcContext {
  container: Container;
  actor: AuthActor | null;
}

const t = initTRPC.context<TrpcContext>().create();

const errorCodeMap: Record<AppErrorCode, TRPCError['code']> = {
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION: 'BAD_REQUEST',
  CONFLICT: 'CONFLICT',
  UNAUTHORIZED: 'UNAUTHORIZED',
};

// Translate domain/application AppErrors into the matching tRPC error codes so
// the boundary speaks HTTP semantics. tRPC reports resolver failures via the
// result object (not a throw), with the original error on `.cause`.
const mapDomainErrors = t.middleware(async ({ next }) => {
  const result = await next();
  if (!result.ok && result.error.cause instanceof AppError) {
    const cause = result.error.cause;
    throw new TRPCError({ code: errorCodeMap[cause.code], message: cause.message, cause });
  }
  return result;
});

export const router = t.router;
export const publicProcedure = t.procedure.use(mapDomainErrors);

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.actor) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required' });
  }
  return next({ ctx: { ...ctx, actor: ctx.actor } });
});
