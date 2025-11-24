"use client";

import { motion } from "framer-motion";

export default function TripTypeSelector({ tripType, setTripType, serviceType = "flights" }) {
  const bgColor =
    serviceType === "helicopters"
      ? "bg-gradient-to-l from-orange-600 to-orange-500"
      : "bg-gradient-to-l from-blue-800 to-blue-600";

  const activeColor = serviceType === "helicopters" ? "text-orange-100" : "text-blue-100";
  const hoverColor = serviceType === "helicopters" ? "group-hover:text-orange-200" : "group-hover:text-blue-200";
  const radioColor = serviceType === "helicopters" ? "text-orange-600" : "text-blue-600";
  const ringColor = serviceType === "helicopters" ? "focus:ring-orange-500" : "focus:ring-blue-500";

  return (
    <div className="flex justify-center w-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`flex items-center ${bgColor} rounded-sm px-6 py-3 gap-6 shadow-lg`}
      >
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name={`${serviceType}TripType`}
            value="oneWay"
            checked={tripType === "oneWay"}
            onChange={(e) => setTripType(e.target.value)}
            className={`w-4 h-4 ${radioColor} focus:ring-2 ${ringColor}`}
          />
          <span className={`text-sm font-semibold ${tripType === "oneWay" ? activeColor : "text-gray-100"} ${hoverColor} transition-colors`}>
            One Way
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name={`${serviceType}TripType`}
            value="roundTrip"
            checked={tripType === "roundTrip"}
            onChange={(e) => setTripType(e.target.value)}
            className={`w-4 h-4 ${radioColor} focus:ring-2 ${ringColor}`}
          />
          <span className={`text-sm font-semibold ${tripType === "roundTrip" ? activeColor : "text-gray-100"} ${hoverColor} transition-colors`}>
            Round Trip
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name={`${serviceType}TripType`}
            value="multiCity"
            checked={tripType === "multiCity"}
            onChange={(e) => setTripType(e.target.value)}
            className={`w-4 h-4 ${radioColor} focus:ring-2 ${ringColor}`}
          />
          <span className={`text-sm font-semibold ${tripType === "multiCity" ? activeColor : "text-gray-100"} ${hoverColor} transition-colors`}>
            Multi City
          </span>
        </label>
      </motion.div>
    </div>
  );
}
