/**
 * Centralized Price Calculation
 * All pricing logic in one place - Cannot be bypassed from UI
 * @security This file contains critical business logic
 */

export class PriceCalculator {
  /**
   * Calculate base price for adults
   */
  static calculateAdultPrice(adultCount, basePrice) {
    return parseFloat(basePrice) * parseInt(adultCount);
  }

  /**
   * Calculate child price (50% discount)
   */
  static calculateChildPrice(childCount, basePrice, discountPercent = 0.5) {
    return parseFloat(basePrice) * parseInt(childCount) * discountPercent;
  }

  /**
   * Calculate infant fee (flat rate)
   */
  static calculateInfantFee(infantCount, feePerInfant = 10) {
    return parseInt(infantCount) * feePerInfant;
  }

  /**
   * Calculate helicopter weight charges
   */
  static calculateWeightCharge(weight, freeWeightLimit = 75, pricePerKg = 500) {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= freeWeightLimit) {
      return 0;
    }
    
    const excessWeight = weightNum - freeWeightLimit;
    return excessWeight * pricePerKg;
  }

  /**
   * Calculate total weight charges for all travelers
   */
  static calculateTotalWeightCharges(travelers, freeWeightLimit = 75, pricePerKg = 500) {
    if (!Array.isArray(travelers)) return 0;
    
    return travelers.reduce((total, traveler) => {
      if (traveler.weight) {
        return total + this.calculateWeightCharge(traveler.weight, freeWeightLimit, pricePerKg);
      }
      return total;
    }, 0);
  }

  /**
   * Calculate total price breakdown
   */
  static calculateBreakdown(bookingData) {
    const {
      basePrice = 0,
      passengers = { adults: 1, children: 0, infants: 0 },
      travelers = [],
      bookingType = 'flight',
      freeWeightLimit = 75,
      pricePerKg = 500
    } = bookingData;

    const breakdown = {
      adultPrice: this.calculateAdultPrice(passengers.adults, basePrice),
      childPrice: this.calculateChildPrice(passengers.children, basePrice),
      infantFee: this.calculateInfantFee(passengers.infants),
      weightCharges: 0,
      subtotal: 0,
      taxes: 0,
      total: 0
    };

    // Add weight charges for helicopter bookings
    if (bookingType === 'helicopter') {
      breakdown.weightCharges = this.calculateTotalWeightCharges(
        travelers,
        freeWeightLimit,
        pricePerKg
      );
    }

    // Calculate subtotal
    breakdown.subtotal = breakdown.adultPrice + breakdown.childPrice + breakdown.infantFee + breakdown.weightCharges;

    // Calculate taxes (if any)
    breakdown.taxes = 0; // Add tax calculation if needed

    // Calculate total
    breakdown.total = breakdown.subtotal + breakdown.taxes;

    return breakdown;
  }

  /**
   * Calculate total price (simplified)
   */
  static calculateTotal(bookingData) {
    const breakdown = this.calculateBreakdown(bookingData);
    return breakdown.total.toFixed(2);
  }

  /**
   * Format price for display
   */
  static formatPrice(price, currency = '₹') {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return `${currency}0`;
    return `${currency}${numPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  /**
   * Calculate per-person price
   */
  static calculatePerPersonPrice(totalPrice, passengerCount) {
    const total = parseFloat(totalPrice);
    const count = parseInt(passengerCount);
    
    if (isNaN(total) || isNaN(count) || count === 0) return 0;
    
    return (total / count).toFixed(2);
  }

  /**
   * Apply coupon discount
   */
  static applyCouponDiscount(totalPrice, couponPercent) {
    const price = parseFloat(totalPrice);
    const discount = parseFloat(couponPercent);
    
    if (isNaN(price) || isNaN(discount)) return price;
    
    const discountAmount = (price * discount) / 100;
    return (price - discountAmount).toFixed(2);
  }

  /**
   * Validate price integrity
   * Ensures calculated price matches expected price
   */
  static validatePriceIntegrity(calculatedPrice, expectedPrice, tolerance = 0.01) {
    const calc = parseFloat(calculatedPrice);
    const expected = parseFloat(expectedPrice);
    
    if (isNaN(calc) || isNaN(expected)) {
      return { valid: false, error: 'Invalid price values' };
    }
    
    const difference = Math.abs(calc - expected);
    
    if (difference > tolerance) {
      return {
        valid: false,
        error: `Price mismatch: calculated ${calc}, expected ${expected}`
      };
    }
    
    return { valid: true };
  }
}

export default PriceCalculator;
