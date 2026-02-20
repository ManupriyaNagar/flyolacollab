"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AirportServices from "./AirportServices";
import BookingHeader from "./BookingHeader";
import BookingProgress from "./BookingProgress";
import BookingSummary from "./BookingSummary";
import FlightInsights from "./FlightInsights";
import FlightSafetyInfo from "./FlightSafetyInfo";
import TourReviewStep from "./TourReviewStep";
import TravelDocuments from "./TravelDocuments";
import TravelerInfoStep from "./TravelerInfoStep";
import WeatherInfo from "./WeatherInfo";

import FlightRecommendations from "./FlightRecommendations";


import { cn } from "@/lib/utils";
import { useAuth } from "../AuthContext";

const PaymentStep = dynamic(() => import("./PaymentStep"), { ssr: false });

const EMPTY_TRAVELLER = {
  title: "",
  fullName: "",
  dateOfBirth: "",
  email: "",
  address: "",
  state: "",
  pinCode: "",
  phone: "",
  gstNumber: "",
};

export default function CombinedBookingPage() {
  const [step, setStep] = useState(1);
  const [travelerDetails, setTravelerDetails] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const router = useRouter();
  const { authState } = useAuth();

useEffect(() => {
  // Wait for auth state to load before checking
  if (authState.isLoading) {
    return;
  }
  
  const token = authState.token || localStorage.getItem("token");
  
  // Skip auth check if still loading
  if (authState.isLoading) {
    return <div className={cn('min-h-screen', 'flex', 'items-center', 'justify-center')}>Loading...</div>;
  }
  
  // For demo purposes, allow access without login
  // if (!authState.isLoggedIn || !token) {
  //   alert("Please log in to continue.");
  //   router.push("/sign-in");
  //   return;
  // }


    let raw = localStorage.getItem("bookingData");
    
    // If no localStorage data, create demo data for F1 flight
    if (!raw) {
      console.log("No localStorage data, creating demo booking data for F1 flight");
      const demoBookingData = {
        departure: "BHOPAL",
        arrival: "REWA", 
        selectedDate: "2025-11-07",
        passengers: { adults: 1, children: 0, infants: 0 },
        totalPrice: "1.00",
        flightSchedule: {
          id: 479,
          price: "1.00",
          departure_time: "10:00:00",
          arrival_time: "11:50:00"
        },
        selectedSeats: [],
        bookingType: "flight"
      };
      raw = JSON.stringify(demoBookingData);
      localStorage.setItem("bookingData", raw);
    }
    
    try {
      const data = JSON.parse(raw);

      
      const total =
        data.passengers.adults +
        data.passengers.children +
        data.passengers.infants;

      setBookingData({
        departure: data.departure,
        arrival: data.arrival,
        departureCode: data.departureCode,
        arrivalCode: data.arrivalCode,
        totalPrice: data.totalPrice.toString(),
        id: Number(data.flightSchedule.id), // Ensure id is a number
        departureTime: data.flightSchedule.departure_time,
        arrivalTime: data.flightSchedule.arrival_time,
        selectedDate: data.selectedDate,
        passengers: data.passengers,
        // CRITICAL FIX: Ensure bookingType is always set correctly
        // Check multiple sources: bookingType, type, or presence of helicopterNumber
        bookingType: data.bookingType || data.type || (data.helicopterNumber ? 'helicopter' : 'flight'),
        helicopterNumber: data.helicopterNumber,
        flightNumber: data.flightNumber,
      });
      
      // Lift selectedSeats to parent state
      const seats = Array.isArray(data.selectedSeats) ? data.selectedSeats : [];
      console.log('CombinedBookingPage: Loading seats from localStorage:', seats);
      setSelectedSeats(seats);
      
      setTravelerDetails(Array.from({ length: total }, () => ({ ...EMPTY_TRAVELLER })));
    } catch (err) {
      console.error("Invalid booking data:", err);
      // Clear invalid booking data
      localStorage.removeItem("bookingData");
      alert("Invalid booking data. Please select a flight again.");
      router.push("/scheduled-flight");
    }
  }, [authState, router]);

  function handleNext() {
    setStep((s) => Math.min(s + 1, 3));
  }

  function handlePrev() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleConfirm(bookingResult) {
    console.log('Booking confirmed with result:', bookingResult);
    
    // Extract PNR from the booking result
    const pnr = bookingResult?.booking?.pnr || bookingResult?.pnr;
    
    // Prepare complete ticket data with all necessary fields
    const ticketData = {
      bookingData: {
        ...bookingData,
        bookingNo: bookingResult?.booking?.bookingNo || bookingResult?.bookingNo,
        bookingStatus: bookingResult?.booking?.bookingStatus || bookingResult?.bookingStatus,
        paymentStatus: bookingResult?.booking?.paymentStatus || bookingResult?.paymentStatus,
        noOfPassengers: travelerDetails.length,
        bookedSeats: bookingResult?.booking?.bookedSeats || selectedSeats,
        flightNumber: bookingData?.flightNumber || 'N/A',
        helicopterNumber: bookingData?.helicopterNumber,
        departureCode: bookingData?.departureCode || bookingData?.departure?.substring(0, 3).toUpperCase() || 'DEP',
        arrivalCode: bookingData?.arrivalCode || bookingData?.arrival?.substring(0, 3).toUpperCase() || 'ARR',
        bookingType: bookingData?.bookingType || 'flight',
      },
      travelerDetails: bookingResult?.passengers || travelerDetails.map((t, index) => ({
        ...t,
        seat: bookingResult?.booking?.bookedSeats?.[index] || selectedSeats[index] || 'Not Assigned',
      })),
      bookingResult: {
        ...bookingResult,
        booking: {
          ...bookingResult?.booking,
          pnr: pnr || 'PENDING',
        },
      },
    };
     
    console.log('Saving ticket data to localStorage:', ticketData);
    localStorage.setItem("ticketData", JSON.stringify(ticketData));
    
    // Always redirect with PNR if available
    if (pnr && pnr !== 'PENDING') {
      console.log('Redirecting to ticket page with PNR:', pnr);
      router.push(`/ticket-page?pnr=${encodeURIComponent(pnr)}`);
    } else {
      console.log('PNR not available yet, redirecting to ticket page with localStorage data');
      router.push("/ticket-page");
    }
  }

  if (!bookingData) {
    return (
      <div className={cn('min-h-screen', 'bg-gradient-to-br', 'from-blue-50', 'via-white', 'to-indigo-50', 'flex', 'items-center', 'justify-center')}>
        <div className={cn('text-center', 'p-8', 'bg-white', 'rounded-xl', 'shadow-lg', 'max-w-md')}>
          <div className={cn('text-red-600', 'text-6xl', 'mb-4')}>⚠️</div>
          <h2 className={cn('text-2xl', 'font-bold', 'text-gray-800', 'mb-4')}>No Booking Data Found</h2>
          <p className={cn('text-gray-600', 'mb-6')}>
       to continue with your booking.
          </p>
          <button
            onClick={() => router.push("/scheduled-flight")}
            className={cn('px-6', 'py-3', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors')}
          >
            Select Flight
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-gradient-to-br', 'from-blue-50', 'via-white', 'to-indigo-50')}>
      <div className={cn('container', 'mx-auto', 'py-8', 'px-4', 'max-w-7xl')}>
        {/* Enhanced Header */}
        <BookingHeader bookingData={bookingData} currentStep={step} />

        {/* Progress Indicator */}
        <BookingProgress currentStep={step} />

        {/* Enhanced Flight Information Section */}
        {step === 1 && (
          <div className={cn('mb-8', 'space-y-6')}>
            {/* Flight Status & Insights */}
            <div className={cn('grid', 'gap-6')}>

              <TourReviewStep
                  bookingData={bookingData}
                  handleNextStep={handleNext}
                  handlePreviousStep={null}
                  step={step}
                />
     
            </div>
            
            {/* Travel Services */}
            {/* <div className={cn('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-6')}>
              <FlightComparison bookingData={bookingData} />
              <TravelInsurance bookingData={bookingData} />
            </div>
             */}
            {/* Safety & Documentation */}
            <div className={cn('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-6')}>
              <FlightSafetyInfo />
              <TravelDocuments bookingData={bookingData} />
            </div>
            
            {/* Airport Services */}
            <AirportServices bookingData={bookingData} />
            
            {/* Travel Guide */}
 
            
            {/* Flight Recommendations */}
            <FlightRecommendations currentBooking={bookingData} />
          </div>
        )}

        <div className={cn('flex', 'flex-col', 'lg:flex-row', 'gap-8', 'mt-8')}>
          {/* Main Content */}
          <div className={cn('flex-1', 'space-y-6')}>
            {step === 1 && (
              <>
                      <FlightInsights bookingData={bookingData} />
                <WeatherInfo bookingData={bookingData} />
              </>
            )}
            {step === 2 && (
              <TravelerInfoStep
                travelerDetails={travelerDetails}
                setTravelerDetails={setTravelerDetails}
                handleNextStep={handleNext}
                handlePreviousStep={handlePrev}
                bookingData={bookingData}
              />
            )}
            {step === 3 && (
              <PaymentStep
                bookingData={bookingData}
                travelerDetails={travelerDetails}
                handlePreviousStep={handlePrev}
                onConfirm={handleConfirm}
                isAdmin={Number(authState.user?.role) === 1}
                isAgent={Number(authState.user?.role) === 2}
                selectedSeats={selectedSeats}
                onChangeSeats={setSelectedSeats}
              />
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:w-96">
            <BookingSummary 
              bookingData={bookingData}
              travelerDetails={travelerDetails}
              currentStep={step}
            />
          </div>
        </div>
      </div>
    </div>
  );
}