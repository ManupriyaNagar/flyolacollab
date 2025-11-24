"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfessionalTicket from "./../../components/SingleTicket/ProfessionalTicket";
import BASE_URL from "@/baseUrl/baseUrl";

// Loading fallback component
const TicketPageLoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading ticket page...</p>
    </div>
  </div>
);

// Main content component that uses useSearchParams
const TicketPageContent = () => {
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const pnr = searchParams.get("pnr");
  const bookingId = searchParams.get("id");

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Priority 1: Try URL parameters (PNR or booking ID)
        if (pnr || bookingId) {
          const identifier = pnr || bookingId;
          const url = `${BASE_URL}/tickets/get-ticket?pnr=${encodeURIComponent(identifier)}`;
          const response = await fetch(url);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || `Failed to fetch ticket: ${response.status}`);
          }

          const result = await response.json();

          if (!result.success || !result.data) {
            throw new Error(result.message || "No booking found");
          }

          // Format the data from API response
          const ticketData = result.data;
          const booking = ticketData.booking;
          const flight = ticketData.flight;
          const passengers = ticketData.passengers || [];
          const payment = ticketData.payment || {};
          const seats = ticketData.seats || {};

          const formattedData = {
            bookingData: {
              id: booking.id,
              departure: flight.departure,
              arrival: flight.arrival,
              departureCode: flight.departureCode || 'DEP',
              arrivalCode: flight.arrivalCode || 'ARR',
              departureTime: flight.departureTime,
              arrivalTime: flight.arrivalTime,
              selectedDate: flight.selectedDate,
              totalPrice: flight.totalPrice,
              bookDate: booking.bookDate,
              flightId: flight.id,
              flightNumber: flight.flightNumber,
              helicopterNumber: flight.helicopterNumber,
              bookedSeats: seats.labels || 'Not Assigned',
              bookingType: flight.bookingType || 'flight'
            },
            travelerDetails: passengers.map((passenger, index) => ({
              title: passenger.title || "Mr",
              fullName: passenger.fullName || passenger.name || "Passenger",
              dateOfBirth: passenger.dateOfBirth,
              email: passenger.email || booking.email_id || "contact@flyolaindia.com",
              phone: passenger.phone || booking.contact_no || "+91-9876543210",
              address: passenger.address || "",
              seat: passenger.seat || seats.details?.[index]?.label || 'Not Assigned'
            })),
            bookingResult: {
              booking: {
                pnr: booking.pnr,
                bookingNo: booking.bookingNo,
                bookDate: booking.bookDate,
                paymentStatus: booking.paymentStatus || "COMPLETED",
                bookingStatus: booking.bookingStatus || "CONFIRMED",
                totalFare: booking.totalFare,
                noOfPassengers: booking.noOfPassengers,
                contact_no: booking.contact_no,
                email_id: booking.email_id,
                bookedSeats: seats.details?.map(seat => seat.label) || []
              },
              passengers: passengers.map((passenger, index) => ({
                age: passenger.age || "25",
                type: passenger.type || "Adult",
                name: passenger.name || passenger.fullName,
                title: passenger.title,
                seat: passenger.seat || seats.details?.[index]?.label || 'Not Assigned'
              })),
              payment: {
                status: payment.status || booking.paymentStatus || "COMPLETED",
                amount: payment.amount || booking.totalFare
              }
            }
          };

          setTicketData(formattedData);
          return;
        }

        // Priority 2: Try localStorage (for newly completed bookings)
        const storedData = localStorage.getItem("ticketData");
        
        if (storedData) {
          const data = JSON.parse(storedData);
          
          // Validate the data structure
          if (data.bookingData && data.travelerDetails && data.bookingResult) {
            const localPnr = data.bookingResult?.booking?.pnr || data.bookingResult?.pnr;
            
            // Check if PNR is valid and try to fetch from API
            if (localPnr && localPnr !== 'MISSING_PNR' && localPnr !== 'undefined' && localPnr !== 'null') {
              console.log('Found valid PNR in localStorage, fetching from API:', localPnr);
            
            try {
              const url = `${BASE_URL}/tickets/get-ticket?pnr=${encodeURIComponent(localPnr)}`;
              const response = await fetch(url);

              if (response.ok) {
                const result = await response.json();
                
                if (result.success && result.data) {
                  // Format the data from API response
                  const ticketData = result.data;
                  const booking = ticketData.booking;
                  const flight = ticketData.flight;
                  const passengers = ticketData.passengers || [];
                  const payment = ticketData.payment || {};
                  const seats = ticketData.seats || {};

                  const formattedData = {
                    bookingData: {
                      id: booking.id,
                      departure: flight.departure,
                      arrival: flight.arrival,
                      departureCode: flight.departureCode || 'DEP',
                      arrivalCode: flight.arrivalCode || 'ARR',
                      departureTime: flight.departureTime,
                      arrivalTime: flight.arrivalTime,
                      selectedDate: flight.selectedDate,
                      totalPrice: flight.totalPrice,
                      bookDate: booking.bookDate,
                      flightId: flight.id,
                      flightNumber: flight.flightNumber,
                      helicopterNumber: flight.helicopterNumber,
                      bookedSeats: seats.labels || 'Not Assigned',
                      bookingType: flight.bookingType || 'flight'
                    },
                    travelerDetails: passengers.map((passenger, index) => ({
                      title: passenger.title || "Mr",
                      fullName: passenger.fullName || passenger.name || "Passenger",
                      dateOfBirth: passenger.dateOfBirth,
                      email: passenger.email || booking.email_id || "contact@flyolaindia.com",
                      phone: passenger.phone || booking.contact_no || "+91-9876543210",
                      address: passenger.address || "",
                      seat: passenger.seat || seats.details?.[index]?.label || 'Not Assigned'
                    })),
                    bookingResult: {
                      booking: {
                        pnr: booking.pnr,
                        bookingNo: booking.bookingNo,
                        bookDate: booking.bookDate,
                        paymentStatus: booking.paymentStatus || "COMPLETED",
                        bookingStatus: booking.bookingStatus || "CONFIRMED",
                        totalFare: booking.totalFare,
                        noOfPassengers: booking.noOfPassengers,
                        contact_no: booking.contact_no,
                        email_id: booking.email_id,
                        bookedSeats: seats.details?.map(seat => seat.label) || []
                      },
                      passengers: passengers.map((passenger, index) => ({
                        age: passenger.age || "25",
                        type: passenger.type || "Adult",
                        name: passenger.name || passenger.fullName,
                        title: passenger.title,
                        seat: passenger.seat || seats.details?.[index]?.label || 'Not Assigned'
                      })),
                      payment: {
                        status: payment.status || booking.paymentStatus || "COMPLETED",
                        amount: payment.amount || booking.totalFare
                      }
                    }
                  };

                  setTicketData(formattedData);
                  return;
                }
              }
              
              // If API fails, use localStorage data as fallback
              console.warn('API fetch failed for PNR:', localPnr, 'Using localStorage data');
              setTicketData(data);
              return;
              
            } catch (apiError) {
              console.error('Error fetching from API:', apiError);
              // Use localStorage data as fallback
              console.log('Using localStorage data as fallback');
              setTicketData(data);
              return;
            }
            } else {
              // No valid PNR but has complete data - use localStorage directly
              console.log('No valid PNR, but localStorage has complete data. Using it directly.');
              setTicketData(data);
              return;
            }
          }
        }

        // No valid data found - show error
        throw new Error("No ticket data found. Please search for your ticket using PNR.");

      } catch (err) {
        console.error('Ticket Page Error:', err);
        setError(err.message || "Failed to load ticket data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTicketData();
  }, [pnr, bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading ticket data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ticket Not Found</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 text-sm mb-6">
            To view your ticket, you can either:
            <br />• Complete a new booking
            <br />• Search using your PNR number
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => router.push("/get-ticket")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Search by PNR
            </button>
            <button
              onClick={() => router.push("/scheduled-flight")}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Book New Flight
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-gray-400 text-5xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Ticket Data</h2>
          <p className="text-gray-600 mb-6">Unable to load ticket information.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/get-ticket")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Get Ticket
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProfessionalTicket
        bookingData={ticketData.bookingData}
        travelerDetails={ticketData.travelerDetails}
        bookingResult={ticketData.bookingResult}
      />
    </div>
  );
};

// Main component with Suspense boundary
const TicketPage = () => {
  return (
    <Suspense fallback={<TicketPageLoadingFallback />}>
      <TicketPageContent />
    </Suspense>
  );
};

export default TicketPage;