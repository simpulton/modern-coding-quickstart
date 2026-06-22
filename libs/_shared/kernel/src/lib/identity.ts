// The authenticated caller, derived from the request's JWT at the tRPC boundary.

export interface AuthActor {
  id: string;
  role: 'admin' | 'member';
}
