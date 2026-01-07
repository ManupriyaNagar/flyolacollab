"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
      className={cn('relative', 'flex', 'flex-col')}
      ref={dropdownRef}
    >
      <label
        htmlFor={`${serviceType}-passengers`}
        className={cn('mb-2', 'text-sm', 'font-semibold', 'text-gray-700', 'flex', 'items-center', 'gap-1')}
      >
        Travellers & Class
        <svg className={cn('w-4', 'h-4')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className={cn('flex', 'items-baseline', 'gap-1')}>
          <span className={cn('text-2xl', 'font-bold', 'text-gray-900')}>
            {totalPassengers}
          </span>
          <span className={cn('text-sm', 'font-semibold', 'text-gray-900')}>
            Traveller{totalPassengers !== 1 ? "s" : ""}
          </span>
        </div>
        <div className={cn('text-xs', 'text-gray-600')}>
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
            className={cn('absolute', 'top-full', 'mt-2', 'left-0', 'w-full', 'min-w-[330px]', 'max-w-[90vw]', 'bg-white', 'border-2', 'border-gray-100', 'rounded-2xl', 'shadow-2xl', 'z-[100]', 'p-6', 'space-y-4', 'overflow-y-auto', 'max-h-[60vh]')}
          >
            {/* Adults */}
            <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2', 'rounded-lg', 'hover:bg-gray-50', 'transition-colors')}>
              <div>
                <p className={cn('text-gray-800', 'font-semibold')}>Adults</p>
                <p className={cn('text-xs', 'text-gray-500')}>(12+ years)</p>
              </div>
              <div className={cn('flex', 'items-center', 'gap-3')}>
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
                <span className={cn('w-10', 'text-center', 'font-bold', 'text-gray-800', 'text-lg')}>
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
            <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2', 'rounded-lg', 'hover:bg-gray-50', 'transition-colors')}>
              <div>
                <p className={cn('text-gray-800', 'font-semibold')}>Children</p>
                <p className={cn('text-xs', 'text-gray-500')}>(2-12 years)</p>
              </div>
              <div className={cn('flex', 'items-center', 'gap-3')}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePassengerChange("children", "decrement")}
                  className={`w-10 h-10 rounded-full ${buttonColor} disabled:opacity-50 transition-all`}
                  disabled={passengerData.children === 0}
                >
                  -
                </Button>
                <span className={cn('w-10', 'text-center', 'font-bold', 'text-gray-800', 'text-lg')}>
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
            <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2', 'rounded-lg', 'hover:bg-gray-50', 'transition-colors')}>
              <div>
                <p className={cn('text-gray-800', 'font-semibold')}>Infants</p>
                <p className={cn('text-xs', 'text-gray-500')}>(0-2 years)</p>
              </div>
              <div className={cn('flex', 'items-center', 'gap-3')}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePassengerChange("infants", "decrement")}
                  className={`w-10 h-10 rounded-full ${buttonColor} disabled:opacity-50 transition-all`}
                  disabled={passengerData.infants === 0}
                >
                  -
                </Button>
                <span className={cn('w-10', 'text-center', 'font-bold', 'text-gray-800', 'text-lg')}>
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
                <div className={cn('mt-4', 'p-3', 'bg-red-50', 'border', 'border-red-200', 'rounded-lg')}>
                  <p className={cn('text-sm', 'text-red-600', 'font-medium')}>
                    ⚠️ An adult must accompany children and infants.
                  </p>
                </div>
              )}
            
            <Separator className="my-3" />
            
   
           
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
