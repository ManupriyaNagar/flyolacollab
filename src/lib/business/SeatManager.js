/**
 * Centralized Seat Management
 * All seat-related operations in one place
 * @security This file contains critical business logic
 */

import BASE_URL from '@/baseUrl/baseUrl';
import API from '@/services/api';

export class SeatManager {
  /**
   * Generate seat labels based on seat limit
   */
  static generateSeatLabels(seatLimit = 6) {
    return Array.from({ length: seatLimit }, (_, i) => `S${i + 1}`);
  }

  /**
   * Fetch available seats for a schedule
   */
  static async fetchAvailableSeats(scheduleId, date, bookingType = 'flight') {
    try {
      let data;
      
      if (bookingType === 'helicopter') {
        data = await API.bookings.getAvailableHelicopterSeats(scheduleId, date);
      } else {
        data = await API.bookings.getAvailableSeats(scheduleId, date);
      }
      
      return {
        success: true,
        seats: Array.isArray(data.availableSeats) ? data.availableSeats : []
      };
    } catch (error) {
      console.error('[SeatManager] Failed to fetch seats:', error);
      return {
        success: false,
        seats: [],
        error: error.message
      };
    }
  }

  /**
   * Hold seats for a user
   */
  static async holdSeats(scheduleId, date, seatLabels, userId, bookingType = 'flight') {
    try {
      const token = localStorage.getItem("token") || "";
      const endpoint = bookingType === 'helicopter' 
        ? '/helicopter-seat/hold-seats'
        : '/booked-seat/hold-seats';
      
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schedule_id: parseInt(scheduleId),
          bookDate: date,
          seat_labels: seatLabels,
          held_by: userId || `guest_${Date.now()}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error || 'Failed to hold seats'
        };
      }

      const data = await response.json();
      return {
        success: true,
        expiresAt: data.expiresAt,
        message: 'Seats held successfully'
      };
    } catch (error) {
      console.error('[SeatManager] Failed to hold seats:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }

  /**
   * Release held seats
   */
  static async releaseSeats(scheduleId, date, seatLabels, userId, bookingType = 'flight') {
    try {
      const token = localStorage.getItem("token") || "";
      const endpoint = bookingType === 'helicopter'
        ? '/helicopter-seat/release-seats'
        : '/booked-seat/release-seats';
      
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schedule_id: parseInt(scheduleId),
          bookDate: date,
          seat_labels: seatLabels,
          held_by: userId || `guest_${Date.now()}`
        }),
      });

      if (!response.ok) {
        console.warn('[SeatManager] Failed to release seats');
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error('[SeatManager] Failed to release seats:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate seat selection
   */
  static validateSeatSelection(selectedSeats, availableSeats, maxSeats) {
    // Check if seats are available
    const unavailable = selectedSeats.filter(seat => !availableSeats.includes(seat));
    if (unavailable.length > 0) {
      return {
        valid: false,
        error: `Seats ${unavailable.join(', ')} are not available`
      };
    }

    // Check max seats
    if (selectedSeats.length > maxSeats) {
      return {
        valid: false,
        error: `You can only select ${maxSeats} seat(s)`
      };
    }

    return { valid: true };
  }

  /**
   * Filter valid seats from a list
   */
  static filterValidSeats(seats, allSeats) {
    if (!Array.isArray(seats) || !Array.isArray(allSeats)) {
      return [];
    }
    return seats.filter(seat => allSeats.includes(seat));
  }

  /**
   * Calculate seat hold expiry time
   */
  static calculateHoldExpiry(expiresAt) {
    if (!expiresAt) return null;
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return null;
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return {
      minutes,
      seconds,
      formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      isExpired: false
    };
  }

  /**
   * Emit seat update event
   */
  static emitSeatUpdate(scheduleId, bookDate, availableSeats) {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('seats-updated', {
        detail: { schedule_id: scheduleId, bookDate, availableSeats }
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * Listen for seat updates
   */
  static onSeatUpdate(callback) {
    if (typeof window !== 'undefined') {
      window.addEventListener('seats-updated', callback);
      return () => window.removeEventListener('seats-updated', callback);
    }
    return () => {};
  }
}

export default SeatManager;
