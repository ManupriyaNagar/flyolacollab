"use client";
import { cn } from "@/lib/utils";
import SeatButton from "./SeatButton";

/**
 * Seat Grid Component
 * Displays seats in a grid layout
 * @security All seat validation handled by SeatSelector parent
 */
export default function SeatGrid({ 
  seats, 
  selectedSeats, 
  availableSeats, 
  onSeatToggle, 
  maxSeats,
  vehicleType = "flight"
}) {
  const isDisabled = (seat) => {
    const isSelected = selectedSeats.includes(seat);
    const maxReached = selectedSeats.length >= maxSeats;
    return !isSelected && maxReached;
  };

  return (
    <div className={cn("bg-white p-6 rounded-xl border border-gray-200 shadow-sm")}>
      {/* Aircraft/Helicopter Front Indicator */}
      <div className="text-center mb-6">
        <div className={cn(
          "inline-block px-4 py-2 rounded-full text-xs font-medium",
          vehicleType === "helicopter" 
            ? "bg-red-800 text-white" 
            : "bg-gray-800 text-white"
        )}>
          {vehicleType === "helicopter" ? "🚁" : "✈️"} FRONT OF {vehicleType.toUpperCase()}
        </div>
      </div>

      {/* Seat Grid */}
      <div className={cn(
        "grid grid-cols-2 gap-3 max-w-[12rem] mx-auto",
        "sm:max-w-[14rem]"
      )}>
        {seats.map((seat) => (
          <SeatButton
            key={seat}
            seat={seat}
            isSelected={selectedSeats.includes(seat)}
            isAvailable={availableSeats.includes(seat)}
            onToggle={onSeatToggle}
            disabled={isDisabled(seat)}
          />
        ))}
      </div>

      {/* Seat Count Info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Selected: <span className="font-bold text-green-600">{selectedSeats.length}</span> / {maxSeats}
        </p>
      </div>
    </div>
  );
}
