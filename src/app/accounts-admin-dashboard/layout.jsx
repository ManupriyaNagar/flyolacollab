"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import {
  FaBars,
  FaHome,
  FaDollarSign,
  FaChartPie,
  FaTimes,
  FaBell,
  FaCog,
  FaCalculator,
  FaSignOutAlt,
  FaFileInvoiceDollar,
  FaReceipt,
} from "react-icons/fa";
import { 
  Home, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  User,
  LogOut
} from "lucide-react";
import Link from "next/link";

const normalizePath = (path) => path.replace(/\/+$/, "");

export default function AccountsAdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const normalizedPathname = normalizePath(pathname);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { authState, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoading && (!authState.isLoggedIn || authState.userRole !== '7')) {
      router.push('/sign-in');
    }
  }, [authState, router]);

  const isActive = (href) => {
    const normalizedHref = normalizePath(href);
    if (normalizedHref === "/accounts-admin-dashboard") {
      return normalizedPathname === normalizedHref;
    }
    return normalizedPathname.startsWith(normalizedHref);
  };

  const handleLogout = () => {
    logout();
  };

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex">
          <div className="w-80 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 min-h-screen p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-700 rounded-xl animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-slate-700 rounded animate-pulse"></div>
                </div>
              </div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-800/50 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="bg-white/70 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto"></div>
                <div className="grid grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!authState.isLoggedIn || authState.userRole !== '7') {
    return null;
  }

  return (
    <RouteGuard>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Enhanced Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full z-30 w-80 flex flex-col overflow-hidden transition-all duration-300 ${
            isSidebarVisible ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white shadow-2xl border-r border-slate-700/50`}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                  <FaCalculator className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                    Accounts Admin
                  </h1>
                  <p className="text-xs text-slate-400">Financial Portal</p>
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
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                <FaCalculator className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Accounts Administrator</p>
                <p className="text-xs text-slate-400">Financial Level</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {/* Dashboard Section */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                Dashboard
              </p>
              <Link
                href="/accounts-admin-dashboard"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/accounts-admin-dashboard") 
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaHome className={`text-lg ${isActive("/accounts-admin-dashboard") ? "text-white" : "text-green-400"}`} />
                <span className="font-medium">Overview</span>
                {isActive("/accounts-admin-dashboard") && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            </div>

            {/* Financial Management */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                Financial Management
              </p>
              <div className="space-y-1">
                <Link
                  href="/accounts-admin-dashboard/financial-reports"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                    isActive("/accounts-admin-dashboard/financial-reports") 
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg" 
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                  }`}
                >
                  <FaFileInvoiceDollar className={`text-lg ${isActive("/accounts-admin-dashboard/financial-reports") ? "text-white" : "text-emerald-400"}`} />
                  <span className="font-medium">Financial Reports</span>
                  {isActive("/accounts-admin-dashboard/financial-reports") && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
                
                <Link
                  href="/accounts-admin-dashboard/payment-management"
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                    isActive("/accounts-admin-dashboard/payment-management") 
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg" 
                      : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                  }`}
                >
                  <FaReceipt className={`text-lg ${isActive("/accounts-admin-dashboard/payment-management") ? "text-white" : "text-yellow-400"}`} />
                  <span className="font-medium">Payment Management</span>
                  {isActive("/accounts-admin-dashboard/payment-management") && (
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
                    Accounts Portal
                  </h2>
                  <p className="text-sm text-slate-500">
                    Financial management and reporting
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                  <Search size={18} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Quick search..."
                    className="bg-transparent border-none outline-none text-sm text-slate-600 placeholder-slate-400 w-40"
                  />
                </div>
                
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
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
                  <User size={18} />
                  <span className="text-sm font-medium hidden sm:block">Accounts</span>
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
        </main>
      </div>
    </RouteGuard>
  );
}