"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
export default function PopularDestinations() {
  return (
    <section className={cn('py-16', 'lg:py-24', 'bg-gradient-to-br', 'from-gray-50', 'via-white', 'to-blue-50', 'relative', 'overflow-hidden')}>


      <div className={cn('px-4', 'sm:px-6', 'lg:px-8', 'relative', 'z-10')}>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <div className={cn('bg-[#0334EA]', 'rounded-2xl', 'py-20', 'text-white', 'shadow-2xl')}>
            <h3 className={cn('text-2xl', 'font-bold', 'mb-2')}>Ready to Experience Luxury Aviation?</h3>
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