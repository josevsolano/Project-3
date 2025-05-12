import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET_KEY ?? process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('Missing JWT secret (set JWT_SECRET_KEY or JWT_SECRET in .env)');
}

export interface TokenPayload {
  id:     string;
  email:  string;
  skills: string[];
  needs:  string[];
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(
    { data: payload },
    SECRET!,          // ← assert non‑null here
    { expiresIn: '2h' }
  );
}

export function authenticateToken(req: any): any {
  let token = req.body?.token || req.query?.token;
  const auth = req.headers?.authorization;
  if (auth?.startsWith('Bearer ')) {
    token = auth.split(' ')[1].trim();
  }
  if (!token) return req;

  try {
    const { data } = jwt.verify(
      token,
      SECRET!,          // ← and here
      { maxAge: '2h' }
    ) as { data: TokenPayload };
    req.user = data;
  } catch {
    console.warn('🔒 Invalid or expired JWT');
  }
  return req;
}

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'UNAUTHENTICATED' } });
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}
