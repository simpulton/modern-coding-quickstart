import { SHARED_TOKENS } from '@pm/shared-kernel';
import type { AuthActor, TokenSigner } from '@pm/shared-kernel';
import type { TrpcContext } from '@pm/shared-trpc';
import { getContainer } from './server-composition-root/container';

export const AUTH_COOKIE = 'pm_token';

// Builds the per-request tRPC context: the app container plus the actor decoded
// from the request's JWT cookie (null when absent or invalid).
export async function createContext(req: Request): Promise<TrpcContext> {
  const container = await getContainer();
  const token = readCookie(req.headers.get('cookie'), AUTH_COOKIE);
  let actor: AuthActor | null = null;
  if (token) {
    actor = await container.get<TokenSigner>(SHARED_TOKENS.TokenSigner).verify(token);
  }
  return { container, actor };
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) {
    return null;
  }
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) {
      return decodeURIComponent(rest.join('='));
    }
  }
  return null;
}
