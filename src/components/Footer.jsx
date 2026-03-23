"use client";

import Link from 'next/link';
import { cn } from "@/lib/utils";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';
import AppDownloadBanner from './Home/AppDownloadBanner';

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
      <footer className="">

        <AppDownloadBanner />
        {/* Desktop View (md and up) */}
        <div className='w-full bg-white border-t-[6px] border-[#F39C12] inter-font' >
          <div className="hidden md:block max-w-7xl mx-auto px-6 md:px-8 py-10">
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
              <div className="text-sm flex flex-col space-y-4">
                <div>
                  <p className="font-bold text-gray-900 mb-1">Address:</p>
                  <p className="text-gray-900 leading-relaxed font-medium">
                    Indraprasth Aerospace & Knowledge Park,<br />
                    Sector-77, Delhi-Jaipur NH-08,<br />
                    Gurgaon, Haryana-122004
                  </p>
                </div>

                <div className="mb-4">
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

          {/* Mobile View (Below md) */}
          <div className="md:hidden bg-white">
            <div className="px-6 py-10">
              {/* Guaranteed Safe Checkout */}
              <div className="flex flex-col items-center mb-8">
                <img src="/flights/topping.svg" alt="Safe Checkout" className="h-6 w-auto" />
              </div>

              {/* Logo */}
              <div className="flex justify-center mb-10">
                <img src="/flights/flyolalogo.svg" alt="Flyola" className="h-12" />
              </div>

              {/* Links Row 1 */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-10">
                <ul className="space-y-4">
                  {footerSections[0].links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-black font-bold text-base underline underline-offset-4 decoration-1 decoration-black/30">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-4">
                  {footerSections[1].links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-black font-bold text-base underline underline-offset-4 decoration-1 decoration-black/30">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Links Row 2 (Services Split) */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-10">
                <ul className="space-y-4">
                  {footerSections[2].links.slice(0, 3).map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-black font-bold text-base">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-4">
                  {footerSections[2].links.slice(3).map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-black font-bold text-base">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="border-t border-gray-100 pt-8 mb-10">
                <div className="mb-6">
                  <p className="font-extrabold text-black text-base mb-1">Address:</p>
                  <p className="text-black font-semibold text-sm leading-relaxed">
                    Indraprasth Aerospace & Knowledge Park, Sector-77, Delhi-Jaipur NH-08, Gurgaon, Haryana-122004
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-extrabold text-black text-base mb-1">Phone:</p>
                    <p className="text-black font-semibold text-sm">9311896389</p>
                  </div>
                  <div>
                    <p className="font-extrabold text-black text-base mb-1">Email:</p>
                    <p className="text-black font-semibold text-[13px] break-all">booking@flyolaindia.com</p>
                  </div>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center gap-10 mb-8 items-center">
                <Link href="#" className="text-black hover:text-[#0133EA] transition-colors"><Facebook size={22} fill="currentColor" strokeWidth={0} /></Link>
                <Link href="#" className="text-black hover:text-[#0133EA] transition-colors"><Instagram size={22} /></Link>
                <Link href="#" className="text-black hover:text-[#0133EA] transition-colors"><Linkedin size={22} fill="currentColor" strokeWidth={0} /></Link>
                <Link href="#" className="text-black hover:text-[#0133EA] transition-colors"><Twitter size={22} fill="currentColor" strokeWidth={0} /></Link>
              </div>

              {/* Footer Bottom Bar Mobile */}
              <div className="flex flex-col items-center gap-2 pt-4">
                <a
                  href="https://rbshstudio.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black font-bold text-[14px] underline underline-offset-4 decoration-black/20"
                >
                  Powered By RBSH Studio
                </a>
                <p className="text-black font-bold text-[14px]">
                  Jet Serve Aviation Pvt. Ltd © {currentYear}. All Rights Reserved
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Bottom Bar */}
          <div className="hidden md:block bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-xs font-semibold text-gray-400">
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
        </div>
      </footer>
    </>
  );
};

export default Footer;