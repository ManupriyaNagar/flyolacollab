"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import AdminDebugPanel from "@/components/AdminDebugPanel";
import {
  FaBars,
  FaPlane,
  FaTimes,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";
import { 
  Bell,
  Settings,
  Search,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarMenuItem, SidebarSection } from "@/components/admin/SidebarComponents";
import { menuConfig } from "@/components/admin/menuConfig";

const normalizePath = (path) => path.replace(/\/+$/, "");

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const normalizedPathname = normalizePath(pathname);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { logout } = useAuth();

  const isActive = (href) => {
    const normalizedHref = normalizePath(href);
    if (normalizedHref === "/admin-dashboard") {
      return normalizedPathname === normalizedHref;
    }
    return normalizedPathname.startsWith(normalizedHref);
  };

  const handleLogout = () => {
    logout();
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
          <SidebarSection title={menuConfig.dashboard.title}>
            {menuConfig.dashboard.items.map((item) => (
              <SidebarMenuItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                iconColor={item.iconColor}
                activeGradient={item.activeGradient}
              />
            ))}
          </SidebarSection>

          {/* Flight Management */}
          <SidebarSection title={menuConfig.flightManagement.title}>
            {menuConfig.flightManagement.items.map((item) => (
              <SidebarMenuItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                iconColor={item.iconColor}
                activeGradient={item.activeGradient}
              />
            ))}
          </SidebarSection>

          {/* Booking Management */}
          <SidebarSection title={menuConfig.bookingManagement.title}>
            {menuConfig.bookingManagement.items.map((item) => (
              <SidebarMenuItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                iconColor={item.iconColor}
                activeGradient={item.activeGradient}
              />
            ))}
          </SidebarSection>

          {/* Helicopter Management */}
          <SidebarSection title={menuConfig.helicopterManagement.title}>
            {menuConfig.helicopterManagement.items.map((item) => (
              <SidebarMenuItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                iconColor={item.iconColor}
                activeGradient={item.activeGradient}
              />
            ))}
          </SidebarSection>

          {/* Joy Ride Services */}
          <SidebarSection title={menuConfig.joyRideServices.title}>
            {menuConfig.joyRideServices.items.map((item) => (
              <SidebarMenuItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                iconColor={item.iconColor}
                activeGradient={item.activeGradient}
              />
            ))}
          </SidebarSection>

          {/* User Management */}
          <SidebarSection title={menuConfig.userManagement.title}>
            {menuConfig.userManagement.items.map((item) => (
              <SidebarMenuItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                iconColor={item.iconColor}
                activeGradient={item.activeGradient}
              />
            ))}
          </SidebarSection>

          {/* System Settings */}
          <SidebarSection title={menuConfig.systemSettings.title}>
            {menuConfig.systemSettings.items.map((item) => (
              <SidebarMenuItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                iconColor={item.iconColor}
                activeGradient={item.activeGradient}
              />
            ))}
          </SidebarSection>
        
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