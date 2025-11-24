"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import AdminDebugPanel from "@/components/AdminDebugPanel";
import {
  FaBars,
  FaHome,
  FaPlane,
  FaPlus,
  FaClock,
  FaBook,
  FaUsers,
  FaTimes,
  FaBell,
  FaCog,
  FaTicketAlt,
  FaChartBar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserShield,
  FaSignOutAlt,
  FaDollarSign,
} from "react-icons/fa";
import { 
  Home, 
  ToyBrickIcon, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  User,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const normalizePath = (path) => path.replace(/\/+$/, "");

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const normalizedPathname = normalizePath(pathname);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { authState, logout } = useAuth();
  const router = useRouter();

  const isActive = (href) => {
    const normalizedHref = normalizePath(href);
    if (normalizedHref === "/admin-dashboard") {
      return normalizedPathname === normalizedHref;
    }
    return normalizedPathname.startsWith(normalizedHref);
  };

  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
  };

  return (
    <RouteGuard>
      <div className={cn('flex', 'min-h-screen', 'bg-gradient-to-br', 'from-slate-50', 'via-blue-50', 'to-indigo-100')}>
      {/* Enhanced Sidebar */}
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
                  Flyola Admin
                </h1>
                <p className={cn('text-xs', 'text-slate-400')}>Management Portal</p>
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
          
          {/* User Info */}
          <div className={cn('flex', 'items-center', 'gap-3', 'p-3', 'bg-slate-800/50', 'rounded-xl')}>
            <div className={cn('w-8', 'h-8', 'bg-gradient-to-r', 'from-blue-400', 'to-indigo-400', 'rounded-full', 'flex', 'items-center', 'justify-center')}>
              <FaUserShield className={cn('text-white', 'text-sm')} />
            </div>
            <div className="flex-1">
              <p className={cn('text-sm', 'font-medium', 'text-white')}>Administrator</p>
              <p className={cn('text-xs', 'text-slate-400')}>Super Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={cn('flex-1', 'p-4', 'space-y-2', 'overflow-y-auto')}>
          {/* Dashboard Section */}
          <div className="mb-6">
            <p className={cn('text-xs', 'font-semibold', 'text-slate-400', 'uppercase', 'tracking-wider', 'mb-3', 'px-3')}>
              Dashboard
            </p>
            <Link
              href="/admin-dashboard"
              className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                isActive("/admin-dashboard") 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                  : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
              }`}
            >
              <FaHome className={`text-lg ${isActive("/admin-dashboard") ? "text-white" : "text-blue-400"}`} />
              <span className="font-medium">Overview</span>
              {isActive("/admin-dashboard") && (
                <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
              )}
            </Link>
          </div>

          {/* Flight Management */}
          <div className="mb-6">
            <p className={cn('text-xs', 'font-semibold', 'text-slate-400', 'uppercase', 'tracking-wider', 'mb-3', 'px-3')}>
              Flight Management
            </p>
            <div className="space-y-1">
              <Link
                href="/admin-dashboard/add-airport"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/add-airport") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaMapMarkerAlt className={`text-lg ${isActive("/admin-dashboard/add-airport") ? "text-white" : "text-emerald-400"}`} />
                <span className="font-medium">Airport Management</span>
                {isActive("/admin-dashboard/add-airport") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/add-flight"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/add-flight") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaPlane className={`text-lg ${isActive("/admin-dashboard/add-flight") ? "text-white" : "text-sky-400"}`} />
                <span className="font-medium">Flight Management</span>
                {isActive("/admin-dashboard/add-flight") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/scheduled-flight"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/scheduled-flight") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaCalendarAlt className={`text-lg ${isActive("/admin-dashboard/scheduled-flight") ? "text-white" : "text-purple-400"}`} />
                <span className="font-medium">Scheduled Flights</span>
                {isActive("/admin-dashboard/scheduled-flight") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
            </div>
          </div>

          {/* Booking Management */}
          <div className="mb-6">
            <p className={cn('text-xs', 'font-semibold', 'text-slate-400', 'uppercase', 'tracking-wider', 'mb-3', 'px-3')}>
              Booking Management
            </p>
            <div className="space-y-1">
              <Link
                href="/admin-dashboard/booking-list"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/booking-list") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaBook className={`text-lg ${isActive("/admin-dashboard/booking-list") ? "text-white" : "text-orange-400"}`} />
                <span className="font-medium">All Bookings</span>
                {isActive("/admin-dashboard/booking-list") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/booking-data"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/booking-data") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaChartBar className={`text-lg ${isActive("/admin-dashboard/booking-data") ? "text-white" : "text-pink-400"}`} />
                <span className="font-medium">Booking Analytics</span>
                {isActive("/admin-dashboard/booking-data") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/tickets"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/tickets") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaTicketAlt className={`text-lg ${isActive("/admin-dashboard/tickets") ? "text-white" : "text-yellow-400"}`} />
                <span className="font-medium">Flight Tickets</span>
                {isActive("/admin-dashboard/tickets") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/helicopter-tickets"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/helicopter-tickets") 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaTicketAlt className={`text-lg ${isActive("/admin-dashboard/helicopter-tickets") ? "text-white" : "text-purple-400"}`} />
                <span className="font-medium">Helicopter Tickets</span>
                {isActive("/admin-dashboard/helicopter-tickets") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/create-ticket"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/create-ticket") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaTicketAlt className={`text-lg ${isActive("/admin-dashboard/create-ticket") ? "text-white" : "text-green-400"}`} />
                <span className="font-medium">Create Ticket</span>
                {isActive("/admin-dashboard/create-ticket") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/refunds"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/refunds") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaDollarSign className={`text-lg ${isActive("/admin-dashboard/refunds") ? "text-white" : "text-green-400"}`} />
                <span className="font-medium">Refund Management</span>
                {isActive("/admin-dashboard/refunds") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/coupons"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/coupons") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaTicketAlt className={`text-lg ${isActive("/admin-dashboard/coupons") ? "text-white" : "text-purple-400"}`} />
                <span className="font-medium">Coupon Management</span>
                {isActive("/admin-dashboard/coupons") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/helicopter-booking"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/helicopter-booking") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaPlane className={`text-lg rotate-45 ${isActive("/admin-dashboard/helicopter-booking") ? "text-white" : "text-red-400"}`} />
                <span className="font-medium">Helicopter Bookings</span>
                {isActive("/admin-dashboard/helicopter-booking") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
            </div>
          </div>

          {/* Helicopter Management */}
          <div className="mb-6">
            <p className={cn('text-xs', 'font-semibold', 'text-slate-400', 'uppercase', 'tracking-wider', 'mb-3', 'px-3')}>
              Helicopter Management
            </p>
            <div className="space-y-1">
              <Link
                href="/admin-dashboard/helipad-management"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/helipad-management") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaMapMarkerAlt className={`text-lg ${isActive("/admin-dashboard/helipad-management") ? "text-white" : "text-orange-400"}`} />
                <span className="font-medium">Helipad Management</span>
                {isActive("/admin-dashboard/helipad-management") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/helicopter-management"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/helicopter-management") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaPlane className={`text-lg rotate-45 ${isActive("/admin-dashboard/helicopter-management") ? "text-white" : "text-red-400"}`} />
                <span className="font-medium">Helicopter Management</span>
                {isActive("/admin-dashboard/helicopter-management") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/helicopter-schedule"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/helicopter-schedule") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaCalendarAlt className={`text-lg ${isActive("/admin-dashboard/helicopter-schedule") ? "text-white" : "text-green-400"}`} />
                <span className="font-medium">Helicopter Schedule</span>
                {isActive("/admin-dashboard/helicopter-schedule") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
            </div>
          </div>

          {/* Joy Ride Management */}
          <div className="mb-6">
            <p className={cn('text-xs', 'font-semibold', 'text-slate-400', 'uppercase', 'tracking-wider', 'mb-3', 'px-3')}>
              Joy Ride Services
            </p>
            <div className="space-y-1">
              <Link
                href="/admin-dashboard/bookid-joyride"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/bookid-joyride") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <ToyBrickIcon className={`text-lg ${isActive("/admin-dashboard/bookid-joyride") ? "text-white" : "text-green-400"}`} />
                <span className="font-medium">Joy Ride Booking</span>
                {isActive("/admin-dashboard/bookid-joyride") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/all-joyride-slots"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/all-joyride-slots") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaClock className={`text-lg ${isActive("/admin-dashboard/all-joyride-slots") ? "text-white" : "text-cyan-400"}`} />
                <span className="font-medium">Available Slots</span>
                {isActive("/admin-dashboard/all-joyride-slots") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/all-joyride-booking"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/all-joyride-booking") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaBook className={`text-lg ${isActive("/admin-dashboard/all-joyride-booking") ? "text-white" : "text-rose-400"}`} />
                <span className="font-medium">Joy Ride Bookings</span>
                {isActive("/admin-dashboard/all-joyride-booking") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
            </div>
          </div>

          {/* User Management */}
          <div className="mb-6">
            <p className={cn('text-xs', 'font-semibold', 'text-slate-400', 'uppercase', 'tracking-wider', 'mb-3', 'px-3')}>
              User Management
            </p>
            <div className="space-y-1">
              <Link
                href="/admin-dashboard/all-users"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/all-users") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaUsers className={`text-lg ${isActive("/admin-dashboard/all-users") ? "text-white" : "text-indigo-400"}`} />
                <span className="font-medium">Manage Users</span>
                {isActive("/admin-dashboard/all-users") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
              
              <Link
                href="/admin-dashboard/agents"
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
                  isActive("/admin-dashboard/agents") 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`}
              >
                <FaUserShield className={`text-lg ${isActive("/admin-dashboard/agents") ? "text-white" : "text-emerald-400"}`} />
                <span className="font-medium">Agent Management</span>
                {isActive("/admin-dashboard/agents") && (
                  <div className={cn('ml-auto', 'w-2', 'h-2', 'bg-white', 'rounded-full')}></div>
                )}
              </Link>
            </div>
          </div>

          {/* Operations Dashboard Link */}
        
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
        {/* Enhanced Header */}
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
                  Welcome Back, Admin!
                </h2>
                <p className={cn('text-sm', 'text-slate-500')}>
                  Manage your flight operations efficiently
                </p>
              </div>
            </div>
            
            <div className={cn('flex', 'items-center', 'gap-3')}>
              {/* Search */}
              <div className={cn('hidden', 'sm:flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'bg-slate-100', 'rounded-xl')}>
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className={cn('bg-transparent', 'border-none', 'outline-none', 'text-sm', 'text-slate-600', 'placeholder-slate-400', 'w-40')}
                />
              </div>
              
              {/* Notifications */}
              <button className={cn('relative', 'p-2', 'rounded-xl', 'bg-slate-100', 'hover:bg-slate-200', 'transition-colors')}>
                <Bell size={20} className="text-slate-600" />
                <span className={cn('absolute', '-top-1', '-right-1', 'w-3', 'h-3', 'bg-red-500', 'rounded-full')}></span>
              </button>
              
              {/* Settings */}
              <button className={cn('p-2', 'rounded-xl', 'bg-slate-100', 'hover:bg-slate-200', 'transition-colors')}>
                <Settings size={20} className="text-slate-600" />
              </button>
              
              {/* Profile */}
              <div className={cn('flex', 'items-center', 'gap-2', 'px-3', 'py-2', 'bg-gradient-to-r', 'from-blue-500', 'to-indigo-500', 'rounded-xl', 'text-white')}>
                <User size={18} />
                <span className={cn('text-sm', 'font-medium', 'hidden', 'sm:block')}>Admin</span>
              </div>
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
      
      {/* Debug Panel - Only in development */}
      {process.env.NODE_ENV === 'development' && <AdminDebugPanel />}
    </div>
    </RouteGuard>
  );
}