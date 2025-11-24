"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { FaHelicopter, FaClock, FaUserFriends, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import API from "@/services/api";
import AuthModal from "@/components/AuthModal";

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

const HelicopterFlightCard = ({ schedule, helicopter, departureHelipad, arrivalHelipad, helipads, searchCriteria, authState, selectedDate, passengers }) => {
  const router = useRouter();
  
  // Initialize with schedule's available seats count, then fetch actual seat labels
  const initialSeatCount = schedule.availableSeats || 0;
  const [availableSeats, setAvailableSeats] = useState([]);
  const [isBookingDisabled, setIsBookingDisabled] = useState(false);
  const [isDeparted, setIsDeparted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const helicopterData = useMemo(
    () => helicopter || {
        id: schedule.helicopter_id,
        helicopter_number: "Unknown",
        seat_limit: 6,
        status: schedule.status || 0,
        departure_day: "Unknown"
      },
    [helicopter, schedule]
  );

  const allSeats = useMemo(() => generateSeatLabels(helicopterData.seat_limit || 6), [helicopterData.seat_limit]);
  
  // Initialize available seats based on schedule data
  useEffect(() => {
    if (initialSeatCount > 0 && availableSeats.length === 0) {
      // Generate initial available seats based on the count from backend
      const initialSeats = allSeats.slice(0, initialSeatCount);
      setAvailableSeats(initialSeats);
    }
  }, [initialSeatCount, allSeats, availableSeats.length]);

  if ((helicopterData.status !== 0 && helicopterData.status !== 1) || (schedule.status !== 0 && schedule.status !== 1)) {
    return null;
  }

  const normaliseStops = (raw) => {
    try {
      const arr = Array.isArray(raw) ? raw : JSON.parse(raw || "[]");
      return [...new Set(arr.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
    } catch {
      return [];
    }
  };

  const departureHelipadData = useMemo(
    () => departureHelipad || {
        city: "Unknown",
        helipad_code: "UNK",
        helipad_name: "Unknown Helipad"
      },
    [departureHelipad]
  );
  
  const arrivalHelipadData = useMemo(
    () => arrivalHelipad || {
        city: "Unknown", 
        helipad_code: "UNK",
        helipad_name: "Unknown Helipad"
      },
    [arrivalHelipad]
  );

  const stopIds = normaliseStops(schedule.via_stop_id || schedule.helipad_stop_ids);
  const stopHelipads = stopIds.map(id => helipads?.find(h => h.id === id)).filter(Boolean) || [];
  const stopCount = stopHelipads.length;
  const isNonStop = stopCount === 0;
  const stopText = isNonStop ? "Non-Stop" : `${stopCount} Stop${stopCount > 1 ? "s" : ""}`;
  const isSoldOut = availableSeats.length === 0;

  const fetchSeats = useCallback(async () => {
    try {
      // Use helicopter-specific API for helicopter schedules
      const data = await API.bookings.getAvailableHelicopterSeats(schedule.id, selectedDate);
      const seats = Array.isArray(data.availableSeats) ? data.availableSeats : allSeats;
      const validSeats = seats.filter((seat) => allSeats.includes(seat));
      setAvailableSeats(validSeats);
    } catch (err) {
      setAvailableSeats(allSeats);
    }
  }, [schedule.id, selectedDate, allSeats]);

  useEffect(() => {
    const timer = setTimeout(() => fetchSeats(), 100);
    return () => clearTimeout(timer);
  }, [fetchSeats]);

  useEffect(() => {
    const handleSeatUpdate = (e) => {
      const { schedule_id, bookDate, availableSeats: updatedSeats } = e.detail;
      if (schedule_id === schedule.id && bookDate === selectedDate) {
        const validSeats = Array.isArray(updatedSeats)
          ? updatedSeats.filter((seat) => allSeats.includes(seat))
          : allSeats;
        setAvailableSeats(validSeats);
      }
    };
    window.addEventListener("seats-updated", handleSeatUpdate);
    return () => window.removeEventListener("seats-updated", handleSeatUpdate);
  }, [schedule.id, selectedDate, allSeats]);

  useEffect(() => {
    const checkBookingStatus = () => {
      const now = new Date();
      const istTime = new Date(now.toLocaleString("en-US", { timeZone: tz }));
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const currentTimeInMinutes = hours * 60 + minutes;
      const currentDate = istTime.toISOString().split("T")[0];

      // Check if current date matches selected date and time is after 9 AM IST (09:00)
      const isAfter9AM = selectedDate === currentDate && currentTimeInMinutes >= 9 * 60;

      // Parse helicopter departure time
      let departureTimeInMinutes;
      try {
        const departureTime = fmtTime(schedule.departure_time);
        const [depHours, depMinutes] = departureTime.split(":").map(Number);
        departureTimeInMinutes = depHours * 60 + depMinutes;
      } catch {
        departureTimeInMinutes = Infinity; // Fallback if time parsing fails
      }

      // Check if helicopter has departed
      const isHelicopterDeparted =
        selectedDate === currentDate && currentTimeInMinutes >= departureTimeInMinutes;

      setIsBookingDisabled(isAfter9AM || isHelicopterDeparted);
      setIsDeparted(isHelicopterDeparted);
    };

    checkBookingStatus();
    const interval = setInterval(checkBookingStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [schedule.departure_time, selectedDate]);

  const handleBookNowClick = useCallback(() => {
    if (!authState?.isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (isSoldOut) {
      alert("This helicopter flight is sold out. Please select another flight.");
      return;
    }
    if (availableSeats.length < passengers) {
      alert(`Only ${availableSeats.length} seat(s) left. Please reduce passengers.`);
      return;
    }
    if (isBookingDisabled) {
      alert(isDeparted ? "This helicopter has departed." : "Booking is closed after 9 AM IST on the departure date.");
      return;
    }
    
    // Use the same booking page as flights with helicopter type parameter
    const bookingParams = new URLSearchParams({
      departure: departureHelipadData.city,
      arrival: arrivalHelipadData.city,
      departureCode: departureHelipadData.airport_code || departureHelipadData.helipad_code || departureHelipadData.city.substring(0, 3).toUpperCase(),
      arrivalCode: arrivalHelipadData.airport_code || arrivalHelipadData.helipad_code || arrivalHelipadData.city.substring(0, 3).toUpperCase(),
      date: selectedDate,
      scheduleId: schedule.id.toString(),
      price: schedule.price.toString(),
      departureTime: schedule.departure_time,
      arrivalTime: schedule.arrival_time,
      passengers: passengers.toString(),
      helicopterNumber: helicopterData.helicopter_number,
      type: 'helicopter'
    });
    
    router.push(`/booking?${bookingParams.toString()}`);
  }, [authState?.isLoggedIn, isSoldOut, availableSeats, passengers, isBookingDisabled, isDeparted, departureHelipadData.city, arrivalHelipadData.city, schedule, selectedDate, router]);

  const handleAuthSuccess = useCallback(() => {
    // After successful login, automatically proceed with booking using same booking page
    const bookingParams = new URLSearchParams({
      departure: departureHelipadData.city,
      arrival: arrivalHelipadData.city,
      departureCode: departureHelipadData.airport_code || departureHelipadData.helipad_code || departureHelipadData.city.substring(0, 3).toUpperCase(),
      arrivalCode: arrivalHelipadData.airport_code || arrivalHelipadData.helipad_code || arrivalHelipadData.city.substring(0, 3).toUpperCase(),
      date: selectedDate,
      scheduleId: schedule.id.toString(),
      price: schedule.price.toString(),
      departureTime: schedule.departure_time,
      arrivalTime: schedule.arrival_time,
      passengers: passengers.toString(),
      helicopterNumber: helicopterData.helicopter_number,
      type: 'helicopter'
    });
    
    router.push(`/booking?${bookingParams.toString()}`);
  }, [departureHelipadData, arrivalHelipadData, helicopterData.helicopter_number, schedule, selectedDate, passengers, router]);

  return (
    <motion.div
      className={`w-full max-w-6xl mx-auto rounded-2xl shadow-lg border border-gray-200 bg-white overflow-hidden transition-all duration-300 ${isSoldOut || isBookingDisabled
        ? "opacity-75 bg-gray-50"
        : "hover:shadow-xl hover:border-red-300 hover:-translate-y-1"
        }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: isSoldOut || isBookingDisabled ? 1 : 1.02 }}
    >
      {/* Status Banner */}
      <div className={`h-1 w-full ${isDeparted ? "bg-red-500" :
        isSoldOut ? "bg-gray-400" :
          "bg-gradient-to-r from-red-400 to-pink-500"
        }`} />

      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-6 lg:space-y-0 lg:gap-8">
          {/* Helicopter Info */}
          <div className="flex items-center gap-4 lg:min-w-[200px]">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <FaHelicopter className="text-white text-2xl" />
              </div>
              {!isSoldOut && !isDeparted && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaHelicopter className="text-red-600" size={16} />
                <span className="text-lg font-bold text-gray-800">{helicopterData.helicopter_number}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDeparted ? "bg-red-100 text-red-700" :
                  isSoldOut ? "bg-gray-100 text-gray-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                  {isDeparted ? "Departed" : isSoldOut ? "Sold Out" : "Available"}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-red-700">{fmtDateLong(selectedDate)}</span>
              </p>
              <p className="text-xs text-gray-500">
                Operates on {helicopterData.departure_day}
              </p>
            </div>
          </div>

          {/* Helicopter Route & Time */}
          <div className="flex-1 space-y-4">
            {/* Time Display */}
            <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{fmtTime(schedule.departure_time)}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Departure</div>
              </div>
              <div className="flex-1 flex items-center justify-center relative">
                <div className="w-full h-0.5 bg-gradient-to-r from-red-300 to-pink-300"></div>
                <FaHelicopter className="absolute text-red-600 bg-white p-1 rounded-full" size={20} />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{fmtTime(schedule.arrival_time)}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Arrival</div>
              </div>
            </div>

            {/* Route Information */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <span className="font-semibold text-base bg-red-100 px-3 py-1 rounded-full">
                  {departureHelipadData.city} ({departureHelipadData.helipad_code})
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">→</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${isNonStop ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                    {stopText}
                  </span>
                  <span className="text-gray-400">→</span>
                </div>
                <span className="font-semibold text-base bg-green-100 px-3 py-1 rounded-full">
                  {arrivalHelipadData.city} ({arrivalHelipadData.helipad_code})
                </span>
              </div>

              {stopHelipads.length > 0 && (
                <div className="text-sm text-gray-600 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                  <span className="font-medium">Route:</span> {[departureHelipadData.city, ...stopHelipads.map(h => h.city), arrivalHelipadData.city].join(" → ")}
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Booking */}
          <div className="lg:min-w-[220px] space-y-4">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <FaUserFriends className="text-gray-500" size={16} />
                <span className={`text-sm font-medium ${isSoldOut ? "text-red-600" : "text-green-600"
                  }`}>
                  {isSoldOut ? "Sold Out" : `${availableSeats.length} seats left`}
                </span>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  ₹{parseFloat(schedule.price || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-sm text-gray-500 flex items-center justify-end gap-1">
                  <FaCheckCircle className="text-green-500" size={12} />
                  Premium Service
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleBookNowClick}
              className={`w-full py-4 px-6 rounded-xl text-base font-semibold ${isSoldOut || isBookingDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
                }`}
              disabled={isSoldOut || isBookingDisabled}
              whileHover={!isSoldOut && !isBookingDisabled ? { scale: 1.05 } : {}}
              whileTap={!isSoldOut && !isBookingDisabled ? { scale: 0.95 } : {}}
            >
              {isDeparted ? "🚁 Departed" :
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

export default HelicopterFlightCard;