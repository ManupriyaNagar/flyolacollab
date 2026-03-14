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
    <footer className="w-full bg-white border-t-[6px] border-[#F39C12] mt-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center">
            {/* FLYOLA Logo */}
            <img src="/flights/flyolalogo.svg" alt="" />
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-gray-800 hover:text-[#0133EA] transition-colors"><Facebook size={18} fill="currentColor" /></Link>
            <Link href="#" className="text-gray-800 hover:text-[#0133EA] transition-colors"><Instagram size={18} /></Link>
            <Link href="#" className="text-gray-800 hover:text-[#0133EA] transition-colors"><Linkedin size={18} fill="currentColor" /></Link>
            <Link href="#" className="text-gray-800 hover:text-[#0133EA] transition-colors"><Twitter size={18} fill="currentColor" /></Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {footerSections.map((section) => (
            <div key={section.title} className="lg:pt-0">
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
        <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
          <div className="flex flex-wrap gap-4">
            <Link href="#" className="block transition-transform hover:scale-105">
              <img src="/flights/Storedownloadbutton.svg" alt="Download on the App Store" className="h-12 w-auto border border-gray-200 rounded-lg shadow-sm" />
            </Link>
            <Link href="#" className="block transition-transform hover:scale-105">
              <img src="/flights/Storedownloadbuttonn.svg" alt="Get it on Google Play" className="h-12 w-auto border border-gray-200 rounded-lg shadow-sm" />
            </Link>
          </div>

          <div className="w-full max-w-sm">
            {/* <div className="relative border border-gray-100 rounded-lg p-2 bg-gray-50/30"> */}
              {/* <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">
                <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Guaranteed Safe Checkout</span>
              </div> */}
              <div className="flex items-center justify-between px-2 py-1">
                <img src="/flights/topping.svg" alt="" className="h-5" />
              </div>
            {/* </div> */}
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-400">
            <p className="tracking-tight">
              Jet Serve Aviation Pvt. Ltd © {currentYear}. All Rights Reserved
            </p>
            <div className="flex items-center">
              <a 
                href="https://rbshstudio.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 underline decoration-gray-300 hover:text-black transition-colors"
              >
                Powered By RBSH Studio
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;









// import React from "react";
// import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter, FaGlobe } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className={cn('bg-[#0B2045]', 'text-white', 'z-10')}>
//       {/* Special Discount Section */}
      

//       {/* Main Footer */}
//       <div className={cn('container', 'mx-auto', 'px-6', 'py-10')}>
//         <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-4', 'gap-6')}>
//           {/* Logo & About */}
//           <div>
//             <img src="/logo-04.png" alt="Flyola Logo" className="h-12" />
//             <p className={cn('text-sm', 'mt-4')}>
//               Jet Serve Aviation is a premier provider of private jet services, catering to travelers seeking luxury, comfort, and convenience.
//             </p>
//             {/* Social Media Icons */}
//             {/* <div className={cn('flex', 'space-x-4', 'mt-4')}>
//               <FaFacebookF className={cn('cursor-pointer', 'hover:text-gray-400')} />
//               <FaLinkedinIn className={cn('cursor-pointer', 'hover:text-gray-400')} />
//               <FaInstagram className={cn('cursor-pointer', 'hover:text-gray-400')} />
//               <FaTwitter className={cn('cursor-pointer', 'hover:text-gray-400')} />
//               <FaGlobe className={cn('cursor-pointer', 'hover:text-gray-400')} />
//             </div> */}
//           </div>

//           {/* Useful Links */}
//           {/* <div>
//             <h3 className={cn('font-semibold', 'text-lg', 'mb-3')}>Useful Links</h3>
//             <ul className="space-y-2">
//               <li><a href="#" className="hover:text-gray-400">Home</a></li>
//               <li><a href="#" className="hover:text-gray-400">About Us</a></li>
//               <li><a href="#" className="hover:text-gray-400">Blogs</a></li>
//               <li><a href="#" className="hover:text-gray-400">Contact Us</a></li>
//               <li><a href="#" className="hover:text-gray-400">Download Ticket</a></li>
//             </ul>
//           </div> */}

//           {/* Legal */}
//           {/* <div>
//             <h3 className={cn('font-semibold', 'text-lg', 'mb-3')}>Legal</h3>
//             <ul className="space-y-2">
//               <li><a href="#" className="hover:text-gray-400">Privacy Policy</a></li>
//               <li><a href="#" className="hover:text-gray-400">Refund Policy</a></li>
//               <li><a href="#" className="hover:text-gray-400">Terms & Conditions</a></li>
//               <li><a href="#" className="hover:text-gray-400">Disclaimer</a></li>
//             </ul>
//           </div> */}

//           {/* Services */}
//           {/* <div>
//             <h3 className={cn('font-semibold', 'text-lg', 'mb-3')}>Services</h3>
//             <ul className="space-y-2">
//               <li><a href="#" className="hover:text-gray-400">Personal Charter</a></li>
//               <li><a href="#" className="hover:text-gray-400">Hire Charter</a></li>
//               <li><a href="#" className="hover:text-gray-400">Business Class Charter</a></li>
//               <li><a href="#" className="hover:text-gray-400">Jet Hire</a></li>
//               <li><a href="#" className="hover:text-gray-400">Helicopter Hire</a></li>
//             </ul>
//           </div> */}
//         </div>

//         {/* Payment Methods */}
//         {/* <div className="mt-8">
//           <h3 className={cn('font-semibold', 'text-lg', 'mb-3')}>Payment Methods</h3>
//           <div className={cn('flex', 'space-x-4')}>
//             <img src="/1.png" alt="Amex" className="h-6" />
//             <img src="/2.png" alt="Google Pay" className="h-6" />
//             <img src="/3.png" alt="Apple Pay" className="h-6" />
//             <img src="/4.png" alt="Visa" className="h-6" />
//           </div>
//         </div> */}

      
//       </div>

// <div className={cn('flex', 'justify-between', 'items-center', 'bg-[#09182C]', 'text-sm', 'py-4', 'px-6')}>
//       {/* Bottom Footer */}
//       <div className={cn('bg-[#09182C]', 'text-center', 'text-sm', 'py-4')}>
//         Jet Serve Aviation Pvt. Ltd © 2025. All Rights Reserved 
//       </div>
//       <div className={cn('bg-[#09182C]', 'text-center', 'text-sm', 'py-4')}>
//         Powered By RBSH Studio
//       </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;