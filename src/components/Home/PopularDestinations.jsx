"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
export default function PopularDestinations() {
  return (
    <section className={cn('py-16', 'lg:py-24', "bg-slate-100", 'relative', 'overflow-hidden')}>


      <div className={cn('px-4', 'sm:px-6', 'lg:px-8', 'relative', 'z-10')}>

        {/* Call to Action */}
        <motion.div

          className="text-center"
        >
          <div className={cn('bg-[#0334EA]', 'rounded-2xl', 'py-20', 'text-white', 'shadow-2xl')}>
            <h3 className={cn('text-3xl', 'md:text-5xl', 'lg:text-4xl', 'font-semibold', 'text-white', 'mb-4', 'tracking-tight')}>Ready to Experience Luxury Aviation?</h3>
            <p className={cn('text-blue-100', 'mb-6', 'max-w-md', 'mx-auto', "px-5")}>
              Contact our aviation specialists today and discover
              how we can elevate your travel experience
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}