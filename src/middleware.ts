import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromCookies } from '@/src/utils/jwt.edge.util';

// Routes that require authentication
const protectedRoutes = ['/dashboard'];

// Public routes that should redirect to dashboard if already logged in
const authRoutes = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get token from cookies
  const cookieHeader = request.headers.get('cookie');
  const token = extractTokenFromCookies(cookieHeader);
  
  // Verify token (ensure it's not empty string)
  const user = token && token.trim() ? await verifyToken(token) : null;
  
  // Redirect to login if accessing protected route without valid token
  if (isProtectedRoute && !user) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
  
  // Redirect to appropriate dashboard if already logged in and accessing auth pages
  if (isAuthRoute && user) {
    let dashboardUrl = '/dashboard/account';
    
    if (user.role === 'ADMIN') {
      dashboardUrl = '/dashboard/admin';
    } else if (user.role === 'PARTNER') {
      dashboardUrl = '/dashboard/partner';
    }
    
    const url = new URL(dashboardUrl, request.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
