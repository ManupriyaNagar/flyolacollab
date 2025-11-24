// Test script to verify ticket data transformation
// This tests the centralized ticket transformation with real data

import { transformTicketData, buildAirportMap } from './ticketDataTransformer.js';
import { AirportService } from '../services/api.js';

// Sample booking data based on the real API response
const sampleBookingData = {
  id: 2454,
  pnr: "EDQRM2",
  bookingNo: "BOOK1755091155873",
  contact_no: "1234554321",
  email_id: "ks@Kk.dff",
  noOfPassengers: 1,
  bookDate: "2025-08-15",
  schedule_id: 479,
  totalFare: "1.00",
  paymentStatus: "SUCCESS",
  bookingStatus: "CONFIRMED",
  bookedUserId: 3069,
  
  FlightSchedule: {
    id: 479,
    flight_id: 15,
    departure_airport_id: 1,
    arrival_airport_id: 7,
    departure_time: "10:00:00",
    arrival_time: "11:50:00",
    price: "1.00",
    Flight: {
      id: 15,
      flight_number: "Vt-Dej/Vt-emj(F1)"
    }
  },
  
  Passengers: [
    {
      id: 3716,
      name: "Kshitiz Maurya",
      age: 47,
      dob: "1978-06-06",
      title: "Mr.",
      type: "Adult",
      bookingId: 2454
    }
  ],
  
  BookedSeats: [
    {
      seat_label: "S1"
    }
  ],
  
  Payments: [
    {
      id: 1666,
      transaction_id: "TXN1755091155873",
      payment_status: "SUCCESS",
      payment_mode: "RAZORPAY",
      payment_amount: "1"
    }
  ]
};

// Test the transformation

try {
  // Build airport map using the centralized service
  const airports = await AirportService.getAirports();
  const airportMap = AirportService.buildAirportMap(airports);
  
  // Transform the data
  const transformedData = transformTicketData(sampleBookingData, airportMap);
  
    departure: transformedData.bookingData.departure,
    arrival: transformedData.bookingData.arrival,
    departureCode: transformedData.bookingData.departureCode,
    arrivalCode: transformedData.bookingData.arrivalCode,
    flightNumber: transformedData.bookingData.flightNumber,
    totalPrice: transformedData.bookingData.totalPrice
  });
  
    name: t.fullName,
    seat: t.seat,
    email: t.email,
    phone: t.phone
  })));
  
    pnr: transformedData.bookingResult.booking.pnr,
    bookingNo: transformedData.bookingResult.booking.bookingNo,
    totalFare: transformedData.bookingResult.booking.totalFare,
    passengerCount: transformedData.bookingResult.passengers.length,
    seats: transformedData.bookingResult.booking.bookedSeats
  });
  
} catch (error) {
}

export { sampleBookingData };