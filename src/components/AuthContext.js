"use client";

import { createContext, useContext, useState, useEffect } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AuthContext = createContext();

const INITIAL = {
  isLoading: true,
  isLoggedIn: false,
  user: null,
  userRole: null,
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [authState, setAuthState] = useState(INITIAL);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const saved = localStorage.getItem("authState");

    if (token && saved) {
      const parsed = JSON.parse(saved);

      // IMPORTANT: Set auth state immediately from localStorage to prevent redirect
      setAuthState({ ...parsed, isLoading: true });

      // ALWAYS ensure token is in cookies for middleware
      const isSecure = window.location.protocol === 'https:';
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax${isSecure ? '; Secure' : ''}`;

      console.log('[AuthContext] Token set in cookie for middleware');

      // Try to verify the token with retry logic for hosted environments
      const verifyToken = async (retryCount = 0) => {
        try {
          const { id, email, role } = await API.users.getProfile();
          const newState = {
            isLoading: false,
            isLoggedIn: true,
            user: { id, email, role: String(role) },
            userRole: String(role),
          };
          setAuthState(newState);
          localStorage.setItem("authState", JSON.stringify(newState));
        } catch (err) {

          // Only log out for specific authentication errors
          const isAuthError = err?.response?.status === 401 ||
            err?.response?.status === 403 ||
            (err?.response?.status === 404 && err?.message?.includes("User not found"));

          if (isAuthError) {
            console.log('[AuthContext] Authentication error, session expired');
            
            // Check if user is on booking/payment page
            const currentPath = window.location.pathname;
            const isOnBookingPage = currentPath.includes('/booking') || 
                                   currentPath.includes('/payment') ||
                                   currentPath.includes('/scheduled-flight') ||
                                   currentPath.includes('/helicopter-flight');
            
            // Clear auth data
            setAuthState({ ...INITIAL, isLoading: false });
            localStorage.removeItem("authState");
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("userData");

            // Clear the cookie
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

            // If on booking page, show modal instead of redirecting
            if (isOnBookingPage) {
              setShowSessionExpiredModal(true);
              toast.warning("Your session has expired. Please log in to continue.", {
                position: "top-center",
                autoClose: 5000,
              });
            } else {
              // Only redirect to sign-in if user is on a protected route
              const protectedRoutes = ['/admin-dashboard', '/agent-dashboard', '/user-dashboard', '/booking-agent-dashboard'];
              const isOnProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));

              if (isOnProtectedRoute) {
                router.push("/sign-in");
              }
            }
          } else {
            // For network/server errors, retry once after a delay, then keep user logged in
            console.log('[AuthContext] Network/server error, retrying...', err?.message);
            if (retryCount === 0) {
              setTimeout(() => verifyToken(1), 2000);
            } else {
              // Use cached user data and keep them logged in
              console.log('[AuthContext] Using cached auth state after retry failed');
              setAuthState((prev) => ({ ...prev, isLoading: false }));
            }
          }
        }
      };

      verifyToken();
    } else {
      setAuthState({ ...INITIAL, isLoading: false });
    }
  }, [router]);

  const login = (token, user, skipRedirect = false) => {
    // Store token in both localStorage and cookies
    localStorage.setItem("token", token);

    // Set cookie with proper settings for middleware (7 days expiry)
    const isSecure = window.location.protocol === 'https:';
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax${isSecure ? '; Secure' : ''}`;

    // Update auth state
    const newState = {
      isLoading: false,
      isLoggedIn: true,
      user: user,
      userRole: String(user.role),
    };

    setAuthState(newState);
    localStorage.setItem("authState", JSON.stringify(newState));

    // Close session expired modal if open
    if (showSessionExpiredModal) {
      setShowSessionExpiredModal(false);
      toast.success("Welcome back! You can continue your booking.", {
        position: "top-center",
        autoClose: 3000,
      });
    }

    // Only redirect if not skipping redirect (for modal-based logins)
    if (!skipRedirect) {
      const redirectPath =
        user.role === 1
          ? "/admin-dashboard"
          : user.role === 2
            ? "/booking-agent-dashboard"
            : "/user-dashboard";
      router.push(redirectPath);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authState");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userData");

    // Clear the cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    setAuthState({ ...INITIAL, isLoading: false });
    router.push("/sign-in");
  };



  return (
    <AuthContext.Provider value={{ 
      authState, 
      setAuthState, 
      login, 
      logout,
      showSessionExpiredModal,
      setShowSessionExpiredModal,
      pendingBookingData,
      setPendingBookingData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}