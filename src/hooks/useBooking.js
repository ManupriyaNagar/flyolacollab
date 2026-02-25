import { BookingValidator } from '@/lib/business/BookingValidator';
import { PriceCalculator } from '@/lib/business/PriceCalculator';
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for managing booking state
 * Centralizes all booking-related state and logic
 */
export function useBooking(initialData = {}) {
  const [bookingState, setBookingState] = useState({
    schedule: null,
    selectedSeats: [],
    travelers: [],
    passengers: { adults: 1, children: 0, infants: 0 },
    totalPrice: 0,
    priceBreakdown: null,
    errors: {},
    bookingType: 'flight',
    ...initialData
  });

  const [isValidating, setIsValidating] = useState(false);

  /**
   * Update a single field in booking state
   */
  const updateField = useCallback((field, value) => {
    setBookingState(prev => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: undefined } // Clear error for this field
    }));
  }, []);

  /**
   * Update multiple fields at once
   */
  const updateFields = useCallback((updates) => {
    setBookingState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  /**
   * Update traveler information
   */
  const updateTraveler = useCallback((index, field, value) => {
    setBookingState(prev => {
      const travelers = [...prev.travelers];
      travelers[index] = {
        ...travelers[index],
        [field]: value
      };
      
      // Clear error for this field
      const errors = { ...prev.errors };
      delete errors[`${index}-${field}`];
      
      return { ...prev, travelers, errors };
    });
  }, []);

  /**
   * Select/deselect a seat
   */
  const toggleSeat = useCallback((seat) => {
    setBookingState(prev => {
      const isSelected = prev.selectedSeats.includes(seat);
      
      if (isSelected) {
        // Deselect seat
        return {
          ...prev,
          selectedSeats: prev.selectedSeats.filter(s => s !== seat)
        };
      } else {
        // Check if max seats reached
        const totalPassengers = prev.passengers.adults + prev.passengers.children;
        if (prev.selectedSeats.length >= totalPassengers) {
          return prev; // Don't add more seats
        }
        
        // Select seat
        return {
          ...prev,
          selectedSeats: [...prev.selectedSeats, seat]
        };
      }
    });
  }, []);

  /**
   * Set selected seats directly
   */
  const setSelectedSeats = useCallback((seats) => {
    setBookingState(prev => ({
      ...prev,
      selectedSeats: Array.isArray(seats) ? seats : []
    }));
  }, []);

  /**
   * Initialize travelers based on passenger count
   */
  const initializeTravelers = useCallback((passengerCount) => {
    const travelers = Array.from({ length: passengerCount }, () => ({
      title: "",
      fullName: "",
      dateOfBirth: "",
      email: "",
      address: "",
      state: "",
      pinCode: "",
      phone: "",
      gstNumber: "",
      weight: ""
    }));
    
    setBookingState(prev => ({ ...prev, travelers }));
  }, []);

  /**
   * Validate current booking state
   */
  const validate = useCallback(() => {
    setIsValidating(true);
    
    const result = BookingValidator.validateCompleteBooking(bookingState);
    
    setBookingState(prev => ({
      ...prev,
      errors: result.errors || {}
    }));
    
    setIsValidating(false);
    return result.valid;
  }, [bookingState]);

  /**
   * Validate specific field
   */
  const validateField = useCallback((field, value) => {
    // Add field-specific validation logic here
    return { valid: true };
  }, []);

  /**
   * Calculate price breakdown
   */
  const calculatePrice = useCallback(() => {
    if (!bookingState.schedule) return;
    
    const breakdown = PriceCalculator.calculateBreakdown({
      basePrice: bookingState.schedule.price,
      passengers: bookingState.passengers,
      travelers: bookingState.travelers,
      bookingType: bookingState.bookingType,
      freeWeightLimit: bookingState.freeWeightLimit || 75,
      pricePerKg: bookingState.pricePerKg || 500
    });
    
    setBookingState(prev => ({
      ...prev,
      priceBreakdown: breakdown,
      totalPrice: breakdown.total
    }));
  }, [bookingState.schedule, bookingState.passengers, bookingState.travelers, bookingState.bookingType, bookingState.freeWeightLimit, bookingState.pricePerKg]);

  /**
   * Reset booking state
   */
  const reset = useCallback(() => {
    setBookingState({
      schedule: null,
      selectedSeats: [],
      travelers: [],
      passengers: { adults: 1, children: 0, infants: 0 },
      totalPrice: 0,
      priceBreakdown: null,
      errors: {},
      bookingType: 'flight'
    });
  }, []);

  /**
   * Auto-calculate price when relevant fields change
   */
  useEffect(() => {
    if (bookingState.schedule && bookingState.travelers.length > 0) {
      calculatePrice();
    }
  }, [bookingState.schedule, bookingState.travelers, bookingState.passengers, calculatePrice]);

  return {
    bookingState,
    updateField,
    updateFields,
    updateTraveler,
    toggleSeat,
    setSelectedSeats,
    initializeTravelers,
    validate,
    validateField,
    calculatePrice,
    reset,
    isValidating
  };
}

export default useBooking;
