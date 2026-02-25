"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";
import { FaArrowLeft, FaHelicopter, FaPlane } from "react-icons/fa";

// Import new secure components
import PassengerInfo from "@/components/booking/info/PassengerInfo";
import PriceBreakdown from "@/components/booking/info/PriceBreakdown";
import VehicleDetails from "@/components/booking/info/VehicleDetails";
import SeatSelector from "@/components/booking/seat/SeatSelector";
import Toast from "@/components/booking/ui/Toast";

// Import business logic
import { BookingValidator } from "@/lib/business/BookingValidator";
import { PriceCalculator } from "@/lib/business/PriceCalculator";

/**
 * Refactored Booking Page
 * Now uses modular, secure components
 * Reduced from 746 lines to ~200 lines
 */
const BookingPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get booking data from URL parameters
  const bookingParams = useMemo(() => ({
    departure: searchParams.get('departure') || '',
    arrival: searchParams.get('arrival') || '',
    selectedDate: searchParams.get('date') || '',
    scheduleId: searchParams.get('scheduleId') || '',
    price: searchParams.get('price') || '0',
    departureTime: searchParams.get('departureTime') || '',
    arrivalTime: searchParams.get('arrivalTime') || '',
    passengers: parseInt(searchParams.get('passengers') || '1'),
    bookingType: searchParams.get('type') || 'flight',
    departureCode: searchParams.get('departureCode') || '',
    arrivalCode: searchParams.get('arrivalCode') || '',
    helicopterNumber: searchParams.get('helicopterNumber'),
    flightNumber: searchParams.get('flightNumber')
  }), [searchParams]);

  // State
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Passenger data
  const passengerData = useMemo(() => ({
    adults: bookingParams.passengers || 1,
    children: 0,
    infants: 0
  }), [bookingParams.passengers]);

  // Total passengers needing seats
  const totalPassengers = useMemo(
    () => passengerData.adults + passengerData.children,
    [passengerData]
  );

  // Show toast notification
  const showToast = useCallback((message, type = 'info') => {
    setToast({ show: true, message, type });
  }, []);

  // Handle seat selection change
  const handleSeatsChange = useCallback((seats) => {
    setSelectedSeats(seats);
  }, []);

  // Handle seat selection error
  const handleSeatError = useCallback((error) => {
    showToast(error, 'error');
  }, [showToast]);

  // Format time helper
  const formatTime = useCallback((time) => {
    if (!time) return "N/A";
    if (/^\d{6}$/.test(time)) return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time.slice(0, 5);
    if (/^\d{2}:\d{2}$/.test(time)) return time;
    return time;
  }, []);

  // Handle confirm booking
  const handleConfirmBooking = useCallback(() => {
    // Validate seat selection
    const validation = BookingValidator.validatePassengerCount(
      selectedSeats,
      totalPassengers
    );

    if (!validation.valid) {
      showToast(validation.error, 'error');
      return;
    }

    try {
      // Calculate total price using secure calculator
      const totalPrice = PriceCalculator.calculateTotal({
        basePrice: parseFloat(bookingParams.price),
        passengers: passengerData,
        travelers: [],
        bookingType: bookingParams.bookingType
      });

      // Prepare booking data
      const bookingData = {
        departure: bookingParams.departure,
        arrival: bookingParams.arrival,
        departureCode: bookingParams.departureCode || bookingParams.departure.substring(0, 3).toUpperCase(),
        arrivalCode: bookingParams.arrivalCode || bookingParams.arrival.substring(0, 3).toUpperCase(),
        selectedDate: bookingParams.selectedDate,
        passengers: passengerData,
        totalPrice: totalPrice,
        flightSchedule: {
          id: bookingParams.scheduleId,
          price: bookingParams.price,
          departure_time: bookingParams.departureTime,
          arrival_time: bookingParams.arrivalTime
        },
        selectedSeats,
        bookingType: bookingParams.bookingType,
        helicopterNumber: bookingParams.helicopterNumber,
        flightNumber: bookingParams.flightNumber
      };

      // Save to localStorage and navigate
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      router.push("/combined-booking-page");
    } catch (error) {
      showToast("An error occurred while processing your booking. Please try again.", 'error');
    }
  }, [
    selectedSeats,
    totalPassengers,
    bookingParams,
    passengerData,
    router,
    showToast
  ]);

  // Validate required parameters
  if (!bookingParams.departure || !bookingParams.arrival || !bookingParams.selectedDate || !bookingParams.scheduleId) {
    return (
      <div className={cn('min-h-screen bg-gray-50 flex items-center justify-center p-4')}>
        <div className={cn('bg-white rounded-2xl p-8 max-w-lg w-full text-center shadow-xl')}>
          <div className={cn('text-red-500', 'text-6xl', 'mb-4')}>⚠️</div>
          <h1 className={cn('text-2xl', 'font-bold', 'text-gray-800', 'mb-4')}>
            Missing Booking Information
          </h1>
          <p className={cn('text-gray-600', 'mb-6')}>
            Some required booking details are missing. Please go back and select a {bookingParams.bookingType} again.
          </p>
          <Link
            href={bookingParams.bookingType === 'helicopter' ? "/helicopter-flight" : "/scheduled-flight"}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3',
              'bg-blue-600 text-white rounded-lg',
              'hover:bg-blue-700 transition-colors'
            )}
          >
            <FaArrowLeft />
            Back to {bookingParams.bookingType === 'helicopter' ? 'Helicopters' : 'Flights'}
          </Link>
        </div>
      </div>
    );
  }

  const Icon = bookingParams.bookingType === 'helicopter' ? FaHelicopter : FaPlane;

  return (
    <div className={cn('min-h-screen', 'bg-gray-50', 'py-8', 'px-4')}>
      <div className={cn('max-w-7xl', 'mx-auto')}>
        {/* Header */}
        <div className={cn(
          'bg-gradient-to-r from-blue-600 to-indigo-700',
          'text-white p-6 rounded-t-2xl shadow-lg'
        )}>
          <div className={cn('flex', 'items-center', 'justify-between')}>
            <div>
              <h1 className={cn('text-3xl', 'font-bold', 'flex', 'items-center', 'gap-3')}>
                <Icon className="text-yellow-300" />
                Complete Your Booking
              </h1>
              <p className={cn('text-blue-100', 'mt-2')}>
                Secure your seats in just a few clicks
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={cn('bg-white', 'p-6', 'rounded-b-2xl', 'shadow-lg', 'space-y-6')}>
          {/* Vehicle Details */}
          <VehicleDetails
            bookingType={bookingParams.bookingType}
            departure={bookingParams.departure}
            arrival={bookingParams.arrival}
            date={bookingParams.selectedDate}
            departureTime={formatTime(bookingParams.departureTime)}
            arrivalTime={formatTime(bookingParams.arrivalTime)}
          />

          {/* Passenger Information */}
          <PassengerInfo
            adults={passengerData.adults}
            children={passengerData.children}
            infants={passengerData.infants}
          />

          {/* Seat Selection */}
          <SeatSelector
            scheduleId={bookingParams.scheduleId}
            bookingDate={bookingParams.selectedDate}
            bookingType={bookingParams.bookingType}
            maxSeats={totalPassengers}
            vehicleType={bookingParams.bookingType}
            onSeatsChange={handleSeatsChange}
            onError={handleSeatError}
          />

          {/* Price Breakdown */}
          <PriceBreakdown
            basePrice={parseFloat(bookingParams.price)}
            passengers={passengerData}
            travelers={[]}
            bookingType={bookingParams.bookingType}
          />

          {/* Action Buttons */}
          <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4')}>
            <Link
              href={bookingParams.bookingType === 'helicopter' ? "/helicopter-flight" : "/scheduled-flight"}
              className={cn(
                'flex-1 py-4 px-6 text-center',
                'bg-gray-100 text-gray-700 rounded-2xl',
                'text-lg font-bold',
                'hover:bg-gray-200 transition-colors'
              )}
            >
              ← Back to {bookingParams.bookingType === 'helicopter' ? 'Helicopters' : 'Flights'}
            </Link>
            
            <button
              onClick={handleConfirmBooking}
              disabled={selectedSeats.length !== totalPassengers}
              className={cn(
                'flex-1 py-4 px-6',
                'bg-gradient-to-r from-blue-600 to-blue-600',
                'text-white rounded-2xl text-lg font-bold',
                'hover:from-blue-700 hover:to-blue-700',
                'transition-all duration-200 shadow-lg hover:shadow-xl',
                'disabled:from-gray-400 disabled:to-gray-500',
                'disabled:cursor-not-allowed'
              )}
            >
              {selectedSeats.length !== totalPassengers
                ? `Select ${totalPassengers - selectedSeats.length} more seat${totalPassengers - selectedSeats.length > 1 ? 's' : ''}`
                : `🎫 Confirm Booking - ${PriceCalculator.formatPrice(
                    PriceCalculator.calculateTotal({
                      basePrice: parseFloat(bookingParams.price),
                      passengers: passengerData,
                      travelers: [],
                      bookingType: bookingParams.bookingType
                    })
                  )}`
              }
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'info' })}
      />
    </div>
  );
};

// Main component with Suspense
const BookingPage = () => {
  return (
    <Suspense fallback={
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <div className={cn('w-16', 'h-16', 'border-4', 'border-blue-600', 'border-t-transparent', 'rounded-full', 'animate-spin', 'mx-auto', 'mb-4')} />
          <p className="text-gray-600">Loading booking page...</p>
        </div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
};

export default BookingPage;
