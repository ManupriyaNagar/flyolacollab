"use client";

import FleetSection from '@/components/FleetSection';
import MPGovernmentPartnership from '@/components/MPGovernmentPartnership';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // update active section based on scroll position
  useEffect(() => {
    const sections = ['hero', 'rental-form', 'offerings', 'why', 'plans', 'use-cases', 'who-uses', 'availability'];
    const onScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3; // bias toward middle
      let current = 'hero';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= scrollPos) current = id;
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      rentalType: formData.get('rentalType'),
      aircraftType: formData.get('aircraftType'),
      route: formData.get('route'),
      travelDate: formData.get('travelDate'),
      notes: formData.get('notes') || ''
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rental-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage({
          type: 'success',
          text: '✅ Your rental inquiry has been sent successfully! Our team will contact you within 30 minutes.'
        });
        e.target.reset();
        // Scroll to message
        setTimeout(() => {
          document.getElementById('submit-message')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        throw new Error(result.message || 'Failed to send inquiry');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage({
        type: 'error',
        text: '❌ Failed to send inquiry. Please try WhatsApp or call us directly at +91 98705 00422'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const rentalServices = [


    {
      title: "Helicopter Rental",
      description: "Ideal for pilgrimage, weddings, city sightseeing, business visits, and medical travel.",
      advantages: ["Pay per hour", "Remote location landing", "Quick route access",],
      link: "/helicopter-flight",
      gradient: "from-gray-800 to-gray-950"
    },
    {
      title: "Private Aircraft Rental",
      description: "Rent a luxury private Aircraft for personal, family, business or leisure travel.",
      advantages: ["Hourly billing", "Flexible pickup time", "Luxury interiors", "Priority boarding"],
      link: "/aircraft-hire",
      gradient: "from-blue-600 to-blue-800"
    },
    
    {
      title: "Business Charter Rental",
      description: "For CEOs, diplomats, executives and corporate groups. or leisure travel and medical travel. and etc",
      advantages: ["Confidential environment", "Multi-city travel in one day", "Hourly + package plans"],
      link: "/business-class-charter",
      gradient: "from-slate-700 to-slate-900"
    }
  ];

  const rentalPlans = [
    { type: "Hourly Rental", desc: "Starting Plans", details: ["Helicopter", "Private Aircraft"] },
    { type: "Weekly Rental", desc: "Plans", details: ["Fly unlimited hours", "Chauffeur pickup & drop", "Premium hospitality add-ons"] },
    { type: "Monthly Rental", desc: "for Corporates", details: ["Fixed monthly fee", "Unlimited priority access", "Dedicated aircraft manager"] }
  ];

  const useCases = [
    "Business Meetings in Cities",
    "Destination Weddings",
    "VIP Pickup & Drop",
    "Pilgrimage Tours",
    "Tourism & Sightseeing",
    "Aerial Filming",
    "Corporate Events",
    "Schedules"
  ];

  const whyRentWithUs = [
    { icon: "💰", title: "No Hidden Charges", desc: "Transparent pricing" },
    { icon: "🗺️", title: "Multi-Stop Routes", desc: "One rental cost" },
    { icon: "🕐", title: "24×7 Operations", desc: "Always available" },
    { icon: "👑", title: "VVIP Service", desc: "Premium arrangements" },
    { icon: "👨‍✈️", title: "Elite Crew", desc: "Trained professionals" },
    { icon: "🛩️", title: "Pan-India Fleet", desc: "Wide coverage" }
  ];

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'rental-form', label: 'Get Quote' },
    { id: 'offerings', label: 'Offerings' },
    { id: 'why', label: 'Why Us' },
    { id: 'plans', label: 'Plans' },
    { id: 'use-cases', label: 'Use Cases' },
    { id: 'who-uses', label: 'Who Uses' },
    { id: 'availability', label: "Today's Avail." }
  ];

  return (
    <>
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919870500422?text=Hi, I'd like to get a quick quote for aircraft rental"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'fixed', 'bottom-6', 'right-6', 'z-50',
          'w-16', 'h-16', 'bg-green-500', 'hover:bg-green-600',
          'rounded-full', 'flex', 'items-center', 'justify-center',
          'shadow-2xl', 'hover:shadow-3xl',
          'transition-all', 'duration-300', 'hover:scale-110',
          'animate-bounce', 'hover:animate-none',
          'group'
        )}
      >
        <svg 
          className={cn('w-8', 'h-8', 'text-white')} 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        
        {/* Tooltip */}
        <div className={cn(
          'absolute', 'right-full', 'mr-3', 'top-1/2', '-translate-y-1/2',
          'bg-slate-900', 'text-white', 'px-3', 'py-2', 'rounded-lg',
          'text-sm', 'font-medium', 'whitespace-nowrap',
          'opacity-0', 'group-hover:opacity-100',
          'transition-opacity', 'duration-300',
          'pointer-events-none'
        )}>
          Chat on WhatsApp
          <div className={cn('absolute', 'left-full', 'top-1/2', '-translate-y-1/2', 'border-4', 'border-transparent', 'border-l-slate-900')} />
        </div>
      </a>

      <header
        className={cn(
          'sticky', 'top-0', 'z-50', 'backdrop-blur', 'bg-white/80',
          'border-b', 'border-gray-200', 'px-6', 'py-3'
        )}
      >
        <div className={cn('max-w-7xl', 'mx-auto', 'flex', 'items-center', 'justify-between')}>
          <div className={cn('flex', 'items-center', 'gap-3')}> 
            <a href="/">
              <img src="/log.png" alt="Brand Logo" className={cn('w-40')} />
            </a>
          </div>

          <nav className={cn('hidden', 'md:flex', 'items-center', 'gap-4')}> 
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  'px-3', 'py-2', 'rounded-md', 'text-sm', 'font-medium',
                  activeSection === item.id ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className={cn('flex', 'items-center', 'gap-3')}>
            <a href="tel:+9198705 00422" className={cn('hidden', 'md:inline-flex', 'px-4', 'py-2', 'rounded-full', 'bg-gradient-to-r', 'from-blue-600', 'to-blue-700', 'text-white', 'font-semibold')}>Call Now</a>
            <a href="#rental-form" className={cn('inline-flex', 'px-4', 'py-2', 'rounded-full', 'bg-white', 'text-blue-700', 'font-semibold', 'border', 'border-slate-200')}>Get Quote</a>
          </div>
        </div>
      </header>

      <main>
        <div className={cn('min-h-screen', 'bg-gradient-to-br', 'from-slate-900', 'via-blue-900', 'to-slate-900')}>

          {/* Hero Section with Rental Form */}
          <section id="hero" className={cn('relative', 'py-20', 'px-4', 'sm:px-6', 'lg:px-8', 'overflow-hidden')}>
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
                  Rent a Private Aircraft or Helicopter
                </h1>
                <p className={cn('text-2xl', 'md:text-3xl', 'text-blue-200', 'mb-4', 'font-light')}>
                  Hourly, Daily, Weekly
                </p>
                <p className={cn('text-lg', 'text-blue-100', 'mb-8', 'max-w-3xl', 'mx-auto')}>
                  Flexible luxury aircraft rental designed for your schedule, budget, and travel requirements.
                </p>
                
                {/* CTA Buttons */}
                <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center', 'items-center', 'mb-8')}>
                  <a href="#rental-form" className={cn('px-8', 'py-4', 'bg-gradient-to-r', 'from-blue-500', 'to-blue-600', 'text-white', 'rounded-full', 'font-bold', 'text-lg', 'hover:from-blue-600', 'hover:to-blue-700', 'transition-all', 'duration-300', 'hover:scale-105', 'shadow-2xl')}>
                    Get Rental Price Now
                  </a>
                  <a href="tel:+919870500422" className={cn('px-8', 'py-4', 'bg-white', 'text-blue-700', 'rounded-full', 'font-bold', 'text-lg', 'hover:bg-blue-50', 'transition-all', 'duration-300', 'hover:scale-105', 'shadow-xl', 'flex', 'items-center', 'gap-2')}>
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

              {/* Rental Form (moved into its own section id) */}
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
                
                {/* Success/Error Message */}
                {submitMessage.text && (
                  <div 
                    id="submit-message"
                    className={cn(
                      'p-4', 'rounded-xl', 'mb-6', 'text-center', 'font-medium',
                      submitMessage.type === 'success' ? 'bg-green-50 text-green-800 border-2 border-green-200' : 'bg-red-50 text-red-800 border-2 border-red-200'
                    )}
                  >
                    {submitMessage.text}
                  </div>
                )}

                <form 
                  className="space-y-6"
                  onSubmit={handleFormSubmit}
                >
                  <div className={cn('grid', 'md:grid-cols-2', 'gap-6')}>
                    <div>
                      <label className={cn('block', 'text-slate-900', 'font-semibold', 'mb-2')}>
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
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
                        name="phone"
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
                        name="rentalType"
                        required
                        className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-slate-200', 'rounded-xl', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200', 'outline-none', 'transition-all', 'duration-300', 'bg-white')}
                      >
                        <option value="">Select rental type</option>
                        <option value="Hourly">Hourly</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className={cn('block', 'text-slate-900', 'font-semibold', 'mb-2')}>
                        Aircraft Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="aircraftType"
                        required
                        className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-slate-200', 'rounded-xl', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200', 'outline-none', 'tr', 'duration-300', 'bg-white')}
                      >
                        <option value="">Select aircraft type</option>
                        <option value="Helicopter">Helicopter</option>
                        <option value="Private Aircraft">Private Aircraft</option>
                        <option value="Business Charter">Business Charter</option>
                      </select>
                    </div>

                    <div>
                      <label className={cn('block', 'text-slate-900', 'font-semibold', 'mb-2')}>
                        Route <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="route"
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
                        name="travelDate"
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
                      name="notes"
                      rows="4"
                      className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-slate-200', 'rounded-xl', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200', 'outline-none', 'transition-all', 'duration-300', 'resize-none')}
                      placeholder="Any special requirements or additional information..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full', 'bg-gradient-to-r', 'from-blue-600', 'to-blue-700', 'text-white', 'font-bold', 'py-4', 'px-6', 'rounded-xl', 
                      'transition-all', 'duration-300', 'shadow-lg', 'flex', 'items-center', 'justify-center', 'gap-2',
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800 transform hover:scale-105'
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className={cn('w-5', 'h-5', 'animate-spin')} fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className={cn('w-5', 'h-5')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Get My Rental Price
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </section>

          {/* Plane Showcase Section */}
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
                  Our Premium Fleet
                </h2>
                <p className={cn('text-xl', 'text-slate-600', 'max-w-3xl', 'mx-auto')}>
                  Experience luxury and comfort with our state-of-the-art aircraft fleet
                </p>
              </motion.div>

              <div className={cn('grid', 'md:grid-cols-3', 'gap-8')}>
                {[
                  { 
                    image: '/aircraft.jpeg', 
                    title: 'King Air C90A', 
                    description: 'Perfect for business travel and executive .',
                    features: ['Luxury Interiors', 'High-Speed Connectivity', 'Premium Catering']
                  },
                  { 
                    image: '/home/home4.jpeg', 
                    title: 'A109E Power Helicopter', 
                    description: 'Ideal for group travel and special occasions',
                    features: ['Spacious Cabin', 'Flexible Seating', 'Entertainment System']
                  },
                  { 
                    image: '/home/helicopter3.jpeg', 
                    title: 'Super King Air B200', 
                    description: 'Ultimate luxury for discerning travelers',
                    features: ['VIP Service', 'Custom Configuration', 'Global Range']
                  }
                ].map((plane, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className={cn('group', 'relative', 'bg-white', 'rounded-3xl', 'overflow-hidden', 'shadow-lg', 'hover:shadow-2xl', 'transition-all',  )}
                  >
                    <div className={cn('relative', 'h-52', 'overflow-hidden')}>
                      <img
                        src={plane.image}
                        alt={plane.title}
                        className={cn('w-full', 'h-9',  'group-hover:scale-110', 'transition-transform', 'duration-500')}
                      />
                      <div className={cn('absolute', 'inset-0', 'bg-gradient-to-t', 'from-black/50', 'to-transparent', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-300')} />
                    </div>
                    
                    <div className={cn('p-8')}>
                      <h3 className={cn('text-2xl', 'font-bold', 'text-slate-900', 'mb-3')}>{plane.title}</h3>
                      <p className={cn('text-slate-600', 'mb-6', 'leading-relaxed')}>{plane.description}</p>
                      
                      <div className={cn('space-y-2', 'mb-6')}>
                        {plane.features.map((feature, i) => (
                          <div key={i} className={cn('flex', 'items-center', 'gap-2')}>
                            <svg className={cn('w-5', 'h-5', 'text-blue-500')} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className={cn('text-slate-700')}>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button className={cn('w-full', 'bg-gradient-to-r', 'from-blue-600', 'to-blue-700', 'text-white', 'font-semibold', 'py-3', 'px-6', 'rounded-xl', 'hover:from-blue-700', 'hover:to-blue-800', 'transition-all', 'duration-300', 'transform', 'hover:scale-105')}>
                        Learn More
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Rental Offerings Section */}
          <section id="offerings" className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-white')}>
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

                    <h3 className={cn('text-2xl', 'font-bold', 'mb-3')}>{service.title}</h3>
                    <p className={cn('text-blue-100', 'mb-6', 'leading-relaxed')}>{service.description}</p>

                    <div className={cn('mb-6')}>
                      <p className={cn('font-semibold', 'mb-3', 'text-lg')}>🔑 Specifications:</p>
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

          {/* Aircraft Gallery Section */}
          <section className={cn( 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gradient-to-br', 'from-slate-50', 'to-blue-50')}>
            <div className={cn('max-w-7xl', 'mx-auto')}>
              <div className={cn('grid', 'md:grid-cols-3', 'gap-8')}>
                {[
                  { image: '/home/helicopter1.jpg' },
                  { image: '/helicopter4.jpeg' },
                  { image: '/home/helicopter3.jpeg' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className={cn('group', 'relative', 'overflow-hidden', 'rounded-3xl', 'shadow-lg', 'hover:shadow-2xl')}
                  >
                    <div className={cn('relative', 'h-48', 'overflow-hidden')}>
                      <img
                        src={item.image}
                        alt={`Aircraft ${index + 1}`}
                        className={cn('w-full', 'h-full', 'object-cover', 'group-hover:scale-110', 'transition-transform', 'duration-700')}
                      />
                      <div className={cn('absolute', 'inset-0', 'bg-gradient-to-t', 'from-black/20', 'to-transparent', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-300')} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Rent With Us Section */}
          <section id="why" className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gradient-to-br', 'from-slate-50', 'to-blue-50')}>
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
                    className={cn('bg-white', 'rounded-2xl', 'p-8', 'shadow-sm', 'hover:shadow-2xl', 'transition-all', 'duration-300', 'border', 'border-slate-100')}
                  >
                    <div className={cn('text-5xl', 'mb-4')}>{item.icon}</div>
                    <h3 className={cn('text-xl', 'font-bold', 'text-slate-900', 'mb-2')}>{item.title}</h3>
                    <p className={cn('text-slate-600')}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* MP Government Partnership Section */}
          <MPGovernmentPartnership />

          {/* Fleet Section */}
          <FleetSection />

          {/* Rental Plans Section */}
          <section id="plans" className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-white')}>
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
                <a href="tel:+919870500422" className={cn('inline-block', 'px-8', 'py-4', 'bg-gradient-to-r', 'from-blue-600', 'to-blue-700', 'text-white', 'rounded-full', 'font-bold', 'text-lg', 'hover:from-blue-700', 'hover:to-blue-800', 'transition-all', 'duration-300', 'hover:scale-105', 'shadow-xl')}>
                  Call for Today's Availability
                </a>
              </motion.div>
            </div>
          </section>

          {/* Popular Use Cases Section */}
          <section id="use-cases" className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gradient-to-br', 'from-slate-900', 'to-blue-900')}>
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
          <section id="who-uses" className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-white')}>
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
          <section id="availability" className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gradient-to-br', 'from-blue-600', 'to-indigo-700')}>
            <div className={cn('max-w-5xl', 'mx-auto')}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={cn('text-center')}
              >
      

          

                <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center')}>
                  <a href="tel:++916398399463" className={cn('px-8', 'py-4', 'bg-white', 'text-blue-700', 'rounded-full', 'font-bold', 'text-lg', 'hover:bg-blue-50', 'transition-all', 'duration-300', 'hover:scale-105', 'shadow-xl')}>
                    Call for Today's Availability
                  </a>
                  <a href="https://wa.me/+916398399463?text=Hi, I'd like to rent an aircraft today" target="_blank" rel="noopener noreferrer" className={cn('px-8', 'py-4', 'bg-green-500', 'text-white', 'rounded-full', 'font-bold', 'text-lg', 'hover:bg-green-600', 'transition-all', 'duration-300', 'hover:scale-105', 'shadow-xl', 'flex', 'items-center', 'justify-center', 'gap-2')}>
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

            html {
              scroll-behavior: smooth;
            }
          `}</style>
        </div>
      </main>
    </>
  );
}
