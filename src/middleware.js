export const runtime = 'experimental-edge';

import { NextResponse } from 'next/server';

// SIMPLIFIED MIDDLEWARE - NO AUTHENTICATION FOR BOOKING PAGES
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  console.log("[Middleware] Request path:", pathname);
  console.log("[Middleware] Allowing all requests - booking pages are public");
  
  // Allow all requests to pass through
  // No authentication checks for any routes
  return NextResponse.next();
}

// Only run middleware on dashboard routes (not on booking pages)
export const config = {
  matcher: [
    '/admin-dashboard/:path*',
    '/agent-dashboard/:path*',
    '/user-dashboard/:path*',
    '/booking-agent-dashboard/:path*',
    '/mp-tourism-portal/:path*',
    '/operations-dashboard/:path*',
  ],
};
