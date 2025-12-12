"use client";

import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <div className={cn('min-h-screen', 'bg-white')}>
      
      {/* Floating Contact Button */}
      <a
        href="tel:+919870500422"
        className={cn(
          'fixed', 'bottom-6', 'right-6', 'z-50',
          'bg-gradient-to-r', 'from-blue-600', 'to-blue-700',
          'text-white', 'px-6', 'py-4', 'rounded-full',
          'shadow-2xl', 'hover:shadow-3xl',
          'flex', 'items-center', 'gap-3',
          'transition-all', 'duration-300',
          'hover:scale-105', 'hover:from-blue-700', 'hover:to-blue-800',
          'animate-bounce', 'hover:animate-none'
        )}
      >
        <svg className={cn('w-6', 'h-6')} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
        </svg>
        
      </a>

      {/* Hero Section with Background Image */}
      <section className={cn('relative', 'h-screen', 'flex', 'items-center', 'justify-center', 'overflow-hidden')}>
        {/* Background Image with Overlay */}
        <div className={cn('absolute', 'inset-0')}>
          <div 
            className={cn('absolute', 'inset-0', 'bg-cover', 'bg-center', 'bg-no-repeat')}
            style={{
              backgroundImage: 'url(/home/home1.jpg)',
              filter: 'brightness(0.5)'
            }}
          />
          <div className={cn('absolute', 'inset-0', 'bg-black/40')} />
        </div>

        {/* Hero Content */}
        <div className={cn('relative', 'z-10', 'max-w-6xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'text-center')}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={cn('text-4xl', 'md:text-xl', 'lg:text-2xl', 'font-thin', 'text-white', 'mb-6', 'leading-tight')}>
              Rent a Private Jet or Helicopter — Hourly, Daily, Weekly
            </h1>
            <p className={cn('text-xl', 'md:text-2xl', 'text-white/90', 'mb-12', 'max-w-4xl', 'mx-auto' , 'font-thin')}>
              Flexible luxury aircraft rental designed for your schedule, budget, and travel requirements.
            </p>
            
   
            
            {/* CTA Buttons */}
            <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center', 'items-center', 'mb-16')}>
              <a
                href="#rental-form"
                className={cn('md:px-8', 'md:py-4',   'py-1' , 'px-1' , 'bg-orange-600', 'text-white', 'rounded-lg', 'font-thin', 'md:text-lg', 'hover:bg-orange-700', 'transition-all', 'duration-300', 'flex', 'items-center', 'gap-2', 'shadow-xl')}
              >
                <svg className={cn('w-5', 'h-5')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                Get Rental Price Now
              </a>
              <a
                href="tel:+919870500422"
                className={cn('md:px-8', 'md:py-4', 'bg-white', 'text-slate-900', 'rounded-lg', 'font-thin', 'md:text-lg', 'hover:bg-slate-100', 'transition-all', 'duration-300', 'flex', 'items-center', 'gap-2', 'shadow-xl' , 'py-1', 'px-1'  )}
              >
                <svg className={cn('w-5', 'h-5')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className={cn('flex', 'flex-col', 'items-start')}>

                  <span className={cn('font-bold', 'text-slate-900')}>+91 98705 00422</span>
                </span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className={cn('flex', 'flex-wrap', 'justify-center', 'gap-4' )}>
              <div className={cn('bg-white/10', 'backdrop-blur-md', 'border', 'border-white/20', 'rounded-lg', 'px-6', 'py-3', 'text-white', 'font-thin')}>
                DGCA Compliant Operators
              </div>
              <div className={cn('bg-white/10', 'backdrop-blur-md', 'border', 'border-white/20', 'rounded-lg', 'px-6', 'py-3', 'text-white', 'font-thin')}>
                VVIP Security Handling
              </div>
              <div className={cn('bg-white/10', 'backdrop-blur-md', 'border', 'border-white/20', 'rounded-lg', 'px-6', 'py-3', 'text-white', 'font-thin')}>
                24×7 Rental Support
              </div>
              <div className={cn('bg-white/10', 'backdrop-blur-md', 'border', 'border-white/20', 'rounded-lg', 'px-6', 'py-3', 'text-white', 'font-thin')}>
                Transparent Hourly Billing
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Premium Services Section */}

 <section className={cn('py-20', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-white')}>
        <div className={cn('max-w-7xl', 'mx-auto')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-center', 'mb-12')}
          >
            <h2 className={cn('text-3xl', 'md:text-4xl', 'font-bold', 'text-slate-900', 'mb-4')}>
              We Offer Aircraft for Rent:
            </h2>
          </motion.div>

          <div className={cn('grid', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
            {[
              { icon: '🕐', text: 'Hourly Rental (2, 4, 6 hours+)' },
              { icon: '📅', text: 'Full-Day Rental' },
              { icon: '📆', text: 'Weekly & Monthly Rental Plans' },
              { icon: '✈️', text: 'On-Demand One-Way or Round-Trip' },
              { icon: '🌍', text: 'Multi-City Travel Rent (Unlimited Routes)' },
              { icon: '🏢', text: 'Corporate, VIP, Event & Tourism Rentals' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={cn('bg-gradient-to-br', 'from-blue-50', 'to-indigo-50', 'rounded-xl', 'p-6', 'border', 'border-blue-100', 'hover:border-blue-300', 'transition-all', 'duration-300', 'flex', 'items-center', 'gap-4')}
              >
                <div className={cn('text-3xl')}>{item.icon}</div>
                <p className={cn('text-slate-700', 'font-medium')}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      <section className={cn('py-20', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-white')}>
        <div className={cn('max-w-7xl', 'mx-auto')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-center', 'mb-16')}
          >
            <h2 className={cn('text-3xl', 'md:text-4xl', 'font-bold', 'text-slate-900', 'mb-4')}>
              Our Premium Services
            </h2>
          </motion.div>

          <div className={cn('grid', 'md:grid-cols-3', 'gap-8')}>
            {/* Private Jet Rental */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'overflow-hidden', 'hover:shadow-2xl', 'transition-all', 'duration-300')}
            >
              <div className={cn('h-96', 'bg-cover', 'bg-center')} style={{ backgroundImage: 'url(/plane3.jpeg)' }} />
              <div className={cn('p-6')}>
                <h3 className={cn('text-xl', 'font-bold', 'text-slate-900', 'mb-2', 'flex', 'items-center', 'gap-2')}>
                  ✈️ Private Jet Rental
                </h3>
                <p className={cn('text-slate-600', 'mb-4')}>
                  Rent a luxury private jet for personal, family, business or leisure travel.
                </p>
                <div className={cn('mb-6')}>
                  <p className={cn('text-sm', 'font-semibold', 'text-orange-600', 'mb-3')}>🔑 Rental PECIFICATION SEAT, TYPE:</p>
                  <ul className={cn('space-y-2', 'text-sm', 'text-slate-700')}>
                    <li className={cn('flex', 'items-center', 'gap-2')}>
                      <svg className={cn('w-4', 'h-4', 'text-green-500')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Hourly billing
                    </li>
                    <li className={cn('flex', 'items-center', 'gap-2')}>
                      <svg className={cn('w-4', 'h-4', 'text-green-500')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Flexible pickup time
                    </li>
                    <li className={cn('flex', 'items-center', 'gap-2')}>
                      <svg className={cn('w-4', 'h-4', 'text-green-500')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Luxury interiors
                    </li>
                    <li className={cn('flex', 'items-center', 'gap-2')}>
                      <svg className={cn('w-4', 'h-4', 'text-green-500')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Priority boarding
                    </li>
                  </ul>
                </div>
                <Link href="/jet-hire">
                  <button className={cn('w-full', 'bg-blue-600', 'text-white', 'font-semibold', 'py-3', 'px-6', 'rounded-lg', 'hover:bg-blue-700', 'transition-all', 'duration-300')}>
                    Rent Private Jet
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Helicopter Rental */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'overflow-hidden', 'hover:shadow-2xl', 'transition-all', 'duration-300')}
            >
              <div className={cn('h-96', 'bg-cover', 'bg-center')} style={{ backgroundImage: 'url(/home/home4.jpeg )' }} />
              <div className={cn('p-6')}>
                <h3 className={cn('text-xl', 'font-bold', 'text-slate-900', 'mb-2', 'flex', 'items-center', 'gap-2')}>
                  🚁 Helicopter Rental
                </h3>
                <p className={cn('text-slate-600', 'mb-4')}>
                  Ideal for pilgrimage, weddings, city sightseeing, business visits, and medical travel.
                </p>
                <div className={cn('mb-6')}>
                  <p className={cn('text-sm', 'font-semibold', 'text-orange-600', 'mb-3')}>🔑 Rental Advantages:</p>
                  <ul className={cn('space-y-2', 'text-sm', 'text-slate-700')}>
                    <li className={cn('flex', 'items-center', 'gap-2')}>
                      <svg className={cn('w-4', 'h-4', 'text-green-500')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Pay per hour
                    </li>
                    <li className={cn('flex', 'items-center', 'gap-2')}>
                      <svg className={cn('w-4', 'h-4', 'text-green-500')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Remote location landing
                    </li>
                    <li className={cn('flex', 'items-center', 'gap-2')}>
                      <svg className={cn('w-4', 'h-4', 'text-green-500')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Quick route access
                    </li>
                    <li className={cn('flex', 'items-center', 'gap-2')}>
                      <svg className={cn('w-4', 'h-4', 'text-green-500')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      VVIP entrance for events
                    </li>
                  </ul>
                </div>
                <Link href="/helicopter-flight">
                  <button className={cn('w-full', 'bg-blue-600', 'text-white', 'font-semibold', 'py-3', 'px-6', 'rounded-lg', 'hover:bg-blue-700', 'transition-all', 'duration-300')}>
                    Rent a Helicopter
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Business Charter Rental */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={cn('bg-white', 'rounded-2xl', 'shadow-lg', 'overflow-hidden', 'hover:shadow-2xl', 'transition-all', 'duration-300')}
            >
              <div className={cn('h-96', 'bg-cover', 'bg-center')} style={{ backgroundImage: 'url(/plane2.jpeg)' }} />
              <div className={cn('p-6')}>
                <h3 className={cn('text-xl', 'font-bold', 'text-slate-900', 'mb-2', 'flex', 'items-center', 'gap-2')}>
                  💼 Business Charter Rental
                </h3>
                <p className={cn('text-slate-600', 'mb-4')}>
                  For CEOs, diplomats, executives and corporate groups.
                </p>
                <div className={cn('mb-6')}>
                  <p className={cn('text-sm', 'font-semibold', 'text-orange-600', 'mb-3')}>🔑 Rental Advantages:</p>
                  <ul className={cn('space-y-2', 'text-sm', 'text-slate-700')}>
                    <li className={cn('flex', 'items-center', 'gap-2')}>
                      <svg className={cn('w-4', 'h-4', 'text-green-500')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Confidential environment
                    </li>
                    <li className={cn('flex', 'items-center', 'gap-2')}>
                      <svg className={cn('w-4', 'h-4', 'text-green-500')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Multi-city travel in one day
                    </li>
                    <li className={cn('flex', 'items-center', 'gap-2')}>
                      <svg className={cn('w-4', 'h-4', 'text-green-500')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Hourly + package plans
                    </li>


                      <li className={cn('flex', 'items-center', 'gap-2')}>
                      <svg className={cn('w-4', 'h-4', 'text-green-500')} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                                       VVIP entrance for events
                    </li>
                  </ul>
                </div>
                <Link href="/business-class-charter">
                  <button className={cn('w-full', 'bg-blue-600', 'text-white', 'font-semibold', 'py-3', 'px-6', 'rounded-lg', 'hover:bg-blue-700', 'transition-all', 'duration-300')}>
                    Rent Business Jet
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Madhya Pradesh Government Tie-up Section */}
      <section className={cn('py-20', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gradient-to-br', 'from-orange-50', 'via-white', 'to-green-50')}>
        <div className={cn('max-w-7xl', 'mx-auto')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-center', 'mb-12')}
          >
            <div className={cn('inline-flex', 'items-center', 'gap-3', 'mb-4', 'bg-white', 'px-6', 'py-3', 'rounded-full', 'shadow-lg')}>
              <span className={cn('text-2xl')}>🤝</span>
              <span className={cn('text-orange-600', 'font-bold', 'text-sm', 'uppercase', 'tracking-wide')}>Official Partner</span>
            </div>
            <h2 className={cn('text-3xl', 'md:text-4xl', 'font-bold', 'text-slate-900', 'mb-4')}>
              Proud Partner of Madhya Pradesh Government
            </h2>
            <p className={cn('text-lg', 'text-slate-600', 'max-w-3xl', 'mx-auto')}>
              Authorized aviation partner for government operations, VIP transport, and official travel services across Madhya Pradesh
            </p>
          </motion.div>

          <div className={cn('grid', 'lg:grid-cols-2', 'gap-12', 'items-center')}>
            {/* Left Side - Government Logo & Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={cn('bg-white', 'rounded-3xl', 'p-8', 'md:p-12',  'border-2', 'border-orange-100')}
            >
              <div className={cn('flex', 'items-center', 'gap-4', 'mb-8', 'pb-6', 'border-b-2', 'border-slate-100')}>
                <div className={cn('w-16', 'h-16', 'bg-gradient-to-br', 'from-orange-500', 'to-orange-600', 'rounded-full', 'flex', 'items-center', 'justify-center', 'text-white', 'text-2xl', 'font-bold', 'shadow-lg')}>
                  MP
                </div>
                <div>
                  <h3 className={cn('text-xl', 'font-bold', 'text-slate-900')}>
                    Madhya Pradesh Government
                  </h3>
                  <p className={cn('text-sm', 'text-slate-600')}>Official Aviation Partner</p>
                </div>
              </div>

              <div className={cn('space-y-4')}>
                <div className={cn('flex', 'items-start', 'gap-3')}>
                  <div className={cn('w-8', 'h-8', 'bg-green-100', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'flex-shrink-0', 'mt-1')}>
                    <svg className={cn('w-5', 'h-5', 'text-green-600')} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className={cn('font-semibold', 'text-slate-900')}>Government-Approved Operator</p>
                    <p className={cn('text-sm', 'text-slate-600', 'mt-1')}>Certified and authorized for official state operations</p>
                  </div>
                </div>

                <div className={cn('flex', 'items-start', 'gap-3')}>
                  <div className={cn('w-8', 'h-8', 'bg-green-100', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'flex-shrink-0', 'mt-1')}>
                    <svg className={cn('w-5', 'h-5', 'text-green-600')} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className={cn('font-semibold', 'text-slate-900')}>VIP & Ministerial Transport</p>
                    <p className={cn('text-sm', 'text-slate-600', 'mt-1')}>Trusted for high-security government travel</p>
                  </div>
                </div>

                <div className={cn('flex', 'items-start', 'gap-3')}>
                  <div className={cn('w-8', 'h-8', 'bg-green-100', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'flex-shrink-0', 'mt-1')}>
                    <svg className={cn('w-5', 'h-5', 'text-green-600')} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className={cn('font-semibold', 'text-slate-900')}>Tourism Development Partner</p>
                    <p className={cn('text-sm', 'text-slate-600', 'mt-1')}>Supporting MP Tourism initiatives and connectivity</p>
                  </div>
                </div>

                <div className={cn('flex', 'items-start', 'gap-3')}>
                  <div className={cn('w-8', 'h-8', 'bg-green-100', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'flex-shrink-0', 'mt-1')}>
                    <svg className={cn('w-5', 'h-5', 'text-green-600')} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className={cn('font-semibold', 'text-slate-900')}>Emergency & Medical Services</p>
                    <p className={cn('text-sm', 'text-slate-600', 'mt-1')}>Priority support for state emergency operations</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Benefits & Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={cn('space-y-6')}
            >
              <div className={cn('bg-white', 'rounded-2xl', 'p-6', 'shadow-lg', 'border', 'border-orange-100')}>
                <div className={cn('flex', 'items-center', 'gap-4', 'mb-4')}>
                  <div className={cn('w-12', 'h-12', 'bg-orange-100', 'rounded-xl', 'flex', 'items-center', 'justify-center', 'text-2xl')}>
                    🏛️
                  </div>
                  <h4 className={cn('text-lg', 'font-bold', 'text-slate-900')}>Government Services</h4>
                </div>
                <p className={cn('text-slate-600', 'text-sm', 'leading-relaxed')}>
                  Providing reliable aviation services for official government functions, state events, and administrative travel across Madhya Pradesh.
                </p>
              </div>

              <div className={cn('bg-white', 'rounded-2xl', 'p-6', 'shadow-lg', 'border', 'border-green-100')}>
                <div className={cn('flex', 'items-center', 'gap-4', 'mb-4')}>
                  <div className={cn('w-12', 'h-12', 'bg-green-100', 'rounded-xl', 'flex', 'items-center', 'justify-center', 'text-2xl')}>
                    🌄
                  </div>
                  <h4 className={cn('text-lg', 'font-bold', 'text-slate-900')}>Tourism Promotion</h4>
                </div>
                <p className={cn('text-slate-600', 'text-sm', 'leading-relaxed')}>
                  Enhancing connectivity to MP's heritage sites, wildlife sanctuaries, and tourist destinations through helicopter and charter services.
                </p>
              </div>

              <div className={cn('bg-white', 'rounded-2xl', 'p-6', 'shadow-lg', 'border', 'border-blue-100')}>
                <div className={cn('flex', 'items-center', 'gap-4', 'mb-4')}>
                  <div className={cn('w-12', 'h-12', 'bg-blue-100', 'rounded-xl', 'flex', 'items-center', 'justify-center', 'text-2xl')}>
                    🛡️
                  </div>
                  <h4 className={cn('text-lg', 'font-bold', 'text-slate-900')}>Safety & Compliance</h4>
                </div>
                <p className={cn('text-slate-600', 'text-sm', 'leading-relaxed')}>
                  Meeting the highest safety standards and regulatory compliance as required for government aviation partnerships.
                </p>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Rent With Us & Who Uses Section */}
      <section className={cn('py-20', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gradient-to-br', 'from-slate-50', 'to-blue-50')}>
        <div className={cn('max-w-7xl', 'mx-auto')}>
          <div className={cn('grid', 'lg:grid-cols-2', 'gap-16')}>
            {/* Why Rent With Us */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={cn('text-3xl', 'font-bold', 'text-slate-900', 'mb-8')}>
                Why Rent With Us?
              </h2>
              <div className={cn('space-y-4')}>
                {[
                  { icon: '🛡️', text: 'No hidden charges' },
                  { icon: '🗺️', text: 'Multi-stop route in one rental cost' },
                  { icon: '🕐', text: '24×7 operations team' },
                  { icon: '👑', text: 'VVIP pickup & drop arrangements' },
                  { icon: '👨‍✈️', text: 'Elite-trained crew' },
                  { icon: '✈️', text: 'Pan-India fleet' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={cn('bg-white', 'rounded-xl', 'p-4', 'shadow-md', 'flex', 'items-center', 'gap-4', 'hover:shadow-lg', 'transition-all', 'duration-300')}
                  >
                    <div className={cn('w-12', 'h-12', 'bg-blue-100', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'text-2xl')}>
                      {item.icon}
                    </div>
                    <p className={cn('text-slate-700', 'font-medium')}>{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Who Uses Our Rental Plans */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={cn('text-3xl', 'font-bold', 'text-slate-900', 'mb-8')}>
                Who Uses Our Rental Plans?
              </h2>
              <div className={cn('grid', 'grid-cols-2', 'gap-4')}>
                {[
                  'CEOs & Entrepreneurs',
                  'Tourists & Travellers',
                  'Wedding Planners',
                  'VIP Families',
                  'Corporates',
                  'Film Industry',
                  'Event Companies'
                ].map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={cn('bg-white', 'rounded-xl', 'p-4', 'shadow-md', 'text-center', 'hover:shadow-lg', 'hover:bg-blue-50', 'transition-all', 'duration-300')}
                  >
                    <p className={cn('text-slate-700', 'font-medium', 'text-sm')}>{user}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Rental Plans Section */}
      <section className={cn('py-20', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-white')}>
        <div className={cn('max-w-6xl', 'mx-auto')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-center', 'mb-12')}
          >
            <h2 className={cn('text-3xl', 'md:text-4xl', 'font-bold', 'text-slate-900', 'mb-4')}>
              Our Rental Plans
            </h2>
          </motion.div>

          <div className={cn('space-y-6')}>
            {/* Hourly Rental */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={cn('bg-gradient-to-br', 'from-orange-50', 'to-yellow-50', 'rounded-3xl', 'p-8', 'border', 'border-orange-200')}
            >
              <div className={cn('flex', 'items-center', 'gap-3', 'mb-6')}>
                <span className={cn('text-2xl')}>🔥</span>
                <h3 className={cn('text-xl', 'font-bold', 'text-slate-900')}>Hourly Rental Starting Plans:</h3>
              </div>
              <div className={cn('grid', 'md:grid-cols-2', 'gap-6')}>
                <div>
                  <p className={cn('text-slate-700')}>
                    <span className={cn('text-blue-600', 'font-semibold')}>Helicopter:</span>{' '}
        
                  </p>
                  <p className={cn('text-sm', 'text-slate-600', 'mt-1')}>(Route-based)</p>
                </div>
                <div>
                  <p className={cn('text-slate-700')}>
                    <span className={cn('text-blue-600', 'font-semibold')}>Private Jet:</span>{' '}

                  </p>
                  <p className={cn('text-sm', 'text-slate-600', 'mt-1')}>(Aircraft-based)</p>
                </div>
              </div>
            </motion.div>

            {/* Weekly Rental */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={cn('bg-gradient-to-br', 'from-purple-50', 'to-pink-50', 'rounded-3xl', 'p-8', 'border', 'border-purple-200')}
            >
              <div className={cn('flex', 'items-center', 'gap-3', 'mb-6')}>
                <span className={cn('text-2xl')}>📅</span>
                <h3 className={cn('text-xl', 'font-bold', 'text-slate-900')}>Weekly Rental Plans:</h3>
              </div>
              <ul className={cn('space-y-3')}>
                {['Fly unlimited hours (conditions apply)', 'Chauffeur pickup & drop included', 'Premium hospitality add-ons available'].map((item, i) => (
                  <li key={i} className={cn('flex', 'items-center', 'gap-3', 'text-slate-700')}>
                    <svg className={cn('w-5', 'h-5', 'text-green-500', 'flex-shrink-0')} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Monthly Rental */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={cn('bg-gradient-to-br', 'from-blue-50', 'to-indigo-50', 'rounded-3xl', 'p-8', 'border', 'border-blue-200')}
            >
              <div className={cn('flex', 'items-center', 'gap-3', 'mb-6')}>
                <span className={cn('text-2xl')}>💼</span>
                <h3 className={cn('text-xl', 'font-bold', 'text-slate-900')}>Monthly Rental for Corporates:</h3>
              </div>
              <ul className={cn('space-y-3')}>
                {['Fixed monthly fee', 'Unlimited priority access', 'Dedicated aircraft manager'].map((item, i) => (
                  <li key={i} className={cn('flex', 'items-center', 'gap-3', 'text-slate-700')}>
                    <svg className={cn('w-5', 'h-5', 'text-green-500', 'flex-shrink-0')} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={cn('text-center', 'mt-8')}
          >
            <p className={cn('text-slate-600', 'mb-2')}>👉 Exact pricing depends on aircraft model & route. Instant quote available.</p>
          </motion.div>
        </div>
      </section>

      {/* Popular Use Cases Section */}
      <section className={cn('py-20', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gradient-to-br', 'from-slate-50', 'to-blue-50')}>
        <div className={cn('max-w-6xl', 'mx-auto')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('text-center', 'mb-12')}
          >
            <h2 className={cn('text-3xl', 'md:text-4xl', 'font-bold', 'text-slate-900', 'mb-4')}>
              Popular Use Cases
            </h2>
          </motion.div>

          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-8')}>
            {[
              { icon: '🏢', text: 'Business Meetings in Multiple Cities in One Day' },
              { icon: '💍', text: 'Destination Weddings' },
              { icon: '👑', text: 'VIP Pickup & Drop' },
              { icon: '🙏', text: 'Pilgrimage (Kedarnath, Vaishno Devi, Shirdi)' },
              { icon: '✈️', text: 'Tourism & Sightseeing Flights' },
              { icon: '📷', text: 'Aerial Filming / Photography' },
              { icon: '🎉', text: 'Corporate Events & Trips' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={cn('bg-white', 'rounded-2xl', 'p-8', 'shadow-md', 'hover:shadow-lg', 'transition-all', 'duration-300', 'text-center', 'flex', 'flex-col', 'items-center', 'gap-4')}
              >
                <div className={cn('w-16', 'h-16', 'bg-blue-600', 'rounded-full', 'flex', 'items-center', 'justify-center', 'text-white', 'text-2xl')}>
                  {item.icon}
                </div>
                <p className={cn('text-slate-700', 'font-medium', 'text-sm', 'leading-relaxed')}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Form Section */}
      <section id="rental-form" className={cn('py-20', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gradient-to-br', 'from-slate-50', 'to-blue-50')}>
        <div className={cn('max-w-4xl', 'mx-auto')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={cn('bg-white', 'rounded-3xl',  'p-8', 'md:p-12')}
          >
            <h2 className={cn('text-3xl', 'md:text-4xl', 'font-bold', 'text-slate-900', 'mb-2', 'text-center')}>
              Get Instant Rental Price
            </h2>
            <p className={cn('text-center', 'text-slate-600', 'mb-8')}>(30-minute response guaranteed)</p>
            
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
                    className={cn('w-full', 'px-4', 'py-3', 'border-2', 'border-slate-200', 'rounded-xl', 'focus:border-blue-500', 'focus:ring-2', 'focus:ring-blue-200', 'outline-none', 'transition-all', 'duration-300', 'bg-white')}
                  >
                    <option value="">Select aircraft type</option>
                    <option value="Helicopter">Helicopter</option>
                    <option value="Private Jet">Private Jet</option>
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

              <div className={cn('grid', 'md:grid-cols-2', 'gap-4')}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'w-full', 'bg-blue-600', 'text-white', 'font-bold', 'md:py-4', 'md:px-6', 'py-2','rounded-xl', 
                    'transition-all', 'duration-300', 'shadow-lg', 'flex', 'items-center', 'justify-center', 'gap-2',
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
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
                <a
                  href="https://wa.me/919870500422?text=Hi, I'd like to get a quick quote for aircraft rental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('w-full', 'bg-green-600', 'text-white', 'font-bold', 'md:py-4', 'md:px-6', 'py-2' , 'rounded-xl', 'hover:bg-green-700', 'transition-all', 'duration-300', 'shadow-lg', 'flex', 'items-center', 'justify-center', 'gap-2')}
                >
                  <svg className={cn('w-5', 'h-5')} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Get Quick Quote on WhatsApp
                </a>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
