"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";

/**
 * Seat Hold Timer Component
 * Shows countdown for seat hold expiry
 * @security Timer managed by SeatManager
 */
export default function SeatHoldTimer({ expiresAt, onExpire }) {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!expiresAt) {
      setTimeRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeRemaining(null);
        clearInterval(interval);
        onExpire?.();
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        
        // Warning when less than 2 minutes
        setIsWarning(minutes < 2);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!timeRemaining) return null;

  return (
    <div className={cn(
      "flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all",
      isWarning 
        ? "bg-red-50 border-red-300 animate-pulse" 
        : "bg-blue-50 border-blue-300"
    )}>
      <FaClock className={cn(
        "text-lg",
        isWarning ? "text-red-600" : "text-blue-600"
      )} />
      <div>
        <div className={cn(
          "text-xs font-medium",
          isWarning ? "text-red-600" : "text-blue-600"
        )}>
          Seats Reserved
        </div>
        <div className={cn(
          "text-lg font-bold",
          isWarning ? "text-red-700" : "text-blue-700"
        )}>
          {timeRemaining}
        </div>
      </div>
      {isWarning && (
        <div className={cn('text-xs', 'text-red-600', 'ml-2')}>
          ⚠️ Hurry!
        </div>
      )}
    </div>
  );
}
