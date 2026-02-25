/**
 * Centralized Booking Validation
 * All validation rules in one place - Cannot be bypassed from UI
 * @security This file contains critical business logic
 */

export class BookingValidator {
  /**
   * Validate passenger count matches selected seats
   */
  static validatePassengerCount(selectedSeats, requiredPassengers) {
    if (!Array.isArray(selectedSeats)) {
      return { valid: false, error: 'Invalid seat selection' };
    }
    
    if (selectedSeats.length !== requiredPassengers) {
      return {
        valid: false,
        error: `Please select exactly ${requiredPassengers} seat(s). Currently selected: ${selectedSeats.length}`
      };
    }
    return { valid: true };
  }

  /**
   * Validate seat availability
   */
  static validateSeatAvailability(selectedSeats, availableSeats) {
    if (!Array.isArray(selectedSeats) || !Array.isArray(availableSeats)) {
      return { valid: false, error: 'Invalid seat data' };
    }

    const unavailable = selectedSeats.filter(seat => !availableSeats.includes(seat));
    if (unavailable.length > 0) {
      return {
        valid: false,
        error: `Seats ${unavailable.join(', ')} are no longer available`
      };
    }
    return { valid: true };
  }

  /**
   * Validate booking time against cutoff rules
   */
  static validateBookingTime(departureTime, selectedDate, cutoffTime = "09:00", advanceBookingDays = 0, isAdmin = false) {
    // Admin can bypass cutoff time
    if (isAdmin) {
      return { valid: true };
    }

    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const currentDate = istTime.toISOString().split("T")[0];
    const currentTimeInMinutes = istTime.getHours() * 60 + istTime.getMinutes();

    // Parse cutoff time
    const [cutoffHours, cutoffMinutes] = cutoffTime.split(":").map(Number);
    const cutoffTimeInMinutes = cutoffHours * 60 + cutoffMinutes;

    // Calculate cutoff date
    const departureDate = new Date(selectedDate);
    const cutoffDate = new Date(departureDate);
    cutoffDate.setDate(cutoffDate.getDate() - advanceBookingDays);
    const cutoffDateStr = cutoffDate.toISOString().split("T")[0];

    // Check if past cutoff
    let isAfterCutoff = false;
    if (currentDate > cutoffDateStr) {
      isAfterCutoff = true;
    } else if (currentDate === cutoffDateStr) {
      isAfterCutoff = currentTimeInMinutes >= cutoffTimeInMinutes;
    }

    if (isAfterCutoff) {
      return {
        valid: false,
        error: advanceBookingDays > 0
          ? `Booking closed ${advanceBookingDays} day(s) before departure at ${cutoffTime} IST`
          : `Booking closed after ${cutoffTime} IST on departure date`
      };
    }

    return { valid: true };
  }

  /**
   * Check if vehicle has departed
   */
  static validateNotDeparted(departureTime, selectedDate) {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const currentDate = istTime.toISOString().split("T")[0];
    const currentTimeInMinutes = istTime.getHours() * 60 + istTime.getMinutes();

    // Parse departure time
    let departureTimeInMinutes;
    try {
      const timeStr = departureTime.toString();
      let hours, minutes;
      
      if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
        [hours, minutes] = timeStr.split(":").map(Number);
      } else if (/^\d{2}:\d{2}$/.test(timeStr)) {
        [hours, minutes] = timeStr.split(":").map(Number);
      } else {
        return { valid: true }; // Can't parse, allow booking
      }
      
      departureTimeInMinutes = hours * 60 + minutes;
    } catch {
      return { valid: true }; // Can't parse, allow booking
    }

    const isDeparted = selectedDate === currentDate && currentTimeInMinutes >= departureTimeInMinutes;

    if (isDeparted) {
      return {
        valid: false,
        error: 'This vehicle has already departed'
      };
    }

    return { valid: true };
  }

  /**
   * Validate traveler details
   */
  static validateTravelerDetails(travelers) {
    const errors = {};
    
    if (!Array.isArray(travelers) || travelers.length === 0) {
      return {
        valid: false,
        errors: { general: 'At least one traveler is required' }
      };
    }

    travelers.forEach((traveler, index) => {
      // Required fields
      if (!traveler.title) {
        errors[`${index}-title`] = 'Title is required';
      }
      
      if (!traveler.fullName || traveler.fullName.trim().length < 2) {
        errors[`${index}-fullName`] = 'Full name must be at least 2 characters';
      }
      
      if (!traveler.dateOfBirth) {
        errors[`${index}-dateOfBirth`] = 'Date of birth is required';
      } else {
        // Validate age
        const age = Math.floor((new Date() - new Date(traveler.dateOfBirth)) / (365.25 * 24 * 3600 * 1000));
        if (age < 0 || age > 120) {
          errors[`${index}-dateOfBirth`] = 'Please enter a valid date of birth';
        }
      }
      
      // First traveler contact info (required)
      if (index === 0) {
        if (!traveler.email || !/\S+@\S+\.\S+/.test(traveler.email)) {
          errors[`${index}-email`] = 'Valid email is required';
        }
        
        if (!traveler.phone || !/^\d{10}$/.test(traveler.phone)) {
          errors[`${index}-phone`] = 'Valid 10-digit phone number is required';
        }
      }
    });
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate helicopter weight (if applicable)
   */
  static validateHelicopterWeight(travelers, freeWeightLimit = 75, maxWeight = 200) {
    const errors = {};
    
    travelers.forEach((traveler, index) => {
      if (traveler.weight !== undefined && traveler.weight !== null && traveler.weight !== '') {
        const weight = parseFloat(traveler.weight);
        
        if (isNaN(weight) || weight <= 0) {
          errors[`${index}-weight`] = 'Weight must be a positive number';
        } else if (weight > maxWeight) {
          errors[`${index}-weight`] = `Weight cannot exceed ${maxWeight}kg`;
        }
      }
    });
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate complete booking data
   */
  static validateCompleteBooking(bookingData) {
    const validations = [];
    
    // Validate seats
    if (bookingData.selectedSeats && bookingData.passengers) {
      validations.push(
        this.validatePassengerCount(bookingData.selectedSeats, bookingData.passengers)
      );
    }
    
    if (bookingData.selectedSeats && bookingData.availableSeats) {
      validations.push(
        this.validateSeatAvailability(bookingData.selectedSeats, bookingData.availableSeats)
      );
    }
    
    // Validate travelers
    if (bookingData.travelers) {
      const travelerValidation = this.validateTravelerDetails(bookingData.travelers);
      if (!travelerValidation.valid) {
        validations.push(travelerValidation);
      }
      
      // Validate helicopter weight if applicable
      if (bookingData.bookingType === 'helicopter') {
        const weightValidation = this.validateHelicopterWeight(
          bookingData.travelers,
          bookingData.freeWeightLimit,
          bookingData.maxWeight
        );
        if (!weightValidation.valid) {
          validations.push(weightValidation);
        }
      }
    }
    
    // Validate timing
    if (bookingData.departureTime && bookingData.selectedDate) {
      validations.push(
        this.validateNotDeparted(bookingData.departureTime, bookingData.selectedDate)
      );
      
      if (bookingData.cutoffTime) {
        validations.push(
          this.validateBookingTime(
            bookingData.departureTime,
            bookingData.selectedDate,
            bookingData.cutoffTime,
            bookingData.advanceBookingDays,
            bookingData.isAdmin
          )
        );
      }
    }
    
    const errors = validations.filter(v => !v.valid);
    
    return {
      valid: errors.length === 0,
      errors: errors.reduce((acc, err) => {
        if (err.error) acc.push(err.error);
        if (err.errors) acc.push(...Object.values(err.errors));
        return acc;
      }, [])
    };
  }
}

export default BookingValidator;
