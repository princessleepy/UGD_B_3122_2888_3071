import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has('session');
  const pathname = request.nextUrl.pathname;

  // Jika user akses /login tapi sudah login -> redirect ke /dashboard
  if (pathname === '/login') {
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Jika user akses /dashboard tanpa session -> redirect ke /login
  if (pathname.startsWith('/dashboard')) {
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Admin-only routes: cek role
  if (pathname.startsWith('/admin')) {
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const userRole = request.cookies.get('userRole')?.value;
    if (userRole !== 'admin') {
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