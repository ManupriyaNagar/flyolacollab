"use client";
import AuthModal from "@/components/AuthModal";
import { cn } from "@/lib/utils";
import API from "@/services/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaPlane, FaUserFriends } from "react-icons/fa";

const tz = "Asia/Kolkata";
const fmtTime = (t) => {
  if (!t) return "N/A";
  if (/^\d{6}$/.test(t)) {
    return `${t.slice(0, 2)}:${t.slice(2, 4)}`;
  }
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) {
    return t.slice(0, 5);
  }
  try {
    const date = new Date(`1970-01-01 ${t}`);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    });
  } catch {
    return "N/A";
  }
};

const fmtDateLong = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: tz,
  });

const generateSeatLabels = (seatLimit) => {
  return Array.from({ length: seatLimit }, (_, i) => `S${i + 1}`);
};

const FlightCard = ({ flightSchedule, flights, airports, authState, dates, selectedDate, passengers }) => {
  const router = useRouter();
  const [availableSeats, setAvailableSeats] = useState([]);
  const [isBookingDisabled, setIsBookingDisabled] = useState(false);
  const [isDeparted, setIsDeparted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cutoffTime, setCutoffTime] = useState("09:00");
  const [advanceBookingDays, setAdvanceBookingDays] = useState(0);

  const flight = useMemo(
    () =>
      flights.find((f) => f.id === flightSchedule.flight_id) || {
        id: flightSchedule.flight_id,
        flight_number: "Unknown",
        seat_limit: 6,
        status: flightSchedule.status || 0,
        stops: [],
      },
    [flights, flightSchedule.flight_id, flightSchedule.status]
  );

  const allSeats = useMemo(() => generateSeatLabels(flight.seat_limit || 6), [flight.seat_limit]);

  if ((flight.status !== 0 && flight.status !== 1) || (flightSchedule.status !== 0 && flightSchedule.status !== 1)) {
    return null;
  }

  const departureAirport = useMemo(
    () =>
      airports.find((a) => a.id === flightSchedule.departure_airport_id) || {
        city: "Unknown",
        airport_code: "UNK",
      },
    [airports, flightSchedule.departure_airport_id]
  );
  const arrivalAirport = useMemo(
    () =>
      airports.find((a) => a.id === flightSchedule.arrival_airport_id) || {
        city: "Unknown",
        airport_code: "UNK",
      },
    [airports, flightSchedule.arrival_airport_id]
  );

  const stopCount = flightSchedule.stops?.length ?? 0;
  const isNonStop = stopCount === 0;
  const stopText = isNonStop ? "Non-Stop" : `${stopCount} Stop${stopCount > 1 ? "s" : ""}`;
  const isSoldOut = availableSeats.length === 0;

  const fetchSeats = useCallback(async () => {
    try {
      const data = await API.bookings.getAvailableSeats(flightSchedule.id, selectedDate);
      const seats = Array.isArray(data.availableSeats) ? data.availableSeats : allSeats;
      const validSeats = seats.filter((seat) => allSeats.includes(seat));
      setAvailableSeats(validSeats);
    } catch (err) {
      setAvailableSeats(allSeats);
    }
  }, [flightSchedule.id, selectedDate, allSeats]);

  useEffect(() => {
    const timer = setTimeout(() => fetchSeats(), 100);
    return () => clearTimeout(timer);
  }, [fetchSeats]);

  // Fetch dynamic cutoff settings from backend
  useEffect(() => {
    const fetchCutoffSettings = async () => {
      try {
        const response = await API.systemSettings.getBookingCutoffTime();
        setCutoffTime(response.data.flight_cutoff_time || "09:00");
        setAdvanceBookingDays(
          response.data.flight_advance_booking_days !== undefined 
            ? response.data.flight_advance_booking_days 
            : (response.data.advance_booking_days || 0)
        );
      } catch (error) {
        console.error("Error fetching cutoff settings:", error);
        // Keep defaults if fetch fails
      }
    };
    fetchCutoffSettings();
  }, []);

  useEffect(() => {
    const handleSeatUpdate = (e) => {
      const { schedule_id, bookDate, availableSeats: updatedSeats } = e.detail;
      if (schedule_id === flightSchedule.id && bookDate === selectedDate) {
        const validSeats = Array.isArray(updatedSeats)
          ? updatedSeats.filter((seat) => allSeats.includes(seat))
          : allSeats;
        setAvailableSeats(validSeats);
      }
    };
    window.addEventListener("seats-updated", handleSeatUpdate);
    return () => window.removeEventListener("seats-updated", handleSeatUpdate);
  }, [flightSchedule.id, selectedDate, allSeats]);

  useEffect(() => {
    const checkBookingStatus = () => {
      const now = new Date();
      const istTime = new Date(now.toLocaleString("en-US", { timeZone: tz }));
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const currentTimeInMinutes = hours * 60 + minutes;
      const currentDate = istTime.toISOString().split("T")[0];

      // Parse dynamic cutoff time
      const [cutoffHours, cutoffMinutes] = cutoffTime.split(":").map(Number);
      const cutoffTimeInMinutes = cutoffHours * 60 + cutoffMinutes;

      // Calculate cutoff date based on advance booking days
      const departureDate = new Date(selectedDate);
      const cutoffDate = new Date(departureDate);
      cutoffDate.setDate(cutoffDate.getDate() - advanceBookingDays);
      const cutoffDateStr = cutoffDate.toISOString().split("T")[0];

      // Check if we're past the cutoff date/time
      let isAfterCutoff = false;
      if (currentDate > cutoffDateStr) {
        // Past the cutoff date entirely
        isAfterCutoff = true;
      } else if (currentDate === cutoffDateStr) {
        // On the cutoff date, check time
        isAfterCutoff = currentTimeInMinutes >= cutoffTimeInMinutes;
      }

      // Parse flight departure time
      let departureTimeInMinutes;
      try {
        const departureTime = fmtTime(flightSchedule.departure_time);
        const [depHours, depMinutes] = departureTime.split(":").map(Number);
        departureTimeInMinutes = depHours * 60 + depMinutes;
      } catch {
        departureTimeInMinutes = Infinity; // Fallback if time parsing fails
      }

      // Check if flight has departed
      const isFlightDeparted =
        selectedDate === currentDate && currentTimeInMinutes >= departureTimeInMinutes;

      // Admin (role 1) can book anytime - bypass cutoff time
      const isAdmin = authState?.userRole === "1";
      
      setIsBookingDisabled(isAdmin ? isFlightDeparted : (isAfterCutoff || isFlightDeparted));
      setIsDeparted(isFlightDeparted);
    };

    checkBookingStatus();
    const interval = setInterval(checkBookingStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [flightSchedule.departure_time, selectedDate, cutoffTime, advanceBookingDays, authState?.userRole]);

  const handleBookNowClick = useCallback(() => {
    // REMOVED: Authentication check - now supports guest booking
    // Users can book without login (guest booking)
    
    if (isSoldOut) {
      alert("This flight is sold out. Please select another flight.");
      return;
    }
    if (availableSeats.length < passengers) {
      alert(`Only ${availableSeats.length} seat(s) left. Please reduce passengers.`);
      return;
    }
    // Admin (role 1) can bypass cutoff time restrictions
    const isAdmin = authState?.userRole === "1";
    
    if (isBookingDisabled && !isAdmin) {
      if (isDeparted) {
        alert("This flight has departed.");
      } else if (advanceBookingDays > 0) {
        alert(`Booking is closed ${advanceBookingDays} day(s) before departure at ${cutoffTime} IST.`);
      } else {
        alert(`Booking is closed after ${cutoffTime} IST on the departure date.`);
      }
      return;
    }
    
    // Even admin cannot book departed flights
    if (isDeparted) {
      alert("This flight has departed.");
      return;
    }
    
    // Redirect to booking page with flight details
    const bookingParams = new URLSearchParams({
      departure: departureAirport.city,
      arrival: arrivalAirport.city,
      date: flightSchedule.departure_date || selectedDate,
      scheduleId: flightSchedule.id.toString(),
      price: flightSchedule.price.toString(),
      departureTime: flightSchedule.departure_time,
      arrivalTime: flightSchedule.arrival_time,
      passengers: passengers.toString(),
    });
    
    const bookingUrl = `/booking?${bookingParams.toString()}`;
    router.push(bookingUrl);
  }, [authState?.userRole, isSoldOut, availableSeats, passengers, isBookingDisabled, isDeparted, departureAirport.city, arrivalAirport.city, flightSchedule, selectedDate, router, cutoffTime, advanceBookingDays]);

  const handleAuthSuccess = useCallback(() => {
    // After successful login, automatically proceed with booking
    const bookingParams = new URLSearchParams({
      departure: departureAirport.city,
      arrival: arrivalAirport.city,
      date: flightSchedule.departure_date || selectedDate,
      scheduleId: flightSchedule.id.toString(),
      price: flightSchedule.price.toString(),
      departureTime: flightSchedule.departure_time,
      arrivalTime: flightSchedule.arrival_time,
      passengers: passengers.toString(),
    });
    
    router.push(`/booking?${bookingParams.toString()}`);
  }, [departureAirport.city, arrivalAirport.city, flightSchedule, selectedDate, passengers, router]);



  return (
    <motion.div
      className={`w-full max-w-6xl mx-auto rounded-2xl shadow-lg border border-gray-200 bg-white overflow-hidden transition-all duration-300 ${isSoldOut || isBookingDisabled
        ? "opacity-75 bg-gray-50"
        : "hover:shadow-xl hover:border-blue-300 hover:-translate-y-1"
        }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: isSoldOut || isBookingDisabled ? 1 : 1.02 }}
    >
      {/* Status Banner */}
      <div className={`h-1 w-full ${isDeparted ? "bg-red-500" :
        isSoldOut ? "bg-gray-400" :
          "bg-gradient-to-r from-green-400 to-blue-500"
        }`} />

      <div className="p-6">
        <div className={cn('flex', 'flex-col', 'lg:flex-row', 'lg:items-center', 'space-y-6', 'lg:space-y-0', 'lg:gap-8')}>
          {/* Airline Info */}
          <div className={cn('flex', 'items-center', 'gap-4', 'lg:min-w-[200px]')}>
            <div className="relative">
              <img
                src="/pp.svg"
                alt="Flyola Logo"
                className={cn('w-16', 'h-16', 'object-contain', 'rounded-full', 'bg-blue-50', 'p-2')}
              />
              {!isSoldOut && !isDeparted && (
                <div className={cn('absolute', '-top-1', '-right-1', 'w-4', 'h-4', 'bg-green-500', 'rounded-full', 'animate-pulse')} />
              )}
            </div>
            <div>
              <div className={cn('flex', 'items-center', 'gap-2', 'mb-1')}>
                <FaPlane className="text-blue-600" size={16} />
                <span className={cn('text-lg', 'font-bold', 'text-gray-800')}>{flight.flight_number}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDeparted ? "bg-red-100 text-red-700" :
                  isSoldOut ? "bg-gray-100 text-gray-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                  {isDeparted ? "Departed" : isSoldOut ? "Sold Out" : "Available"}
                </span>
              </div>
              <p className={cn('text-sm', 'text-gray-600')}>
                <span className={cn('font-medium', 'text-blue-700')}>{fmtDateLong(selectedDate)}</span>
              </p>
            </div>
          </div>

          {/* Flight Route & Time */}
          <div className={cn('flex-1', 'space-y-4')}>
            {/* Time Display */}
            <div className={cn('flex', 'items-center', 'justify-center', 'gap-4', 'bg-gradient-to-r', 'from-blue-50', 'to-indigo-50', 'px-6', 'py-4', 'rounded-xl')}>
              <div className="text-center">
                <div className={cn('text-2xl', 'font-bold', 'text-gray-800')}>{fmtTime(flightSchedule.departure_time)}</div>
                <div className={cn('text-xs', 'text-gray-500', 'uppercase', 'tracking-wide')}>Departure</div>
              </div>
              <div className={cn('flex-1', 'flex', 'items-center', 'justify-center', 'relative')}>
                <div className={cn('w-full', 'h-0.5', 'bg-gradient-to-r', 'from-blue-300', 'to-indigo-300')}></div>
                <FaPlane className={cn('absolute', 'text-blue-600', 'bg-white', 'p-1', 'rounded-full')} size={20} />
              </div>
              <div className="text-center">
                <div className={cn('text-2xl', 'font-bold', 'text-gray-800')}>{fmtTime(flightSchedule.arrival_time)}</div>
                <div className={cn('text-xs', 'text-gray-500', 'uppercase', 'tracking-wide')}>Arrival</div>
              </div>
            </div>

            {/* Route Information */}
            <div className={cn('text-center', 'space-y-2')}>
              <div className={cn('flex', 'items-center', 'justify-center', 'gap-3', 'text-gray-700')}>
                <span className={cn('font-semibold', 'text-base', 'bg-blue-100', 'px-3', 'py-1', 'rounded-full')}>
                  {departureAirport.city} ({departureAirport.airport_code})
                </span>
                <div className={cn('flex', 'items-center', 'gap-1')}>
                  <span className="text-gray-400">→</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${isNonStop ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                    {stopText}
                  </span>
                  <span className="text-gray-400">→</span>
                </div>
                <span className={cn('font-semibold', 'text-base', 'bg-green-100', 'px-3', 'py-1', 'rounded-full')}>
                  {arrivalAirport.city} ({arrivalAirport.airport_code})
                </span>
              </div>

              {flightSchedule.isMultiStop && (
                <div className={cn('text-sm', 'text-gray-600', 'bg-yellow-50', 'px-3', 'py-2', 'rounded-lg', 'border', 'border-yellow-200')}>
                  <span className="font-medium">Route:</span> {flightSchedule.routeCities.join(" → ")}
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Booking */}
          <div className={cn('lg:min-w-[220px]', 'space-y-4')}>
            <div className={cn('bg-gradient-to-br', 'from-green-50', 'to-blue-50', 'p-4', 'rounded-xl', 'border', 'border-green-200')}>
              <div className={cn('flex', 'items-center', 'justify-between', 'mb-2')}>
                <FaUserFriends className="text-gray-500" size={16} />
                <span className={`text-sm font-medium ${isSoldOut ? "text-red-600" : "text-green-600"
                  }`}>
                  {isSoldOut ? "Sold Out" : `${availableSeats.length} seats left`}
                </span>
              </div>

              <div className="text-right">
                <div className={cn('text-3xl', 'font-bold', 'text-gray-900')}>
                  ₹{parseFloat(flightSchedule.price || 0).toLocaleString('en-IN')}
                </div>
                <div className={cn('text-sm', 'text-gray-500', 'flex', 'items-center', 'justify-end', 'gap-1')}>
                  <FaCheckCircle className="text-green-500" size={12} />
                  Refundable
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleBookNowClick}
              className={`w-full py-4 px-6 rounded-xl text-base font-semibold ${isSoldOut || isBookingDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-600 text-white hover:from-blue-700 hover:to-blue-700 shadow-lg hover:shadow-xl"
                }`}
              disabled={isSoldOut || isBookingDisabled}
              whileHover={!isSoldOut && !isBookingDisabled ? { scale: 1.05 } : {}}
              whileTap={!isSoldOut && !isBookingDisabled ? { scale: 0.95 } : {}}
            >
              {isDeparted ? "✈️ Departed" :
                isSoldOut ? "❌ Sold Out" :
                  "🎫 Book Now"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </motion.div>
  );
};

export default FlightCard;