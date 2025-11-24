"use client";

import { motion } from "framer-motion";

export default function ReturnDateSelector({ 
  tripType, 
  setTripType, 
  returnDate, 
  setReturnDate, 
  minDate,
  delay = 0.75,
  serviceType = "flights"
}) {
  const hoverColor = serviceType === "helicopters" ? "hover:border-orange-300 hover:bg-orange-50" : "hover:border-blue-300 hover:bg-blue-50";
  const textColor = serviceType === "helicopters" ? "text-orange-600" : "text-blue-600";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex flex-col relative"
    >
      <label
        htmlFor={`${serviceType}-return-date`}
        className="mb-2 text-sm font-semibold text-gray-700"
      >
        Return Date
      </label>
      {tripType === "roundTrip" ? (
        <div className="relative">
          <input
            id={`${serviceType}-return-date`}
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={minDate}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={`w-full h-14 border-2 border-gray-200 rounded-xl bg-white px-4 py-2 flex flex-col justify-center ${hoverColor} transition-all cursor-pointer`}>
            {returnDate ? (
              <>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {new Date(returnDate + 'T00:00:00').getDate()}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {new Date(returnDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}'{new Date(returnDate + 'T00:00:00').getFullYear().toString().slice(-2)}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {new Date(returnDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
              </>
            ) : (
              <span className="text-sm text-gray-400">Select date</span>
            )}
          </div>
        </div>
      ) : (
        <div 
          onClick={() => setTripType("roundTrip")}
          className={`w-full h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center cursor-pointer ${hoverColor} transition-all duration-300 bg-white px-3`}
        >
          <span className={`text-xs ${textColor} font-semibold text-center leading-tight`}>
            Tap to add a return for bigger<br />discount
          </span>
        </div>
      )}
    </motion.div>
  );
}
