"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import API from "@/services/api";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUsers,
  FaChevronDown,
  FaRegCalendarAlt
} from "react-icons/fa";
import CityAutocomplete from "./CityAutocomplete";

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

const HotelBooking = forwardRef((props, ref) => {
  const [openCalendarFn, setOpenCalendarFn] = useState(null);
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState(() => getTomorrowDateIST());
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState({
    rooms: 1,
    adults: 2,
    children: 0
  });
  const [priceRange, setPriceRange] = useState("any");

  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  const guestDropdownRef = useRef(null);
  const priceDropdownRef = useRef(null);

  // Price range options
  const priceRanges = [
    { id: "any", label: "Any Price", min: 0, max: null },
    { id: "0-1500", label: "₹0 - ₹1,500", min: 0, max: 1500 },
    { id: "1500-2500", label: "₹1,500 - ₹2,500", min: 1500, max: 2500 },
    { id: "2500-4000", label: "₹2,500 - ₹4,000", min: 2500, max: 4000 },
    { id: "4000-6000", label: "₹4,000 - ₹6,000", min: 4000, max: 6000 },
    { id: "6000-10000", label: "₹6,000 - ₹10,000", min: 6000, max: 10000 },
    { id: "10000+", label: "₹10,000+", min: 10000, max: null }
  ];

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const response = await API.hotels.getCities();
        if (response && response.data && Array.isArray(response.data)) {
          const activeCities = response.data.filter(city => city.status === 0);
          setCities(activeCities);
          if (activeCities.length > 0 && !destination) {
            setDestination(activeCities[0].name);
          }
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (checkInDate && !checkOutDate) {
      const checkin = new Date(checkInDate + 'T00:00:00');
      checkin.setDate(checkin.getDate() + 1);
      setCheckOutDate(formatDateToInput(checkin));
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
        setIsGuestDropdownOpen(false);
      }
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) {
        setIsPriceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGuestChange = (type, action) => {
    setGuests(prev => ({
      ...prev,
      [type]: action === "increment" ? prev[type] + 1 : Math.max(type === "rooms" ? 1 : 0, prev[type] - 1)
    }));
  };

  const totalGuests = guests.adults + guests.children;
  const isSearchDisabled = !destination.trim() || !checkInDate || !checkOutDate;

  useImperativeHandle(ref, () => ({
    getSearchData: () => ({ destination, checkInDate, checkOutDate, guests, totalGuests, priceRange }),
    isSearchDisabled: () => isSearchDisabled,
    handleSearch: () => `/hotels?destination=${encodeURIComponent(destination)}&checkin=${checkInDate}&checkout=${checkOutDate}&rooms=${guests.rooms}&adults=${guests.adults}&children=${guests.children}&guests=${totalGuests}&priceRange=${priceRange}`,
    setOpenCalendar: (fn) => setOpenCalendarFn(() => fn),
    setCheckInDate: (date) => {
      setCheckInDate(date);
      if (!checkOutDate || new Date(checkOutDate) <= new Date(date)) {
        const nextDay = new Date(date + 'T00:00:00');
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOutDate(formatDateToInput(nextDay));
      }
    },
    setCheckOutDate: (date) => setCheckOutDate(date)
  }));

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap lg:flex-nowrap items-end gap-3 w-full">
        {/* Destination */}
        <div className="flex-[1.5] min-w-[250px] space-y-2">
          <label className="text-sm font-semibold text-gray-400 ml-1">Destination</label>
          <div className="bg-gray-100/80 font-light rounded-2xl px-4 py-2 border border-transparent transition-all hover:bg-gray-200/80 group">
            <CityAutocomplete
              cities={cities}
              value={destination}
              onChange={setDestination}
              placeholder="Where are you going?"
              disabled={loadingCities}
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="flex-1 min-w-[160px] space-y-2">
          <label className="text-sm font-semibold text-gray-400 ml-1">Check-in</label>
          <button
            onClick={() => openCalendarFn && openCalendarFn('hotelCheckin')}
            className="w-full h-[72px] bg-gray-100/80 rounded-2xl px-5 border border-transparent transition-all hover:bg-gray-200/80 flex items-center justify-between group text-left"
          >
            <span className="text-gray-900 text-lg font-light tracking-tighter">
              {formatDate(checkInDate)}
            </span>
            <FaRegCalendarAlt className="text-gray-400 group-hover:text-blue-500 transition-colors w-5 h-5" />
          </button>
        </div>

        {/* Check-out */}
        <div className="flex-1 min-w-[160px] space-y-2">
          <label className="text-sm font-semibold text-gray-400 ml-1">Check-out</label>
          <button
            onClick={() => openCalendarFn && openCalendarFn('hotelCheckout')}
            className="w-full h-[72px] bg-gray-100/80 rounded-2xl px-5 border border-transparent transition-all hover:bg-gray-200/80 flex items-center justify-between group text-left"
          >
            <span className="text-gray-900 font-light text-lg tracking-tighter">
              {formatDate(checkOutDate)}
            </span>
            <FaRegCalendarAlt className="text-gray-400 group-hover:text-blue-500 transition-colors w-5 h-5" />
          </button>
        </div>

        {/* Budget */}
        <div className="flex-1 min-w-[180px] space-y-2 relative" ref={priceDropdownRef}>
          <label className="text-sm font-semibold text-gray-400 ml-1">Budget per Night</label>
          <button
            onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
            className="w-full h-[72px] bg-gray-100/80 rounded-2xl px-5 border border-transparent transition-all hover:bg-gray-200/80 flex items-center justify-between group text-left"
          >
            <div className="flex flex-col leading-tight">
              <span className="text-gray-900 font-light text-lg tracking-tighter truncate max-w-[120px]">
                {priceRanges.find(r => r.id === priceRange)?.label || "Any Price"}
              </span>
              <span className="text-[11px] text-gray-400 font-light uppercase tracking-widest">Budget</span>
            </div>
            <FaChevronDown className={cn("text-gray-400 text-xs transition-transform", isPriceDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isPriceDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 mt-3 w-64 bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[110] overflow-hidden border border-gray-100"
              >
                <div className="max-h-80 overflow-y-auto py-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => {
                        setPriceRange(range.id);
                        setIsPriceDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full px-6 py-3.5 text-left text-sm font-light transition-colors",
                        priceRange === range.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guests */}
        <div className="flex-1 min-w-[200px] space-y-2 relative" ref={guestDropdownRef}>
          <label className="text-sm font-semibold text-gray-400 ml-1">Guests & Rooms</label>
          <button
            onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
            className="w-full h-[72px] bg-gray-100/80 rounded-2xl px-5 border border-transparent transition-all hover:bg-gray-200/80 flex items-center justify-between group text-left"
          >
            <div className="flex flex-col leading-tight">
              <span className="text-gray-900 font-light text-lg tracking-tighter">
                {totalGuests} Guest{totalGuests !== 1 ? "s" : ""}
              </span>
              <span className="text-[11px] text-gray-400 font-light uppercase tracking-widest">
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
                        <span className="font-light text-gray-900">{item.label}</span>
                        <span className="text-[10px] font-light text-gray-400 uppercase tracking-widest">{item.sub}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleGuestChange(item.type, "decrement")}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all font-light"
                          disabled={item.type === "rooms" ? guests.rooms === 1 : item.type === "adults" ? guests.adults === 1 : guests.children === 0}
                        >–</button>
                        <span className="font-light text-gray-900 w-4 text-center tracking-tighter">{guests[item.type]}</span>
                        <button
                          onClick={() => handleGuestChange(item.type, "increment")}
                          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all font-light"
                        >+</button>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => setIsGuestDropdownOpen(false)}
                    className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-light mt-2"
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

HotelBooking.displayName = "HotelBooking";
export default HotelBooking;