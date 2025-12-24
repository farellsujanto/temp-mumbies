/**
 * Edge-Compatible JWT Utility Functions
 * Uses 'jose' library for Edge Runtime compatibility
 */

import { SignJWT, jwtVerify } from 'jose';
import { UserRole } from '@/generated/prisma/client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'mumbies-super-secret-key-change-in-production'
);
const JWT_EXPIRES_IN = '7d'; // 7 days

export interface JWTPayload {
  userId: number;
  role: UserRole;
  referralCode: string;
}

/**
 * Generate a JWT token for a user (Edge Runtime compatible)
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .setIssuedAt()
    .sign(JWT_SECRET);
  
  return token;
}

/**
 * Verify and decode a JWT token (Edge Runtime compatible)
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    // Validate token format before verification
    if (!token || !token.trim() || token.split('.').length !== 3) {
      return null;
    }
    
    const { payload } = await jwtVerify<JWTPayload>(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Extract token from cookies
 */
export function extractTokenFromCookies(cookies: string | null): string | null {
  if (!cookies) return null;
  
  const cookieArr = cookies.split(';');
  for (const cookie of cookieArr) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return value;
    }
  }
  return null;
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}
