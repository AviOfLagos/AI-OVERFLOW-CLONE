// src/utils/supabase/middleware.ts

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

// Define protected routes
const PROTECTED_ROUTES: string[] = [
  '/',
  '/settings',
  '/profile',
  '/submit-issue',
  '/submit-error',
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Create Supabase client
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Check auth for protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    // Redirect unauthenticated users to sign-in page
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === '/sign-in' || pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to proceed
  return response;
}

export const config = {
  matcher: ['/', '/settings', '/profile', '/submit-issue', '/submit-error'],
};
