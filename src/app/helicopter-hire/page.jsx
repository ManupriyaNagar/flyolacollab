"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function HelicopterHirePage() {
  // Helicopter carousel data
  const helicopterSlides = [
    {
      title: "Luxury Sky Tour",
      description: "Experience breathtaking views from above",
      src: "/home/home4.jpeg",
      button: "Book Now",
    },
    {
      title: "City Escape",
      description: "Quick getaways over urban landscapes",
      src: "https://media.cnn.com/api/v1/images/stellar/prod/200102145651-uh-60-black-hawk.jpg?q=w_1600,h_1069,x_0,y_0,c_fill",
      button: "Reserve Flight",
    },
    {
      title: "Mountain Adventure",
      description: "Soar above majestic peaks",
      src: "https://images.stockcake.com/public/2/1/9/21947095-b369-4b2d-9b48-b62bff8fb8da_large/helicopter-over-mountains-stockcake.jpg",
      button: "Schedule Now",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Features data
  const features = [
    {
      title: "Luxury Fleet",
      description: "State-of-the-art helicopters with premium amenities",
      icon: "✈️",
    },
    {
      title: "Expert Pilots",
      description: "Certified professionals with years of experience",
      icon: "👨‍✈️",
    },
    {
      title: "Custom Routes",
      description: "Personalized flight paths for your needs",
      icon: "🗺️",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
        <div className="bg-gray-100 py-10 px-6 text-center ">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Helicopter Charter</h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
      Jet Serve Aviation offers swift and versatile helicopter charter services—ideal for short-distance travel, remote access, and scenic aerial experiences. With the same standard of luxury, safety, and precision, our helicopter charters provide unmatched flexibility for business, leisure, and emergency travel needs.
      </p>
      </div>
      {/* Hero Section with Carousel */}
      <section className="relative w-full h-[700px] bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="relative h-full">
          {helicopterSlides.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  {slide.title}
                </motion.h1>
                <p className="text-lg md:text-xl mb-6 text-gray-200">
                  {slide.description}
                </p>
                <button className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300 border border-white/30">
                  {slide.button}
                </button>
              </div>
            </motion.div>
          ))}

          {/* Navigation Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
            {helicopterSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-white scale-125" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose Our Helicopter Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Flight?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Book your helicopter experience today and soar to new heights with
            unparalleled luxury and convenience.
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}