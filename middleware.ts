import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const userRole = request.cookies.get('userRole')?.value; // ✅ Ambil role dari cookie
  const pathname = request.nextUrl.pathname;

  // Public routes (tidak perlu login)
  const publicRoutes = ['/', '/login'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes: harus login dulu
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, request.url));
  }

  // ✅ Admin-only routes: cek role
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'admin') {
      // Operator coba akses /admin → redirect ke dashboard dengan error
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/',
  ],
};