// src/utils/auth.ts
import * as jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import * as dotenv from 'dotenv';
dotenv.config();

/** 
 * The shape of the data you embed in your JWTs 
 */
export interface TokenPayload {
  id:     string;
  email:  string;
  skills: string[];
  needs:  string[];
}

/**
 * Read a bearer token from headers/queries/body, verify it,
 * and populate `req.user` with the decoded payload.
 */
export function authenticateToken({ req }: any) {
  let token = req.body.token
           || req.query.token
           || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop()?.trim() ?? '';
  }
  if (!token) return req;

  try {
    const { data }: any = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || '',
      { maxAge: '2h' }
    );
    req.user = data;
  } catch {
    console.log('Invalid token');
  }

  return req;
}

/**
 * Produce a signed JWT from a clean payload of primitives.
 */
export function signToken(payload: TokenPayload): string {
  const secretKey = process.env.JWT_SECRET_KEY!;
  return jwt.sign(
    { data: payload },
    secretKey,
    { expiresIn: '2h' }
  );
}

/**
 * A GraphQL error class you can throw for auth failures.
 */
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}
