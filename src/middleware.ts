import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { TOKEN_COOKIE } from '@/lib/constants';

const PROTECTED = [
  '/dashboard',
  '/analytics',
  '/bookings',
  '/reviews',
  '/profile',
  '/offers',
  '/finance',
  '/admin',
  '/settings',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE)?.value;

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // صفحات محمية بلا توكن → تسجيل الدخول.
  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // مسجّل ويحاول الدخول → لوحة التحكم.
  if (pathname === '/login' && token) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.svg).*)',
  ],
};
