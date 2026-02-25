"use client";
import { cn } from "@/lib/utils";
import { FaCalendarAlt, FaClock, FaHelicopter, FaPlane } from "react-icons/fa";

/**
 * Vehicle Details Component
 * Displays flight/helicopter information
 * @security All data passed as props, no manipulation possible
 */
export default function VehicleDetails({
  bookingType = "flight",
  departure,
  arrival,
  date,
  departureTime,
  arrivalTime
}) {
  const Icon = bookingType === "helicopter" ? FaHelicopter : FaPlane;
  const gradient = bookingType === "helicopter" 
    ? "from-red-50 to-pink-50 border-red-200"
    : "from-blue-50 to-indigo-50 border-blue-200";
  const iconColor = bookingType === "helicopter" ? "text-red-600" : "text-blue-600";

  // Format date
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={cn(
      "bg-gradient-to-br p-6 rounded-2xl border",
      gradient
    )}>
      <h3 className={cn(
        "text-lg font-semibold text-gray-800 mb-4",
        "flex items-center gap-2"
      )}>
        <Icon className={iconColor} />
        {bookingType === "helicopter" ? "Helicopter" : "Flight"} Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Route Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">From:</span>
            <span className="font-semibold text-gray-800">{departure}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-sm text-gray-600">To:</span>
            <span className="font-semibold text-gray-800">{arrival}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-blue-500" size={12} />
            <span className="text-sm text-gray-600">Date:</span>
            <span className="font-semibold text-gray-800">{formattedDate}</span>
          </div>
        </div>

        {/* Time Information */}
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <FaClock className="text-green-500" />
                Departure
              </span>
              <span className="font-bold text-lg text-gray-800">{departureTime}</span>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <FaClock className="text-blue-500" />
                Arrival
              </span>
              <span className="font-bold text-lg text-gray-800">{arrivalTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
