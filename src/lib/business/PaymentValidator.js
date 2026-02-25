/**
 * Centralized Payment Validation
 * All payment-related validation rules
 * @security This file contains critical business logic - Cannot be modified from UI
 */

export class PaymentValidator {
  /**
   * Valid payment methods
   */
  static VALID_PAYMENT_METHODS = ['razorpay', 'cash', 'upi', 'card'];

  /**
   * Valid payment statuses
   */
  static VALID_STATUSES = ['pending', 'completed', 'failed', 'refunded'];

  /**
   * Validate payment amount
   */
  static validateAmount(amount, expectedAmount, tolerance = 0.01) {
    const amt = parseFloat(amount);
    const expected = parseFloat(expectedAmount);

    if (isNaN(amt) || isNaN(expected)) {
      return {
        valid: false,
        error: 'Invalid amount format'
      };
    }

    if (amt <= 0) {
      return {
        valid: false,
        error: 'Amount must be greater than zero'
      };
    }

    // Check if amount matches expected (with small tolerance for rounding)
    const difference = Math.abs(amt - expected);
    if (difference > tolerance) {
      return {
        valid: false,
        error: `Amount mismatch: expected ₹${expected}, got ₹${amt}`
      };
    }

    return { valid: true };
  }

  /**
   * Validate payment method
   */
  static validatePaymentMethod(method) {
    if (!method) {
      return {
        valid: false,
        error: 'Payment method is required'
      };
    }

    if (!this.VALID_PAYMENT_METHODS.includes(method.toLowerCase())) {
      return {
        valid: false,
        error: 'Invalid payment method'
      };
    }

    return { valid: true };
  }

  /**
   * Validate Razorpay payment ID
   */
  static validateRazorpayId(paymentId) {
    if (!paymentId) {
      return {
        valid: false,
        error: 'Payment ID is required'
      };
    }

    // Razorpay payment ID format: pay_XXXXXXXXXXXXX
    if (!/^pay_[A-Za-z0-9]{14}$/.test(paymentId)) {
      return {
        valid: false,
        error: 'Invalid Razorpay payment ID format'
      };
    }

    return { valid: true };
  }

  /**
   * Validate Razorpay order ID
   */
  static validateRazorpayOrderId(orderId) {
    if (!orderId) {
      return {
        valid: false,
        error: 'Order ID is required'
      };
    }

    // Razorpay order ID format: order_XXXXXXXXXXXXX
    if (!/^order_[A-Za-z0-9]{14}$/.test(orderId)) {
      return {
        valid: false,
        error: 'Invalid Razorpay order ID format'
      };
    }

    return { valid: true };
  }

  /**
   * Validate Razorpay signature
   */
  static validateRazorpaySignature(signature) {
    if (!signature) {
      return {
        valid: false,
        error: 'Payment signature is required'
      };
    }

    // Razorpay signature is a hex string
    if (!/^[a-f0-9]{64}$/.test(signature)) {
      return {
        valid: false,
        error: 'Invalid payment signature format'
      };
    }

    return { valid: true };
  }

  /**
   * Validate complete Razorpay payment
   */
  static validateRazorpayPayment(paymentData) {
    const errors = {};

    // Validate payment ID
    const paymentIdResult = this.validateRazorpayId(paymentData.razorpay_payment_id);
    if (!paymentIdResult.valid) {
      errors.paymentId = paymentIdResult.error;
    }

    // Validate order ID
    const orderIdResult = this.validateRazorpayOrderId(paymentData.razorpay_order_id);
    if (!orderIdResult.valid) {
      errors.orderId = orderIdResult.error;
    }

    // Validate signature
    const signatureResult = this.validateRazorpaySignature(paymentData.razorpay_signature);
    if (!signatureResult.valid) {
      errors.signature = signatureResult.error;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate UPI ID
   */
  static validateUpiId(upiId) {
    if (!upiId) {
      return {
        valid: false,
        error: 'UPI ID is required'
      };
    }

    // UPI ID format: username@bankname
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
      return {
        valid: false,
        error: 'Invalid UPI ID format'
      };
    }

    return { valid: true };
  }

  /**
   * Validate card number (basic validation)
   */
  static validateCardNumber(cardNumber) {
    if (!cardNumber) {
      return {
        valid: false,
        error: 'Card number is required'
      };
    }

    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');

    // Check if it's all digits
    if (!/^\d+$/.test(cleaned)) {
      return {
        valid: false,
        error: 'Card number must contain only digits'
      };
    }

    // Check length (13-19 digits)
    if (cleaned.length < 13 || cleaned.length > 19) {
      return {
        valid: false,
        error: 'Card number must be 13-19 digits'
      };
    }

    // Luhn algorithm check
    if (!this.luhnCheck(cleaned)) {
      return {
        valid: false,
        error: 'Invalid card number'
      };
    }

    return { valid: true };
  }

  /**
   * Luhn algorithm for card validation
   */
  static luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate CVV
   */
  static validateCvv(cvv) {
    if (!cvv) {
      return {
        valid: false,
        error: 'CVV is required'
      };
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      return {
        valid: false,
        error: 'CVV must be 3 or 4 digits'
      };
    }

    return { valid: true };
  }

  /**
   * Validate expiry date
   */
  static validateExpiryDate(month, year) {
    if (!month || !year) {
      return {
        valid: false,
        error: 'Expiry date is required'
      };
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (isNaN(monthNum) || isNaN(yearNum)) {
      return {
        valid: false,
        error: 'Invalid expiry date format'
      };
    }

    if (monthNum < 1 || monthNum > 12) {
      return {
        valid: false,
        error: 'Invalid month'
      };
    }

    // Check if card is expired
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return {
        valid: false,
        error: 'Card has expired'
      };
    }

    return { valid: true };
  }

  /**
   * Validate complete payment data
   */
  static validatePaymentData(paymentData) {
    const errors = {};

    // Validate amount
    if (paymentData.amount !== undefined && paymentData.expectedAmount !== undefined) {
      const amountResult = this.validateAmount(paymentData.amount, paymentData.expectedAmount);
      if (!amountResult.valid) {
        errors.amount = amountResult.error;
      }
    }

    // Validate payment method
    const methodResult = this.validatePaymentMethod(paymentData.paymentMethod);
    if (!methodResult.valid) {
      errors.paymentMethod = methodResult.error;
    }

    // Method-specific validation
    if (paymentData.paymentMethod === 'razorpay' && paymentData.razorpayData) {
      const razorpayResult = this.validateRazorpayPayment(paymentData.razorpayData);
      if (!razorpayResult.valid) {
        Object.assign(errors, razorpayResult.errors);
      }
    }

    if (paymentData.paymentMethod === 'upi' && paymentData.upiId) {
      const upiResult = this.validateUpiId(paymentData.upiId);
      if (!upiResult.valid) {
        errors.upiId = upiResult.error;
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Sanitize payment data
   */
  static sanitizePaymentData(paymentData) {
    return {
      amount: parseFloat(paymentData.amount) || 0,
      paymentMethod: paymentData.paymentMethod?.toLowerCase() || '',
      razorpayData: paymentData.razorpayData ? {
        razorpay_payment_id: paymentData.razorpayData.razorpay_payment_id?.trim() || '',
        razorpay_order_id: paymentData.razorpayData.razorpay_order_id?.trim() || '',
        razorpay_signature: paymentData.razorpayData.razorpay_signature?.trim() || ''
      } : undefined,
      upiId: paymentData.upiId?.trim().toLowerCase() || undefined
    };
  }

  /**
   * Validate payment status
   */
  static validatePaymentStatus(status) {
    if (!status) {
      return {
        valid: false,
        error: 'Payment status is required'
      };
    }

    if (!this.VALID_STATUSES.includes(status.toLowerCase())) {
      return {
        valid: false,
        error: 'Invalid payment status'
      };
    }

    return { valid: true };
  }

  /**
   * Check if payment is successful
   */
  static isPaymentSuccessful(status) {
    return status?.toLowerCase() === 'completed';
  }

  /**
   * Check if payment can be refunded
   */
  static canRefund(status, paymentDate, refundPolicy = 24) {
    if (status?.toLowerCase() !== 'completed') {
      return {
        canRefund: false,
        reason: 'Only completed payments can be refunded'
      };
    }

    // Check if within refund window (default 24 hours)
    const paymentTime = new Date(paymentDate);
    const now = new Date();
    const hoursSincePayment = (now - paymentTime) / (1000 * 60 * 60);

    if (hoursSincePayment > refundPolicy) {
      return {
        canRefund: false,
        reason: `Refund window of ${refundPolicy} hours has passed`
      };
    }

    return { canRefund: true };
  }
}

export default PaymentValidator;
