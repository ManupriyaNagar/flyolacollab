"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const services = [
  {
    title: "Personal Charter",
    image: "#",
    description:
      "Luxury private jets for personal travel with maximum comfort and privacy.",
  },
  {
    title: "Helicopter Hire",
    image: "#",
    description:
      "Premium helicopter services for point-to-point urban travel and sightseeing.",
  },
  {
    title: "Jet Hire",
    image: "#",
    description:
      "High-performance jet rentals for long-range travel at supersonic speeds.",
  },
  {
    title: "Business Class Charter",
    image: "#",
    description:
      "Executive business travel solutions designed for productivity and efficiency.",
  },
];

const CARD_WIDTH = 350; // 👈 control card width
const HALF_CARD = CARD_WIDTH / 2;

const PrivateJetRental = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = CARD_WIDTH + 24; // card width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-4 bg-slate-100 overflow-hidden relative">
      <div className="px-6 lg:px-18">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 lg:px-18 px-4 gap-4">
          <h1 className="text-4xl md:text-5xl lg:text-4xl font-semibold text-slate-900 tracking-tight">
            Elevating Private Jet Rental Experience
          </h1>

          <div className="flex items-center gap-3">
            {/* Desktop Navigation Tags - Hidden on small screens if needed, but let's keep it */}
            <div className="hidden sm:block px-5 py-2 rounded-xl bg-[#F6A149] text-white text-sm whitespace-nowrap">
              Premium Aviation Services
            </div>

            {/* Navigation Buttons for Mobile/Tab */}
            <div className="flex gap-2 lg:hidden">
              <button
                onClick={() => scroll("left")}
                className="p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
                aria-label="Scroll Left"
              >
                <ChevronLeft size={20} className="text-slate-700" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
                aria-label="Scroll Right"
              >
                <ChevronRight size={20} className="text-slate-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar px-4 lg:px-18 scroll-smooth"
        >
          <div
            className="flex gap-6 snap-x snap-mandatory"
            style={{
              paddingRight: `${HALF_CARD}px`, // 👈 THIS creates half visible last card
            }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="snap-start bg-white rounded-2xl p-5 border border-slate-100 flex flex-col shrink-0 shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ width: `${CARD_WIDTH}px` }} // 👈 fixed width
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.01 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  whileHover: { duration: 0.2 }
                }}
              >
                {/* Image */}
                <div className="aspect-[5/4] rounded-2xl bg-slate-100 overflow-hidden mb-5">
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Content */}
                <span className="text-xs font-medium text-[#F6A149] mb-2 uppercase tracking-wider">
                  Premium Aviation Services • India
                </span>

                <h3 className="font-bold text-xl text-gray-800 mb-2">
                  {service.title}
                </h3>

                <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                  {service.description}
                </p>

                <button className="text-sm font-bold text-slate-900 underline underline-offset-4 decoration-[#F6A149]/30 hover:decoration-[#F6A149] text-start transition-all cursor-pointer">
                  Know More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </section>
  );
};

export default PrivateJetRental;