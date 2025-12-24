import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateToken, extractTokenFromCookies } from '@/src/utils/jwt.edge.util';
import { ApiResponse } from '@/src/types/apiResponse.type';
import prisma from '@/src/utils/prismaOrm.util';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieHeader = request.headers.get('cookie');
    const token = extractTokenFromCookies(cookieHeader);
    
    if (!token || !token.trim()) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'No refresh token provided',
        data: null,
      }, { status: 401 });
    }
    
    // Verify the existing token
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'Invalid or expired token',
        data: null,
      }, { status: 401 });
    }
    
    // Fetch fresh user data from database
    const user = await prisma.user.findFirst({
      where: { id: decoded?.userId },
    });
    
    if (!user || !user.enabled) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: 'User not found or disabled',
        data: null,
      }, { status: 401 });
    }
    
    // Generate new token with fresh data
    const newToken = await generateToken({
      userId: user.id,
      role: user.role,
      referralCode: user.referralCode,
    });
    
    // Create response with new token
    const response = NextResponse.json<ApiResponse>({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          referralCode: user.referralCode,
        },
      },
    }, { status: 200 });
    
    // Set new JWT token in HTTP-only cookie
    response.cookies.set('auth_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: 'Failed to refresh token',
      data: null,
    }, { status: 500 });
  }
}
