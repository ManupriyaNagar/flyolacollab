"use client";
import { SeatManager } from "@/lib/business/SeatManager";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import SeatGrid from "./SeatGrid";
import SeatHoldTimer from "./SeatHoldTimer";
import SeatLegend from "./SeatLegend";

/**
 * Simplified Seat Selector Component
 * Based on old working implementation
 */
export default function SeatSelector({
  scheduleId,
  bookingDate,
  bookingType = "flight",
  maxSeats = 1,
  vehicleType = "flight",
  onSeatsChange,
  onError
}) {
  // All possible seats
  const allSeats = ["S1", "S2", "S3", "S4", "S5", "S6"];
  
  const [availableSeats, setAvailableSeats] = useState(allSeats);
  const [selectedSeats, setSelectedSeats] = useState(allSeats.slice(0, maxSeats));
  const [error, setError] = useState(null);
  const [seatHoldExpiry, setSeatHoldExpiry] = useState(null);
  const [isHolding, setIsHolding] = useState(false);

  // Notify parent of initial selection
  useEffect(() => {
    onSeatsChange?.(allSeats.slice(0, maxSeats));
  }, []);

  /**
   * Fetch available seats - simplified version
   */
  const fetchSeats = useCallback(async () => {
    if (!scheduleId) return;

    try {
      const result = await SeatManager.fetchAvailableSeats(
        scheduleId,
        bookingDate,
        bookingType
      );

      if (result.success && result.seats.length > 0) {
        const validSeats = result.seats.filter(seat => allSeats.includes(seat));
        if (validSeats.length > 0) {
          setAvailableSeats(validSeats);
        }
      }
    } catch (err) {
      console.log('[SeatSelector] Using default seats');
    }
  }, [scheduleId, bookingDate, bookingType]);

  /**
   * Hold seats - simplified version
   */
  const holdSeats = useCallback(async (seats) => {
    if (!seats || seats.length === 0) return { success: true };

    setIsHolding(true);
    const userId = localStorage.getItem("userId") || `guest_${Date.now()}`;

    const result = await SeatManager.holdSeats(
      scheduleId,
      bookingDate,
      seats,
      userId,
      bookingType
    );

    setIsHolding(false);

    if (result.success) {
      setSeatHoldExpiry(result.expiresAt);
      return { success: true };
    } else {
      setError(result.error);
      onError?.(result.error);
      // Refresh seats if hold failed
      await fetchSeats();
      return { success: false };
    }
  }, [scheduleId, bookingDate, bookingType, fetchSeats, onError]);

  /**
   * Handle seat toggle - simplified version
   */
  const handleSeatToggle = useCallback(async (seat) => {
    console.log('[SeatSelector] Seat clicked:', seat);
    console.log('[SeatSelector] Current selected:', selectedSeats);
    console.log('[SeatSelector] Available seats:', availableSeats);
    
    // Check if seat is available
    if (!availableSeats.includes(seat)) {
      console.log('[SeatSelector] Seat not available');
      setError('This seat is not available');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    const isCurrentlySelected = selectedSeats.includes(seat);

    if (isCurrentlySelected) {
      // Deselect seat
      const newSeats = selectedSeats.filter(s => s !== seat);
      console.log('[SeatSelector] Deselecting, new seats:', newSeats);
      setSelectedSeats(newSeats);
      onSeatsChange?.(newSeats);

      // Clear hold if no seats selected
      if (newSeats.length === 0) {
        setSeatHoldExpiry(null);
      }
    } else {
      // Check if can select more seats
      if (selectedSeats.length >= maxSeats) {
        console.log('[SeatSelector] Max seats reached');
        setError(`You can only select ${maxSeats} seat(s)`);
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Select seat
      const newSeats = [...selectedSeats, seat];
      console.log('[SeatSelector] Selecting, new seats:', newSeats);
      setSelectedSeats(newSeats);
      onSeatsChange?.(newSeats);

      // Hold new selection in background (don't wait)
      holdSeats(newSeats);
    }
  }, [selectedSeats, maxSeats, holdSeats, onSeatsChange, availableSeats]);

  /**
   * Handle seat hold expiry
   */
  const handleExpiry = useCallback(() => {
    setSelectedSeats([]);
    setSeatHoldExpiry(null);
    setError("Seat hold expired. Please select seats again.");
    onSeatsChange?.([]);
    onError?.("Seat hold expired");
    fetchSeats();
  }, [onSeatsChange, onError, fetchSeats]);

  /**
   * Initial fetch - only once
   */
  useEffect(() => {
    fetchSeats();
  }, []); // Empty dependency array - only run once

  return (
    <div className={cn(
      "bg-gradient-to-br from-yellow-50 to-orange-50",
      "p-6 rounded-2xl border border-yellow-200"
    )}>
      {/* Header */}
      <div className={cn('flex', 'items-center', 'justify-between', 'mb-4')}>
        <h3 className={cn("text-lg font-semibold text-gray-800 flex items-center gap-2")}>
          <svg className={cn('w-5', 'h-5', 'text-yellow-600')} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" />
          </svg>
          Select Your Seats
        </h3>
        
        {/* Seat Hold Timer */}
        {seatHoldExpiry && (
          <SeatHoldTimer 
            expiresAt={seatHoldExpiry} 
            onExpire={handleExpiry}
          />
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className={cn(
          "text-center py-2 mb-4",
          "bg-red-50 rounded-xl border border-red-200"
        )}>
          <p className={cn('text-red-600', 'text-sm')}>{error}</p>
        </div>
      )}

      {/* Seat Selection - Always visible */}
      <SeatLegend />
      <SeatGrid
        seats={allSeats}
        selectedSeats={selectedSeats}
        availableSeats={availableSeats}
        onSeatToggle={handleSeatToggle}
        maxSeats={maxSeats}
        vehicleType={vehicleType}
      />

      {/* Holding Indicator */}
      {isHolding && (
        <div className={cn('mt-4', 'text-center')}>
          <div className={cn('inline-flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'bg-blue-100', 'rounded-lg')}>
            <div className={cn('w-4', 'h-4', 'border-2', 'border-blue-600', 'border-t-transparent', 'rounded-full', 'animate-spin')} />
            <span className={cn('text-sm', 'text-blue-700', 'font-medium')}>Reserving seats...</span>
          </div>
        </div>
      )}
    </div>
  );
}
