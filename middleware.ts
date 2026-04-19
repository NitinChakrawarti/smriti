import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NOTE: Middleware runs on the server and cannot access localStorage
// Authentication is handled client-side in page components
// This middleware is disabled to prevent redirect loops

export function middleware(request: NextRequest) {
  // Let all requests through - auth is handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
  ],
};
