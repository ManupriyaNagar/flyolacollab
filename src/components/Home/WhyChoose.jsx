"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Trophy, MousePointer2, BadgePercent, PhoneCall } from "lucide-react";

const features = [
  {
    title: "Easy Booking",
    description: "Streamlined booking process with instant confirmations and secure payments. Experience hassle-free flight reservations in just a few clicks.",
    icon: MousePointer2,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Best Price Guarantee",
    description: "We offer competitive rates on all our listings, ensuring you get the best value for your journey.",
    icon: BadgePercent,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "24/7 Support",
    description: "Our customer support team is here to help you anytime, anywhere.",
    icon: PhoneCall,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
  },
];

const WhyChooseFlyOla = () => {
  return (
    <section className={cn('py-12 px-4 md:py-24 bg-slate-50/50 relative overflow-hidden')}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-slate-200 bg-white shadow-sm mb-8"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-sm font-semibold text-slate-600">Here's Why</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 tracking-tight"
          >
            Why Flyola?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
          >
            Experience premium aviation services with our comprehensive suite of
            features designed for modern travelers
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Main Hero Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#0033ff] p-10 rounded-[2.5rem] text-white flex flex-col justify-end min-h-[380px] shadow-2xl shadow-blue-200/50 group hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-auto group-hover:scale-110 transition-transform">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-3xl font-bold leading-[1.2] tracking-tight">
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
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[380px]"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8", feature.bgColor)}>
                <feature.icon className={cn("w-7 h-7", feature.iconColor)} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-lg">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseFlyOla;