"use client";

import { useAuth } from "@/components/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import {
  Bell,
  Home,
  Search,
  Settings,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaBars,
  FaClock,
  FaCreditCard,
  FaDollarSign,
  FaHeadset,
  FaHome,
  FaHotel,
  FaPlane,
  FaSignOutAlt,
  FaTicketAlt,
  FaTimes,
  FaUser,
  FaUserCircle
} from "react-icons/fa";

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
      <div className="flex min-h-screen bg-slate-50/50">
        {/* Minimalist Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full z-30 w-72 flex flex-col overflow-hidden transition-all duration-300 border-r border-slate-200 shadow-sm ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 bg-white text-slate-600`}
        >
          {/* Header */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <img src="/flights/Layer_1.png" alt="" className="w-10 h-10" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900 flex items-center gap-1">
                    Flyola <span className="text-xs font-normal text-slate-400">⌄</span>
                  </h1>
                </div>
              </div>
              <button
                onClick={() => setSidebarVisible(false)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
                aria-label="Close sidebar"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            {/* Overview Section */}
            <div className="mb-6">
              <Link
                href="/user-dashboard"
                className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard")
                  ? "bg-[#E8F5E9] text-[#001E5B] font-semibold"
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setSidebarVisible(false)}
              >
                <FaHome className={`text-lg ${isActive("/user-dashboard") ? "text-[#001E5B]" : "text-slate-400"}`} />
                <span>Start here!</span>
              </Link>
            </div>

            <div className="h-px bg-slate-100 my-4 mx-2"></div>

            {/* My Bookings Section */}
            <div className="space-y-1">
              <Link
                href="/user-dashboard/bookings"
                className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/bookings")
                  ? "bg-gray-100 text-[#0049CF] font-semibold"
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setSidebarVisible(false)}
              >
                <FaPlane className={`text-lg ${isActive("/user-dashboard/bookings") ? "text-[#0049CF]" : "text-slate-400"}`} />
                <span>Flight Bookings</span>
              </Link>

              <Link
                href="/user-dashboard/helicopter-bookings"
                className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/helicopter-bookings")
                  ? "bg-[#E8F5E9] text-[#001E5B] font-semibold"
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setSidebarVisible(false)}
              >
                <FaClock className={`text-lg ${isActive("/user-dashboard/helicopter-bookings") ? "text-[#001E5B]" : "text-slate-400"}`} />
                <span>Helicopter Bookings</span>
              </Link>

              <Link
                href="/user-dashboard/hotel-bookings"
                className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/hotel-bookings")
                  ? "bg-[#E8F5E9] text-[#001E5B] font-semibold"
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setSidebarVisible(false)}
              >
                <FaHotel className={`text-lg ${isActive("/user-dashboard/hotel-bookings") ? "text-[#001E5B]" : "text-slate-400"}`} />
                <span>Hotel Bookings</span>
              </Link>

              <Link
                href="/user-dashboard/pnr-status"
                className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/pnr-status")
                  ? "bg-[#E8F5E9] text-[#001E5B] font-semibold"
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setSidebarVisible(false)}
              >
                <FaTicketAlt className={`text-lg ${isActive("/user-dashboard/pnr-status") ? "text-[#001E5B]" : "text-slate-400"}`} />
                <span>PNR Status</span>
              </Link>
            </div>

            <div className="h-px bg-slate-100 my-6 mx-2"></div>

            {/* Financial Section */}
            <div className="space-y-1">
              <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Financial</p>
              <Link
                href="/user-dashboard/payments"
                className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/payments")
                  ? "bg-[#E8F5E9] text-[#001E5B] font-semibold"
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setSidebarVisible(false)}
              >
                <FaCreditCard className={`text-lg ${isActive("/user-dashboard/payments") ? "text-[#001E5B]" : "text-slate-400"}`} />
                <span>Payments</span>
              </Link>
              <Link
                href="/user-dashboard/refunds"
                className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/refunds")
                  ? "bg-[#E8F5E9] text-[#001E5B] font-semibold"
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setSidebarVisible(false)}
              >
                <FaDollarSign className={`text-lg ${isActive("/user-dashboard/refunds") ? "text-[#001E5B]" : "text-slate-400"}`} />
                <span>Refunds</span>
              </Link>
            </div>

            <div className="h-px bg-slate-100 my-6 mx-2"></div>

            {/* Account Section */}
            <div className="space-y-1">
              <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Account</p>
              <Link
                href="/user-dashboard/support"
                className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/support")
                  ? "bg-[#E8F5E9] text-[#001E5B] font-semibold"
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setSidebarVisible(false)}
              >
                <FaHeadset className={`text-lg ${isActive("/user-dashboard/support") ? "text-[#001E5B]" : "text-slate-400"}`} />
                <span>Support</span>
              </Link>
              <Link
                href="/user-dashboard/profile"
                className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200 group ${isActive("/user-dashboard/profile")
                  ? "bg-[#E8F5E9] text-[#001E5B] font-semibold"
                  : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setSidebarVisible(false)}
              >
                <FaUser className={`text-lg ${isActive("/user-dashboard/profile") ? "text-[#001E5B]" : "text-slate-400"}`} />
                <span>Profile</span>
              </Link>
            </div>
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full py-3 px-4 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
            >
              <FaSignOutAlt className="text-lg text-slate-400 group-hover:text-red-500" />
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
        )}        {/* Main Content */}
        <main className="flex-1 relative md:ml-72 bg-white flex flex-col min-h-screen">
          {/* Enhanced Header */}
          <header className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-sm">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4">
              <div className="flex items-center gap-3 lg:gap-4">
                <button
                  onClick={() => setSidebarVisible(!isSidebarVisible)}
                  className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                  aria-label="Toggle sidebar"
                >
                  <FaBars size={18} className="text-slate-600" />
                </button>
                <div>
                  <h2 className="text-sm lg:text-2xl font-bold text-slate-800">
                    Welcome Back!
                  </h2>
                  <p className="text-[10px] lg:text-sm text-slate-500">
                    Manage your bookings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:gap-3">
                {/* Search - Hidden on Small Screens */}
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
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
                  <Home size={18} className="text-slate-600 sm:w-5 sm:h-5" />
                </Link>

                {/* Notifications */}
                <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                  <Bell size={18} className="text-slate-600 sm:w-5 sm:h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* Settings - Hidden on mobile, shown on SM or above if needed or just kept for desktop */}
                <button className="hidden sm:block p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                  <Settings size={18} className="text-slate-600 sm:w-5 sm:h-5" />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                  <User size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:block">Profile</span>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-4 md:p-6 lg:p-8 flex-1 bg-slate-50/30">
            <div className="max-w-7xl mx-auto h-full">
              <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 lg:p-10 min-h-[600px] shadow-sm">
                {children}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-slate-500">
                  <p>Jet Serve Aviation Pvt. Ltd © {new Date().getFullYear()}. All Rights Reserved</p>
                  <div className="flex items-center gap-4">
                    <span className="hidden md:block">|</span>
                    <Link href="/privacy" className="hover:text-slate-900 transition-colors duration-200">
                      Privacy
                    </Link>
                    <span>•</span>
                    <Link href="/terms" className="hover:text-slate-900 transition-colors duration-200">
                      Terms
                    </Link>
                    <span>•</span>
                    <Link href="/refund" className="hover:text-slate-900 transition-colors duration-200">
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
