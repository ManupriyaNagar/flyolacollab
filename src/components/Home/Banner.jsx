"use client";

import { motion } from "framer-motion";

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
  return (
    <section className="py-4 bg-slate-100 overflow-hidden">
      <div className="px-6 lg:px-18">

        {/* Header */}
        <div className="flex justify-between items-center mb-10 px-18">
          <h1 className="text-4xl md:text-5xl lg:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">
            Elevating Private Jet Rental Experience
          </h1>

          <div className="px-5 py-2 rounded-xl bg-[#F6A149] text-white text-sm">
            Premium Aviation Services
          </div>
        </div>

        {/* Scroll Container */}
        <div className="overflow-x-auto no-scrollbar px-18">
          <div
            className="flex gap-6 snap-x snap-mandatory"
            style={{
              paddingRight: `${HALF_CARD}px`, // 👈 THIS creates half visible last card
            }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="snap-start bg-white rounded-xl p-5 border border-slate-100 flex flex-col shrink-0"
                style={{ width: `${CARD_WIDTH}px` }} // 👈 fixed width
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Image */}
                <div className="aspect-[5/4] rounded-2xl bg-slate-100 overflow-hidden mb-5">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Content */}
                <span className="text-xs text-gray-500 mb-2">
                  Premium Aviation Services • India
                </span>

                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {service.title}
                </h3>

                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  {service.description}
                </p>

                <button className="text-sm font-semibold underline text-start">
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
      `}</style>
    </section>
  );
};

export default PrivateJetRental;