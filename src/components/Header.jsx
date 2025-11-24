"use client";

import React, { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
  TicketIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { cn } from "@/lib/utils";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { authState, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Dropdown items
  const services = [
    { name: 'Personal Charter', href: '/personal-charter' },
    { name: 'Hire Charter', href: '/hire-charter' },
    { name: 'Business Class', href: '/business-class-charter' },
    { name: 'Helicopter Hire', href: '/helicopter-hire' },
    { name: 'Marriage', href: '/hire-for-marriage' },
  ];
  
  const downloads = [
    { name: 'Ticket', href: '/get-ticket' },
    { name: 'Schedule', href: '/schedule-final.pdf', download: true },
  ];

  // User menu
  const userMenuItems = [
    { name: 'Profile', href: '/user-dashboard', icon: ChevronDownIcon },
    { name: 'My Bookings', href: '/user-dashboard/bookings', icon: TicketIcon },
    { name: 'Settings', href: '', icon: Cog6ToothIcon },
  ];
  
  const adminMenuItems = [
    { name: 'Admin Dashboard', href: '/admin-dashboard', icon: ChartBarIcon },
    { name: 'Manage Flights', href: '/admin-dashboard/add-flight', icon: PaperAirplaneIcon },
    { name: 'Joy Ride Management', href: '/admin-dashboard/all-joyride-slots', icon: SparklesIcon },
  ];

  const operationsMenuItems = [
    { name: 'MP Tourism Portal', href: '/operations-dashboard', icon: ChartBarIcon },
    { name: 'Flight Bookings', href: '/operations-dashboard/flight-bookings', icon: PaperAirplaneIcon },
    { name: 'Helicopter Bookings', href: '/operations-dashboard/helicopter-bookings', icon: SparklesIcon },
    { name: 'Flight Tickets', href: '/operations-dashboard/flight-tickets', icon: TicketIcon },
  ];

  const isActive = (href) => pathname === href;

  return (


<header
  className={`fixed left-1/2 -translate-x-1/2 bg-white/50 w-5/6   rounded-b-xl py-2 top-0 z-50 transition duration-300 ${
    scrolled ? 'backdrop-blur-md' : 'backdrop-blur-sm'
  }`}
>

      <nav className={cn('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')}>
        <div className={cn('flex', 'h-16', 'items-center', 'justify-between')}>
          {/* Logo */}
          <Link href="/" className={cn('flex', 'items-center', 'flex-shrink-0')}>
            <img src="/log.png" alt="Logo" className={cn('h-8', 'w-40')} />
          </Link>

<div className={cn('hidden', 'md:block')}>
          {/* Desktop Navigation */}
        <div className={cn('lg:flex', 'items-center', 'space-x-1', 'flex-1', 'justify-center', 'text-black')}>
            <Link
              href="/scheduled-flight"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                isActive('/scheduled-flight') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-black hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Flights
            </Link>

            <Link
              href="/joy-ride"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                isActive('/joy-ride') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-black hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Joy Ride
            </Link>

            {/* Services Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className={cn('inline-flex', 'items-center', 'px-3', 'py-2', 'text-sm', 'font-medium', 'text-black', 'hover:text-blue-600', 'hover:bg-blue-50', 'rounded-lg', 'transition')}>
                Services
                <ChevronDownIcon className={cn('w-4', 'h-4', 'ml-1')} />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Menu.Items className={cn('absolute', 'left-0', 'mt-2', 'w-56', 'bg-white', 'rounded-lg', 'shadow-lg', 'ring-1', 'ring-black', 'ring-opacity-5', 'border', 'border-slate-200', 'z-50')}>
                  {services.map((item) => (
                    <Menu.Item key={item.href}>
                      {({ active }) => (
                        <Link
                          href={item.href}
                          className={`${
                            active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                          } block px-4 py-2 text-sm`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>

            <Link
              href="/about"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                isActive('/about') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-black hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                isActive('/contact') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-black hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Contact
            </Link>

            {/* Download Dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className={cn('inline-flex', 'items-center', 'px-3', 'py-2', 'text-sm', 'font-medium', 'text-black', 'hover:text-blue-600', 'hover:bg-blue-50', 'rounded-lg', 'transition')}>
                Download
                <ChevronDownIcon className={cn('w-4', 'h-4', 'ml-1')} />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Menu.Items className={cn('absolute', 'left-0', 'mt-2', 'w-40', 'bg-white', 'rounded-lg', 'shadow-lg', 'ring-1', 'ring-black', 'ring-opacity-5', 'border', 'border-slate-200', 'z-50')}>
                  {downloads.map((item) => (
                    <Menu.Item key={item.href}>
                      {({ active }) => (
                        <Link
                          href={item.href}
                          download={item.download}
                          className={`${
                            active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                          } block px-4 py-2 text-sm`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
      </div>
          {/* Desktop Auth Buttons */}
          <div className={cn('hidden', 'md:block', 'lg:flex', 'items-center', 'space-x-3')}>
            {!authState.isLoading && authState.isLoggedIn ? (
              <Menu as="div" className="relative">
                <Menu.Button className={cn('flex', 'items-center', 'px-3', 'py-2', 'rounded-lg', 'text-sm', 'font-medium', 'text-slate-700', 'hover:bg-slate-100', 'transition')}>
                  <UserCircleIcon className={cn('w-7', 'h-7')} />
                  <ChevronDownIcon className={cn('w-4', 'h-4', 'ml-1')} />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className={cn('absolute', 'right-0', 'mt-2', 'w-56', 'bg-white', 'rounded-xl', 'shadow-lg', 'ring-1', 'ring-black', 'ring-opacity-5', 'border', 'border-slate-200')}>
                    <div className="p-2">
                      <div className={cn('px-3', 'py-2', 'border-b', 'border-slate-100')}>
                        <p className={cn('text-xs', 'text-slate-500')}>
                          {authState.userRole === '1' 
                            ? 'Administrator' 
                            : authState.userRole === '2' 
                            ? 'Agent'
                            : authState.userRole === '8'
                            ? 'MP Tourism Portal'
                            : 'Customer'}
                        </p>
                      </div>
                      
                      {(authState.userRole === '1' || authState.userRole === 1) &&
                        adminMenuItems.map((item) => (
                          <Menu.Item key={item.href}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={`${
                                  active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                                } flex items-center px-3 py-2 text-sm rounded-lg`}
                              >
                                <item.icon className={cn('w-4', 'h-4', 'mr-2')} />
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      
                      {(authState.userRole === '8' || authState.userRole === 8) &&
                        operationsMenuItems.map((item) => (
                          <Menu.Item key={item.href}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={`${
                                  active ? 'bg-purple-50 text-purple-700' : 'text-slate-700'
                                } flex items-center px-3 py-2 text-sm rounded-lg`}
                              >
                                <item.icon className={cn('w-4', 'h-4', 'mr-2')} />
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      
                      {(authState.userRole !== '1' && authState.userRole !== 1 && authState.userRole !== '8' && authState.userRole !== 8) &&
                        userMenuItems.map((item) => (
                        <Menu.Item key={item.href}>
                          {({ active }) => (
                            <Link
                              href={item.href}
                              className={`${
                                active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'
                              } flex items-center px-3 py-2 text-sm rounded-lg`}
                            >
                              <item.icon className={cn('w-4', 'h-4', 'mr-2')} />
                              {item.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                      
                      <div className={cn('border-t', 'border-slate-100', 'my-2')} />
                      
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`flex w-full items-center px-3 py-2 text-sm rounded-lg ${
                              active ? 'bg-red-50 text-red-700' : 'text-slate-700'
                            }`}
                          >
                            <ArrowRightOnRectangleIcon className={cn('w-4', 'h-4', 'mr-2')} />
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={cn('px-3', 'py-2', 'text-sm', 'font-medium', 'text-slate-700', 'hover:text-blue-600', 'hover:bg-blue-50', 'rounded-lg', 'transition', 'whitespace-nowrap')}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className={cn('px-4', 'py-2', 'bg-blue-600', 'text-white', 'text-sm', 'font-medium', 'rounded-lg', 'hover:bg-blue-700', 'transition', 'shadow-sm', 'whitespace-nowrap')}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn('p-2', 'rounded-lg', 'text-black', 'hover:text-blue-600', 'hover:bg-blue-50', 'transition')}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className={cn('w-6', 'h-6')} />
              ) : (
                <Bars3Icon className={cn('w-6', 'h-6')} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <Transition
          show={mobileMenuOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className={cn('lg:hidden', 'bg-white', 'border-t', 'border-slate-200', 'shadow-lg', 'rounded-b-xl', 'mt-2')}>
            <div className={cn('px-2', 'pt-2', 'pb-3', 'space-y-1')}>
              <Link
                href="/scheduled-flight"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium rounded-lg ${
                  isActive('/scheduled-flight')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-black hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Flights
              </Link>

              <Link
                href="/joy-ride"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium rounded-lg ${
                  isActive('/joy-ride')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-black hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Joy Ride
              </Link>

              {/* Mobile Services */}
              <Menu as="div" className="relative">
                <Menu.Button className={cn('w-full', 'text-left', 'px-3', 'py-2', 'text-base', 'font-medium', 'text-black', 'hover:text-blue-600', 'hover:bg-blue-50', 'rounded-lg', 'transition')}>
                  Services
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className={cn('mt-1', 'space-y-1')}>
                    {services.map((item) => (
                      <Menu.Item key={item.href}>
                        {({ active }) => (
                          <Link
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`${
                              active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                            } block px-5 py-2 text-base rounded-lg`}
                          >
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium rounded-lg ${
                  isActive('/about')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-black hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                About
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-base font-medium rounded-lg ${
                  isActive('/contact')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-black hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Contact
              </Link>

              {/* Mobile Download */}
              <Menu as="div" className="relative">
                <Menu.Button className={cn('w-full', 'text-left', 'px-3', 'py-2', 'text-base', 'font-medium', 'text-black', 'hover:text-blue-600', 'hover:bg-blue-50', 'rounded-lg', 'transition')}>
                  Download
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className={cn('mt-1', 'space-y-1')}>
                    {downloads.map((item) => (
                      <Menu.Item key={item.href}>
                        {({ active }) => (
                          <Link
                            href={item.href}
                            download={item.download}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`${
                              active ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                            } block px-5 py-2 text-base rounded-lg`}
                          >
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            {/* Mobile User Menu */}
            {!authState.isLoading && authState.isLoggedIn && (
              <div className={cn('border-t', 'border-slate-200', 'pt-3', 'pb-4')}>
                <div className={cn('space-y-1', 'px-2')}>
                  <div className={cn('px-3', 'py-2')}>
                    <p className={cn('text-sm', 'text-slate-500')}>
                      {authState.userRole === '1'
                        ? 'Admin'
                        : authState.userRole === '2'
                        ? 'Agent'
                        : authState.userRole === '8'
                        ? 'MP Tourism Portal'
                        : 'Customer'}
                    </p>
                  </div>

                  {(authState.userRole === '1' || authState.userRole === 1) &&
                    adminMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn('flex', 'items-center', 'px-3', 'py-2', 'text-base', 'font-medium', 'text-black', 'hover:text-blue-600', 'hover:bg-blue-50', 'rounded-lg')}
                      >
                        <item.icon className={cn('w-5', 'h-5', 'mr-3')} />
                        {item.name}
                      </Link>
                    ))}

                  {(authState.userRole === '8' || authState.userRole === 8) &&
                    operationsMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn('flex', 'items-center', 'px-3', 'py-2', 'text-base', 'font-medium', 'text-black', 'hover:text-purple-600', 'hover:bg-purple-50', 'rounded-lg')}
                      >
                        <item.icon className={cn('w-5', 'h-5', 'mr-3')} />
                        {item.name}
                      </Link>
                    ))}

                  {(authState.userRole !== '1' && authState.userRole !== 1 && authState.userRole !== '8' && authState.userRole !== 8) &&
                    userMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn('flex', 'items-center', 'px-3', 'py-2', 'text-base', 'font-medium', 'text-black', 'hover:text-slate-900', 'hover:bg-slate-50', 'rounded-lg')}
                    >
                      <item.icon className={cn('w-5', 'h-5', 'mr-3')} />
                      {item.name}
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className={cn('flex', 'items-center', 'w-full', 'px-3', 'py-2', 'text-base', 'font-medium', 'text-red-600', 'hover:text-red-700', 'hover:bg-red-50', 'rounded-lg')}
                  >
                    <ArrowRightOnRectangleIcon className={cn('w-5', 'h-5', 'mr-3')} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </Transition>
      </nav>
    </header>

  );
};

export default Header;
