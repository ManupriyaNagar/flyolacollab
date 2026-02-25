"use client";
import { cn } from "@/lib/utils";

/**
 * Seat Legend Component
 * Shows what each seat color means
 */
export default function SeatLegend() {
  const legendItems = [
    { color: "bg-green-500", label: "Selected", textColor: "text-green-700" },
    { color: "bg-blue-200", label: "Available", textColor: "text-blue-700" },
    { color: "bg-red-200", label: "Occupied", textColor: "text-red-700" }
  ];

  return (
    <div className={cn(
      "flex items-center justify-center gap-6 text-sm",
      "mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
    )}>
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className={cn("w-4 h-4 rounded", item.color)} />
          <span className={cn("font-medium", item.textColor)}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
