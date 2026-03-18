"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FaChevronDown, FaRegCalendarAlt } from "react-icons/fa";
import AirportAutocomplete from "./AirportAutocomplete";

const formatDateToInput = (d) => {
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTomorrowDateIST = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istOffset = 5.5 * 60 * 60000;
  const istNow = new Date(utc + istOffset);
  istNow.setDate(istNow.getDate() + 1);
  return formatDateToInput(istNow);
};

const HolidayPackage = forwardRef(({ airports = [], isLoadingAirports = false, airportFetchError = null }, ref) => {
  const router = useRouter();
  const [openCalendarFn, setOpenCalendarFn] = useState(null);

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [departureDate, setDepartureDate] = useState(() => getTomorrowDateIST());
  const [guests, setGuests] = useState({
    rooms: 1,
    adults: 2,
    children: 0,
  });

  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const guestDropdownRef = useRef(null);

  const packageAirports = airports.filter(airport => airport.airport_code);
  const totalGuests = guests.adults + guests.children;

  useEffect(() => {
    if (!packageAirports.length) return;
    const defaultFromCity = packageAirports.find((a) => a.id === 1 && a.airport_code);
    const defaultToCity = packageAirports.find((a) => a.id === 2 && a.airport_code) || packageAirports.find((a) => a.id !== 1 && a.airport_code);
    if (defaultFromCity && !fromCity) setFromCity(defaultFromCity.airport_code);
    if (defaultToCity && !toCity) setToCity(defaultToCity.airport_code);
  }, [packageAirports, fromCity, toCity]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
        setIsGuestDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGuestChange = (type, action) => {
    setGuests(prev => ({
      ...prev,
      [type]: action === "increment" ? prev[type] + 1 : Math.max(type === "rooms" ? 1 : type === "adults" ? 1 : 0, prev[type] - 1)
    }));
  };

  const getCityFromCode = (code) => {
    const airport = packageAirports.find((a) => a.airport_code === code);
    return airport ? airport.city : "";
  };

  useImperativeHandle(ref, () => ({
    getSearchData: () => ({
      fromCity: getCityFromCode(fromCity) || "",
      toCity: getCityFromCode(toCity) || "",
      fromCityCode: fromCity || "",
      toCityCode: toCity || "",
      departureDate,
      rooms: guests.rooms.toString(),
      adults: guests.adults.toString(),
      children: guests.children.toString(),
    }),
    isSearchDisabled: () => !fromCity || !toCity || !departureDate || totalGuests === 0 || airportFetchError,
    handleSearch: () => {
      const searchParams = new URLSearchParams({
        fromCity: getCityFromCode(fromCity) || "",
        toCity: getCityFromCode(toCity) || "",
        fromCityCode: fromCity || "",
        toCityCode: toCity || "",
        departureDate,
        rooms: guests.rooms.toString(),
        adults: guests.adults.toString(),
        children: guests.children.toString(),
      });
      return `/holiday-packages?${searchParams.toString()}`;
    },
    setOpenCalendar: (fn) => setOpenCalendarFn(() => fn),
    setDate: (date) => setDepartureDate(date)
  }));

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap lg:flex-nowrap items-end gap-3 w-full">
        {/* From City */}
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-sm font-semibold text-gray-400 ml-1">From City</label>
          <div className="bg-gray-100/80 rounded-2xl px-5 py-3 border border-transparent transition-all hover:bg-gray-200/80 group">
            <AirportAutocomplete
              airports={packageAirports}
              value={fromCity}
              onChange={setFromCity}
              placeholder="From City"
              disabled={!!airportFetchError && packageAirports.length === 0}
            />
          </div>
        </div>

        {/* To City */}
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-sm font-semibold text-gray-400 ml-1">To City</label>
          <div className="bg-gray-100/80 rounded-2xl px-5 py-3 border border-transparent transition-all hover:bg-gray-200/80 group">
            <AirportAutocomplete
              airports={packageAirports}
              value={toCity}
              onChange={setToCity}
              placeholder="To City"
              disabled={!!airportFetchError}
            />
          </div>
        </div>

        {/* Departure Date */}
        <div className="flex-1 min-w-[160px] space-y-2">
          <label className="text-sm font-semibold text-gray-400 ml-1">Departure Date</label>
          <button
            onClick={() => openCalendarFn && openCalendarFn('packageDate')}
            className="w-full h-[72px] bg-gray-100/80 rounded-2xl px-5 border border-transparent transition-all hover:bg-gray-200/80 flex items-center justify-between group text-left"
          >
            <span className="text-gray-900 font-black text-lg tracking-tighter">
              {formatDate(departureDate)}
            </span>
            <FaRegCalendarAlt className="text-gray-400 group-hover:text-blue-500 transition-colors w-5 h-5" />
          </button>
        </div>

        {/* Travellers */}
        <div className="flex-1 min-w-[200px] space-y-2 relative" ref={guestDropdownRef}>
          <label className="text-sm font-semibold text-gray-400 ml-1">Travellers & Rooms</label>
          <button
            onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
            className="w-full h-[72px] bg-gray-100/80 rounded-2xl px-5 border border-transparent transition-all hover:bg-gray-200/80 flex items-center justify-between group text-left"
          >
            <div className="flex flex-col leading-tight">
              <span className="text-gray-900 font-black text-lg tracking-tighter">
                {totalGuests} Traveller{totalGuests !== 1 ? "s" : ""}
              </span>
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                {guests.rooms} Room{guests.rooms !== 1 ? "s" : ""}
              </span>
            </div>
            <FaChevronDown className={cn("text-gray-400 text-xs transition-transform", isGuestDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isGuestDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-3 w-[320px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[110] p-6 border border-gray-100"
              >
                <div className="space-y-6">
                  {[
                    { label: "Rooms", type: "rooms", sub: "Number of rooms" },
                    { label: "Adults", type: "adults", sub: "12+ yrs" },
                    { label: "Children", type: "children", sub: "0-12 yrs" }
                  ].map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900">{item.label}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.sub}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleGuestChange(item.type, "decrement")}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all font-bold"
                          disabled={item.type === "rooms" ? guests.rooms === 1 : item.type === "adults" ? guests.adults === 1 : guests.children === 0}
                        >–</button>
                        <span className="font-black text-gray-900 w-4 text-center tracking-tighter">{guests[item.type]}</span>
                        <button
                          onClick={() => handleGuestChange(item.type, "increment")}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all font-bold"
                        >+</button>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => setIsGuestDropdownOpen(false)}
                    className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black mt-2"
                  >
                    Done
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

HolidayPackage.displayName = "HolidayPackage";
export default HolidayPackage;