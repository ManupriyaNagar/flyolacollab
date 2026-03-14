"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Utensils,
  Coffee,
  MonitorPlay,
  LayoutGrid,
  Clock
} from "lucide-react";

/**
 * Vehicle Details Component
 * Displays flight/helicopter information with a premium UI
 */
export default function VehicleDetails({
  bookingType = "flight",
  departure,
  arrival,
  date,
  departureTime,
  arrivalTime,
  price = "7,000",
  flightNumber = "SA 8092",
  cabinClass = "Business",
  departureCode,
  arrivalCode,
  duration = "1h 50min",
  seatsRemaining = 6
}) {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Fallback codes if not provided
  const dCode = departureCode || (departure ? departure.substring(0, 3).toUpperCase() : "DEP");
  const aCode = arrivalCode || (arrival ? arrival.substring(0, 3).toUpperCase() : "ARR");

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: 'numeric',
    month: 'short',
    weekday: 'short'
  });

  const amenities = [
    { label: "Flyola 737", icon: <img src="/flights/flight_takeoff.svg" alt="" className="w-5 h-5" /> },
    { label: "Meal Included", icon: <Utensils size={18} /> },
    { label: "Beverages Included", icon: <Coffee size={18} /> },
    { label: "On-demand video", icon: <MonitorPlay size={18} /> },
    { label: "2-2 layout", icon: <LayoutGrid size={18} /> }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 lg:space-y-8 md:space-y-0 space-y-2 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-1">
              <img src="/flights/Layer_1.png" alt="Flyola" className="lg:w-6 md:w-4 lg:h-6 md:h-4 w-4 h-4" />
              <span className="font-light lg:text-xl md:text-md text-gray-900 tracking-tight">Flyola</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-gray-400 lg:text-sm md:text-xs uppercase tracking-widest">{flightNumber}</span>
              <span className="bg-[#10B981] text-white lg:text-[10px] md:text-[8px] text-[6px] px-2.5 py-1 rounded-md font-medium uppercase tracking-widest shadow-sm">{cabinClass}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-red-500 font-medium lg:text-3xl md:text-lg text-xl tracking-tight">
            INR {price}<span className="lg:text-sm md:text-xs font-light text-gray-400 ml-1">/pax</span>
          </div>
          <div className="text-gray-300 lg:text-sm md:text-xs text-xs line-through font-light mt-1">
            INR {typeof price === 'string' ? Math.round(parseFloat(price.replace(/,/g, '')) * 1.2).toLocaleString() : Math.round(price * 1.2).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col lg:flex-row md:flex-col justify-between gap-6">
        <div className="flex-1 flex items-center gap-6 py-6 bg-white rounded-3xl">
          <div className="flex flex-col items-center">
            <span className="lg:text-3xl md:text-xl text-lg font-medium text-gray-900 tracking-tighter">{departureTime}</span>
            <span className="text-xs text-gray-400 font-light uppercase tracking-widest">{dCode}</span>
          </div>

          <div className="flex-1 flex flex-col items-center min-w-[120px]">
            <div className="relative w-full flex items-center justify-center">
              <div className="absolute w-full border-t-[2px] border-dotted border-gray-200" />
              <div className="relative z-10 w-full flex justify-between">
                <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" />
                <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" />
              </div>
              <div className="absolute bg-white px-4">
                <img src="/flights/flight_takeoff.svg" alt="plane" className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex gap-4 mt-3 whitespace-nowrap">
              <span className="text-[12px] text-gray-400 font-light">{duration}</span>
              <span className="text-[12px] text-gray-400 font-light tracking-tight">• Direct Flight</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="lg:text-3xl md:text-xl text-lg font-medium text-gray-900 tracking-tighter">{arrivalTime}</span>
            <span className="text-xs text-gray-400 font-light uppercase tracking-widest">{aCode}</span>
          </div>
        </div>

        <div className="flex flex-row justify-end items-end gap-2 lg:mt-10 md:-mt-6">
          <div className="text-red-500 text-xs font-light tracking-wider">{seatsRemaining} seats remaining</div>
          <div>
            <button
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="flex items-center text-sky-400 text-xs hover:text-sky-500 transition-colors">
              See Details
              <ChevronDown className={cn("transition-transform duration-300 h-4 w-4 ml-1", isDetailsExpanded && "rotate-180")} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isDetailsExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-50 pt-8 mt-4">
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-6 md:space-y-8 relative">
                  {/* Vertical Timeline */}
                  <div className="absolute left-[72px] md:left-[92px] top-[14px] bottom-[14px] w-px border-l-[2px] border-dotted border-gray-200" />

                  <div className="flex items-start gap-4 md:gap-8">
                    <div className="flex flex-col items-center gap-1 w-14 shrink-0">
                      <span className="font-medium text-gray-900 lg:text-xl md:text-lg text-sm tracking-tighter">{departureTime}</span>
                      <span className="text-[10px] text-gray-400 font-light uppercase tracking-widest text-center">{formattedDate}</span>
                    </div>
                    <div className="mt-2 w-2.5 h-2.5 rounded-full bg-gray-100 z-10 border border-white shrink-0" />

                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900 tracking-tight text-sm md:text-base">{departure} ({dCode})</span>
                      </div>
                    </div>
                  </div>

                  <div className="pl-[88px] md:pl-[128px]">
                    <div className="text-[8px] text-gray-400 font-medium uppercase px-3 py-1.5 md:px-4 md:py-2 bg-gray-50 rounded-full w-fit flex items-center gap-2">
                      <Clock size={8} />
                      {duration}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 md:gap-8">
                    <div className="flex flex-col items-center gap-1 w-14 shrink-0">
                      <span className="font-medium text-gray-900 lg:text-xl md:text-lg text-sm tracking-tighter">{arrivalTime}</span>
                      <span className="text-[10px] text-gray-400 font-light uppercase tracking-widest text-center">{formattedDate}</span>
                    </div>
                    <div className="mt-2 w-2.5 h-2.5 rounded-full bg-gray-100 z-10 border border-white shrink-0" />

                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900 tracking-tight text-sm md:text-base">{arrival} ({aCode})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-start md:items-end gap-3 md:gap-0">
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4 md:hidden">Flight Amenities</div>
                  {amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center md:justify-end group gap-3 w-full md:w-auto">
                      <span className="text-gray-600 font-light text-sm tracking-tight order-2 md:order-1">{item.label}</span>
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 group-hover:text-blue-600 transition-all order-1 md:order-2 shrink-0">
                        {item.icon}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
