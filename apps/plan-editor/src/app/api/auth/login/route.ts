import { NextResponse } from 'next/server';
import { TRPCError } from '@trpc/server';
import { appRouter } from '../../../../server/app-router';
import { AUTH_COOKIE, createContext } from '../../../../server/context';

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as { email?: string; password?: string };
  const ctx = await createContext(req);
  const caller = appRouter.createCaller(ctx);

  try {
    const { token, user } = await caller.users.login({
      email: body.email ?? '',
      password: body.password ?? '',
    });
    const response = NextResponse.json({ user });
    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    const status = error instanceof TRPCError && error.code === 'UNAUTHORIZED' ? 401 : 400;
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ error: message }, { status });
  }
}
