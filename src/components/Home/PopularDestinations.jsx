"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaMapMarkerAlt, FaStar, FaPlane, FaArrowRight } from "react-icons/fa";
import { cn } from "@/lib/utils";

const destinations = [
  {
    image: "/f2.png",
    name: "Jabalpur",
    code: "JLR",
    description: "Gateway to Marble Rocks",
    rating: 4.8,
    flights: "12 flights/week",
    tilt: -10,
    zIndex: 1,

  },
  {
    image: "/f6.png",
    name: "Singrauli",
    code: "SGR",
    description: "Industrial Hub",
    rating: 4.6,
    flights: "8 flights/week",
    tilt: 5,
    zIndex: 2,

  },
  {
    image: "/f5.png",
    name: "Indore",
    code: "IDR",
    description: "Commercial Capital",
    rating: 4.9,
    flights: "20 flights/week",
    tilt: 0,
    zIndex: 3,

  },
  {
    image: "/f4.png",
    name: "Gwalior",
    code: "GWL",
    description: "Historic Fort City",
    rating: 4.7,
    flights: "15 flights/week",
    tilt: -5,
    zIndex: 2,

  },


];

export default function PopularDestinations() {
  return (
    <section className={cn('py-16', 'lg:py-24', 'bg-gradient-to-br', 'from-gray-50', 'via-white', 'to-blue-50', 'relative', 'overflow-hidden')}>
  

      <div className={cn('px-4', 'sm:px-6', 'lg:px-8', 'relative', 'z-10')}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn('text-center', 'mb-16')}
        >
          <div className={cn('inline-flex', 'items-center', 'gap-2', 'bg-gradient-to-r', 'from-purple-100', 'to-pink-100', 'text-purple-800', 'px-6', 'py-2', 'text-sm', 'font-bold', 'rounded-full', 'shadow-sm', 'mb-6')}>
            <FaMapMarkerAlt className="text-purple-600" />
            Top Destinations
          </div>
          
          <h2 className={cn('text-3xl', 'sm:text-4xl', 'lg:text-5xl', 'font-bold', 'text-gray-900', 'mb-6', 'leading-tight')}>
            Popular 
            <span className={cn('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'bg-clip-text', 'text-transparent')}> Destinations</span>
          </h2>
          
          <p className={cn('text-lg', 'text-gray-600', 'max-w-3xl', 'mx-auto', 'leading-relaxed')}>
            Discover the most sought-after destinations in our network. From historic cities to modern business hubs, 
            explore where Flyola can take you next.
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <div className={cn('relative', 'flex', 'flex-wrap', 'justify-center', 'items-center', 'gap-8', 'lg:gap-14', 'mb-16' ) }>
          {destinations.map((destination, index) => (
            <motion.div
       
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn('group', 'relative', 'w-72', 'h-auto', 'bg-white', 'rounded-xl', 'shadow-md', 'overflow-hidden', 'border', 'border-gray-100')}
              style={{
                zIndex: destination.zIndex,
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              {/* Image Container */}
              <div className={cn('relative', 'w-full', 'h-64', 'overflow-hidden')}>
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className={cn('object-cover', 'transition-transform', 'duration-700', 'group-hover:scale-110')}
                  quality={85}
                />
                
                {/* Overlay Gradient */}
                <div className={cn('absolute', 'inset-0', 'bg-gradient-to-t', 'from-black/60', 'via-transparent', 'to-transparent')}></div>
                
                {/* Top Badges */}
                <div className={cn('absolute', 'top-4', 'left-4', 'right-4', 'flex', 'justify-between', 'items-start')}>
                  <div className={`text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                    {destination.code}
                  </div>
                  <div className={cn('bg-white/90', 'backdrop-blur-sm', 'rounded-full', 'px-3', 'py-1', 'flex', 'items-center', 'gap-1')}>
                    <FaStar className={cn('text-yellow-500', 'text-sm')} />
                    <span className={cn('text-sm', 'font-semibold', 'text-gray-800')}>{destination.rating}</span>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className={cn('absolute', 'bottom-4', 'left-4', 'right-4', 'text-white')}>
                  <h3 className={cn('text-xl', 'font-bold', 'mb-1')}>{destination.name}</h3>
                  <p className={cn('text-sm', 'text-blue-200', 'mb-2')}>{destination.description}</p>
                  <div className={cn('flex', 'items-center', 'gap-2')}>
                    <FaPlane className={cn('text-blue-400', 'text-sm')} />
                    <span className="text-sm">{destination.flights}</span>
                  </div>
                </div>
              </div>

              {/* Hover Border Effect */}

            </motion.div>
          ))}
        </div>









        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={cn('grid', 'grid-cols-1', 'sm:grid-cols-3', 'gap-8', 'mb-16')}
        >
          <div className="text-center">
            <div className={cn('w-16', 'h-16', 'bg-gradient-to-r', 'from-blue-500', 'to-indigo-600', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mx-auto', 'mb-4')}>
              <FaMapMarkerAlt className={cn('text-white', 'text-2xl')} />
            </div>
            <h3 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'mb-2')}>50+</h3>
            <p className="text-gray-600">Destinations Covered</p>
          </div>
          
          <div className="text-center">
            <div className={cn('w-16', 'h-16', 'bg-gradient-to-r', 'from-green-500', 'to-emerald-600', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mx-auto', 'mb-4')}>
              <FaPlane className={cn('text-white', 'text-2xl')} />
            </div>
            <h3 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'mb-2')}>200+</h3>
            <p className="text-gray-600">Weekly Flights</p>
          </div>
          
          <div className="text-center">
            <div className={cn('w-16', 'h-16', 'bg-gradient-to-r', 'from-purple-500', 'to-pink-600', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mx-auto', 'mb-4')}>
              <FaStar className={cn('text-white', 'text-2xl')} />
            </div>
            <h3 className={cn('text-3xl', 'font-bold', 'text-gray-900', 'mb-2')}>4.8</h3>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <div className={cn('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'rounded-3xl', 'p-8', 'text-white', 'shadow-2xl')}>
            <h3 className={cn('text-2xl', 'font-bold', 'mb-4')}>Ready to Explore These Destinations?</h3>
            <p className={cn('text-blue-100', 'mb-6', 'max-w-7xl', 'mx-auto')}>
              Book your next adventure with Flyola and discover the beauty of these amazing destinations
            </p>
            <button className={cn('bg-white', 'text-blue-600', 'px-8', 'py-4', 'rounded-2xl', 'font-bold', 'text-lg', 'hover:bg-gray-100', 'transform', 'hover:scale-105', 'transition-all', 'duration-300', 'shadow-lg')}>
              Start Your Journey
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}