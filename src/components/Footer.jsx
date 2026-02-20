"use client";

import Link from 'next/link';

import { cn } from "@/lib/utils";
import {
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
// Social media icons using simple SVG components
const FacebookIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.875 2.026-1.297 3.323-1.297s2.448.422 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.405c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm-4.262 9.405c-2.379 0-4.297-1.918-4.297-4.297s1.918-4.297 4.297-4.297 4.297 1.918 4.297 4.297-1.918 4.297-4.297 4.297z"/>
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YouTubeIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

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

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, href: 'https://www.facebook.com/flyolaaviation/', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: TwitterIcon, href: 'https://x.com/flyolaviation', color: 'hover:text-sky-500' },
    { name: 'Instagram', icon: InstagramIcon, href: 'https://www.instagram.com/flyolaindia/?__d=11', color: 'hover:text-pink-600' },
    { name: 'LinkedIn', icon: LinkedInIcon, href: 'https://in.linkedin.com/company/fly-ola', color: 'hover:text-blue-700' },
    { name: 'YouTube', icon: YouTubeIcon, href: 'https://www.youtube.com/@jetserveaviation', color: 'hover:text-red-600' },
  ];

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Address',
      content: '  Indraprasth Aerospace & Knowledge Park, Sector-77, Delhi-Jaipur NH-08, Gurgaon, Haryana-122004',
    },
    {
      icon: PhoneIcon,
      title: 'Phone',
      content: '9311896389',
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'booking@flyolaindia.com',
    },
    {
      icon: GlobeAltIcon,
      title: 'Website',
      content: 'https://flyola.in/',
    },
  ];

  return (
    <footer className={cn('bg-gradient-to-br', 'from-slate-900', 'via-slate-800', 'to-slate-900', 'text-white')}>
      {/* Main Footer Content */}
      <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-16')}>
        <div className={cn('grid', 'grid-cols-1', 'lg:grid-cols-12', 'gap-8')}>
          {/* Brand Section */}
          <div className="lg:col-span-3">
            <div className={cn('flex', 'items-center', 'mb-6')}>
              <img
                src="/log.png"
                alt="Flyola Logo"
                className={cn('h-16', 'w-60')}
              />
            </div>
            
            <p className={cn('text-slate-300', 'mb-6', 'leading-relaxed')}>
              Jet Serve Aviation is a premier provider of private jet services, catering to travelers seeking luxury, comfort, and convenience.
            </p>
            
            {/* Social Links */}
            <div className={cn('flex', 'space-x-4')}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`p-2 bg-slate-800 rounded-lg text-slate-400 ${social.color} transition-all duration-200 hover:bg-slate-700 hover:scale-110`}
                  aria-label={social.name}
                >
                  <social.icon className={cn('w-5', 'h-5')} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
        <div className={cn('lg:col-span-6', 'flex', 'justify-center')}>
<div className={cn('grid', 'grid-cols-2', 'md:grid-cols-3', 'gap-8', )}>
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h3 className={cn('text-lg', 'font-semibold', 'text-white', 'mb-4')}>
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className={cn('text-slate-400', 'hover:text-white', 'transition-colors', 'duration-200', 'text-sm')}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className={cn('text-lg', 'font-semibold', 'text-white', 'mb-4')}>
              Get in Touch
            </h3>
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.title} className={cn('flex', 'items-start', 'space-x-3')}>
                  <div className={cn('p-2', 'bg-slate-800', 'rounded-lg')}>
                    <info.icon className={cn('w-4', 'h-4', 'text-blue-400')} />
                  </div>
                  <div>
                    <p className={cn('text-sm', 'font-medium', 'text-slate-300')}>{info.title}</p>
                    <p className={cn('text-sm', 'text-slate-400')}>{info.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className={cn('border-t', 'border-slate-700')}>
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8')}>
          <div className={cn('flex', 'flex-col', 'md:flex-row', 'items-center', 'justify-between', 'gap-6')}>
            <div>
              <h3 className={cn('text-xl', 'font-semibold', 'text-white', 'mb-2')}>
                Stay Updated with Flyola
              </h3>
              <p className="text-slate-400">
                Get the latest flight deals, joy ride offers, and aviation news delivered to your inbox.
              </p>
            </div>
            <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-3', 'w-full', 'md:w-auto')}>
              <input
                type="email"
                placeholder="Enter your email"
                className={cn('px-4', 'py-3', 'bg-slate-800', 'border', 'border-slate-600', 'rounded-lg', 'text-white', 'placeholder-slate-400', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all', 'duration-200', 'min-w-[280px]')}
              />
              <button className={cn('px-6', 'py-3', 'bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'text-white', 'font-medium', 'rounded-lg', 'hover:from-blue-700', 'hover:to-indigo-700', 'transition-all', 'duration-200', 'shadow-lg', 'hover:shadow-xl', 'transform', 'hover:-translate-y-0.5', 'whitespace-nowrap')}>
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={cn('border-t', 'border-slate-700')}>
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6')}>
          <div className={cn('flex', 'flex-col', 'md:flex-row', 'items-center', 'justify-between', 'gap-4')}>
            <div className={cn('flex', 'flex-col', 'md:flex-row', 'items-center', 'gap-4', 'text-sm', 'text-slate-400')}>
              <p>Jet Serve Aviation Pvt. Ltd © {currentYear}. All Rights Reserved</p>
              <div className={cn('flex', 'items-center', 'gap-4')}>
                <span className={cn('hidden', 'md:block')}>|</span>
                <Link href="/privacy" className={cn('hover:text-white', 'transition-colors', 'duration-200')}>
                  Privacy
                </Link>
                <span>•</span>
                <Link href="/terms" className={cn('hover:text-white', 'transition-colors', 'duration-200')}>
                  Terms
                </Link>
                <span>•</span>
                <Link href="/refund" className={cn('hover:text-white', 'transition-colors', 'duration-200')}>
                  Refund Policy
                </Link>
              </div>
            </div>
            
            <div className={cn('flex', 'items-center', 'gap-2', 'text-sm', 'text-slate-400')}>
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