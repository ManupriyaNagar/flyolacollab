"use client";
import { cn } from "@/lib/utils";
import { memo } from "react";

/**
 * Individual Seat Button Component
 * Memoized to prevent unnecessary re-renders
 * @security All seat logic handled by parent SeatSelector
 */
const SeatButton = memo(({ 
  seat, 
  isSelected, 
  isAvailable, 
  onToggle, 
  disabled 
}) => {
  return (
    <button
      onClick={() => onToggle(seat)}
      disabled={disabled || !isAvailable}
      className={cn(
        "h-12 rounded-lg text-sm font-bold transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        isSelected && "bg-green-500 text-white shadow-md hover:bg-green-600 focus:ring-green-500",
        !isSelected && isAvailable && "bg-blue-200 text-gray-800 hover:bg-blue-300 focus:ring-blue-500",
        !isAvailable && "bg-red-200 text-gray-500 cursor-not-allowed opacity-60",
        disabled && "cursor-not-allowed opacity-50"
      )}
      aria-label={`Seat ${seat} - ${isSelected ? 'Selected' : isAvailable ? 'Available' : 'Occupied'}`}
      aria-pressed={isSelected}
      aria-disabled={disabled || !isAvailable}
    >
      {seat}
    </button>
  );
});

SeatButton.displayName = "SeatButton";

export default SeatButton;
