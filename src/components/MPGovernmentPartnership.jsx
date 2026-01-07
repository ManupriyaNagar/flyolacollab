"use client";

import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

const MPGovernmentPartnership = () => {
  return (
    <section className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'bg-gradient-to-br', 'from-blue-50', 'via-white', 'to-blue-50', 'relative', 'overflow-hidden')}>
      {/* Animated Background Elements */}
      <div className={cn('absolute', 'inset-0', 'overflow-hidden', 'opacity-20')}>
        <div className={cn('absolute', 'top-20', 'left-10', 'w-96', 'h-96', 'bg-orange-500', 'rounded-full', 'mix-blend-multiply', 'filter', 'blur-3xl', 'animate-blob')} />
        <div className={cn('absolute', 'bottom-20', 'right-10', 'w-96', 'h-96', 'bg-green-500', 'rounded-full', 'mix-blend-multiply', 'filter', 'blur-3xl', 'animate-blob', 'animation-delay-2000')} />
      </div>

      <div className={cn('relative', 'z-10', 'max-w-7xl', 'mx-auto')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn('text-center', 'mb-16')}
        >
          <div className={cn('inline-flex', 'items-center', 'gap-3', 'mb-6', 'bg-white/10', 'backdrop-blur-lg', 'px-8', 'py-4', 'rounded-full', 'border', 'border-white/20',  'border' , 'border-blue-200')}>
            <span className={cn('text-3xl')}>🤝</span>
            <span className={cn('text-orange-400', 'font-bold', 'text-sm', 'uppercase', 'tracking-wide')}>Official Partner</span>
          </div>
          <h2 className={cn('text-5xl', 'md:text-6xl', 'font-bold', 'text-black', 'mb-6', 'leading-tight')}>
            Proud Partner of Madhya Pradesh Government
          </h2>
          <p className={cn('text-xl', 'md:text-2xl', 'text-blue-700', 'mb-4', 'font-light')}>
            Authorized Aviation Partner
          </p>
          <p className={cn('text-lg', 'text-blue-900', 'max-w-4xl', 'mx-auto', 'leading-relaxed')}>
            Official aviation partner for government operations, VIP transport, and travel services across Madhya Pradesh
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={cn('bg-white', 'rounded-3xl', 'p-8', 'md:p-12', 'max-w-6xl', 'mx-auto', 'border', 'border-slate-200')}
        >
          <div className={cn('grid', 'lg:grid-cols-2', 'gap-12', 'items-center')}>
            {/* Left Side - Government Logo & Info */}
            <div>
              <div className={cn('flex', 'items-center', 'gap-4', 'mb-8', 'pb-6', 'border-b-2', 'border-slate-100')}>
                <div className={cn('w-20', 'h-20', 'bg-gradient-to-br', 'from-orange-500', 'to-orange-600', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'text-white', 'text-2xl', 'font-bold')}>
                  MP
                </div>
                <div>
                  <h3 className={cn('text-2xl', 'font-bold', 'text-slate-900')}>
                    Madhya Pradesh Government
                  </h3>
                  <p className={cn('text-orange-600', 'font-semibold')}>Official Aviation Partner</p>
                </div>
              </div>

              <div className={cn('space-y-6')}>
                {[
                  {
                    icon: '🏛️',
                    title: 'Government-Approved Operator',
                    desc: 'Certified and authorized for official state operations'
                  },
                  {
                    icon: '👑',
                    title: 'VIP & Ministerial Transport',
                    desc: 'Trusted for high-security government travel'
                  },
                  {
                    icon: '🌄',
                    title: 'Tourism Development Partner',
                    desc: 'Supporting MP Tourism initiatives and connectivity'
                  },
                  {
                    icon: '🚨',
                    title: 'Emergency & Medical Services',
                    desc: 'Priority support for state emergency operations'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={cn('flex', 'items-start', 'gap-4', 'p-4', 'rounded-xl', 'hover:bg-slate-50', 'transition-all', 'duration-300')}
                  >
                    <div className={cn('w-12', 'h-12', 'bg-gradient-to-br', 'from-blue-500', 'to-blue-600', 'rounded-xl', 'flex', 'items-center', 'justify-center', 'text-2xl',  'flex-shrink-0')}>
                      {item.icon}
                    </div>
                    <div>
                      <p className={cn('font-bold', 'text-slate-900', 'text-lg', 'mb-1')}>{item.title}</p>
                      <p className={cn('text-slate-600', 'leading-relaxed')}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Side - Service Highlights */}
            <div className={cn('space-y-6')}>
              {[
                {
                  icon: '🏛️',
                  title: 'Government Services',
                  desc: 'Providing reliable aviation services for official government functions, state events, and administrative travel across Madhya Pradesh.',
                  gradient: 'from-orange-500 to-orange-600'
                },
                {
                  icon: '🌄',
                  title: 'Tourism Promotion',
                  desc: 'Enhancing connectivity to MP\'s heritage sites, wildlife sanctuaries, and tourist destinations through helicopter and charter services.',
                  gradient: 'from-green-500 to-green-600'
                },
                {
                  icon: '🛡️',
                  title: 'Safety & Compliance',
                  desc: 'Meeting the highest safety standards and regulatory compliance as required for government aviation partnerships.',
                  gradient: 'from-blue-500 to-blue-600'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={cn('bg-gradient-to-br', 'from-slate-50', 'to-blue-50', 'rounded-2xl', 'p-6', 'border-2', 'border-slate-100', 'hover:border-blue-200', 'transition-all', 'duration-300')}
                >
                  <div className={cn('flex', 'items-center', 'gap-4', 'mb-4')}>
                    <div className={cn('w-14', 'h-14', 'bg-gradient-to-br', item.gradient, 'rounded-xl', 'flex', 'items-center', 'justify-center', 'text-2xl')}>
                      {item.icon}
                    </div>
                    <h4 className={cn('text-xl', 'font-bold', 'text-slate-900')}>{item.title}</h4>
                  </div>
                  <p className={cn('text-slate-700', 'leading-relaxed')}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={cn('flex', 'flex-wrap', 'justify-center', 'gap-6', 'text-blue-700', 'text-sm', 'mt-12')}
        >
          {[
            'DGCA Compliant Operations',
            'Government Certified Partner',
            'VVIP Security Clearance',
            '24×7 Emergency Support',
            'Multi-State Coverage',
            'Premium Fleet Access'
          ].map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={cn('flex', 'items-center', 'gap-2', 'bg-white/10', 'backdrop-blur-lg', 'px-4', 'py-2', 'rounded-full', 'border', 'border-white/20')}
            >
              <svg className={cn('w-4', 'h-4', 'text-green-900')} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {badge}
            </motion.div>
          ))}
        </motion.div>
      </div>

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
    </section>
  );
};

export default MPGovernmentPartnership;