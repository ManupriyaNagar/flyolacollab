"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { FaPlane, FaGlobe, FaCompass, FaHeadset } from "react-icons/fa";
import { cn } from "@/lib/utils";



const features = [
  {
    icon: FaPlane,
    title: "Easy Booking",
    description:
      "Streamlined booking process with instant confirmations and secure payments. Experience hassle-free flight reservations in just a few clicks.",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
    delay: 0.1,
  },
  {
    icon: FaGlobe,
    title: "Global Destinations",
    description:
      "Access to premium destinations worldwide with our extensive network of aviation partners and exclusive routes.",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
    delay: 0.2,
  },
  {
    icon: FaCompass,
    title: "Expert Guidance",
    description:
      "Professional travel consultation and personalized flight recommendations tailored to your specific needs and preferences.",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
    delay: 0.3,
  },
  {
    icon: FaHeadset,
    title: "24/7 Support",
    description:
      "Round-the-clock customer support with dedicated aviation specialists ready to assist you at every step of your journey.",
     iconBg: "bg-blue-600",
    iconColor: "text-white",
    delay: 0.4,
  },
];

const FeatureCards = memo(() => {
  return (
    <section className={cn(
      "py-16 lg:py-24",
      "bg-gradient-to-br from-gray-50 to-white",
      "relative overflow-hidden"
    )}>
      <div className={cn("px-4 sm:px-6 lg:px-8 relative z-10")}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn("text-center mb-16")}
        >
          <h2 className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-bold",
            "bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4"
          )}>
            Why Flyola?
          </h2>
          <p className={cn("text-lg text-gray-600 max-w-2xl mx-auto")}>
            Experience premium aviation services with our comprehensive suite of features designed for modern travelers
          </p>
        </motion.div>

        <div className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
          "gap-6 lg:gap-8"
        )}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={cn('group', 'relative')}
              >
<div
  className={cn('p-8', 'rounded-sm', 'shadow-md', 'border', 'border-white/50', 'backdrop-blur-sm', 'h-full', 'flex', 'flex-col', 'bg-cover', 'bg-center' )}

>
<div className={cn('absolute', 'inset-0', 'bg-gradient-to-br', 'from-black-300/10', 'to-transparent', 'rounded-sm')}></div>

                  <div className={cn('relative', 'mb-6' )}>
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ",
                      feature.iconBg
                    )}>
                      <IconComponent className={cn("text-2xl", feature.iconColor)} />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className={cn('text-xl', 'lg:text-2xl', 'font-bold', 'text-gray-900', 'mb-4')}>
                      {feature.title}
                    </h3>
                    <p className={cn('text-gray-600', 'leading-relaxed', 'text-sm', 'lg:text-base')}>
                      {feature.description}
                    </p>
                  </div>

                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent",
                    "rounded-3xl opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-300 pointer-events-none"
                  )} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

FeatureCards.displayName = "FeatureCards";

export default FeatureCards;
