"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function TravellersClassSelector({
  passengerData,
  handlePassengerChange,
  totalPassengers,
  travelClass,
  setTravelClass,
  delay = 0.8,
  serviceType = "flights"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const buttonColor = serviceType === "helicopters" ? "text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300" : "text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300";
  const activeButtonColor = serviceType === "helicopters" ? "bg-orange-600" : "bg-blue-600";
  const hoverBorderColor = serviceType === "helicopters" ? "hover:border-orange-300" : "hover:border-blue-300";
  const activeBorderColor = serviceType === "helicopters" ? "border-orange-500" : "border-blue-500";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="relative flex flex-col"
      ref={dropdownRef}
    >
      <label
        htmlFor={`${serviceType}-passengers`}
        className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-1"
      >
        Travellers & Class
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </label>
      <div
        id={`${serviceType}-passengers`}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex flex-col justify-center border-2 rounded-xl px-4 py-2 cursor-pointer bg-white ${hoverBorderColor} transition-all duration-300 h-14 ${
          isOpen ? activeBorderColor : "border-gray-200"
        }`}
      >
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">
            {totalPassengers}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            Traveller{totalPassengers !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="text-xs text-gray-600">
          {travelClass === "Premium Economy" ? "Economy/ Premium Economy" : travelClass}
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-full mt-2 left-0 w-full min-w-[330px] max-w-[90vw] bg-white border-2 border-gray-100 rounded-2xl shadow-2xl z-[100] p-6 space-y-4 overflow-y-auto max-h-[60vh]"
          >
            {/* Adults */}
            <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-gray-800 font-semibold">Adults</p>
                <p className="text-xs text-gray-500">(12+ years)</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePassengerChange("adults", "decrement")}
                  className={`w-10 h-10 rounded-full ${buttonColor} disabled:opacity-50 transition-all`}
                  disabled={
                    passengerData.adults ===
                      (passengerData.children > 0 || passengerData.infants > 0 ? 1 : 0) && 
                    totalPassengers === passengerData.adults
                  }
                >
                  -
                </Button>
                <span className="w-10 text-center font-bold text-gray-800 text-lg">
                  {passengerData.adults}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePassengerChange("adults", "increment")}
                  className={`w-10 h-10 rounded-full ${buttonColor} transition-all`}
                >
                  +
                </Button>
              </div>
            </div>
            <Separator className="my-2" />
            
            {/* Children */}
            <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-gray-800 font-semibold">Children</p>
                <p className="text-xs text-gray-500">(2-12 years)</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePassengerChange("children", "decrement")}
                  className={`w-10 h-10 rounded-full ${buttonColor} disabled:opacity-50 transition-all`}
                  disabled={passengerData.children === 0}
                >
                  -
                </Button>
                <span className="w-10 text-center font-bold text-gray-800 text-lg">
                  {passengerData.children}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePassengerChange("children", "increment")}
                  className={`w-10 h-10 rounded-full ${buttonColor} disabled:opacity-50 transition-all`}
                  disabled={passengerData.adults === 0}
                >
                  +
                </Button>
              </div>
            </div>
            <Separator className="my-2" />
            
            {/* Infants */}
            <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-gray-800 font-semibold">Infants</p>
                <p className="text-xs text-gray-500">(0-2 years)</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePassengerChange("infants", "decrement")}
                  className={`w-10 h-10 rounded-full ${buttonColor} disabled:opacity-50 transition-all`}
                  disabled={passengerData.infants === 0}
                >
                  -
                </Button>
                <span className="w-10 text-center font-bold text-gray-800 text-lg">
                  {passengerData.infants}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePassengerChange("infants", "increment")}
                  className={`w-10 h-10 rounded-full ${buttonColor} disabled:opacity-50 transition-all`}
                  disabled={passengerData.adults === 0}
                >
                  +
                </Button>
              </div>
            </div>
            
            {passengerData.adults === 0 &&
              (passengerData.children > 0 || passengerData.infants > 0) && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">
                    ⚠️ An adult must accompany children and infants.
                  </p>
                </div>
              )}
            
            <Separator className="my-3" />
            
            {/* Travel Class Selection */}
            <div className="space-y-3">
              <p className="text-gray-800 font-semibold text-sm">Choose Travel Class</p>
              <div className="grid grid-cols-2 gap-2">
                {["Economy", "Premium Economy", "Business", "First Class"].map((classType) => (
                  <button
                    key={classType}
                    onClick={() => setTravelClass(classType)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      travelClass === classType
                        ? `${activeButtonColor} text-white shadow-md`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {classType}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
