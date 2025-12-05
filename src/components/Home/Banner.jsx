"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FaHelicopter, FaPlane, FaRocket, FaStar } from "react-icons/fa";

const services = [
  {
    title: "Personal Charter",
    image: "/1.png",
    icon: FaPlane,
    description: "Luxury private jets for personal travel",

  },
  {
    title: "Helicopter Hire",
    image: "/2.png",
    icon: FaHelicopter,
    description: "Premium helicopter services",

  },
  {
    title: "Jet Hire",
    image: "/3.png",
    icon: FaRocket,
    description: "High-performance jet rentals",

  },
  {
    title: "Business Class Charter",
    image: "https://www.investopedia.com/thmb/Pl2WUBNKdZXV6_ioa1GsUnEyxws=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-First-Class-Seat-UPGRADEASK0223-41f98c66e49146deb5f986bc61a59135.jpg",
    icon: FaStar,
    description: "Executive business travel solutions",

  },
];

const PrivateJetRental = () => {
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
          <div className={cn('inline-flex', 'items-center', 'gap-2', 'bg-gradient-to-r', 'from-yellow-400', 'to-orange-400', 'text-black', 'px-6', 'py-2', 'text-sm', 'font-bold', 'rounded-full', 'shadow-lg', 'mb-6')}>
            <FaStar className="text-yellow-600" />
            Premium Aviation Services
          </div>
          
          <h2 className={cn('text-3xl', 'sm:text-4xl', 'lg:text-5xl', 'font-bold', 'text-gray-900', 'mb-6', 'leading-tight')}>
            Elevating Private Jet 
            <span className={cn('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'bg-clip-text', 'text-transparent')}> Rental Experience</span>
          </h2>
          
         
        </motion.div>

        {/* Services Grid */}
        <div className={cn('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4', 'gap-6', 'lg:gap-8')}>
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div className={cn('group', 'relative')} >
                <div className={cn('', 'rounded-sm', 'shadow-sm', 'overflow-hidden', 'border', 'border-gray-100')}>
                  {/* Image Container */}
                  <div className={cn('relative', 'overflow-hidden')}>
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className={cn('w-full', 'h-64', 'sm:h-72', 'object-cover',)}
                    />
                    
                    {/* Overlay */}
                    <div className={cn('absolute', 'inset-0', 'bg-gradient-to-t', 'from-black/50', 'via-transparent', 'to-transparent', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-300')}></div>
                    
                    {/* Icon Overlay */}
                    <div className={cn('absolute', 'top-4', 'right-4', 'opacity-0', 'translate-x-4', )}>
                      <div className={`w-12 h-12  rounded-full flex items-center justify-center shadow-lg`}>
                        <IconComponent className={cn('text-white', 'text-lg')} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className={cn('font-bold', 'text-xl', 'text-gray-900', 'mb-2', 'group-hover:text-blue-600', 'transition-colors', 'duration-300')}>
                      {service.title}
                    </h3>
                    <p className={cn('text-gray-600', 'text-sm', 'leading-relaxed')}>
                      {service.description}
                    </p>
                    
                    {/* Learn More Link */}
                  
                  </div>

                  {/* Hover Border Effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}></div>
                </div>
              </div>
            );
          })}
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
            <h3 className={cn('text-2xl', 'font-bold', 'mb-4')}>Ready to Experience Luxury Aviation?</h3>
            <p className={cn('text-blue-100', 'mb-6', 'max-w-2xl', 'mx-auto')}>
              Contact our aviation specialists today and discover how we can elevate your travel experience
            </p>
            <button className={cn('bg-white', 'text-blue-600', 'px-8', 'py-4', 'rounded-2xl', 'font-bold', 'text-lg', 'hover:bg-gray-100', 'transform', 'hover:scale-105', 'transition-all', 'duration-300', 'shadow-lg')}>
              Get Quote Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrivateJetRental;
