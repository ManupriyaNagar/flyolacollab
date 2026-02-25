"use client";
import AuthModal from "@/components/AuthModal";
import { BookingValidator } from "@/lib/business/BookingValidator";
import { SeatManager } from "@/lib/business/SeatManager";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaHelicopter, FaPlane, FaUserFriends } from "react-icons/fa";

// Configuration for different vehicle types
const VEHICLE_CONFIG = {
  flight: {
    icon: FaPlane,
    gradient: "from-blue-600 to-indigo-600",
    hoverColor: "border-blue-300",
    statusColor: "from-green-400 to-blue-500",
    bgGradient: "from-blue-50 to-indigo-50",
    badgeColor: "bg-blue-100",
    iconColor: "text-blue-600",
    label: "Flight"
  },
  helicopter: {
    icon: FaHelicopter,
    gradient: "from-red-600 to-pink-600",
    hoverColor: "border-red-300",
    statusColor: "from-red-400 to-pink-500",
    bgGradient: "from-red-50 to-pink-50",
    badgeColor: "bg-red-100",
    iconColor: "text-red-600",
    label: "Helicopter"
  }
};

/**
 * Generic Vehicle Card Component
 * Works for both flights and helicopters
 * @param {string} type - "flight" or "helicopter"
 * @param {object} schedule - Schedule data
 * @param {object} vehicle - Vehicle data (flight or helicopter)
 * @param {object} departureLocation - Departure airport/helipad
 * @param {object} arrivalLocation - Arrival airport/helipad
 * @param {array} stops - Stop locations (optional)
 * @param {number} passengers - Number of passengers
 * @param {string} selectedDate - Selected date
 * @param {object} authState - Authentication state
 */
export default function VehicleCard({
  type = "flight",
  schedule,
  vehicle,
  departureLocation,
  arrivalLocation,
  stops = [],
  passengers = 1,
  selectedDate,
  authState
}) {
  const router = useRouter();
  const config = VEHICLE_CONFIG[type];
  const Icon = config.icon;
  
  // Debug logging
  console.log('[VehicleCard] Rendering:', {
    type,
    scheduleId: schedule?.id,
    vehicleNumber: vehicle?.flight_number || vehicle?.helicopter_number,
    departure: departureLocation?.city,
    arrival: arrivalLocation?.city,
    price: schedule?.price,
    date: selectedDate
  });
  
  const [availableSeats, setAvailableSeats] = useState([]);
  const [isBookingDisabled, setIsBookingDisabled] = useState(false);
  const [isDeparted, setIsDeparted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cutoffTime, setCutoffTime] = useState("09:00");
  const [advanceBookingDays, setAdvanceBookingDays] = useState(0);

  const allSeats = useMemo(
    () => SeatManager.generateSeatLabels(vehicle?.seat_limit || 6),
    [vehicle?.seat_limit]
  );

  const isSoldOut = availableSeats.length === 0;
  const canBook = !isSoldOut && !isBookingDisabled && !isDeparted;

  // Format time
  const formatTime = useCallback((time) => {
    if (!time) return "N/A";
    if (/^\d{6}$/.test(time)) return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time.slice(0, 5);
    if (/^\d{2}:\d{2}$/.test(time)) return time;
    try {
      return new Date(`1970-01-01 ${time}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return "N/A";
    }
  }, []);

  // Format date
  const formatDate = useCallback((iso) => {
    return new Date(iso).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  }, []);

  // Fetch available seats
  useEffect(() => {
    const fetchSeats = async () => {
      const result = await SeatManager.fetchAvailableSeats(
        schedule.id,
        selectedDate,
        type
      );
      
      if (result.success) {
        const validSeats = SeatManager.filterValidSeats(result.seats, allSeats);
        setAvailableSeats(validSeats);
      } else {
        setAvailableSeats(allSeats);
      }
    };

    const timer = setTimeout(fetchSeats, 100);
    return () => clearTimeout(timer);
  }, [schedule.id, selectedDate, type, allSeats]);

  // Listen for seat updates
  useEffect(() => {
    const cleanup = SeatManager.onSeatUpdate((e) => {
      const { schedule_id, bookDate, availableSeats: updatedSeats } = e.detail;
      if (schedule_id === schedule.id && bookDate === selectedDate) {
        const validSeats = SeatManager.filterValidSeats(updatedSeats, allSeats);
        setAvailableSeats(validSeats);
      }
    });
    return cleanup;
  }, [schedule.id, selectedDate, allSeats]);

  // Fetch cutoff settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Use the existing system settings API
        const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL || 'http://localhost:4000'}/system-settings/booking-cutoff-time`);
        if (response.ok) {
          const data = await response.json();
          const cutoffKey = type === 'helicopter' ? 'helicopter_cutoff_time' : 'flight_cutoff_time';
          const advanceKey = type === 'helicopter' ? 'helicopter_advance_booking_days' : 'flight_advance_booking_days';
          
          setCutoffTime(data[cutoffKey] || "09:00");
          setAdvanceBookingDays(data[advanceKey] || 0);
        }
      } catch (error) {
        // Silently fail and use defaults
        console.log('[VehicleCard] Using default cutoff settings');
      }
    };
    fetchSettings();
  }, [type]);

  // Check booking status
  useEffect(() => {
    const checkStatus = () => {
      const isAdmin = authState?.userRole === "1";
      
      // Check if departed
      const departedCheck = BookingValidator.validateNotDeparted(
        schedule.departure_time,
        selectedDate
      );
      setIsDeparted(!departedCheck.valid);
      
      // Check cutoff time
      const cutoffCheck = BookingValidator.validateBookingTime(
        schedule.departure_time,
        selectedDate,
        cutoffTime,
        advanceBookingDays,
        isAdmin
      );
      
      setIsBookingDisabled(!departedCheck.valid || (!cutoffCheck.valid && !isAdmin));
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, [schedule.departure_time, selectedDate, cutoffTime, advanceBookingDays, authState?.userRole]);

  // Handle booking
  const handleBookClick = useCallback(() => {
    if (!canBook) {
      if (isDeparted) {
        alert(`This ${config.label.toLowerCase()} has departed.`);
      } else if (advanceBookingDays > 0) {
        alert(`Booking closed ${advanceBookingDays} day(s) before departure at ${cutoffTime} IST.`);
      } else {
        alert(`Booking closed after ${cutoffTime} IST on departure date.`);
      }
      return;
    }

    if (availableSeats.length < passengers) {
      alert(`Only ${availableSeats.length} seat(s) available. Please reduce passengers.`);
      return;
    }

    // Build booking URL
    const params = new URLSearchParams({
      type,
      scheduleId: schedule.id.toString(),
      departure: departureLocation.city,
      arrival: arrivalLocation.city,
      departureCode: departureLocation.airport_code || departureLocation.helipad_code || departureLocation.city.substring(0, 3).toUpperCase(),
      arrivalCode: arrivalLocation.airport_code || arrivalLocation.helipad_code || arrivalLocation.city.substring(0, 3).toUpperCase(),
      date: selectedDate,
      price: schedule.price.toString(),
      departureTime: schedule.departure_time,
      arrivalTime: schedule.arrival_time,
      passengers: passengers.toString(),
    });

    if (type === 'helicopter' && vehicle?.helicopter_number) {
      params.append('helicopterNumber', vehicle.helicopter_number);
    } else if (type === 'flight' && vehicle?.flight_number) {
      params.append('flightNumber', vehicle.flight_number);
    }

    router.push(`/booking?${params.toString()}`);
  }, [canBook, isDeparted, advanceBookingDays, cutoffTime, availableSeats, passengers, type, schedule, departureLocation, arrivalLocation, vehicle, selectedDate, router, config.label]);

  // Stop information
  const stopCount = stops?.length || 0;
  const isNonStop = stopCount === 0;
  const stopText = isNonStop ? "Non-Stop" : `${stopCount} Stop${stopCount > 1 ? "s" : ""}`;

  return (
    <>
      <motion.div
        className={cn(
          "w-full max-w-6xl mx-auto rounded-2xl shadow-lg border border-gray-200 bg-white overflow-hidden transition-all duration-300",
          !canBook ? "opacity-75 bg-gray-50" : `hover:shadow-xl hover:${config.hoverColor} hover:-translate-y-1`
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: canBook ? 1.02 : 1 }}
      >
        {/* Status Banner */}
        <div className={cn(
          "h-1 w-full",
          isDeparted ? "bg-red-500" :
          isSoldOut ? "bg-gray-400" :
          `bg-gradient-to-r ${config.statusColor}`
        )} />

        <div className="p-6">
          <div className={cn("flex flex-col lg:flex-row lg:items-center space-y-6 lg:space-y-0 lg:gap-8")}>
            {/* Vehicle Info */}
            <div className={cn("flex items-center gap-4 lg:min-w-[200px]")}>
              <div className="relative">
                <div className={cn(`w-16 h-16 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center`)}>
                  <Icon className={cn('text-white', 'text-2xl')} />
                </div>
                {canBook && (
                  <div className={cn("absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse")} />
                )}
              </div>
              <div>
                <div className={cn("flex items-center gap-2 mb-1")}>
                  <Icon className={config.iconColor} size={16} />
                  <span className={cn("text-lg font-bold text-gray-800")}>
                    {vehicle?.flight_number || vehicle?.helicopter_number || "Unknown"}
                  </span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    isDeparted ? "bg-red-100 text-red-700" :
                    isSoldOut ? "bg-gray-100 text-gray-700" :
                    "bg-green-100 text-green-700"
                  )}>
                    {isDeparted ? "Departed" : isSoldOut ? "Sold Out" : "Available"}
                  </span>
                </div>
                <p className={cn("text-sm text-gray-600")}>
                  <span className={cn("font-medium", config.iconColor)}>
                    {formatDate(selectedDate)}
                  </span>
                </p>
              </div>
            </div>

            {/* Route & Time */}
            <div className={cn("flex-1 space-y-4")}>
              <div className={cn(`flex items-center justify-center gap-4 bg-gradient-to-r ${config.bgGradient} px-6 py-4 rounded-xl`)}>
                <div className="text-center">
                  <div className={cn("text-2xl font-bold text-gray-800")}>
                    {formatTime(schedule.departure_time)}
                  </div>
                  <div className={cn("text-xs text-gray-500 uppercase tracking-wide")}>Departure</div>
                </div>
                <div className={cn("flex-1 flex items-center justify-center relative")}>
                  <div className={cn(`w-full h-0.5 bg-gradient-to-r ${config.bgGradient.replace('from-', 'from-').replace('to-', 'to-')}`)}></div>
                  <Icon className={cn(`absolute ${config.iconColor} bg-white p-1 rounded-full`)} size={20} />
                </div>
                <div className="text-center">
                  <div className={cn("text-2xl font-bold text-gray-800")}>
                    {formatTime(schedule.arrival_time)}
                  </div>
                  <div className={cn("text-xs text-gray-500 uppercase tracking-wide")}>Arrival</div>
                </div>
              </div>

              <div className={cn("text-center space-y-2")}>
                <div className={cn("flex items-center justify-center gap-3 text-gray-700")}>
                  <span className={cn(`font-semibold text-base ${config.badgeColor} px-3 py-1 rounded-full`)}>
                    {departureLocation.city} ({departureLocation.airport_code || departureLocation.helipad_code || "N/A"})
                  </span>
                  <div className={cn("flex items-center gap-1")}>
                    <span className="text-gray-400">→</span>
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      isNonStop ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                      {stopText}
                    </span>
                    <span className="text-gray-400">→</span>
                  </div>
                  <span className={cn("font-semibold text-base bg-green-100 px-3 py-1 rounded-full")}>
                    {arrivalLocation.city} ({arrivalLocation.airport_code || arrivalLocation.helipad_code || "N/A"})
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing & Booking */}
            <div className={cn("lg:min-w-[220px] space-y-4")}>
              <div className={cn(`bg-gradient-to-br ${config.bgGradient} p-4 rounded-xl border border-gray-200`)}>
                <div className={cn("flex items-center justify-between mb-2")}>
                  <FaUserFriends className="text-gray-500" size={16} />
                  <span className={cn(
                    "text-sm font-medium",
                    isSoldOut ? "text-red-600" : "text-green-600"
                  )}>
                    {isSoldOut ? "Sold Out" : `${availableSeats.length} seats left`}
                  </span>
                </div>

                <div className="text-right">
                  <div className={cn("text-3xl font-bold text-gray-900")}>
                    ₹{parseFloat(schedule.price || 0).toLocaleString('en-IN')}
                  </div>
                  <div className={cn("text-sm text-gray-500 flex items-center justify-end gap-1")}>
                    <FaCheckCircle className="text-green-500" size={12} />
                    {type === 'flight' ? 'Refundable' : 'Premium Service'}
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleBookClick}
                className={cn(
                  "w-full py-4 px-6 rounded-xl text-base font-semibold",
                  !canBook
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : `bg-gradient-to-r ${config.gradient} text-white hover:opacity-90 shadow-lg hover:shadow-xl`
                )}
                disabled={!canBook}
                whileHover={canBook ? { scale: 1.05 } : {}}
                whileTap={canBook ? { scale: 0.95 } : {}}
              >
                {isDeparted ? `${type === 'flight' ? '✈️' : '🚁'} Departed` :
                  isSoldOut ? "❌ Sold Out" :
                  "🎫 Book Now"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}
