"use client";
import AuthModal from "@/components/AuthModal";
import { BookingValidator } from "@/lib/business/BookingValidator";
import { SeatManager } from "@/lib/business/SeatManager";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaHelicopter, FaPlane, FaUserFriends, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdFlight, MdRestaurant, MdLocalBar, MdOndemandVideo, MdAirlineSeatReclineNormal } from "react-icons/md";
import { IoAirplane } from "react-icons/io5";

// Configuration for different vehicle types
const VEHICLE_CONFIG = {
  flight: {
    icon: FaPlane,
    iconColor: "text-gray-700",
    badgeColor: "bg-green-500 text-white",
    priceColor: "text-blue-700",
    statusAvailable: "text-green-600",
    statusSold: "text-red-500",
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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_NODE_API_URL || 'https://api.jetserveaviation.com'}/system-settings/booking-cutoff-time`);
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
        className="w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

            {/* LEFT SECTION */}
            <div className="flex flex-col gap-6 flex-1">

              {/* Airline + Number */}
              <div className="flex items-center gap-4">


                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center shadow-sm">
                      <FaPlane className="text-white text-[12px]" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                      Flyola
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-gray-400 text-xs font-semibold tracking-widest uppercase">
                      {vehicle?.flight_number || vehicle?.helicopter_number}
                    </span>

                    <span className={cn(
                      "text-[10px] uppercase font-bold px-3 py-1 rounded-md tracking-wider shadow-sm",
                      type === "flight" && (schedule.class === "Economy" ? "bg-amber-400 text-white" : "bg-emerald-500 text-white"),
                      type === "helicopter" && "bg-red-500 text-white"
                    )}>
                      {schedule.class || (type === "flight" ? "Business" : "Premium")}
                    </span>
                  </div>
                </div>
              </div>

              {/* TIME SECTION */}
              <div className="flex justify-between w-full max-w-lg">

                {/* Departure */}
                <div className="flex flex-col">
                  <div className="text-xl font-semibold text-gray-900 tracking-tight leading-none mb-1">
                    {formatTime(schedule.departure_time)}
                  </div>
                  <div className="text-gray-400 text-xs font-bold tracking-widest uppercase">
                    {departureLocation.airport_code}
                  </div>
                  <div className="text-gray-400 text-[10px] font-medium mt-0.5">
                    {formatDate(selectedDate)}
                  </div>
                </div>

                {/* Middle Line */}
                <div className="flex-1 flex flex-col items-center px-6">
                  <div className="flex items-center w-full relative">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <div className="flex-1 border-t border-dashed border-slate-300 mx-1 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                        <IoAirplane className="text-slate-400" size={18} />
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>
                  <div className="flex gap-2 mt-2 text-[10px] text-gray-400 font-bold tracking-wide uppercase">
                    <span>{stopText}</span>
                  </div>
                </div>

                {/* Arrival */}
                <div className="flex flex-col items-end">
                  <div className="text-xl font-semibold text-gray-900 tracking-tight leading-none mb-1">
                    {formatTime(schedule.arrival_time)}
                  </div>
                  <div className="text-gray-400 text-xs font-bold tracking-widest uppercase">
                    {arrivalLocation.airport_code}
                  </div>
                  <div className="text-gray-400 text-[10px] font-medium mt-0.5">
                    {formatDate(selectedDate)}
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT SECTION: Price and Availability */}
            <div className="flex flex-col justify-between items-end min-w-[220px] h-full">

              {/* Top Section: Price */}
              <div className="text-right">
                <div className="text-xl font-medium text-[#0133EA] leading-none mb-1">
                  INR {parseFloat(schedule.price || 0).toLocaleString("en-IN")}
                  <span className="text-gray-400 text-xs font-normal ml-0.5">/pax</span>
                </div>

                <div className="text-gray-400 line-through text-sm font-medium pr-1 opacity-70">
                  INR {Math.round((schedule.price || 0) * 1.3).toLocaleString("en-IN")}
                </div>
              </div>

              {/* Bottom Section: Availability & Action */}
              <div className="flex flex-col items-end gap-3 text-sm mt-20">
                <div className="flex items-center gap-3">
                  {availableSeats.length <= 6 && availableSeats.length > 0 && (
                    <span className="text-red-500 font-light tracking-tight">
                      {availableSeats.length} seats remaining
                    </span>
                  )}
                  {availableSeats.length > 0 && availableSeats.length <= 6 && <span className="text-gray-300">•</span>}
                  <button
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="text-cyan-500 hover:text-cyan-600 font-light flex items-center gap-1 transition-all text-xs tracking-wider"
                  >
                    See Details {isDetailsOpen ? <FaChevronUp size={10} className="mt-0.5" /> : <FaChevronDown size={10} className="mt-0.5" />}
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Details Section (Accordion) */}
          {isDetailsOpen && (
            <motion.div
              className="mt-16"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 px-4">
                {/* Timeline */}
                <div className="flex flex-col gap-12">
                  {/* Departure Stop */}
                  <div className="flex items-start">
                    <div className="w-24 text-right pr-6 pt-0.5">
                      <div className="text-xl font-light text-gray-900">{formatTime(schedule.departure_time)}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{formatDate(selectedDate)}</div>
                    </div>

                    <div className="relative flex flex-col items-center px-4 pt-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300 ring-4 ring-gray-50 z-10" />
                      <div className="absolute top-6 bottom-[-98px] w-px border-l-2 border-dashed border-gray-300" />
                    </div>

                    <div className="flex-1 pl-4">
                      <div className="text-lg font-bold text-gray-800 tracking-tight leading-tight">{departureLocation.city} ({departureLocation.airport_code})</div>
                      <div className="text-sm text-gray-400 font-medium mt-0.5">{departureLocation.name}</div>
                    </div>
                  </div>

                  {/* Arrival Stop */}
                  <div className="flex items-start">
                    <div className="w-24 text-right pr-6 pt-0.5">
                      <div className="text-xl font-light text-gray-900">{formatTime(schedule.arrival_time)}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{formatDate(selectedDate)}</div>
                    </div>

                    <div className="relative flex flex-col items-center px-4 pt-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300 ring-4 ring-gray-50 z-10" />
                    </div>

                    <div className="flex-1 pl-4">
                      <div className="text-lg font-bold text-gray-800 tracking-tight leading-tight">{arrivalLocation.city} ({arrivalLocation.airport_code})</div>
                      <div className="text-sm text-gray-400 font-medium mt-0.5">{arrivalLocation.name}</div>
                    </div>
                  </div>
                </div>

                {/* Amenities/Action */}
                <div className="flex flex-col justify-between items-end gap-16">
                  <div className="grid grid-cols-1 gap-x-12 gap-y-2 text-xs text-black font-light">
                    <div className="flex justify-end gap-3"> Flyola 737 <MdAirlineSeatReclineNormal size={18} className="text-black" /> </div>
                    <div className="flex justify-end gap-3">Meal Included<MdRestaurant size={18} className="text-black" /> </div>
                    <div className="flex justify-end gap-3"> Beverages Included<MdLocalBar size={18} className="text-black" /></div>
                    <div className="flex justify-end gap-3">On-demand Video<MdOndemandVideo size={18} className="text-black" /></div>
                    <div className="flex justify-end gap-3">2-2 layout<MdAirlineSeatReclineNormal size={18} className="text-black" /> </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBookClick}
                    disabled={!canBook}
                    className={cn(
                      "px-16 py-2 rounded-full text-lg font-bold transition-all duration-300 shadow-xl min-w-[280px] tracking-tight",
                      canBook
                        ? "bg-[#FF9F43] text-white hover:bg-[#F39C12] shadow-[#FF9F43]/30"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    )}
                  >
                    {isSoldOut ? "SOLDOUT" : isDeparted ? "DEPARTED" : isBookingDisabled ? "CLOSED" : "Book Now"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
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
