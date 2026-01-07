"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
// Use numbers, same as your middleware
const ROLES = {
  ADMIN: 1,
  AGENT: 2,
  USER: 3,
  HEAD_ADMIN: 4,
  CHAIRMAN_ADMIN: 5,
  OPERATIONS: 6,
  ACCOUNTS_ADMIN: 7,
  MP_TOURISM: 8,
};

// Route → allowed roles
const ROUTE_ACCESS = {
  "/admin-dashboard": [ROLES.ADMIN],
  "/agent-dashboard": [ROLES.AGENT],
  "/user-dashboard": [ROLES.USER],
  "/booking-agent-dashboard": [ROLES.AGENT],
  "/head-admin-dashboard": [ROLES.HEAD_ADMIN],
  "/chairman-admin-dashboard": [ROLES.CHAIRMAN_ADMIN],
  "/operations-dashboard": [ROLES.OPERATIONS],
  "/accounts-admin-dashboard": [ROLES.ACCOUNTS_ADMIN],
  "/mp-tourism-portal": [ROLES.MP_TOURISM],
  "/scheduled-flight": [ROLES.USER, ROLES.AGENT],

  "/combined-booking-page": [ROLES.USER, ROLES.AGENT],
  "/get-ticket": [ROLES.USER, ROLES.AGENT],
  "/ticket-page": [ROLES.USER, ROLES.AGENT],
};

const RouteGuard = ({ children }) => {
  const { authState } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getRedirectPath = (userRole) => {
    switch (userRole) {
      case ROLES.ADMIN:
        return "/admin-dashboard";
      case ROLES.AGENT:
        return "/agent-dashboard";
      case ROLES.USER:
        return "/user-dashboard";
      case ROLES.HEAD_ADMIN:
        return "/head-admin-dashboard";
      case ROLES.CHAIRMAN_ADMIN:
        return "/chairman-admin-dashboard";
      case ROLES.OPERATIONS:
        return "/operations-dashboard";
      case ROLES.ACCOUNTS_ADMIN:
        return "/accounts-admin-dashboard";
      case ROLES.MP_TOURISM:
        return "/mp-tourism-portal";
      default:
        return "/sign-in";
    }
  };

  useEffect(() => {
    const checkAccess = () => {
      // 1) Still loading auth → keep skeleton
      if (authState.isLoading) {
        setIsLoading(true);
        setIsAuthorized(false);
        return;
      }

      // 2) Not logged in → check if token exists before redirecting
      if (!authState.isLoggedIn) {
        // If token exists in localStorage, wait for verification
        const hasToken = typeof window !== 'undefined' && localStorage.getItem("token");
        
        if (hasToken) {
          // Token exists but not verified yet, keep loading
          setIsLoading(true);
          setIsAuthorized(false);
          return;
        }
        
        // No token at all, redirect to sign-in
        setIsLoading(false);
        setIsAuthorized(false);
        router.push("/sign-in");
        return;
      }

      // 3) Normalize role to NUMBER (matches middleware)
      const rawRole = authState.userRole ?? authState.user?.role;
      const userRole = Number(rawRole);

      if (!userRole || Number.isNaN(userRole)) {
        setIsLoading(false);
        setIsAuthorized(false);
        router.push("/sign-in");
        return;
      }

      // 4) Check if route has any specific role restriction
      let hasAccess = true;

      for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_ACCESS)) {
        if (pathname.startsWith(routePrefix)) {
          hasAccess = allowedRoles.includes(userRole);
          if (!hasAccess) {
            setIsLoading(false);
            setIsAuthorized(false);
            const redirectPath = getRedirectPath(userRole);
            router.push(redirectPath);
            return;
          }
          break;
        }
      }

      // 5) All good - user is authorized
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAccess();
  }, [authState.isLoading, authState.isLoggedIn, authState.userRole, authState.user?.role, pathname, router]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn('min-h-screen', 'bg-gradient-to-br', 'from-slate-50', 'via-blue-50', 'to-indigo-100')}>
        <div className="flex">
          {/* Sidebar Skeleton */}
          <div className={cn('w-80', 'bg-gradient-to-br', 'from-slate-900', 'via-blue-900', 'to-indigo-900', 'min-h-screen', 'p-6')}>
            <div className="space-y-4">
              <div className={cn('flex', 'items-center', 'gap-3')}>
                <div className={cn('h-10', 'w-10', 'bg-slate-700', 'rounded-xl', 'animate-pulse')}></div>
                <div className="space-y-2">
                  <div className={cn('h-4', 'w-24', 'bg-slate-700', 'rounded', 'animate-pulse')}></div>
                  <div className={cn('h-3', 'w-20', 'bg-slate-700', 'rounded', 'animate-pulse')}></div>
                </div>
              </div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={cn('h-12', 'bg-slate-800/50', 'rounded-xl', 'animate-pulse')}></div>
              ))}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className={cn('flex-1', 'p-6')}>
            <div className={cn('bg-white/70', 'rounded-2xl', 'p-8')}>
              <div className={cn('text-center', 'space-y-4')}>
                <div className={cn('h-8', 'w-48', 'bg-gray-200', 'rounded', 'animate-pulse', 'mx-auto')}></div>
                <div className={cn('h-4', 'w-32', 'bg-gray-200', 'rounded', 'animate-pulse', 'mx-auto')}></div>
                <div className={cn('grid', 'grid-cols-4', 'gap-6', 'mt-8')}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={cn('h-32', 'bg-gray-200', 'rounded-xl', 'animate-pulse')}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unauthorized state (should rarely show, because we redirect above)
  if (!isAuthorized) {
    return (
      <div className={cn('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-gray-50')}>
        <div className="text-center">
          <div className={cn('text-red-500', 'text-6xl', 'mb-4')}>🚫</div>
          <h1 className={cn('text-2xl', 'font-bold', 'text-gray-800', 'mb-2')}>
            Access Denied
          </h1>
          <p className={cn('text-gray-600', 'mb-4')}>
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.back()}
            className={cn('px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors')}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default RouteGuard;
