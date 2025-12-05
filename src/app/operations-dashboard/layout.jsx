"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import {
  FaBars,
  FaHome,
  FaPlane,
  FaTimes,
  FaTicketAlt,
  FaChartBar,
  FaSignOutAlt,
  FaHelicopter,
} from "react-icons/fa";
import Link from "next/link";
import { cn } from "@/lib/utils";

const normalizePath = (path) => path.replace(/\/+$/, "");

export default function OperationsDashboardLayout({ children }) {
  const pathname = usePathname();
  const normalizedPathname = normalizePath(pathname);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { authState, logout } = useAuth();
  const router = useRouter();

  const isActive = (href) => {
    const normalizedHref = normalizePath(href);
    if (normalizedHref === "/operations-dashboard") {
      return normalizedPathname === normalizedHref;
    }
    return normalizedPathname.startsWith(normalizedHref);
  };

  // Check if user has role 6 (Operations)
  useEffect(() => {
    if (!authState.isLoading && (!authState.isLoggedIn || (authState.userRole !== "6" && authState.userRole !== 6))) {
      router.push("/sign-in");
    }
  }, [authState.isLoading, authState.isLoggedIn, authState.userRole, router]);

  const handleLogout = () => {
    logout();
  };

  return (
    <RouteGuard>
      <div className={cn('flex', 'min-h-screen', 'bg-gradient-to-br', 'from-slate-50', 'via-blue-50', 'to-indigo-100')}>
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full z-30 w-80 flex flex-col overflow-hidden transition-all duration-300 ${
            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl border-r border-slate-700/50`}
        >
          {/* Header */}
          <div className={cn('p-6', 'border-b', 'border-slate-700/50')}>
            <div className={cn('flex', 'items-center', 'justify-between', 'mb-4')}>
              <div className={cn('flex', 'items-center', 'gap-3')}>
                <div className={cn('w-10', 'h-10', 'bg-gradient-to-r', 'from-blue-400', 'to-indigo-400', 'rounded-xl', 'flex', 'items-center', 'justify-center')}>
                  <FaPlane className={cn('text-white', 'text-lg')} />
                </div>
                <div>
                  <h1 className={cn('text-xl', 'font-bold', 'bg-gradient-to-r', 'from-white', 'to-blue-200', 'bg-clip-text', 'text-transparent')}>
                    Operations Portal
                  </h1>
                  <p className={cn('text-xs', 'text-slate-400')}>Flight Operations Management</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarVisible(false)}
                className={cn('md:hidden', 'p-2', 'rounded-lg', 'hover:bg-slate-800', 'transition-colors')}
                aria-label="Close sidebar"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className={cn('flex-1', 'p-4', 'space-y-2', 'overflow-y-auto')}>
            {/* Dashboard */}
            <div className="mb-6">
              <p className={cn('text-xs', 'font-semibold', 'text-slate-400', 'uppercase', 'tracking-wider', 'mb-3', 'px-3')}>
                Overview
              </p>
              <Link
                href="/operations-dashboard"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/operations-dashboard") && normalizedPathname === "/operations-dashboard"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaChartBar className={`text-lg ${isActive("/operations-dashboard") && normalizedPathname === "/operations-dashboard" ? "text-white" : "text-blue-400"}`} />
                <span className="font-medium">Dashboard</span>
              </Link>
            </div>

            {/* Flight Operations */}
            <div className="mb-6">
              <p className={cn('text-xs', 'font-semibold', 'text-slate-400', 'uppercase', 'tracking-wider', 'mb-3', 'px-3')}>
                Flight Operations
              </p>
              <div className="space-y-1">
                <Link
                  href="/operations-dashboard/flight-bookings"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                    isActive("/operations-dashboard/flight-bookings")
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                  }`}
                >
                  <FaPlane className={`text-lg ${isActive("/operations-dashboard/flight-bookings") ? "text-white" : "text-sky-400"}`} />
                  <span className="font-medium">Flight Bookings</span>
                </Link>

                <Link
                  href="/operations-dashboard/flight-tickets"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                    isActive("/operations-dashboard/flight-tickets")
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                  }`}
                >
                  <FaTicketAlt className={`text-lg ${isActive("/operations-dashboard/flight-tickets") ? "text-white" : "text-yellow-400"}`} />
                  <span className="font-medium">Flight Tickets</span>
                </Link>
              </div>
            </div>

            {/* Helicopter Operations */}
            <div className="mb-6">
              <p className={cn('text-xs', 'font-semibold', 'text-slate-400', 'uppercase', 'tracking-wider', 'mb-3', 'px-3')}>
                Helicopter Operations
              </p>
              <div className="space-y-1">
                <Link
                  href="/operations-dashboard/helicopter-bookings"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                    isActive("/operations-dashboard/helicopter-bookings")
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                  }`}
                >
                  <FaHelicopter className={`text-lg ${isActive("/operations-dashboard/helicopter-bookings") ? "text-white" : "text-red-400"}`} />
                  <span className="font-medium">Helicopter Bookings</span>
                </Link>

                <Link
                  href="/operations-dashboard/helicopter-tickets"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                    isActive("/operations-dashboard/helicopter-tickets")
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                  }`}
                >
                  <FaTicketAlt className={`text-lg ${isActive("/operations-dashboard/helicopter-tickets") ? "text-white" : "text-purple-400"}`} />
                  <span className="font-medium">Helicopter Tickets</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className={cn('p-4', 'border-t', 'border-slate-700/50')}>
            <button
              onClick={handleLogout}
              className={cn('flex', 'items-center', 'gap-3', 'w-full', 'py-3', 'px-4', 'rounded-xl', 'text-slate-300', 'hover:text-white', 'hover:bg-red-600/20', 'transition-all', 'duration-200', 'group')}
            >
              <FaSignOutAlt className={cn('text-lg', 'text-red-400')} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarVisible && (
          <div
            onClick={() => setSidebarVisible(false)}
            className={cn('fixed', 'inset-0', 'bg-black/50', 'z-20', 'md:hidden')}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className={cn('flex-1', 'relative', 'md:ml-80', 'overflow-x-hidden')}>
          {/* Header */}
          <header className={cn('sticky', 'top-0', 'z-20', 'bg-white/80', 'backdrop-blur-lg', 'border-b', 'border-slate-200/50', 'shadow-sm')}>
            <div className={cn('flex', 'items-center', 'justify-between', 'px-6', 'py-4')}>
              <div className={cn('flex', 'items-center', 'gap-4')}>
                <button
                  onClick={() => setSidebarVisible(!isSidebarVisible)}
                  className={cn('md:hidden', 'p-2', 'rounded-xl', 'bg-slate-100', 'hover:bg-slate-200', 'transition-colors')}
                  aria-label="Toggle sidebar"
                >
                  <FaBars size={20} className="text-slate-600" />
                </button>
                <div>
                  <h2 className={cn('text-2xl', 'font-bold', 'text-slate-800')}>
                    Operations Dashboard
                  </h2>
                  <p className={cn('text-sm', 'text-slate-500')}>
                    Flight & Helicopter Operations Management
                  </p>
                </div>
              </div>

              <div className={cn('flex', 'items-center', 'gap-3')}>
                {/* Home Link */}
                <Link
                  href="/"
                  className={cn('p-2', 'rounded-xl', 'bg-slate-100', 'hover:bg-slate-200', 'transition-colors')}
                  title="Go to Home"
                >
                  <FaHome size={20} className="text-slate-600" />
                </Link>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className={cn('p-6', 'min-h-screen', 'bg-gradient-to-br', 'from-slate-50', 'via-blue-50', 'to-indigo-100', 'overflow-x-hidden')}>
            <div className={cn('w-full', 'max-w-full', 'overflow-x-hidden')}>
              <div className={cn('bg-white/70', 'backdrop-blur-sm', 'rounded-2xl', 'shadow-xl', 'border', 'border-white/20', 'p-8', 'min-h-[600px]', 'overflow-x-hidden')}>
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
