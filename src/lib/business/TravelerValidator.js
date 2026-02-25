/**
 * Centralized Traveler Validation
 * All traveler-related validation rules
 * @security This file contains critical business logic - Cannot be modified from UI
 */

export class TravelerValidator {
  /**
   * Valid titles
   */
  static VALID_TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Master', 'Miss'];

  /**
   * Validate single traveler
   */
  static validateTraveler(traveler, index = 0, isFirstTraveler = false) {
    const errors = {};
    const prefix = index;

    // Title validation
    if (!traveler.title) {
      errors[`${prefix}-title`] = 'Title is required';
    } else if (!this.VALID_TITLES.includes(traveler.title)) {
      errors[`${prefix}-title`] = 'Invalid title selected';
    }

    // Full name validation
    if (!traveler.fullName || traveler.fullName.trim().length < 2) {
      errors[`${prefix}-fullName`] = 'Full name must be at least 2 characters';
    } else if (traveler.fullName.trim().length > 100) {
      errors[`${prefix}-fullName`] = 'Full name too long (max 100 characters)';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(traveler.fullName)) {
      errors[`${prefix}-fullName`] = 'Full name contains invalid characters';
    }

    // Date of birth validation
    if (!traveler.dateOfBirth) {
      errors[`${prefix}-dateOfBirth`] = 'Date of birth is required';
    } else {
      const dob = new Date(traveler.dateOfBirth);
      const today = new Date();
      const age = Math.floor((today - dob) / (365.25 * 24 * 3600 * 1000));

      if (isNaN(dob.getTime())) {
        errors[`${prefix}-dateOfBirth`] = 'Invalid date format';
      } else if (dob > today) {
        errors[`${prefix}-dateOfBirth`] = 'Date of birth cannot be in the future';
      } else if (age < 0 || age > 120) {
        errors[`${prefix}-dateOfBirth`] = 'Please enter a valid date of birth';
      }
    }

    // First traveler contact validation (required)
    if (isFirstTraveler) {
      // Email validation
      if (!traveler.email) {
        errors[`${prefix}-email`] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(traveler.email)) {
        errors[`${prefix}-email`] = 'Please enter a valid email address';
      } else if (traveler.email.length > 100) {
        errors[`${prefix}-email`] = 'Email too long';
      }

      // Phone validation
      if (!traveler.phone) {
        errors[`${prefix}-phone`] = 'Phone number is required';
      } else if (!/^\d{10}$/.test(traveler.phone)) {
        errors[`${prefix}-phone`] = 'Phone must be exactly 10 digits';
      }

      // Address validation (optional but if provided, validate)
      if (traveler.address && traveler.address.length > 200) {
        errors[`${prefix}-address`] = 'Address too long (max 200 characters)';
      }

      // State validation (optional but if provided, validate)
      if (traveler.state && traveler.state.length > 50) {
        errors[`${prefix}-state`] = 'State name too long';
      }

      // PIN code validation (optional but if provided, validate)
      if (traveler.pinCode && !/^\d{6}$/.test(traveler.pinCode)) {
        errors[`${prefix}-pinCode`] = 'PIN code must be 6 digits';
      }

      // GST number validation (optional but if provided, validate)
      if (traveler.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(traveler.gstNumber)) {
        errors[`${prefix}-gstNumber`] = 'Invalid GST number format';
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate all travelers
   */
  static validateAllTravelers(travelers) {
    if (!Array.isArray(travelers) || travelers.length === 0) {
      return {
        valid: false,
        errors: { general: 'At least one traveler is required' }
      };
    }

    const allErrors = {};
    let isValid = true;

    travelers.forEach((traveler, index) => {
      const result = this.validateTraveler(traveler, index, index === 0);
      if (!result.valid) {
        isValid = false;
        Object.assign(allErrors, result.errors);
      }
    });

    return {
      valid: isValid,
      errors: allErrors
    };
  }

  /**
   * Validate helicopter weight (for helicopter bookings)
   */
  static validateWeight(weight, freeWeightLimit = 75, maxWeight = 200) {
    if (weight === undefined || weight === null || weight === '') {
      return { valid: true }; // Weight is optional
    }

    const weightNum = parseFloat(weight);

    if (isNaN(weightNum)) {
      return {
        valid: false,
        error: 'Weight must be a valid number'
      };
    }

    if (weightNum <= 0) {
      return {
        valid: false,
        error: 'Weight must be greater than 0'
      };
    }

    if (weightNum > maxWeight) {
      return {
        valid: false,
        error: `Weight cannot exceed ${maxWeight}kg`
      };
    }

    return { valid: true };
  }

  /**
   * Validate all traveler weights (for helicopter bookings)
   */
  static validateAllWeights(travelers, freeWeightLimit = 75, maxWeight = 200) {
    const errors = {};
    let isValid = true;

    travelers.forEach((traveler, index) => {
      if (traveler.weight !== undefined && traveler.weight !== null && traveler.weight !== '') {
        const result = this.validateWeight(traveler.weight, freeWeightLimit, maxWeight);
        if (!result.valid) {
          isValid = false;
          errors[`${index}-weight`] = result.error;
        }
      }
    });

    return {
      valid: isValid,
      errors
    };
  }

  /**
   * Sanitize traveler input
   */
  static sanitizeTraveler(traveler) {
    return {
      title: traveler.title?.trim() || '',
      fullName: traveler.fullName?.trim().substring(0, 100) || '',
      dateOfBirth: traveler.dateOfBirth || '',
      email: traveler.email?.trim().toLowerCase().substring(0, 100) || '',
      phone: traveler.phone?.replace(/\D/g, '').substring(0, 10) || '',
      address: traveler.address?.trim().substring(0, 200) || '',
      state: traveler.state?.trim().substring(0, 50) || '',
      pinCode: traveler.pinCode?.replace(/\D/g, '').substring(0, 6) || '',
      gstNumber: traveler.gstNumber?.trim().toUpperCase().substring(0, 15) || '',
      weight: traveler.weight ? parseFloat(traveler.weight) : undefined
    };
  }

  /**
   * Sanitize all travelers
   */
  static sanitizeAllTravelers(travelers) {
    if (!Array.isArray(travelers)) return [];
    return travelers.map(t => this.sanitizeTraveler(t));
  }

  /**
   * Check if traveler data is complete
   */
  static isComplete(traveler, isFirstTraveler = false) {
    const required = ['title', 'fullName', 'dateOfBirth'];
    
    if (isFirstTraveler) {
      required.push('email', 'phone');
    }

    return required.every(field => {
      const value = traveler[field];
      return value !== undefined && value !== null && value !== '';
    });
  }

  /**
   * Check if all travelers are complete
   */
  static areAllComplete(travelers) {
    if (!Array.isArray(travelers) || travelers.length === 0) {
      return false;
    }

    return travelers.every((traveler, index) => 
      this.isComplete(traveler, index === 0)
    );
  }

  /**
   * Get traveler summary for display
   */
  static getSummary(traveler) {
    return {
      name: traveler.fullName || 'Not provided',
      title: traveler.title || 'Not provided',
      age: traveler.dateOfBirth ? this.calculateAge(traveler.dateOfBirth) : 'Not provided',
      email: traveler.email || 'Not provided',
      phone: traveler.phone || 'Not provided'
    };
  }

  /**
   * Calculate age from date of birth
   */
  static calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = Math.floor((today - dob) / (365.25 * 24 * 3600 * 1000));
    return age;
  }

  /**
   * Get passenger type based on age
   */
  static getPassengerType(dateOfBirth) {
    const age = this.calculateAge(dateOfBirth);
    
    if (age < 2) return 'Infant';
    if (age < 12) return 'Child';
    return 'Adult';
  }

  /**
   * Validate passenger count matches travelers
   */
  static validatePassengerCount(travelers, expectedCount) {
    if (travelers.length !== expectedCount) {
      return {
        valid: false,
        error: `Expected ${expectedCount} traveler(s), but got ${travelers.length}`
      };
    }
    return { valid: true };
  }
}

export default TravelerValidator;
