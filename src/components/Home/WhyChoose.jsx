"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaHeadset, FaMousePointer, FaDollarSign, FaStar, FaCheckCircle } from "react-icons/fa";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "01",
    title: "Exceptional Customer Service",
    description:
      "Flyola prides itself on providing exceptional customer service from the moment you book your ticket until you reach your destination.",
    color: "bg-gradient-to-r from-green-500 to-emerald-600",
    icon: FaHeadset,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "02",
    title: "Easy Booking Process",
    description:
      "At Flyola, we understand that convenience is key. Our user-friendly website and mobile app make the booking process quick and straightforward.",
    color: "bg-gradient-to-r from-yellow-500 to-orange-600",
    icon: FaMousePointer,
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    id: "03",
    title: "Competitive Pricing",
    description:
      "Flyola offers competitive pricing without compromising on quality. We strive to provide the best value for your money, with regular promotions.",
    color: "bg-gradient-to-r from-purple-500 to-pink-600",
    icon: FaDollarSign,
    gradient: "from-blue-500 to-blue-600",
  },
  
];

const WhyChooseFlyOla = () => {
  return (
    <section className={cn('py-16', 'lg:py-24', 'bg-gradient-to-br', 'from-gray-50', 'via-white', 'to-blue-50', 'relative', 'overflow-hidden')}>
      {/* Background Pattern */}
      <div className={cn('absolute', 'inset-0', 'opacity-5')}>
        <div className={cn('absolute', 'top-20', 'left-20', 'w-32', 'h-32', 'border', 'border-blue-300', 'rounded-full')}></div>
        <div className={cn('absolute', 'bottom-20', 'right-20', 'w-40', 'h-40', 'border', 'border-indigo-300', 'rounded-full')}></div>
        <div className={cn('absolute', 'top-1/2', 'right-1/4', 'w-24', 'h-24', 'border', 'border-purple-300', 'rounded-full')}></div>
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
          <div className={cn('inline-flex', 'items-center', 'gap-2', 'bg-gradient-to-r', 'from-blue-100', 'to-indigo-100', 'text-blue-800', 'px-6', 'py-2', 'text-sm', 'font-bold', 'rounded-full', 'shadow-sm', 'mb-6')}>
            <FaCheckCircle className="text-blue-600" />
            Why Choose Us
          </div>
          
          <h2 className={cn('text-3xl', 'sm:text-4xl', 'lg:text-5xl', 'font-bold', 'text-gray-900', 'mb-6', 'leading-tight')}>
            Why Choose 
            <span className={cn('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'bg-clip-text', 'text-transparent')}> Flyola</span>
          </h2>
          
          <p className={cn('text-lg', 'text-gray-600', 'max-w-4xl', 'mx-auto', 'leading-relaxed')}>
            When it comes to air travel, Flyola stands out as a premier choice for travelers
            seeking a seamless, comfortable, and enjoyable journey. Here are compelling
            reasons why choosing Flyola is the best decision for your next trip.
          </p>
        </motion.div>

        <div className={cn('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-12', 'lg:gap-16', 'items-center')}>
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className={cn('relative', 'h-96', 'lg:h-[500px]', 'flex', 'items-center', 'justify-center')}>
              {/* Background Gradient */}
              <div className={cn('absolute', 'inset-0', 'bg-gradient-to-br', 'from-blue-600', 'to-indigo-600', 'rounded-3xl', 'opacity-10')}></div>
              
              {/* Aircraft Images */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={cn('relative', 'z-10')}
              >
                <motion.img
                  src="/1.png"
                  alt="Private Jet"
                  className={cn('w-48', 'h-64', 'lg:w-60', 'lg:h-80', 'object-cover', 'rounded-3xl', 'shadow-2xl', 'border-4', 'border-white')}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img
                  src="/2.png"
                  alt="Helicopter"
                  className={cn('w-32', 'h-32', 'lg:w-40', 'lg:h-40', 'object-cover', 'rounded-2xl', 'shadow-sm', 'border-4', 'border-white', 'absolute', '-bottom-4', '-right-4', 'lg:-bottom-6', 'lg:-right-6')}
                  whileHover={{ scale: 1.1, rotate: -2 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Floating Elements */}
              <div className={cn('absolute', 'top-8', 'right-8', 'w-16', 'h-16', 'bg-white', 'rounded-full', 'shadow-sm', 'flex', 'items-center', 'justify-center', 'opacity-90')}>
                <FaCheckCircle className={cn('text-2xl', 'text-green-500')} />
              </div>
              
              <div className={cn('absolute', 'bottom-8', 'left-8', 'w-20', 'h-20', 'bg-white', 'rounded-2xl', 'shadow-sm', 'flex', 'items-center', 'justify-center', 'opacity-90')}>
                <div className="text-center">
                  <p className={cn('text-xs', 'text-gray-500')}>Rating</p>
                  <p className={cn('font-bold', 'text-gray-900')}>5.0★</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className={cn('group', 'flex', 'items-start', 'gap-6', 'p-6', 'bg-white', 'rounded-3xl', 'shadow-sm', 'hover:shadow-sm', 'transition-all', 'duration-300', 'border', 'border-gray-100')}
                >
                  {/* Icon and Number */}
                  <div className={cn('flex-shrink-0', 'relative')}>
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={cn('text-white', 'text-xl')} />
                    </div>
                    <div className={cn('absolute', '-top-2', '-right-2', 'w-8', 'h-8', 'bg-white', 'rounded-full', 'shadow-md', 'flex', 'items-center', 'justify-center')}>
                      <span className={cn('text-xs', 'font-bold', 'text-gray-700')}>{feature.id}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-3', 'group-hover:text-blue-600', 'transition-colors', 'duration-300')}>
                      {feature.title}
                    </h3>
                    <p className={cn('text-gray-600', 'leading-relaxed')}>
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Arrow */}
                  <div className={cn('opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-300')}>
                    <div className={`w-8 h-8 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center`}>
                      <span className={cn('text-white', 'text-sm')}>→</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={cn('text-center', 'mt-16')}
        >
          <div className={cn('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'rounded-3xl', 'p-8', 'text-white', 'shadow-2xl')}>
            <h3 className={cn('text-2xl', 'font-bold', 'mb-4')}>Ready to Experience Excellence?</h3>
            <p className={cn('text-blue-100', 'mb-6', 'max-w-2xl', 'mx-auto')}>
              Join thousands of satisfied customers who trust Flyola for their aviation needs
            </p>
            <button className={cn('bg-white', 'text-blue-600', 'px-7', 'py-3', 'rounded-2xl', 'font-bold', 'text-lg', 'hover:bg-gray-100', 'transform', 'hover:scale-105', 'transition-all', 'duration-300', 'shadow-sm')}>
              Book Your Flight Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseFlyOla;