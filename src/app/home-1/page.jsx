"use client";

import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const rentalServices = [
    {
      title: "Private Jet Rental",
      description: "Rent a luxury private jet for personal, family, business or leisure travel.",
      icon: "✈️",
      advantages: ["Hourly billing", "Flexible pickup time", "Luxury interiors", "Priority boarding"],
      link: "/jet-hire",
      gradient: "from-blue-600 to-blue-800"
    },
    {
      title: "Helicopter Rental",
      description: "Ideal for pilgrimage, weddings, city sightseeing, business visits, and medical travel.",
      icon: "🚁",
      advantages: ["Pay per hour", "Remote location landing", "Quick route access", "VVIP entrance for events"],
      link: "/helicopter-flight",
      gradient: "from-indigo-600 to-purple-700"
    },
    {
      title: "Business Charter Rental",
      description: "For CEOs, diplomats, executives and corporate groups.",
      icon: "💼",
      advantages: ["Confidential environment", "Multi-city travel in one day", "Hourly + package plans"],
      link: "/business-class-charter",
      gradient: "from-slate-700 to-slate-900"
    }
  ];

  const rentalPlans = [
    { type: "Hourly Rental", desc: "Starting Plans", details: ["Helicopter: ₹1.5 - 2 Lakh/Hour", "Private Jet: ₹2.5–₹6 Lakh/Hour"] },
    { type: "Weekly Rental", desc: "Plans", details: ["Fly unlimited hours", "Chauffeur pickup & drop", "Premium hospitality add-ons"] },
    { type: "Monthly Rental", desc: "for Corporates", details: ["Fixed monthly fee", "Unlimited priority access", "Dedicated aircraft manager"] }
  ];

  const useCases = [
    "Business Meetings in Multiple Cities",
    "Destination Weddings",
    "VIP Pickup & Drop",
    "Pilgrimage Tours",
    "Tourism & Sightseeing",
    "Aerial Filming",
    "Corporate Events"
  ];

  const whyRentWithUs = [
    { icon: "💰", title: "No Hidden Charges", desc: "Transparent pricing" },
    { icon: "🗺️", title: "Multi-Stop Routes", desc: "One rental cost" },
    { icon: "🕐", title: "24×7 Operations", desc: "Always available" },
    { icon: "👑", title: "VVIP Service", desc: "Premium arrangements" },
    { icon: "👨‍✈️", title: "Elite Crew", desc: "Trained professionals" },
    { icon: "🛩️", title: "Pan-India Fleet", desc: "Wide coverage" }
  ];

  return (
    <div className={cn('min-h-screen', 'bg-gradient-to-br', 'from-slate-900', 'via-blue-900', 'to-slate-900')}>
      
      {/* Hero Section with Rental Form */}
      <section className={cn('relative', 'py-20', 'px-4', 'sm:px-6', 'lg:px-8', 'overflow-hidden')}>
        {/* Animated Background */}
        <div className={cn('absolute', 'inset-0', 'overflow-hidden', 'opacity-30')}>
          <div className={cn('absolute', 'top-20', 'left-10', 'w-96', 'h-96', 'bg-blue-500', 'rounded-full', 'mix-blend-multiply', 'filter', 'blur-3xl', 'animate-blob')} />
          <div className={cn('absolute', 'top-40', 'right-10', 'w-96', 'h-96', 'bg-indigo-500', 'rounded-full', 'mix-blend-multiply', 'filter', 'blur-3xl', 'animate-blob', 'animation-delay-2000')} />
        </div>

        <div className={cn('relative', 'z-10', 'max-w-7xl', 'mx-auto')}>
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={cn('text-center', 'mb-12')}
          >
            <h1 className={cn('text-5xl', 'md:text-7xl', 'font-bold', 'text-white', 'mb-6', 'leading-tight')}>
              Rent a Private Jet or Helicopter
            </h1>
            <p className={cn('text-2xl', 'md:text-3xl', 'text-blue-200', 'mb-4', 'font-light')}>
              Hourly, Daily, Weekly
            </p>
            <p className={cn('text-lg', 'text-blue-100', 'mb-8', 'max-w-3xl', 'mx-auto')}>
              Flexible luxury aircraft rental designed for your schedule, budget, and travel requirements.
            </p>
            
            {/* CTA Buttons */}
            <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center', 'items-center', 'mb-8')}>
              <a
                href="#rental-form"
                className={cn('px-8', 'py-4', 'bg-gradient-to-r', 'from-blue-500', 'to-blue-600', 'text-white', 'rounded-full', 'font-bold', 'text-lg', 'hover:from-blue-600', 'hover:to-blue-700', 'transition-all', 'duration-300', 'hover:scale-105', 'shadow-2xl')}
              >
                Get Rental Price Now
              </a>
              <a
                href="tel:+923335555555"
                className={cn('px-8', 'py-4', 'bg-white', 'text-blue-700', 'rounded-full', 'font-bold', 'text-lg', 'hover:bg-blue-50', 'transition-all', 'duration-300', 'hover:scale-105', 'shadow-xl', 'flex', 'items-center', 'gap-2')}
              >
                <svg className={cn('w-6', 'h-6')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call for Instant Booking
              </a>
            </div>

            {/* Trust Badges */}
            <div className={cn('flex', 'flex-wrap', 'justify-center', 'gap-6', 'text-blue-100', 'text-sm')}>
              <div className={cn('flex', 'items-center', 'gap-2')}>
                <svg className={cn('w-5', 'h-5', 'text-green-400')} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                DGCA Compliant Operators
              </div>
              <div className={cn('flex', 'items-center', 'gap-2')}>
                <svg className={cn('w-5', 'h-5', 'text-green-400')} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                VVIP Security Handling
              </div>
              <div className={cn('flex', 'items-center', 'gap-2')}>
                <svg className={cn('w-5', 'h-5', 'text-green-400')} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                24×7 Rental Support
              </div>
              <div className={cn('flex', 'items-center', 'gap-2')}>
                <svg className={cn('w-5', 'h-5', 'text-green-400')} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Transparent Hourly Billing
              </div>
            </div>
          </motion.div>

          {/* Rental Form */}
          <motion.div
            id="rental-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={cn('bg-white', 'rounded-3xl', 'shadow-2xl', 'p-8', 'md:p-12', 'max-w-5xl', 'mx-auto')}
          >
            <h2 className={cn('text-3xl', 'md:text-4xl', 'font-bold', 'text-slate-900', 'mb-8', 'text-center')}>
              Get Your Rental Quote
            </h2>
            <form className="space-y-6">
              <div className={cn('grid', 'md:grid-cols-2', 'gap-6')}>
                <div>
                  <label className={cn('block', 'text-slate-900', 'font-semibold', 'mb-2')}>
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-slate-200', 'rounded-xl', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200', 'outline-none', 'transition-all', 'duration-300')}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className={cn('block', 'text-slate-900', 'font-semibold', 'mb-2')}>
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-slate-200', 'rounded-xl', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200', 'outline-none', 'transition-all', 'duration-300')}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className={cn('block', 'text-slate-900', 'font-semibold', 'mb-2')}>
                    Rental Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-slate-200', 'rounded-xl', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200', 'outline-none', 'transition-all', 'duration-300', 'bg-white')}
                  >
                    <option value="">Select rental type</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className={cn('block', 'text-slate-900', 'font-semibold', 'mb-2')}>
                    Aircraft Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-slate-200', 'rounded-xl', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200', 'outline-none', 'transition-all', 'duration-300', 'bg-white')}
                  >
                    <option value="">Select aircraft type</option>
                    <option value="helicopter">Helicopter</option>
                    <option value="private-jet">Private Jet</option>
                    <option value="business-charter">Business Charter</option>
                  </select>
                </div>

                <div>
                  <label className={cn('block', 'text-slate-900', 'font-semibold', 'mb-2')}>
                    Route <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-slate-200', 'rounded-xl', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200', 'outline-none', 'transition-all', 'duration-300')}
                    placeholder="e.g., Delhi to Mumbai"
                  />
                </div>

                <div>
                  <label className={cn('block', 'text-slate-900', 'font-semibold', 'mb-2')}>
                    Travel Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-slate-200', 'rounded-xl', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200', 'outline-none', 'transition-all', 'duration-300')}
                  />
                </div>
              </div>

              <div>
                <label className={cn('block', 'text-slate-900', 'font-semibold', 'mb-2')}>
                  Additional Notes
                </label>
                <textarea
                  rows="4"
                  className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-slate-200', 'rounded-xl', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200', 'outline-none', 'transition-all', 'duration-300', 'resize-none')}
                  placeholder="Any special requirements or additional information..."
                />
              </div>

              <button
                type="submit"
                className={cn('w-full', 'bg-gradient-to-r', 'from-blue-600', 'to-blue-700', 'text-white', 'font-bold', 'py-4', 'px-6', 'rounded-xl', 'hover:from-blue-700', 'hover:to-blue-800', 'transform', 'hover:scale-105', 'transition-all', 'duration-300', 'shadow-lg')}
              >
                Get My Rental Price
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Rental Offerings Section */}
      <section className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-white')}>
        <div className={cn('max-w-7xl', 'mx-auto')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-center', 'mb-16')}
          >
            <h2 className={cn('text-4xl', 'md:text-5xl', 'font-bold', 'text-slate-900', 'mb-4')}>
              We Offer Aircraft for Rent
            </h2>
            <p className={cn('text-xl', 'text-slate-600', 'max-w-3xl', 'mx-auto')}>
              Hourly Rental (2, 4, 6 hours+) • Full-Day Rental • Weekly & Monthly Plans • On-Demand One-Way or Round-Trip • Multi-City Travel • Corporate, VIP, Event & Tourism Rentals
            </p>
          </motion.div>

          <div className={cn('grid', 'md:grid-cols-3', 'gap-8')}>
            {rentalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn('group', 'relative', 'bg-gradient-to-br', service.gradient, 'rounded-3xl', 'p-8', 'text-white', 'shadow-2xl', 'hover:scale-105', 'transition-all', 'duration-300')}
              >
                <div className={cn('text-6xl', 'mb-4')}>{service.icon}</div>
                <h3 className={cn('text-2xl', 'font-bold', 'mb-3')}>{service.title}</h3>
                <p className={cn('text-blue-100', 'mb-6', 'leading-relaxed')}>{service.description}</p>
                
                <div className={cn('mb-6')}>
                  <p className={cn('font-semibold', 'mb-3', 'text-lg')}>🔑 Rental Advantages:</p>
                  <ul className={cn('space-y-2')}>
                    {service.advantages.map((adv, i) => (
                      <li key={i} className={cn('flex', 'items-center', 'gap-2')}>
                        <svg className={cn('w-5', 'h-5', 'text-green-300')} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {adv}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={service.link}>
                  <button className={cn('w-full', 'bg-white', 'text-slate-900', 'font-bold', 'py-3', 'px-6', 'rounded-xl', 'hover:bg-slate-100', 'transition-all', 'duration-300')}>
                    Rent {service.title.split(' ')[0]}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Rent With Us Section */}
      <section className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gradient-to-br', 'from-slate-50', 'to-blue-50')}>
        <div className={cn('max-w-7xl', 'mx-auto')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-center', 'mb-16')}
          >
            <h2 className={cn('text-4xl', 'md:text-5xl', 'font-bold', 'text-slate-900', 'mb-4')}>
              Why Rent With Us?
            </h2>
          </motion.div>

          <div className={cn('grid', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-8')}>
            {whyRentWithUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn('bg-white', 'rounded-2xl', 'p-8', 'shadow-lg', 'hover:shadow-2xl', 'transition-all', 'duration-300', 'border', 'border-slate-100')}
              >
                <div className={cn('text-5xl', 'mb-4')}>{item.icon}</div>
                <h3 className={cn('text-xl', 'font-bold', 'text-slate-900', 'mb-2')}>{item.title}</h3>
                <p className={cn('text-slate-600')}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Plans Section */}
      <section className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-white')}>
        <div className={cn('max-w-7xl', 'mx-auto')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-center', 'mb-16')}
          >
            <h2 className={cn('text-4xl', 'md:text-5xl', 'font-bold', 'text-slate-900', 'mb-4')}>
              Our Rental Plans
            </h2>
          </motion.div>

          <div className={cn('grid', 'md:grid-cols-3', 'gap-8')}>
            {rentalPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn('bg-gradient-to-br', 'from-blue-50', 'to-indigo-50', 'rounded-3xl', 'p-8', 'border-2', 'border-blue-200', 'hover:border-blue-400', 'transition-all', 'duration-300')}
              >
                <h3 className={cn('text-2xl', 'font-bold', 'text-slate-900', 'mb-2')}>{plan.type}</h3>
                <p className={cn('text-blue-600', 'font-semibold', 'mb-6')}>{plan.desc}</p>
                <ul className={cn('space-y-3')}>
                  {plan.details.map((detail, i) => (
                    <li key={i} className={cn('flex', 'items-start', 'gap-2', 'text-slate-700')}>
                      <svg className={cn('w-5', 'h-5', 'text-green-500', 'mt-0.5', 'flex-shrink-0')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={cn('text-center', 'mt-12')}
          >
            <p className={cn('text-lg', 'text-slate-600', 'mb-6')}>
              👉 Exact pricing depends on aircraft model & route. Instant quote available.
            </p>
            <a
              href="tel:+923335555555"
              className={cn('inline-block', 'px-8', 'py-4', 'bg-gradient-to-r', 'from-blue-600', 'to-blue-700', 'text-white', 'rounded-full', 'font-bold', 'text-lg', 'hover:from-blue-700', 'hover:to-blue-800', 'transition-all', 'duration-300', 'hover:scale-105', 'shadow-xl')}
            >
              Call for Today's Availability
            </a>
          </motion.div>
        </div>
      </section>

      {/* Popular Use Cases Section */}
      <section className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gradient-to-br', 'from-slate-900', 'to-blue-900')}>
        <div className={cn('max-w-7xl', 'mx-auto')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-center', 'mb-16')}
          >
            <h2 className={cn('text-4xl', 'md:text-5xl', 'font-bold', 'text-white', 'mb-4')}>
              Popular Use Cases
            </h2>
          </motion.div>

          <div className={cn('grid', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6')}>
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={cn('bg-white/10', 'backdrop-blur-lg', 'rounded-2xl', 'p-6', 'text-center', 'border', 'border-white/20', 'hover:bg-white/20', 'transition-all', 'duration-300')}
              >
                <p className={cn('text-white', 'font-semibold', 'text-lg')}>{useCase}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Uses Section */}
      <section className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-white')}>
        <div className={cn('max-w-7xl', 'mx-auto')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-center', 'mb-16')}
          >
            <h2 className={cn('text-4xl', 'md:text-5xl', 'font-bold', 'text-slate-900', 'mb-4')}>
              Who Uses Our Rental Plans?
            </h2>
          </motion.div>

          <div className={cn('flex', 'flex-wrap', 'justify-center', 'gap-6')}>
            {["CEOs & Entrepreneurs", "Tourists & Travellers", "Wedding Planners", "VIP Families", "Corporates", "Film Industry", "Event Companies"].map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={cn('bg-gradient-to-r', 'from-blue-500', 'to-indigo-600', 'text-white', 'px-8', 'py-4', 'rounded-full', 'font-semibold', 'text-lg', 'shadow-lg', 'hover:scale-105', 'transition-all', 'duration-300')}
              >
                {user}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Availability Section */}
      <section className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gradient-to-br', 'from-blue-600', 'to-indigo-700')}>
        <div className={cn('max-w-5xl', 'mx-auto')}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-center')}
          >
            <h2 className={cn('text-4xl', 'md:text-5xl', 'font-bold', 'text-white', 'mb-8')}>
              Today's Available Rentals
            </h2>
            
            <div className={cn('grid', 'md:grid-cols-3', 'gap-8', 'mb-12')}>
              <div className={cn('bg-white/20', 'backdrop-blur-lg', 'rounded-2xl', 'p-8', 'border', 'border-white/30')}>
                <p className={cn('text-white/80', 'text-sm', 'font-semibold', 'mb-2')}>Private Jets</p>
                <p className={cn('text-5xl', 'font-bold', 'text-white', 'mb-2')}>3</p>
                <p className={cn('text-white/80', 'text-sm')}>available</p>
              </div>
              <div className={cn('bg-white/20', 'backdrop-blur-lg', 'rounded-2xl', 'p-8', 'border', 'border-white/30')}>
                <p className={cn('text-white/80', 'text-sm', 'font-semibold', 'mb-2')}>Helicopters</p>
                <p className={cn('text-5xl', 'font-bold', 'text-white', 'mb-2')}>2</p>
                <p className={cn('text-white/80', 'text-sm')}>available</p>
              </div>
              <div className={cn('bg-white/20', 'backdrop-blur-lg', 'rounded-2xl', 'p-8', 'border', 'border-white/30')}>
                <p className={cn('text-white/80', 'text-sm', 'font-semibold', 'mb-2')}>Business Charters</p>
                <p className={cn('text-3xl', 'font-bold', 'text-white', 'mb-2')}>Fast Filling</p>
                <p className={cn('text-white/80', 'text-sm')}>limited slots</p>
              </div>
            </div>

            <p className={cn('text-xl', 'text-white', 'mb-8')}>
              👉 Book before slots close.
            </p>

            <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center')}>
              <a
                href="tel:++916398399463"
                className={cn('px-8', 'py-4', 'bg-white', 'text-blue-700', 'rounded-full', 'font-bold', 'text-lg', 'hover:bg-blue-50', 'transition-all', 'duration-300', 'hover:scale-105', 'shadow-xl')}
              >
                Call for Today's Availability
              </a>
              <a
                href="https://wa.me/+916398399463?text=Hi, I'd like to rent an aircraft today"
                target="_blank"
                rel="noopener noreferrer"
                className={cn('px-8', 'py-4', 'bg-green-500', 'text-white', 'rounded-full', 'font-bold', 'text-lg', 'hover:bg-green-600', 'transition-all', 'duration-300', 'hover:scale-105', 'shadow-xl', 'flex', 'items-center', 'justify-center', 'gap-2')}
              >
                <svg className={cn('w-6', 'h-6')} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
