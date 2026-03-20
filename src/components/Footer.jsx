"use client";

import Link from 'next/link';
import { cn } from "@/lib/utils";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Useful Links',
      links: [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Blogs', href: '/blogs' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Download Ticket', href: '/get-ticket' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Refund Policy', href: '/refund' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Disclaimer', href: '/disclaimer' },
      ],
    },
    {
      title: 'Services',
      links: [
        { name: 'Personal Charter', href: '/personal-charter' },
        { name: 'Hire Charter', href: '/hire-charter' },
        { name: 'Business Class Charter', href: '/business-class-charter' },
        { name: 'Jet Hire', href: '/jet-hire' },
        { name: 'Helicopter Hire', href: '/helicopter-hire' },
      ],
    },
  ];

  return (
    <>
      <div className="w-full overflow-hidden -mb-2">
        <img src="/flights/Banner-Flyola2.svg" alt="Flyola Banner" className="w-full h-auto" />
      </div>
      <footer className="w-full bg-white border-t-[6px] border-[#F39C12] font-sans">
        {/* Desktop View (lg and up) */}
        <div className="hidden lg:block max-w-7xl mx-auto px-6 md:px-8 py-10">
          {/* Top Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="flex items-center">
              {/* FLYOLA Logo */}
              <img src="/flights/flyolalogo.svg" alt="" />
            </div>

            <div className="flex items-center lg:gap-10 gap-4 lg:pr-20 pr-10">
              <Link href="#" className="text-gray-800 hover:text-[#0133EA] transition-colors"><Facebook size={18} fill="currentColor" /></Link>
              <Link href="#" className="text-gray-800 hover:text-[#0133EA] transition-colors"><Instagram size={18} /></Link>
              <Link href="#" className="text-gray-800 hover:text-[#0133EA] transition-colors"><Linkedin size={18} fill="currentColor" /></Link>
              <Link href="#" className="text-gray-800 hover:text-[#0133EA] transition-colors"><Twitter size={18} fill="currentColor" /></Link>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {footerSections.map((section) => (
              <div key={section.title} className="pt-0">
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-900 font-medium text-sm hover:underline underline-offset-4"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Column */}
            <div className="text-sm space-y-4">
              <div>
                <p className="font-bold text-gray-900 mb-1">Address:</p>
                <p className="text-gray-900 leading-relaxed font-medium">
                  Indraprasth Aerospace & Knowledge Park,<br />
                  Sector-77, Delhi-Jaipur NH-08,<br />
                  Gurgaon, Haryana-122004
                </p>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Phone:</p>
                <p className="text-gray-900 font-medium">9311896389</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Email:</p>
                <p className="text-gray-900 font-medium">booking@flyolaindia.com</p>
              </div>
            </div>
          </div>

          {/* Bottom App & Checkout Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="flex flex-wrap gap-4">
              <Link href="#" className="block transition-transform hover:scale-105">
                <img src="/flights/Storedownloadbutton.svg" alt="Download on the App Store" className="h-12 w-auto border border-gray-200 rounded-lg shadow-sm" />
              </Link>
              <Link href="#" className="block transition-transform hover:scale-105">
                <img src="/flights/Storedownloadbuttonn.svg" alt="Get it on Google Play" className="h-12 w-auto border border-gray-200 rounded-lg shadow-sm" />
              </Link>
            </div>

            <div className="w-full max-w-sm pl-27">
              <div className="flex items-center justify-between px-2 py-1">
                <img src="/flights/topping.svg" alt="" className="h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet View Layout (lg:hidden) */}
        <div className="lg:hidden px-6 py-10 space-y-8 max-w-4xl mx-auto">
          {/* App Banner */}
          <div className="w-full bg-[#0E35B5] rounded-3xl p-8 text-white space-y-4 shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold leading-tight">Plan, Book, and Track on the Go with Flyola App</h3>
              <p className="text-xs text-blue-100 opacity-90 leading-relaxed">
                Experience faster bookings, live train updates, and easy cancellations — all in one app
              </p>
              <div className="flex gap-3 pt-2">
                <Link href="#" className="w-24">
                  <img src="/flights/Storedownloadbuttonn.svg" alt="Google Play" className="w-full h-auto" />
                </Link>
                <Link href="#" className="w-24">
                  <img src="/flights/Storedownloadbutton.svg" alt="App Store" className="w-full h-auto" />
                </Link>
              </div>
            </div>
          </div>

          {/* Logo Section */}
          <div className="flex justify-center py-4">
            <img src="/flights/flyolalogo.svg" alt="Flyola" className="h-12 w-auto" />
          </div>

          {/* Safe Checkout Section */}
          <div className="space-y-4">
            <div className="flex justify-center scale-110 sm:scale-125 md:scale-150 py-4">
              <img src="/flights/topping.svg" alt="Payment Methods" className="h-8 w-auto" />
            </div>
          </div>

          {/* Links Grid - 3 Columns for Mobile & Tablet */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
            {footerSections.map((section) => (
              <ul key={section.title} className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-900 font-bold text-[15px] underline decoration-transparent hover:decoration-gray-300">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          {/* Contact Info Section */}
          <div className="pt-10 space-y-8 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h4 className="font-black text-gray-900 text-lg">Address:</h4>
                <p className="text-sm text-gray-900 font-medium leading-relaxed max-w-sm">
                  Indraprasth Aerospace & Knowledge Park, Sector-77, Delhi-Jaipur NH-08, Gurgaon, Haryana-122004
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-black text-gray-900 text-lg">Phone:</h4>
                  <p className="text-sm text-gray-900 font-medium">9311896389</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-gray-900 text-lg">Email:</h4>
                  <p className="text-sm text-gray-900 font-medium break-all sm:break-normal">booking@flyolaindia.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-xs font-semibold text-gray-400">
              <div className="flex lg:hidden items-center gap-8 mb-2">
                <Link href="#" className="text-black hover:text-[#0133EA] transition-colors">
                  <Facebook size={20} fill="currentColor" strokeWidth={0} />
                </Link>
                <Link href="#" className="text-black hover:text-[#0133EA] transition-colors">
                  <Instagram size={20} />
                </Link>
                <Link href="#" className="text-black hover:text-[#0133EA] transition-colors">
                  <Linkedin size={20} fill="currentColor" strokeWidth={0} />
                </Link>
                <Link href="#" className="text-black hover:text-[#0133EA] transition-colors">
                  <Twitter size={20} fill="currentColor" strokeWidth={0} />
                </Link>
              </div>
              <p className="tracking-tight text-center lg:text-left">
                Jet Serve Aviation Pvt. Ltd © {currentYear}. All Rights Reserved
              </p>
              <div className="flex items-center">
                <a
                  href="https://rbshstudio.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 underline decoration-gray-300 hover:text-black transition-colors"
                  id="powered-by-link"
                >
                  Powered By RBSH Studio
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;