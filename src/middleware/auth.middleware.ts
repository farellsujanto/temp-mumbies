/**
 * Authentication Middleware
 * Protects routes and validates user roles
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, extractTokenFromCookies, hasRole, JWTPayload } from '@/src/utils/jwt.edge.util';
import { UserRole } from '@/generated/prisma/client';
import { ApiResponse } from '@/src/types/apiResponse.type';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Middleware to authenticate requests
 * Checks for valid JWT token in Authorization header or cookies
 */
export async function authenticateUser(request: NextRequest): Promise<{ authenticated: boolean; user?: JWTPayload; error?: NextResponse }> {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get('authorization');
  let token = extractTokenFromHeader(authHeader);
  
  // If not in header, try cookies
  if (!token) {
    const cookieHeader = request.headers.get('cookie');
    token = extractTokenFromCookies(cookieHeader);
  }
  
  if (!token) {
    return {
      authenticated: false,
      error: NextResponse.json<ApiResponse>({
        success: false,
        message: 'Authentication required. Please login.',
        data: null,
      }, { status: 401 })
    };
  }
  
  const decoded = await verifyToken(token);
  
  if (!decoded) {
    return {
      authenticated: false,
      error: NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid or expired token. Please login again.',
        data: null,
      }, { status: 401 })
    };
  }
  
  return {
    authenticated: true,
    user: decoded,
  };
}

/**
 * Middleware to authorize user based on roles
 */
export async function authorizeRoles(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<{ authorized: boolean; user?: JWTPayload; error?: NextResponse }> {
  const authResult = await authenticateUser(request);
  
  if (!authResult.authenticated || !authResult.user) {
    return {
      authorized: false,
      error: authResult.error,
    };
  }
  
  if (!hasRole(authResult.user.role, allowedRoles)) {
    return {
      authorized: false,
      error: NextResponse.json<ApiResponse>({
        success: false,
        message: 'Insufficient permissions. Access denied.',
        data: null,
      }, { status: 403 })
    };
  }
  
  return {
    authorized: true,
    user: authResult.user,
  };
}

/**
 * Create a protected route handler
 */
export function withAuth(
  handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>,
  allowedRoles?: UserRole[]
) {
  return async (request: NextRequest) => {
    if (allowedRoles && allowedRoles.length > 0) {
      const authResult = await authorizeRoles(request, allowedRoles);
      if (!authResult.authorized || !authResult.user) {
        return authResult.error!;
      }
      return handler(request, authResult.user);
    } else {
      const authResult = await authenticateUser(request);
      if (!authResult.authenticated || !authResult.user) {
        return authResult.error!;
      }
      return handler(request, authResult.user);
    }
  };
}
