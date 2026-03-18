"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const features = [
  {
    title: "Easy Booking",
    description: "Streamlined booking process with instant confirmations and secure payments. Experience hassle-free flight reservations in just a few clicks.",
    icon: "/flights/frame2.svg",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Best Price Guarantee",
    description: "We offer competitive rates on all our listings, ensuring you get the best value for your journey.",
    icon: "/flights/frame3.svg",
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "24/7 Support",
    description: "Our customer support team is here to help you anytime, anywhere.",
    icon: "/flights/frame4.svg",
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
  },
];

const WhyChooseFlyOla = () => {
  return (
    <section className={cn('py-12 md:py-4 bg-slate-100 relative overflow-hidden')}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-slate-200 bg-white mb-8"
          >
            <span className="w-4.5 h-4.5 rounded-full bg-blue-600" />
            <span className="text-sm font-semibold text-slate-600">Here's Why</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-4xl font-semibold text-slate-900 mb-4 tracking-tight"
          >
            Why Flyola?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#020000] max-w-2xl mx-auto text-lg md:text-lg"
          >
            Experience premium aviation services with our comprehensive suite of
            features designed for modern travelers
          </motion.p>
        </div>

        {/* Cards Grid */}

      </div>
      <div className="bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-18">
        {/* Main Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#0033ff] p-6 rounded-2xl text-white flex flex-col justify-end group hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex mb-auto transition-transform">
            <img src="/flights/frame1.svg" alt="" />
          </div>
          <h3 className="text-3xl font-semibold">
            Why Choose Us for Your Travel Plans?
          </h3>
        </motion.div>

        {/* Feature Cards */}
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div className={cn("w-14 h-14 flex items-center justify-center mb-4")}>
              <img src={feature.icon} alt={feature.title} className="" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 tracking-tight">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseFlyOla;