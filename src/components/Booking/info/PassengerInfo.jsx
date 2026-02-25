"use client";
import { cn } from "@/lib/utils";
import { FaUserFriends } from "react-icons/fa";

/**
 * Passenger Information Component
 * Displays passenger count breakdown
 * @security Read-only display, no manipulation possible
 */
export default function PassengerInfo({ 
  adults = 1, 
  children = 0, 
  infants = 0 
}) {
  const passengerTypes = [
    { count: adults, label: "Adults", color: "text-green-600", bgColor: "border-green-200" },
    { count: children, label: "Children", color: "text-blue-600", bgColor: "border-blue-200" },
    { count: infants, label: "Infants", color: "text-purple-600", bgColor: "border-purple-200" }
  ];

  const totalPassengers = adults + children + infants;

  return (
    <div className={cn(
      "bg-gradient-to-br from-green-50 to-emerald-50",
      "p-6 rounded-2xl border border-green-200"
    )}>
      <h3 className={cn(
        "text-lg font-semibold text-gray-800 mb-4",
        "flex items-center gap-2"
      )}>
        <FaUserFriends className="text-green-600" />
        Passenger Details
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {passengerTypes.map((type, index) => (
          <div
            key={index}
            className={cn(
              "text-center bg-white p-4 rounded-xl border",
              type.bgColor
            )}
          >
            <div className={cn("text-2xl font-bold", type.color)}>
              {type.count}
            </div>
            <div className="text-sm text-gray-600">{type.label}</div>
          </div>
        ))}
      </div>

      {/* Total Count */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Total Passengers: <span className="font-bold text-green-600">{totalPassengers}</span>
        </p>
      </div>
    </div>
  );
}
