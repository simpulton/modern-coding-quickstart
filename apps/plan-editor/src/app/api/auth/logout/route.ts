import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '../../../../server/context';

export function POST(): Response {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
