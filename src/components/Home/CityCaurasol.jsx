"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPlane } from "react-icons/fa";

const cities = [
  { code: "BHO", image: "/f1.png", name: "Raja Bhoj Airport", city: "Bhopal" },
  { code: "JLR", image: "/f2.png", name: "Jabalpur Airport", city: "Jabalpur" },
  { code: "HJR", image: "/f3.png", name: "Khajuraho Airport", city: "Khajuraho" },
  { code: "GWL", image: "/f4.png", name: "Gwalior Airport", city: "Gwalior" },
  { code: "IDR", image: "/f5.png", name: "Devi Ahilyabai Holkar Airport", city: "Indore" },
  { code: "SGR", image: "/f6.png", name: "Singrauli Airport", city: "Singrauli" },
  { code: "REW", image: "/f7.png", name: "Rewari Airport", city: "Rewari" },
  { code: "UJN", image: "/f8.png", name: "Ujjain Airport", city: "Ujjain" },
  { code: "TNI", image: "/f9.png", name: "Bharhut Airport Satna", city: "Satna" },
];

// Double the cities array for seamless looping
const infiniteCities = [...cities, ...cities];

export default function CityCarousel() {
  return (
    <section className="py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-300 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-indigo-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-purple-300 rounded-full"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-6 py-2 text-sm font-bold rounded-full shadow-sm mb-6">
            <FaMapMarkerAlt className="text-blue-600" />
            Popular Destinations
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Next
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Destination</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our extensive network of premium airports and destinations. From business hubs to leisure getaways,
            we connect you to the places that matter most.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <motion.div
            className="flex gap-6 pl-6"
            animate={{
              x: [0, -cities.length * 280], // Adjusted based on card width + gap
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {infiniteCities.map((city, index) => (
              <motion.div
                key={`${city.code}-${index}`}
                className="flex-shrink-0 w-64 md:w-72"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-xl border border-white/50 group bg-white">
                  <Image
                    src={city.image}
                    alt={`${city.name} (${city.code})`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    quality={85}
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Top Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <FaPlane className="text-blue-600 text-sm" />
                    <span className="text-xs font-semibold text-gray-800">{city.code}</span>
                  </div>

                  {/* City Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-blue-400 text-sm" />
                      <span className="text-sm font-medium text-blue-200">{city.city}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
                      {city.name}
                    </h3>

                    {/* Hover Button */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg">
                        Book Flight →
                      </button>
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}