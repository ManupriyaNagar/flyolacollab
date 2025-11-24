// Centralized ticket data transformation utility
// This ensures consistent ticket data structure across all pages

import { AirportService } from '@/services/api';

/**
 * Transforms raw booking data from various sources into a consistent format
 * for the ProfessionalTicket component
 * @param {Object} rawBookingData - Raw booking data from API
 * @param {Array} airportMap - Map of airport IDs to airport details
 * @returns {Object} Formatted ticket data for ProfessionalTicket component
 */
export const transformTicketData = (rawBookingData, airportMap = {}) => {
  if (!rawBookingData) {
    throw new Error('No booking data provided');
  }

  // Extract flight schedule information
  const flightSchedule = rawBookingData.FlightSchedule || {};
  const flight = flightSchedule.Flight || {};
  
  // Extract airport information with fallback support
  const departureAirportId = flightSchedule.departure_airport_id;
  const arrivalAirportId = flightSchedule.arrival_airport_id;
  
  const departureAirport = airportMap[departureAirportId] || {};
  const arrivalAirport = airportMap[arrivalAirportId] || {};
  
  const departureAirportName = departureAirport.airport_name || 
                               rawBookingData.departureAirportName || 
                               AirportService.resolveAirportName(departureAirportId, airportMap) || 
                               'Departure Airport';
  const arrivalAirportName = arrivalAirport.airport_name || 
                             rawBookingData.arrivalAirportName || 
                             AirportService.resolveAirportName(arrivalAirportId, airportMap) || 
                             'Arrival Airport';
  
  // Extract passenger information
  const passengers = rawBookingData.Passengers || rawBookingData.passengers || [];
  
  // Extract seat information
  const bookedSeats = rawBookingData.BookedSeats || [];
  const seatLabels = bookedSeats.map(seat => seat.seat_label).filter(Boolean);
  const seatString = rawBookingData.booked_seat || rawBookingData.seatLabels || seatLabels.join(', ') || '';
  
  // Extract payment information
  const payments = rawBookingData.Payments || [];
  const primaryPayment = payments[0] || {};
  
  // Extract billing information
  const billing = rawBookingData.billing || {};
  
  // Get primary contact information (prefer booking contact, then first passenger, then billing)
  const primaryPassenger = passengers[0] || {};
  const contactEmail = rawBookingData.email_id || primaryPassenger.email || billing.billing_email || 'contact@flyolaindia.com';
  const contactPhone = rawBookingData.contact_no || primaryPassenger.phone || billing.billing_number || primaryPassenger.number || '+91-XXXXXXXXXX';
  
  // Calculate total price
  const totalPrice = parseFloat(rawBookingData.totalFare) || 
                    parseFloat(rawBookingData.totalPrice) || 
                    parseFloat(primaryPayment.payment_amount) || 
                    parseFloat(flightSchedule.price) || 
                    0;
  
  // Generate flight number - prioritize backend provided data
  const flightNumber = rawBookingData.flightNumber || 
                      flight.flight_number || 
                      rawBookingData.flight?.flightNumber ||
                      'N/A';
  
  // Build the standardized ticket data structure
  const ticketData = {
    bookingData: {
      id: rawBookingData.id || rawBookingData.schedule_id,
      departure: departureAirportName,
      arrival: arrivalAirportName,
      // Ensure airport codes are always from database, never fallback to name truncation
      departureCode: departureAirport.airport_code || 
                     AirportService.resolveAirportCode(departureAirportId, airportMap) || 
                     'DEP',
      arrivalCode: arrivalAirport.airport_code || 
                   AirportService.resolveAirportCode(arrivalAirportId, airportMap) || 
                   'ARR',
      departureTime: flightSchedule.departure_time || '00:00',
      arrivalTime: flightSchedule.arrival_time || '00:00',
      selectedDate: rawBookingData.bookDate || rawBookingData.book_date,
      bookDate: rawBookingData.bookDate || rawBookingData.book_date,
      totalPrice: totalPrice,
      flightNumber: flightNumber,
      bookedSeats: seatString || 'Not Assigned'
    },
    
    travelerDetails: passengers.length > 0 ? passengers.map((passenger, index) => ({
      title: passenger.title || (passenger.gender === 'Female' ? 'Ms.' : 'Mr.'),
      fullName: passenger.name || passenger.passenger_name || `Passenger ${index + 1}`,
      email: index === 0 ? contactEmail : null, // Only first passenger gets contact info
      phone: index === 0 ? contactPhone : null,
      address: passenger.address || billing.billing_address || 'Address not provided',
      seat: seatLabels[index] || 'Not Assigned',
      age: passenger.age || '25',
      dateOfBirth: passenger.dob ? new Date(passenger.dob).toLocaleDateString() : null
    })) : [{
      title: 'Mr.',
      fullName: 'Passenger Name Not Available',
      email: contactEmail,
      phone: contactPhone,
      address: 'Address not provided',
      seat: seatLabels[0] || 'Not Assigned',
      age: '25',
      dateOfBirth: null
    }],
    
    bookingResult: {
      booking: {
        pnr: rawBookingData.pnr || `PNR${rawBookingData.bookingNo || rawBookingData.id}`,
        bookingNo: rawBookingData.bookingNo || rawBookingData.booking_no || rawBookingData.id,
        bookingStatus: rawBookingData.bookingStatus || rawBookingData.booking_status || 'CONFIRMED',
        paymentStatus: primaryPayment.payment_status || rawBookingData.paymentStatus || 'COMPLETED',
        totalFare: totalPrice,
        noOfPassengers: rawBookingData.noOfPassengers || passengers.length || 1,
        contact_no: contactPhone,
        email_id: contactEmail,
        bookDate: rawBookingData.bookDate || rawBookingData.book_date,
        bookedSeats: seatLabels
      },
      
      passengers: passengers.length > 0 ? passengers.map((passenger, index) => ({
        id: passenger.id,
        name: passenger.name || passenger.passenger_name,
        title: passenger.title,
        age: passenger.age || '25',
        type: passenger.type || passenger.passenger_type || 'Adult',
        seat: seatLabels[index] || 'Not Assigned'
      })) : [{
        id: 1,
        name: 'Passenger Name Not Available',
        title: 'Mr.',
        age: '25',
        type: 'Adult',
        seat: seatLabels[0] || 'Not Assigned'
      }],
      
      payment: {
        status: primaryPayment.payment_status || rawBookingData.paymentStatus || 'COMPLETED',
        amount: totalPrice,
        paymentMethod: primaryPayment.payment_mode || rawBookingData.pay_mode || 'Online',
        transactionId: primaryPayment.transaction_id || rawBookingData.transactionId
      },
      
      flight: {
        flightNumber: flightNumber,
        departure: departureAirportName,
        arrival: arrivalAirportName,
        departureTime: flightSchedule.departure_time || '00:00',
        arrivalTime: flightSchedule.arrival_time || '00:00',
        date: rawBookingData.bookDate || rawBookingData.book_date
      }
    }
  };

  return ticketData;
};

/**
 * Builds airport map from airport array for quick lookup
 * @param {Array} airports - Array of airport objects
 * @returns {Object} Map of airport ID to airport object
 */
export const buildAirportMap = (airports) => {
  return AirportService.buildAirportMap(airports);
};

/**
 * Validates if ticket data has required fields
 * @param {Object} ticketData - Transformed ticket data
 * @returns {Object} Validation result
 */
export const validateTicketData = (ticketData) => {
  const errors = [];
  
  if (!ticketData.bookingResult?.booking?.pnr) {
    errors.push('Missing PNR');
  }
  
  if (!ticketData.bookingData?.departure || !ticketData.bookingData?.arrival) {
    errors.push('Missing departure or arrival airport');
  }
  
  if (!ticketData.travelerDetails?.length) {
    errors.push('Missing passenger details');
  }
  
  if (ticketData.bookingData?.totalPrice <= 0) {
    errors.push('Invalid total price');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  transformTicketData,
  buildAirportMap,
  validateTicketData
};