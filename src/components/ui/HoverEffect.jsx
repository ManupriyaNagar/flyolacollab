"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FaClock, FaGlobe, FaHeadset, FaPlane, FaShieldAlt, FaStar } from "react-icons/fa";
// Default items for aviation services
const defaultItems = [
  {
    title: "Premium Safety Standards",
    description: "Our aircraft undergo rigorous safety checks and maintenance protocols to ensure the highest safety standards in the aviation industry.",
    link: "#",
    icon: FaShieldAlt,
    gradient: "from-green-500 to-emerald-600"
  },
  {
    title: "24/7 Customer Support",
    description: "Round-the-clock customer service with dedicated aviation specialists ready to assist you at every step of your journey.",
    link: "#",
    icon: FaHeadset,
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    title: "Global Network",
    description: "Access to premium destinations worldwide with our extensive network of aviation partners and exclusive routes.",
    link: "#",
    icon: FaGlobe,
    gradient: "from-purple-500 to-pink-600"
  },
  {
    title: "Luxury Fleet",
    description: "Modern aircraft equipped with state-of-the-art amenities and comfort features for an exceptional flying experience.",
    link: "#",
    icon: FaPlane,
    gradient: "from-orange-500 to-red-600"
  },
  {
    title: "On-Time Performance",
    description: "Reliable scheduling and punctual departures with industry-leading on-time performance rates for your peace of mind.",
    link: "#",
    icon: FaClock,
    gradient: "from-teal-500 to-cyan-600"
  },
  {
    title: "5-Star Service",
    description: "Exceptional service quality with personalized attention to detail, ensuring every flight exceeds your expectations.",
    link: "#",
    icon: FaStar,
    gradient: "from-yellow-500 to-orange-600"
  }
];

// Export as default to match lazy loading expectation
export default function HoverEffect({ items = defaultItems, className }) {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className={cn('py-16', 'lg:py-24', 'bg-gradient-to-br', 'from-gray-900', 'via-blue-900', 'to-indigo-900', 'relative', 'overflow-hidden')}>
      {/* Background Pattern */}
      <div className={cn('absolute', 'inset-0', 'opacity-10')}>
        <div className={cn('absolute', 'top-20', 'left-20', 'w-32', 'h-32', 'border', 'border-blue-300', 'rounded-full')}></div>
        <div className={cn('absolute', 'bottom-20', 'right-20', 'w-40', 'h-40', 'border', 'border-indigo-300', 'rounded-full')}></div>
        <div className={cn('absolute', 'top-1/2', 'left-1/4', 'w-24', 'h-24', 'border', 'border-purple-300', 'rounded-full')}></div>
      </div>

      <div className={cn('px-4', 'sm:px-6', 'lg:px-8', 'relative', 'z-10')}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn('text-center', 'mb-16')}
        >
          <div className={cn('inline-flex', 'items-center', 'gap-2', 'bg-gradient-to-r', 'from-blue-100/20', 'to-indigo-100/20', 'text-blue-200', 'px-6', 'py-2', 'text-sm', 'font-bold', 'rounded-full', 'shadow-sm', 'mb-6', 'backdrop-blur-sm', 'border', 'border-white/10')}>
            <FaStar className="text-blue-400" />
            Our Services
          </div>
          
          <h2 className={cn('text-3xl', 'sm:text-4xl', 'lg:text-5xl', 'font-bold', 'text-white', 'mb-6', 'leading-tight')}>
            Excellence in 
            <span className={cn('bg-gradient-to-r', 'from-blue-400', 'to-indigo-400', 'bg-clip-text', 'text-transparent')}> Aviation</span>
          </h2>
          
          <p className={cn('text-lg', 'text-blue-100', 'max-w-7xl', 'mx-auto', 'leading-relaxed')}>
            Discover what sets Flyola apart in the aviation industry. Our commitment to excellence 
            ensures every aspect of your journey exceeds expectations.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
          {items.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <Link
                href={item?.link || "#"}
                key={idx}
                className={cn('relative', 'group', 'block', 'p-2', 'h-full', 'w-full')}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.span
                      className={cn('absolute', 'inset-0', 'h-full', 'w-full', 'bg-gradient-to-r', 'from-blue-500/20', 'to-indigo-600/20', 'block', 'rounded-3xl', 'backdrop-blur-sm', 'border', 'border-white/20')}
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.15 } }}
                      exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                    />
                  )}
                </AnimatePresence>
                <Card>
                  <div className={cn('flex', 'items-center', 'gap-4', 'mb-4')}>
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={cn('text-white', 'text-xl')} />
                    </div>
                    <CardTitle>{item?.title || "No Title"}</CardTitle>
                  </div>
                  <CardDescription>{item?.description || "No Description"}</CardDescription>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={cn('text-center', 'mt-16')}
        >
          <div className={cn('bg-gradient-to-r', 'from-blue-600/20', 'to-indigo-600/20', 'backdrop-blur-sm', 'rounded-3xl', 'p-8', 'border', 'border-white/20')}>
            <h3 className={cn('text-2xl', 'font-bold', 'text-white', 'mb-4')}>Experience the Flyola Difference</h3>
            <p className={cn('text-blue-100', 'mb-6', 'max-w-2xl', 'mx-auto')}>
              Ready to experience premium aviation services? Contact us today and let us elevate your travel experience.
            </p>
            <button className={cn('bg-gradient-to-r', 'from-blue-500', 'to-indigo-600', 'text-white', 'px-8', 'py-4', 'rounded-2xl', 'font-bold', 'text-lg', 'hover:from-blue-600', 'hover:to-indigo-700', 'transform', 'hover:scale-105', 'transition-all', 'duration-300', 'shadow-lg')}>
              Get Started
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export const Card = ({
  className,
  children
}) => {
  return (
    <div
      className={cn(
        "rounded-3xl h-full w-full p-6 overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/15 relative z-20 transition-all duration-300",
        className
      )}>
      <div className={cn('relative', 'z-50')}>
        {children}
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children
}) => {
  return (
    <h4 className={cn("text-white font-bold tracking-wide text-lg", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children
}) => {
  return (
    <p
      className={cn("mt-4 text-blue-100 tracking-wide leading-relaxed text-sm", className)}>
      {children}
    </p>
  );
};