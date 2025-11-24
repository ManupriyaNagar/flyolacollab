"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

const ROLES = {
  ADMIN: 1,
  AGENT: 2,
  USER: 3
};

const ROUTE_ACCESS = {
  '/admin-dashboard': [ROLES.ADMIN],
  '/agent-dashboard': [ROLES.AGENT],
  '/user-dashboard': [ROLES.USER],
  '/booking-agent-dashboard': [ROLES.AGENT],
  // Allow admins + users + agents on booking flows (admins can test/book)
  '/booking': [ROLES.ADMIN, ROLES.USER, ROLES.AGENT],
  '/combined-booking-page': [ROLES.ADMIN, ROLES.USER, ROLES.AGENT]
  // Note: /ticket-page and /get-ticket are public - no role restrictions
};

const PROTECTED_ROUTES = [
  '/admin-dashboard',
  '/agent-dashboard', 
  '/user-dashboard',
  '/booking-agent-dashboard',
  '/booking',
  '/combined-booking-page'
  // Note: /ticket-page is NOT protected - anyone with a PNR can view their ticket
  // Note: /get-ticket is NOT protected - public ticket search page
];

export default function RouteProtection({ children }) {
  const { authState } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for auth state to load
    if (authState.isLoading) {
      return;
    }

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    
    if (!isProtectedRoute) return;

    if (!authState.isLoggedIn) {
      // Check if token exists in localStorage before redirecting
      const hasToken = typeof window !== 'undefined' && localStorage.getItem("token");
      
      if (hasToken) {
        // Token exists but not verified yet, wait for AuthContext
        return;
      }
      
      // No token, redirect to sign-in
      router.push('/sign-in');
      return;
    }

    const userRole = Number(authState.userRole);
    
    // Check role-based access
    for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_ACCESS)) {
      if (pathname.startsWith(routePrefix)) {
        if (!allowedRoles.includes(userRole)) {
          // Redirect to appropriate dashboard
          const redirectPath = getRedirectPath(userRole);
          router.push(redirectPath);
          return;
        }
        break;
      }
    }
  }, [authState.isLoading, authState.isLoggedIn, authState.userRole, pathname, router]);

  return children;
}

function getRedirectPath(userRole) {
  switch (userRole) {
    case ROLES.ADMIN:
      return '/admin-dashboard';
    case ROLES.AGENT:
      return '/agent-dashboard';
    case ROLES.USER:
      return '/user-dashboard';
    default:
      return '/sign-in';
  }
}