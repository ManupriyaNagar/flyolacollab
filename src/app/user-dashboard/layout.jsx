"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import {
  FaBars,
  FaHome,
  FaClock,
  FaDollarSign,
  FaHeadset,
  FaCreditCard,
  FaUser,
  FaTimes,
  FaBell,
  FaCog,
  FaTicketAlt,
  FaChartLine,
  FaPlane,
  FaSignOutAlt,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";
import {
  Home,
  Bell,
  Settings,
  Search,
  User,
  LogOut
} from "lucide-react";

const normalizePath = (path) => path.replace(/\/+$/, "");

export default function UserDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { authState, logout } = useAuth();
  const normalizedPathname = normalizePath(pathname);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const isActive = (href) => {
    const normalizedHref = normalizePath(href);
    if (normalizedHref === "/user-dashboard") {
      return normalizedPathname === normalizedHref;
    }
    return normalizedPathname.startsWith(normalizedHref);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <RouteGuard>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Enhanced Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full z-30 w-80 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white shadow-2xl border-r border-slate-700/50`}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                  <FaPlane className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Flyola
                  </h1>
                  <p className="text-xs text-slate-400">User Portal</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarVisible(false)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close sidebar"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                <FaUserCircle className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Welcome Back!</p>
                <p className="text-xs text-slate-400">Valued Customer</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {/* Dashboard Section */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                Overview
              </p>
              <Link
                href="/user-dashboard"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard")
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                  }`}
                onClick={() => setSidebarVisible(false)}
              >
                <FaHome className={`text-lg ${isActive("/user-dashboard") ? "text-white" : "text-blue-400"}`} />
                <span className="font-medium">Dashboard</span>
                {isActive("/user-dashboard") && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            </div>

            {/* Booking Management */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                My Bookings
              </p>
              <div className="space-y-1">
                <Link
                  href="/user-dashboard/bookings"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/bookings")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                    }`}
                  onClick={() => setSidebarVisible(false)}
                >
                  <FaClock className={`text-lg ${isActive("/user-dashboard/bookings") ? "text-white" : "text-emerald-400"}`} />
                  <span className="font-medium">Flight Bookings</span>
                  {isActive("/user-dashboard/bookings") && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>

                <Link
                  href="/user-dashboard/helicopter-bookings"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/helicopter-bookings")
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                    }`}
                  onClick={() => setSidebarVisible(false)}
                >
                  <FaClock className={`text-lg ${isActive("/user-dashboard/helicopter-bookings") ? "text-white" : "text-purple-400"}`} />
                  <span className="font-medium">Helicopter Bookings</span>
                  {isActive("/user-dashboard/helicopter-bookings") && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>

                <Link
                  href="/user-dashboard/pnr-status"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/pnr-status")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                    }`}
                  onClick={() => setSidebarVisible(false)}
                >
                  <FaTicketAlt className={`text-lg ${isActive("/user-dashboard/pnr-status") ? "text-white" : "text-sky-400"}`} />
                  <span className="font-medium">PNR Status</span>
                  {isActive("/user-dashboard/pnr-status") && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              </div>
            </div>

            {/* Financial Management */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                Financial
              </p>
              <div className="space-y-1">
                <Link
                  href="/user-dashboard/payments"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/payments")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                    }`}
                  onClick={() => setSidebarVisible(false)}
                >
                  <FaCreditCard className={`text-lg ${isActive("/user-dashboard/payments") ? "text-white" : "text-orange-400"}`} />
                  <span className="font-medium">Payment History</span>
                  {isActive("/user-dashboard/payments") && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>

                <Link
                  href="/user-dashboard/refunds"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/refunds")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                    }`}
                  onClick={() => setSidebarVisible(false)}
                >
                  <FaDollarSign className={`text-lg ${isActive("/user-dashboard/refunds") ? "text-white" : "text-green-400"}`} />
                  <span className="font-medium">Refund Requests</span>
                  {isActive("/user-dashboard/refunds") && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              </div>
            </div>

            {/* Support & Account */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                Support & Account
              </p>
              <div className="space-y-1">
                <Link
                  href="/user-dashboard/support"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/support")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                    }`}
                  onClick={() => setSidebarVisible(false)}
                >
                  <FaHeadset className={`text-lg ${isActive("/user-dashboard/support") ? "text-white" : "text-pink-400"}`} />
                  <span className="font-medium">Support Tickets</span>
                  {isActive("/user-dashboard/support") && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>

                <Link
                  href="/user-dashboard/profile"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/profile")
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                    }`}
                  onClick={() => setSidebarVisible(false)}
                >
                  <FaUser className={`text-lg ${isActive("/user-dashboard/profile") ? "text-white" : "text-indigo-400"}`} />
                  <span className="font-medium">Profile Settings</span>
                  {isActive("/user-dashboard/profile") && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700/50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full py-3 px-4 rounded-xl text-slate-300 hover:text-white hover:bg-red-600/20 transition-all duration-200 group"
            >
              <FaSignOutAlt className="text-lg text-red-400" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarVisible && (
          <div
            onClick={() => setSidebarVisible(false)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 relative md:ml-80">
          {/* Enhanced Header */}
          <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarVisible(!isSidebarVisible)}
                  className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                  aria-label="Toggle sidebar"
                >
                  <FaBars size={20} className="text-slate-600" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Welcome Back!
                  </h2>
                  <p className="text-sm text-slate-500">
                    Manage your bookings and travel preferences
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                  <Search size={18} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder-slate-400 w-40"
                  />
                </div>

                {/* Home Link */}
                <Link
                  href="/"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                  title="Go to Home"
                >
                  <Home size={20} className="text-slate-600" />
                </Link>

                {/* Notifications */}
                <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                  <Bell size={20} className="text-slate-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Settings */}
                <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                  <Settings size={20} className="text-slate-600" />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                  <User size={18} />
                  <span className="text-sm font-medium hidden sm:block">Profile</span>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 min-h-[600px]">
                {children}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-700 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-slate-400">
                  <p>Jet Serve Aviation Pvt. Ltd © {new Date().getFullYear()}. All Rights Reserved</p>
                  <div className="flex items-center gap-4">
                    <span className="hidden md:block">|</span>
                    <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                      Privacy
                    </Link>
                    <span>•</span>
                    <Link href="/terms" className="hover:text-white transition-colors duration-200">
                      Terms
                    </Link>
                    <span>•</span>
                    <Link href="/refund" className="hover:text-white transition-colors duration-200">
                      Refund Policy
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <a
                    href="https://rbshstudio.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Powered By RBSH Studio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
