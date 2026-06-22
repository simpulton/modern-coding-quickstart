import { SignJWT, jwtVerify } from 'jose';
import { inject, injectable } from 'inversify';
import { SHARED_TOKENS } from '@pm/shared-kernel';
import type { AuthActor, TokenSigner } from '@pm/shared-kernel';

@injectable()
export class JwtTokenService implements TokenSigner {
  private readonly key: Uint8Array;

  constructor(@inject(SHARED_TOKENS.JwtSecret) secret: string) {
    this.key = new TextEncoder().encode(secret);
  }

  async sign(actor: AuthActor): Promise<string> {
    return new SignJWT({ role: actor.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(actor.id)
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(this.key);
  }

  async verify(token: string): Promise<AuthActor | null> {
    try {
      const { payload } = await jwtVerify(token, this.key);
      const role = payload['role'];
      if (typeof payload.sub !== 'string' || (role !== 'admin' && role !== 'member')) {
        return null;
      }
      return { id: payload.sub, role };
    } catch {
      return null;
    }
  }
}
