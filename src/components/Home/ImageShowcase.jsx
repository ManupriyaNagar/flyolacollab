"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Destination Overview",
    image: "/image1.jpg",
    heading: "Madhya Pradesh",
    description:
      "Duration: 1 Night / 2 Days Jabalpur → Bandhavgarh → Jabalpur",
    price: "₹25,000 onwards per person",
  },
  {
    id: "02",
    title: "Flight Booking",
    image: "/image2.jpg",
    heading: "Flight Booking",
    description:
      "Duration: 2 Night / 3 Days Jabalpur → Bandhavgarh → Kanha → Jabalpur ",
    price: "₹40,000 onwards per person",
  },
  {
    id: "03",
    title: "Enjoy Your Trip",
    image: "/home/tour.jpg",
    heading: "Luxury Experience",
    description:
      "Duration: 1 Day same day tour Jabalpur → Maihar → Jabalpur",
    price: "₹14,000 onwards per person",
  },
];

const ImageShowcase = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-16 md:py-10 bg-white overflow-hidden">
      <div className="px-4  lg:px-16">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border bg-white mb-6">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
            <span className="text-sm font-medium text-gray-700">
              Discover Your Journey
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">
            Experience the World from <br /> New Heights
          </h1>

          <p className="text-gray-500 max-w-xl mx-auto">
            Embark on unforgettable adventures with our premium aviation services
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT IMAGE (CHANGES) */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden h-full">
            <img
              key={steps[activeStep].image}
              src={steps[activeStep].image}
              alt=""
              className="w-full h-full object-cover"

            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-4">

            {/* INFO CARD (CHANGES) */}
            <div
              key={activeStep}
              className="bg-black text-white rounded-2xl px-6 py-5"

            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                  {steps[activeStep].heading}
                </h3>
                <ChevronUp size={18} />
              </div>

              <p className="text-sm opacity-80 mb-2">
                {steps[activeStep].description}
              </p>

              <p className="text-sm mb-4">
                STARTING AT: {steps[activeStep].price}
              </p>

              <button className="bg-white text-black px-4 py-2 rounded-full text-sm">
                Book Now
              </button>
            </div>

            {/* STEP BUTTONS */}
            {steps.map((step, index) => {
              const nextIndex = (activeStep + 1) % steps.length;
              if (index === nextIndex) {
                return (
                  <div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setActiveStep(index)}
                    className="cursor-pointer bg-white rounded-2xl p-8 border border-gray-100 flex flex-col justify-between h-52 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <span className="text-gray-200 text-6xl font-light tracking-tighter group-hover:text-blue-100 transition-colors">
                      {step.id}
                    </span>
                    <h4 className="text-gray-900 text-2xl font-medium">
                      {step.title}
                    </h4>
                  </div>
                );
              }
              return null;
            })}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageShowcase;