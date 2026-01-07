"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FaBed, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { MdFlightLand, MdFlightTakeoff } from "react-icons/md";
import AirportAutocomplete from "./AirportAutocomplete";

const getTomorrowDateIST = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istOffset = 5.5 * 60 * 60000;
  const istNow = new Date(utc + istOffset);
  istNow.setDate(istNow.getDate() + 1);
  const year = istNow.getFullYear();
  const month = String(istNow.getMonth() + 1).padStart(2, "0");
  const day = String(istNow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateToInput = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const HolidayPackage = forwardRef(({ airports = [], isLoadingAirports = false, airportFetchError = null }, ref) => {
  const router = useRouter();
  const [openCalendarFn, setOpenCalendarFn] = useState(null);
  
  // Holiday package state
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [departureDate, setDepartureDate] = useState(() => getTomorrowDateIST());
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
  });

  // UI state
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  const guestDropdownRef = useRef(null);
  const roomDropdownRef = useRef(null);

  // Filter airports for holiday packages (only locations with airport_code)
  const packageAirports = airports.filter(airport => airport.airport_code);

  const totalGuests = guests.adults + guests.children;

  // Set default cities when airports are loaded
  useEffect(() => {
    if (!packageAirports.length) return;
    
    const defaultFromCity = packageAirports.find((a) => a.id === 1 && a.airport_code);
    const defaultToCity = packageAirports.find((a) => a.id === 2 && a.airport_code) || packageAirports.find((a) => a.id !== 1 && a.airport_code);
    
    if (defaultFromCity && !fromCity) {
      setFromCity(defaultFromCity.airport_code);
    }
    if (defaultToCity && !toCity) {
      setToCity(defaultToCity.airport_code);
    }
  }, [packageAirports, fromCity, toCity]);

  const handleGuestChange = (type, action) => {
    setGuests((prev) => {
      let newValue = prev[type];
      if (action === "increment") {
        newValue = prev[type] + 1;
      } else {
        newValue = Math.max(type === "adults" ? 1 : 0, prev[type] - 1);
      }
      return { ...prev, [type]: newValue };
    });
  };

  const handleRoomChange = (action) => {
    if (action === "increment") {
      setRooms(prev => prev + 1);
    } else {
      setRooms(prev => Math.max(1, prev - 1));
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
        setIsGuestDropdownOpen(false);
      }
      if (roomDropdownRef.current && !roomDropdownRef.current.contains(event.target)) {
        setIsRoomDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCityFromCode = (code) => {
    const airport = packageAirports.find((a) => a.airport_code === code);
    return airport ? airport.city : "";
  };

  const selectedDate = departureDate ? new Date(departureDate) : new Date();
  const day = selectedDate.getDate();
  const month = selectedDate.toLocaleString("en-US", { month: "short" });
  const yearShort = selectedDate.getFullYear().toString().slice(-2);
  const weekday = selectedDate.toLocaleString("en-US", { weekday: "long" });

  const isSearchDisabled = !fromCity || !toCity || !departureDate || totalGuests === 0 || airportFetchError;

  // Expose search data to parent component
  useImperativeHandle(ref, () => ({
    getSearchData: () => ({
      fromCity: getCityFromCode(fromCity) || "",
      toCity: getCityFromCode(toCity) || "",
      fromCityCode: fromCity || "",
      toCityCode: toCity || "",
      departureDate: departureDate || "",
      rooms: rooms.toString(),
      adults: guests.adults.toString(),
      children: guests.children.toString(),
    }),
    isSearchDisabled: () => isSearchDisabled,
    handleSearch: () => {
      const searchParams = new URLSearchParams({
        fromCity: getCityFromCode(fromCity) || "",
        toCity: getCityFromCode(toCity) || "",
        fromCityCode: fromCity || "",
        toCityCode: toCity || "",
        departureDate: departureDate || "",
        rooms: rooms.toString(),
        adults: guests.adults.toString(),
        children: guests.children.toString(),
      });
      return `/holiday-packages?${searchParams.toString()}`;
    },
    setOpenCalendar: (fn) => {
      setOpenCalendarFn(() => fn);
    },
    setDate: (date) => {
      setDepartureDate(date);
    }
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-5', 'gap-1')}>
        {/* From City */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
        >
          <label className={cn('text-sm', 'text-gray-950', 'mb-2')}>
            From City
          </label>
          <AirportAutocomplete
            airports={packageAirports}
            value={fromCity}
            onChange={setFromCity}
            placeholder="Departure city..."
            label=""
            icon={MdFlightTakeoff}
            disabled={!!airportFetchError && packageAirports.length === 0}
          />
        </motion.div>

        {/* To City */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
        >
          <label className={cn('text-sm', 'text-gray-950', 'mb-2')}>
            To City
          </label>
          <AirportAutocomplete
            airports={packageAirports}
            value={toCity}
            onChange={setToCity}
            placeholder="Destination city..."
            label=""
            icon={MdFlightLand}
            disabled={!!airportFetchError}
          />
        </motion.div>

        {/* Departure Date */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
          onClick={() => openCalendarFn && openCalendarFn('packageDate')}
        >
          <label className={cn('text-sm', 'text-gray-950', 'mb-2', 'flex', 'items-center', 'gap-1')}>
            <FaCalendarAlt className="text-xs" />
            Departure Date
          </label>
          <div className={cn('flex', 'flex-col')}>
            <div className={cn('flex', 'items-baseline', 'gap-2')}>
              <span className={cn('text-4xl', 'font-bold', 'leading-none')}>{day}</span>
              <span className={cn('text-lg', 'font-semibold', 'leading-none')}>
                {month}
                <span className={cn('align-top', 'text-sm', 'font-semibold', 'ml-0.5')}>
                  '{yearShort}
                </span>
              </span>
            </div>
            <span className={cn('mt-1', 'text-sm', 'text-gray-500')}>{weekday}</span>
          </div>
        </motion.div>

        {/* Rooms */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
          ref={roomDropdownRef}
        >
          <label className={cn('text-sm', 'text-gray-950', 'flex', 'items-center', 'gap-1')}>
            <FaBed className="text-xs" />
            Rooms
          </label>
          <div
            onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
            className={`flex flex-col justify-center cursor-pointer bg-white hover:border-blue-300 transition-all duration-300 h-14 ${
              isRoomDropdownOpen ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <div className={cn('flex', 'items-baseline', 'gap-1')}>
              <span className={cn('text-2xl', 'font-bold', 'text-gray-900')}>
                {rooms}
              </span>
              <span className={cn('text-sm', 'font-semibold', 'text-gray-900')}>
                Room{rooms !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <AnimatePresence>
            {isRoomDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={cn('absolute', 'top-full', 'mt-2', 'left-0', 'w-full', 'min-w-[280px]', 'bg-white', 'border-2', 'border-gray-100', 'rounded-2xl', 'shadow-2xl', 'z-50', 'p-6')}
              >
                <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2', 'rounded-lg', 'hover:bg-gray-50', 'transition-colors')}>
                  <div>
                    <p className={cn('text-gray-800', 'font-semibold')}>Rooms</p>
                    <p className={cn('text-xs', 'text-gray-500')}>Number of rooms needed</p>
                  </div>
                  <div className={cn('flex', 'items-center', 'gap-3')}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRoomChange("decrement")}
                      className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                      disabled={rooms === 1}
                    >
                      -
                    </Button>
                    <span className={cn('w-10', 'text-center', 'font-bold', 'text-gray-800', 'text-lg')}>
                      {rooms}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRoomChange("increment")}
                      className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'transition-all')}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Guests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
          ref={guestDropdownRef}
        >
          <label className={cn('text-sm', 'text-gray-950', 'flex', 'items-center', 'gap-1')}>
            <FaUsers className="text-xs" />
            Guests
          </label>
          <div
            onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
            className={`flex flex-col justify-center cursor-pointer bg-white hover:border-blue-300 transition-all duration-300 h-14 ${
              isGuestDropdownOpen ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <div className={cn('flex', 'items-baseline', 'gap-1')}>
              <span className={cn('text-2xl', 'font-bold', 'text-gray-900')}>
                {totalGuests}
              </span>
              <span className={cn('text-sm', 'font-semibold', 'text-gray-900')}>
                Guest{totalGuests !== 1 ? "s" : ""}
              </span>
            </div>
            <div className={cn('text-xs', 'text-gray-600')}>
              {guests.adults} Adult{guests.adults !== 1 ? "s" : ""}{guests.children > 0 ? `, ${guests.children} Child${guests.children !== 1 ? "ren" : ""}` : ""}
            </div>
          </div>
          <AnimatePresence>
            {isGuestDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={cn('absolute', 'top-full', 'mt-2', 'left-0', 'w-full', 'min-w-[330px]', 'max-w-[90vw]', 'bg-white', 'border-2', 'border-gray-100', 'rounded-2xl', 'shadow-2xl', 'z-50', 'p-6', 'space-y-4')}
              >
                {/* Adults */}
                <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2', 'rounded-lg', 'hover:bg-gray-50', 'transition-colors')}>
                  <div>
                    <p className={cn('text-gray-800', 'font-semibold')}>Adults</p>
                    <p className={cn('text-xs', 'text-gray-500')}>(18+ years)</p>
                  </div>
                  <div className={cn('flex', 'items-center', 'gap-3')}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("adults", "decrement")}
                      className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                      disabled={guests.adults === 1}
                    >
                      -
                    </Button>
                    <span className={cn('w-10', 'text-center', 'font-bold', 'text-gray-800', 'text-lg')}>
                      {guests.adults}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("adults", "increment")}
                      className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'transition-all')}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Separator className="my-2" />
                {/* Children */}
                <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2', 'rounded-lg', 'hover:bg-gray-50', 'transition-colors')}>
                  <div>
                    <p className={cn('text-gray-800', 'font-semibold')}>Children</p>
                    <p className={cn('text-xs', 'text-gray-500')}>(0-17 years)</p>
                  </div>
                  <div className={cn('flex', 'items-center', 'gap-3')}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("children", "decrement")}
                      className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                      disabled={guests.children === 0}
                    >
                      -
                    </Button>
                    <span className={cn('w-10', 'text-center', 'font-bold', 'text-gray-800', 'text-lg')}>
                      {guests.children}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("children", "increment")}
                      className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'transition-all')}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>


    </motion.div>
  );
});

HolidayPackage.displayName = "HolidayPackage";

export default HolidayPackage;