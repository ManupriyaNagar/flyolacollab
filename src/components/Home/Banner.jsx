"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Plane, Fan, Rocket, Star, ArrowRight } from "lucide-react";

const services = [
  {
    title: "Personal Charter",
    image: "/1.png",
    icon: Plane,
    description: "Luxury private jets for personal travel with maximum comfort and privacy.",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Helicopter Hire",
    image: "/2.png",
    icon: Fan,
    description: "Premium helicopter services for point-to-point urban travel and sightseeing.",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Jet Hire",
    image: "/3.png",
    icon: Rocket,
    description: "High-performance jet rentals for long-range travel at supersonic speeds.",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Business Charter",
    image: "https://www.investopedia.com/thmb/Pl2WUBNKdZXV6_ioa1GsUnEyxws=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-First-Class-Seat-UPGRADEASK0223-41f98c66e49146deb5f986bc61a59135.jpg",
    icon: Star,
    description: "Executive business travel solutions designed for productivity and efficiency.",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

const PrivateJetRental = () => {
  return (
    <section className={cn('py-16 md:py-24 bg-white relative overflow-hidden')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-100 bg-amber-50 shadow-sm mb-8"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-amber-700">Premium Aviation Services</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 tracking-tight"
          >
            Elevating Your
            <span className="text-blue-600"> Rental Experience</span>
          </motion.h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* floating icon */}
                <div className={cn("absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg group-hover:scale-110 transition-transform", service.bgColor)}>
                  <service.icon className={cn("w-6 h-6", service.iconColor)} />
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="font-bold text-2xl text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-base mb-6">
                  {service.description}
                </p>
                <button className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all duration-300">
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Unified CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 md:mt-32"
        >
          <div className="relative bg-[#0033ff] rounded-[3rem] p-10 md:p-16 text-white overflow-hidden shadow-2xl shadow-blue-200">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-center md:text-left">
                <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                  Ready to Experience Luxury Aviation?
                </h3>
                <p className="text-blue-100 text-lg md:text-xl max-w-2xl leading-relaxed">
                  Join exclusive travelers who trust Flyola for their global journey.
                  Every detail is curated for your perfection.
                </p>
              </div>
              <button className="whitespace-nowrap bg-white text-blue-600 px-10 py-5 rounded-[2rem] font-bold text-xl hover:bg-slate-50 transform hover:scale-105 transition-all duration-300 shadow-xl">
                Get Your Quote
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrivateJetRental;
