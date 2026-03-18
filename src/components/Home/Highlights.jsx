"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Ticket } from 'lucide-react';

const featuredFlights = [
  {
    from: "Bhopal",
    to: "Jabalpur",
    date: "04 Apr, 2024",
    status: "Available",
    image: "/flights/jabalpur.svg",
    title: "JABALPUR",
    tagline: "CITY OF MARBLE ROCKS"
  },
  {
    from: "Jabalpur",
    to: "Bhopal",
    date: "06 Apr, 2024",
    status: "Available",
    image: "/flights/bhopal.svg",
    title: "BHOPAL",
    tagline: "CITY OF LAKES"
  },
  {
    from: "Satna",
    to: "Indore",
    date: "07 Apr, 2024",
    status: "Available",
    image: "/flights/indore.svg",
    title: "INDORE",
    tagline: "CLEANEST CITY OF INDIA"
  },
  {
    from: "Bhopal",
    to: "Khajuraho",
    date: "04 Apr, 2024",
    status: "Available",
    image: "/flights/khajuraho.svg",
    title: "KHAJURAHO",
    tagline: "CITY OF TEMPLES"
  },
  {
    from: "Jabalpur",
    to: "Gwalior",
    date: "06 Apr, 2024",
    status: "Available",
    image: "/flights/gwalior.svg",
    title: "GWALIOR",
    tagline: "CITY OF MUSIC"
  },
  {
    from: "Satna",
    to: "Rewa",
    date: "07 Apr, 2024",
    status: "Available",
    image: "/flights/rewa.svg",
    title: "REWA",
    tagline: "LAND OF WHITE TIGER"
  }
];

const AviationHighlights = () => {
  return (
    <section className="py-4 bg-slate-100">
      <div className="px-4 sm:px-6 lg:px-18">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <span className="w-3 h-3 rounded-full bg-slate-900"></span>
              <span className="text-sm font-medium">Recommendation</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-4xl font-semibold text-slate-900 tracking-tight max-w-xl">
              Popular flights near your location available now.
            </h1>
          </div>

          <button className="flex items-center gap-2 bg-[#FD9931] text-white px-6 py-2 rounded-full font-light transition-colors">
            See More <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Flight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredFlights.map((flight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              {/* Collage Image Container */}
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden flex">
                {/* Simulated Collage with masking or just one image with text overlays */}
                <div className="relative w-full h-full">
                  <img
                    src={flight.image}
                    alt={flight.title}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Flight Info */}
              <div className="px-1 -mt-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-light text-lg text-slate-800">{flight.from}</span>
                    <span className="text-orange-500">✈</span>
                    <span className="font-light text-lg text-slate-800">{flight.to}</span>
                  </div>
                  <span className="text-sm font-light text-blue-600">{flight.date}</span>
                </div>

                <p className="text-xs font-light text-emerald-600">{flight.status}</p>

                <button className="flex items-center gap-2 bg-[#f1f5f9] border hover:bg-blue-600 hover:text-white transition-all duration-300 px-4 py-2 rounded-full text-slate-700 font-light mt-4">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <img src="/flights/bttn.svg" alt="" />
                  </div>
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AviationHighlights;