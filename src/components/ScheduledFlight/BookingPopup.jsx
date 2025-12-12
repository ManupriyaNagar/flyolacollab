"use client";
import BASE_URL from "@/baseUrl/baseUrl";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaClock, FaPlane, FaUserFriends } from "react-icons/fa";

const tz = "Asia/Kolkata";

// Memoized seat button component to prevent unnecessary re-renders
const SeatButton = memo(({ seat, isSelected, isAvailable, onToggle, disabled }) => (
  <button
    onClick={() => onToggle(seat)}
    className={`h-12 rounded-lg text-sm font-bold transition-colors duration-150 ${isSelected
      ? "bg-green-500 text-white shadow-md"
      : isAvailable
        ? "bg-blue-200 text-gray-800 hover:bg-blue-300"
        : "bg-red-200 text-gray-500 cursor-not-allowed"
      }`}
    disabled={disabled || !isAvailable}
  >
    {seat}
  </button>
));

SeatButton.displayName = 'SeatButton';

const BookingPopup = ({ closePopup, passengerData, departure, arrival, selectedDate, flightSchedule }) => {
  const router = useRouter();
  const [passengers] = useState({
    adults: passengerData.adults || 1,
    children: passengerData.children || 0,
    infants: passengerData.infants || 0,
  });
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized constants to prevent recalculation
  const basePrice = useMemo(() => parseFloat(flightSchedule.price || 2000), [flightSchedule.price]);
  const childDiscount = 0.5;
  const infantFee = 10;
  const totalPassengers = useMemo(() => passengers.adults + passengers.children, [passengers.adults, passengers.children]);
  const allSeats = useMemo(() => flightSchedule.allSeats || ["S1", "S2", "S3", "S4", "S5", "S6"], [flightSchedule.allSeats]);

  // Optimized date validation
  const formattedDate = useMemo(() => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) return selectedDate;
    return new Date().toISOString().split("T")[0];
  }, [selectedDate]);

  // Optimized time formatting
  const formatTime = useCallback((t) => {
    if (!t) return "N/A";
    if (/^\d{6}$/.test(t)) return `${t.slice(0, 2)}:${t.slice(2, 4)}`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5);
    try {
      return new Date(`1970-01-01 ${t}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: tz,
      });
    } catch {
      return "N/A";
    }
  }, []);

  const departureTime = useMemo(() => formatTime(flightSchedule.departure_time), [flightSchedule.departure_time, formatTime]);
  const arrivalTime = useMemo(() => formatTime(flightSchedule.arrival_time), [flightSchedule.arrival_time, formatTime]);

  const fetchAvailableSeats = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        `${BASE_URL}/booked-seat/available-seats?schedule_id=${flightSchedule.id}&bookDate=${formattedDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Seats API failed: ${response.status}`);
      }

      const data = await response.json();
      const seats = Array.isArray(data.availableSeats)
        ? data.availableSeats.filter((seat) => allSeats.includes(seat))
        : allSeats;

      setAvailableSeats(seats);
      setSelectedSeats(seats.slice(0, totalPassengers));
      setError(null);
    } catch (err) {
      setError(`Unable to load seats. Using fallback.`);
      setAvailableSeats(allSeats);
      setSelectedSeats(allSeats.slice(0, totalPassengers));
    } finally {
      setLoading(false);
    }
  }, [flightSchedule.id, formattedDate, allSeats, totalPassengers]);

  useEffect(() => {
    fetchAvailableSeats();
  }, [fetchAvailableSeats]);

  const handleSeatToggle = useCallback((seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : prev.length < totalPassengers
          ? [...prev, seat]
          : prev
    );
  }, [totalPassengers]);

  const calculateTotalPrice = useMemo(() => {
    const adultPrice = basePrice * passengers.adults;
    const childPrice = basePrice * passengers.children * childDiscount;
    const infantPrice = passengers.infants * infantFee;
    return (adultPrice + childPrice + infantPrice).toFixed(2);
  }, [basePrice, passengers]);

  const handleConfirmBooking = useCallback(() => {
    if (selectedSeats.length !== totalPassengers) {
      alert(`Please select exactly ${totalPassengers} seat(s) for all passengers.`);
      return;
    }
    try {
      const bookingData = {
        departure,
        arrival,
        selectedDate: formattedDate,
        passengers,
        totalPrice: calculateTotalPrice,
        flightSchedule,
        selectedSeats,
      };
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      closePopup();
      router.push("/combined-booking-page");
    } catch (error) {
      alert("An error occurred while processing your booking. Please try again.");
    }
  }, [closePopup, router, departure, arrival, formattedDate, passengers, calculateTotalPrice, flightSchedule, selectedSeats, totalPassengers]);

  const handleRetry = useCallback(() => {
    setError(null);
    fetchAvailableSeats();
  }, [fetchAvailableSeats]);

  // Optimized backdrop click handler
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  }, [closePopup]);

  return (
    <AnimatePresence>
      <motion.div
        className={cn('fixed', 'inset-0', 'bg-black/60', 'flex', 'items-center', 'justify-center', 'z-50', 'p-4', 'overflow-y-auto')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className={cn('bg-white', 'rounded-3xl', 'shadow-2xl', 'w-full', 'max-w-2xl', 'max-h-[95vh]', 'overflow-y-auto', 'border', 'border-gray-200')}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={cn('bg-gradient-to-r', 'from-blue-600', 'to-indigo-700', 'text-white', 'p-6', 'rounded-t-3xl')}>
            <div className={cn('flex', 'justify-between', 'items-center')}>
              <div>
                <h2 className={cn('text-2xl', 'font-bold', 'flex', 'items-center', 'gap-3')}>
                  <FaPlane className="text-yellow-300" />
                  Complete Your Booking
                </h2>
                <p className={cn('text-blue-100', 'mt-1')}>Secure your seats in just a few clicks</p>
              </div>
              <button
                className={cn('text-white/80', 'hover:text-white', 'hover:bg-white/20', 'p-2', 'rounded-full', 'transition-all')}
                onClick={closePopup}
                aria-label="Close"
              >
                <svg className={cn('w-6', 'h-6')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className={cn('p-6', 'space-y-6')}>
            {/* Flight Details */}
            <div className={cn('bg-gradient-to-br', 'from-blue-50', 'to-indigo-50', 'p-6', 'rounded-2xl', 'border', 'border-blue-200')}>
              <h3 className={cn('text-lg', 'font-semibold', 'text-gray-800', 'mb-4', 'flex', 'items-center', 'gap-2')}>
                <FaPlane className="text-blue-600" />
                Flight Details
              </h3>
              <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                <div className="space-y-3">
                  <div className={cn('flex', 'items-center', 'gap-3')}>
                    <div className={cn('w-2', 'h-2', 'bg-green-500', 'rounded-full')}></div>
                    <span className={cn('text-sm', 'text-gray-600')}>From:</span>
                    <span className={cn('font-semibold', 'text-gray-800')}>{departure}</span>
                  </div>
                  <div className={cn('flex', 'items-center', 'gap-3')}>
                    <div className={cn('w-2', 'h-2', 'bg-red-500', 'rounded-full')}></div>
                    <span className={cn('text-sm', 'text-gray-600')}>To:</span>
                    <span className={cn('font-semibold', 'text-gray-800')}>{arrival}</span>
                  </div>
                  <div className={cn('flex', 'items-center', 'gap-3')}>
                    <FaCalendarAlt className="text-blue-500" size={12} />
                    <span className={cn('text-sm', 'text-gray-600')}>Date:</span>
                    <span className={cn('font-semibold', 'text-gray-800')}>
                      {new Date(formattedDate).toLocaleDateString("en-US", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className={cn('bg-white', 'p-3', 'rounded-xl', 'border', 'border-gray-200')}>
                    <div className={cn('flex', 'items-center', 'justify-between')}>
                      <span className={cn('text-sm', 'text-gray-600', 'flex', 'items-center', 'gap-2')}>
                        <FaClock className="text-green-500" />
                        Departure
                      </span>
                      <span className={cn('font-bold', 'text-lg', 'text-gray-800')}>{departureTime}</span>
                    </div>
                  </div>
                  <div className={cn('bg-white', 'p-3', 'rounded-xl', 'border', 'border-gray-200')}>
                    <div className={cn('flex', 'items-center', 'justify-between')}>
                      <span className={cn('text-sm', 'text-gray-600', 'flex', 'items-center', 'gap-2')}>
                        <FaClock className="text-blue-500" />
                        Arrival
                      </span>
                      <span className={cn('font-bold', 'text-lg', 'text-gray-800')}>{arrivalTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Information */}
            <div className={cn('bg-gradient-to-br', 'from-green-50', 'to-emerald-50', 'p-6', 'rounded-2xl', 'border', 'border-green-200')}>
              <h3 className={cn('text-lg', 'font-semibold', 'text-gray-800', 'mb-4', 'flex', 'items-center', 'gap-2')}>
                <FaUserFriends className="text-green-600" />
                Passenger Details
              </h3>
              <div className={cn('grid', 'grid-cols-3', 'gap-4')}>
                <div className={cn('text-center', 'bg-white', 'p-4', 'rounded-xl', 'border', 'border-green-200')}>
                  <div className={cn('text-2xl', 'font-bold', 'text-green-600')}>{passengers.adults}</div>
                  <div className={cn('text-sm', 'text-gray-600')}>Adults</div>
                </div>
                <div className={cn('text-center', 'bg-white', 'p-4', 'rounded-xl', 'border', 'border-green-200')}>
                  <div className={cn('text-2xl', 'font-bold', 'text-blue-600')}>{passengers.children}</div>
                  <div className={cn('text-sm', 'text-gray-600')}>Children</div>
                </div>
                <div className={cn('text-center', 'bg-white', 'p-4', 'rounded-xl', 'border', 'border-green-200')}>
                  <div className={cn('text-2xl', 'font-bold', 'text-purple-600')}>{passengers.infants}</div>
                  <div className={cn('text-sm', 'text-gray-600')}>Infants</div>
                </div>
              </div>
            </div>

            {/* Seat Selection */}
            <div className={cn('bg-gradient-to-br', 'from-yellow-50', 'to-orange-50', 'p-6', 'rounded-2xl', 'border', 'border-yellow-200')}>
              <h3 className={cn('text-lg', 'font-semibold', 'text-gray-800', 'mb-4', 'flex', 'items-center', 'gap-2')}>
                <svg className={cn('w-5', 'h-5', 'text-yellow-600')} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" />
                </svg>
                Select Your Seats ({selectedSeats.length}/{totalPassengers})
              </h3>

              {loading ? (
                <div className={cn('py-8', 'space-y-4')}>
                  <div className={cn('flex', 'items-center', 'justify-center', 'mb-4')}>
                    <div className={cn('h-4', 'w-48', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
                  </div>
                  <div className={cn('grid', 'grid-cols-2', 'gap-3', 'max-w-[8rem]', 'mx-auto')}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={cn('h-10', 'bg-gray-200', 'rounded-lg', 'animate-pulse')}></div>
                    ))}
                  </div>
                </div>
              ) : error && availableSeats.length === 0 ? (
                <div className={cn('text-center', 'py-6', 'bg-red-50', 'rounded-xl', 'border', 'border-red-200')}>
                  <p className={cn('text-red-600', 'mb-3')}>{error}</p>
                  <button
                    onClick={handleRetry}
                    className={cn('px-4', 'py-2', 'bg-red-500', 'text-white', 'rounded-lg', 'hover:bg-red-600', 'transition-colors')}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div>
                  <div className={cn('mb-4', 'flex', 'items-center', 'justify-center', 'gap-6', 'text-sm')}>
                    <div className={cn('flex', 'items-center', 'gap-2')}>
                      <div className={cn('w-4', 'h-4', 'bg-green-500', 'rounded')}></div>
                      <span>Selected</span>
                    </div>
                    <div className={cn('flex', 'items-center', 'gap-2')}>
                      <div className={cn('w-4', 'h-4', 'bg-blue-200', 'rounded')}></div>
                      <span>Available</span>
                    </div>
                    <div className={cn('flex', 'items-center', 'gap-2')}>
                      <div className={cn('w-4', 'h-4', 'bg-red-200', 'rounded')}></div>
                      <span>Occupied</span>
                    </div>
                  </div>

                  <div className={cn('bg-white', 'p-4', 'rounded-xl', 'border', 'border-gray-200')}>
                    <div className={cn('text-center', 'mb-4')}>
                      <div className={cn('inline-block', 'bg-gray-800', 'text-white', 'px-4', 'py-1', 'rounded-full', 'text-xs', 'font-medium')}>
                        ✈️ FRONT OF AIRCRAFT
                      </div>
                    </div>
                    <div className={cn('grid', 'grid-cols-3', 'gap-3', 'max-w-xs', 'mx-auto')}>
                      {allSeats.map((seat) => (
                        <SeatButton
                          key={seat}
                          seat={seat}
                          isSelected={selectedSeats.includes(seat)}
                          isAvailable={availableSeats.includes(seat)}
                          onToggle={handleSeatToggle}
                          disabled={selectedSeats.length >= totalPassengers && !selectedSeats.includes(seat)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className={cn('bg-gradient-to-br', 'from-purple-50', 'to-pink-50', 'p-6', 'rounded-2xl', 'border', 'border-purple-200')}>
              <h3 className={cn('text-lg', 'font-semibold', 'text-gray-800', 'mb-4')}>Price Breakdown</h3>
              <div className="space-y-3">
                <div className={cn('flex', 'justify-between', 'items-center')}>
                  <span className="text-gray-600">Base Price (Adults: {passengers.adults})</span>
                  <span className="font-semibold">₹{(basePrice * passengers.adults).toLocaleString('en-IN')}</span>
                </div>
                {passengers.children > 0 && (
                  <div className={cn('flex', 'justify-between', 'items-center')}>
                    <span className="text-gray-600">Children ({passengers.children}) - 50% off</span>
                    <span className="font-semibold">₹{(basePrice * passengers.children * childDiscount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {passengers.infants > 0 && (
                  <div className={cn('flex', 'justify-between', 'items-center')}>
                    <span className="text-gray-600">Infants ({passengers.infants})</span>
                    <span className="font-semibold">₹{(passengers.infants * infantFee).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className={cn('border-t', 'border-gray-300', 'pt-3')}>
                  <div className={cn('flex', 'justify-between', 'items-center', 'text-xl', 'font-bold')}>
                    <span className="text-gray-800">Total Amount</span>
                    <span className="text-green-600">₹{parseFloat(calculateTotalPrice).toLocaleString('en-IN')}</span>
                  </div>
                  <p className={cn('text-xs', 'text-gray-500', 'mt-1')}>✅ Includes all taxes and fees</p>
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmBooking}
              className={cn('w-full', 'py-4', 'bg-gradient-to-r', 'from-green-600', 'to-blue-600', 'text-white', 'rounded-2xl', 'text-lg', 'font-bold', 'hover:from-green-700', 'hover:to-blue-700', 'transition-colors', 'duration-200', 'shadow-lg', 'hover:shadow-xl', 'disabled:from-gray-400', 'disabled:to-gray-500', 'disabled:cursor-not-allowed')}
              disabled={loading || (error && availableSeats.length === 0) || selectedSeats.length !== totalPassengers}
            >
              {loading ? (
                <div className={cn('flex', 'items-center', 'justify-center', 'gap-3')}>
                  <div className={cn('h-5', 'w-5', 'bg-white/30', 'rounded', 'animate-pulse')}></div>
                  Processing...
                </div>
              ) : selectedSeats.length !== totalPassengers ? (
                `Select ${totalPassengers - selectedSeats.length} more seat${totalPassengers - selectedSeats.length > 1 ? 's' : ''}`
              ) : (
                `🎫 Confirm Booking - ₹${parseFloat(calculateTotalPrice).toLocaleString('en-IN')}`
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingPopup;