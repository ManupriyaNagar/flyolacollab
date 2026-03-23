"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
export default function PopularDestinations() {
  return (
    <section className={cn('py-10', 'lg:py-16', "bg-slate-100", 'relative', 'overflow-hidden')}>


      <div className={cn('px-4', 'sm:px-6', 'lg:px-8', 'relative', 'z-10')}>

        {/* Call to Action */}
        <motion.div

          className="text-center"
        >
          <div className={cn('bg-[#0334EA]', 'rounded-2xl', 'py-10', 'text-white', 'shadow-2xl')}>
            <h3 className={cn('text-xl', 'md:text-5xl', 'lg:text-4xl', 'font-semibold', 'text-white', 'md:mb-4', 'mb-0', 'tracking-tight')}>Ready to Experience Luxury Aviation?</h3>
            <p className={cn('text-blue-100', 'md:max-w-md', 'mx-auto', "px-5", 'text-sm', 'md:text-base')}>
              Contact our aviation specialists today and discover
              how we can elevate your travel experience
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}