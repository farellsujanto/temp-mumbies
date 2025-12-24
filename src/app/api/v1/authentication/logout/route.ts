import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/src/types/apiResponse.type';

/**
 * POST /api/v1/authentication/logout
 * Logout user by clearing auth token
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.json<ApiResponse>({
    success: true,
    message: 'Logged out successfully',
    data: null,
  });

  // Clear the auth token cookie
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
