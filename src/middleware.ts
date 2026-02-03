import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPrefixes = [
  // '/feed', // TEMP: allow feed without auth until cookie-based auth is implemented
  '/messages',
  '/subscriptions',
  '/wallet',
  '/transactions',
  '/settings',
  '/creator',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Supabase v2 از کوکی sb-access-token استفاده می‌کند
  const hasSessionCookie = req.cookies.has('sb-access-token');
  if (!hasSessionCookie) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
