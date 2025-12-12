"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaGlobeAmericas, FaPhone, FaPlane, FaStar, FaWhatsapp } from "react-icons/fa";

// Reusable Motion Wrapper
const MotionFade = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

// Reusable Image Card
const ImageCard = ({
  image,
  title,
  desc,
  badge,
  icon: Icon,
  gradientFrom,
  gradientTo,
  iconFrom,
  iconTo,
  direction,
  cta,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "left" ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="group relative w-full"
    >
      <div className="relative overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-lg">
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10",
            `bg-gradient-to-br from-${gradientFrom}/20 to-${gradientTo}/20`
          )}
        />

        <div className="relative w-full h-[350px] sm:h-[300px] lg:h-[380px]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover w-full"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <div className="flex items-center gap-3 mb-3">
           
          
          </div>

        </div>

        <div
          className={cn(
            "absolute top-4 sm:top-6 right-4 sm:right-6 px-4 py-2 rounded-full font-bold text-xs sm:text-sm shadow-sm z-20",
            `bg-gradient-to-r from-${gradientFrom} to-${gradientTo}`,
            gradientFrom.includes("yellow") ? "text-black" : "text-white"
          )}
        >
          {badge}
        </div>
      </div>
    </motion.div>
  );
};

// Card Data Array
const cardData = [
  {
    image: "/image1.jpg",
    title: "Premium Flights",
    desc: "Experience luxury travel with our state-of-the-art aircraft and world-class service",
    badge: "Featured",
    icon: FaPlane,
    gradientFrom: "yellow-400",
    gradientTo: "orange-500",
    iconFrom: "blue-400",
    iconTo: "cyan-500",
    direction: "left",
    cta: "Learn More",
  },
  {
    image: "/image2.jpg",
    title: "Global Reach",
    desc: "Connect to destinations worldwide with our extensive network and seamless service",
    badge: "Popular",
    icon: FaGlobeAmericas,
    gradientFrom: "indigo-400",
    gradientTo: "purple-500",
    iconFrom: "indigo-400",
    iconTo: "purple-500",
    direction: "right",
    cta: "Explore Routes",
  },
];

const ImageShowcase = () => {
  return (
    <section className="py-16 lg:py-20 bg-white relative overflow-hidden">
      {/* Background visuals */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
      </div>

      <div className=" mx-auto px-4 sm:px-4 lg:px-16 relative z-10">
        {/* Header */}
        <MotionFade>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 text-sm font-bold rounded-full shadow-sm mb-6">
              <FaStar className="text-yellow-700" />
              Discover Your Journey
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Experience the World from
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block mt-2">
                New Heights
              </span>
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Embark on unforgettable adventures with our premium aviation services
            </p>
          </div>
        </MotionFade>

        {/* Dynamic Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {cardData.map((card, index) => (
            <ImageCard key={index} {...card} />
          ))}
        </div>

        {/* CTA Section */}
        <MotionFade delay={0.4}>
          <div className="text-center mt-12 lg:mt-16">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12 border border-gray-200 shadow-sm">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Ready to Take Off?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
                Book your next journey with us and experience the difference
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+919870500422"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-sm hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <FaPhone className="text-base" />
                  Book Now - Call Us
                </a>
                <a 
                  href="https://wa.me/919870500422"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-900 px-8 py-4 rounded-full font-bold text-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105 transition-all duration-300"
                >
                  <FaWhatsapp className="text-green-500 text-xl" />
                  Contact on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </MotionFade>
      </div>
    </section>
  );
};

export default ImageShowcase;
