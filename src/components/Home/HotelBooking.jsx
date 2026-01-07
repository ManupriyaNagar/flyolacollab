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
  FaUsers
} from "react-icons/fa";
import { Label } from "../ui/label";
import CityAutocomplete from "./CityAutocomplete";

const formatDateToInput = (d) => {
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMode, setCalendarMode] = useState("checkin"); // "checkin" or "checkout"
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

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const response = await API.hotels.getCities();
        
        // API returns {data: [...], message: ...}
        if (response && response.data && Array.isArray(response.data)) {
          // Filter only active cities (status = 0)
          const activeCities = response.data.filter(city => city.status === 0);
          setCities(activeCities);
          // Auto-select first city
          if (activeCities.length > 0 && !destination) {
            setDestination(activeCities[0].name);
          }
          console.log('Cities loaded from API:', activeCities.length);
        } else if (response && Array.isArray(response)) {
          // Fallback: if response is directly an array
          const activeCities = response.filter(city => city.status === 0);
          setCities(activeCities);
          // Auto-select first city
          if (activeCities.length > 0 && !destination) {
            setDestination(activeCities[0].name);
          }
          console.log('Cities loaded from API (direct array):', activeCities.length);
        } else {
          console.warn('Unexpected API response format:', response);
          setCities([]);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);



  // Set default checkout date (1 day after checkin)
  useEffect(() => {
    if (checkInDate && !checkOutDate) {
      const checkin = new Date(checkInDate + 'T00:00:00');
      checkin.setDate(checkin.getDate() + 1);
      setCheckOutDate(formatDateToInput(checkin));
    }
  }, [checkInDate, checkOutDate]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
        setIsGuestDropdownOpen(false);
      }
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) {
        setIsPriceDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsCalendarOpen(false);
        setIsGuestDropdownOpen(false);
        setIsPriceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleGuestChange = (type, action) => {
    setGuests(prev => {
      let newValue = prev[type];
      if (action === "increment") {
        newValue = prev[type] + 1;
      } else {
        newValue = Math.max(type === "rooms" ? 1 : 0, prev[type] - 1);
      }
      return { ...prev, [type]: newValue };
    });
  };



  const openCalendar = (mode) => {
    setCalendarMode(mode);
    setIsCalendarOpen(true);
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    const formattedDate = formatDateToInput(date);
    
    if (calendarMode === "checkin") {
      setCheckInDate(formattedDate);
      // Auto-set checkout to next day if not set or if checkout is before new checkin
      if (!checkOutDate || new Date(checkOutDate) <= new Date(formattedDate)) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOutDate(formatDateToInput(nextDay));
      }
    } else {
      setCheckOutDate(formattedDate);
    }
    setIsCalendarOpen(false);
  };

  const totalGuests = guests.adults + guests.children;
  const isSearchDisabled = !destination.trim() || !checkInDate || !checkOutDate;

  // Expose search data to parent component
  useImperativeHandle(ref, () => ({
    getSearchData: () => ({
      destination,
      checkInDate,
      checkOutDate,
      guests,
      totalGuests,
      priceRange
    }),
    isSearchDisabled: () => isSearchDisabled,
    handleSearch: () => {
      return `/hotels?destination=${encodeURIComponent(destination)}&checkin=${checkInDate}&checkout=${checkOutDate}&rooms=${guests.rooms}&adults=${guests.adults}&children=${guests.children}&guests=${totalGuests}&priceRange=${priceRange}`;
    },
    setOpenCalendar: (fn) => {
      setOpenCalendarFn(() => fn);
    },
    setCheckInDate: (date) => {
      setCheckInDate(date);
      // Auto-set checkout to next day if not set or if checkout is before new checkin
      if (!checkOutDate || new Date(checkOutDate) <= new Date(date)) {
        const nextDay = new Date(date + 'T00:00:00');
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOutDate(formatDateToInput(nextDay));
      }
    },
    setCheckOutDate: (date) => {
      setCheckOutDate(date);
    }
  }));

  // Format dates for display
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return { day: "", month: "", year: "", weekday: "" };
    const date = new Date(dateStr + 'T00:00:00');
    return {
      day: date.getDate(),
      month: date.toLocaleString("en-US", { month: "short" }),
      year: date.getFullYear().toString().slice(-2),
      weekday: date.toLocaleString("en-US", { weekday: "long" })
    };
  };

  const checkinDisplay = formatDisplayDate(checkInDate);
  const checkoutDisplay = formatDisplayDate(checkOutDate);

  return (
    <div className="space-y-6">
      {/* Hotel Search Form */}
      <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-5', 'gap-1')}>
        
        {/* Destination Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm')}
        >
          <CityAutocomplete
            cities={cities}
            value={destination}
            onChange={setDestination}
            placeholder="Search city..."
            label="Destination"
            icon={FaMapMarkerAlt}
            disabled={loadingCities}
          />
        </motion.div>

        {/* Check-in Date */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
          onClick={() => openCalendarFn && openCalendarFn('hotelCheckin')}
        >
          <Label className={cn('text-sm', 'text-gray-950', 'mb-2')}>
            <FaCalendarAlt className={cn('inline', 'w-4', 'h-4', 'mr-1')} />
            Check-in
          </Label>
          <div className={cn('flex', 'flex-col')}>
            <div className={cn('flex', 'items-baseline', 'gap-2')}>
              <span className={cn('text-4xl', 'font-bold', 'leading-none')}>{checkinDisplay.day}</span>
              <span className={cn('text-lg', 'font-semibold', 'leading-none')}>
                {checkinDisplay.month}
                <span className={cn('align-top', 'text-sm', 'font-semibold', 'ml-0.5')}>
                  '{checkinDisplay.year}
                </span>
              </span>
            </div>
            <span className={cn('mt-1', 'text-sm', 'text-gray-500')}>{checkinDisplay.weekday}</span>
          </div>
        </motion.div>

        {/* Check-out Date */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
          onClick={() => openCalendarFn && openCalendarFn('hotelCheckout')}
        >
          <Label className={cn('text-sm', 'text-gray-950', 'mb-2')}>
            <FaCalendarAlt className={cn('inline', 'w-4', 'h-4', 'mr-1')} />
            Check-out
          </Label>
          <div className={cn('flex', 'flex-col')}>
            <div className={cn('flex', 'items-baseline', 'gap-2')}>
              <span className={cn('text-4xl', 'font-bold', 'leading-none')}>{checkoutDisplay.day}</span>
              <span className={cn('text-lg', 'font-semibold', 'leading-none')}>
                {checkoutDisplay.month}
                <span className={cn('align-top', 'text-sm', 'font-semibold', 'ml-0.5')}>
                  '{checkoutDisplay.year}
                </span>
              </span>
            </div>
            <span className={cn('mt-1', 'text-sm', 'text-gray-500')}>{checkoutDisplay.weekday}</span>
          </div>
        </motion.div>

        {/* Price Range */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.75 }}
          className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
          ref={priceDropdownRef}
        >
          <Label className={cn('text-sm', 'text-gray-950', 'mb-2')}>
            <FaRupeeSign className={cn('inline', 'w-4', 'h-4', 'mr-1')} />
            Price per Night
          </Label>
          <div
            onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
            className={cn('flex', 'flex-col', 'justify-center', 'cursor-pointer', 'h-14')}
          >
            <div className={cn('flex', 'items-center', 'gap-1')}>
              <span className={cn('text-lg', 'font-semibold', 'text-gray-900', 'truncate')}>
                {priceRanges.find(range => range.id === priceRange)?.label || "Any Price"}
              </span>
            </div>
            <div className={cn('text-xs', 'text-gray-600')}>
              Budget Range
            </div>
          </div>

          {/* Price Range Dropdown */}
          <AnimatePresence>
            {isPriceDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={cn('absolute', 'top-full', 'mt-2', 'left-0', 'w-full', 'min-w-[250px]', 'bg-white', 'border-2', 'border-gray-100', 'rounded-2xl', 'shadow-2xl', 'z-50', 'py-2', 'max-h-80', 'overflow-y-auto')}
              >
                {priceRanges.map((range) => (
                  <div
                    key={range.id}
                    onClick={() => {
                      setPriceRange(range.id);
                      setIsPriceDropdownOpen(false);
                    }}
                    className={cn(
                      'px-4', 'py-3', 'hover:bg-gray-50', 'cursor-pointer', 'transition-colors',
                      priceRange === range.id ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
                    )}
                  >
                    <div className="font-medium">{range.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Guests & Rooms */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
          ref={guestDropdownRef}
        >
          <Label className={cn('text-sm', 'text-gray-950', 'mb-2')}>
            <FaUsers className={cn('inline', 'w-4', 'h-4', 'mr-1')} />
            Guests & Rooms
          </Label>
          <div
            onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
            className={cn('flex', 'flex-col', 'justify-center', 'cursor-pointer', 'h-14')}
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
              {guests.rooms} Room{guests.rooms !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Guests Dropdown */}
          <AnimatePresence>
            {isGuestDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={cn('absolute', 'top-full', 'mt-2', 'left-0', 'w-full', 'min-w-[300px]', 'bg-white', 'border-2', 'border-gray-100', 'rounded-2xl', 'shadow-2xl', 'z-50', 'p-6', 'space-y-4')}
              >
                {/* Rooms */}
                <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2')}>
                  <div>
                    <p className={cn('text-gray-800', 'font-semibold')}>Rooms</p>
                  </div>
                  <div className={cn('flex', 'items-center', 'gap-3')}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("rooms", "decrement")}
                      className={cn('w-10', 'h-10', 'rounded-full')}
                      disabled={guests.rooms === 1}
                    >
                      -
                    </Button>
                    <span className={cn('w-10', 'text-center', 'font-bold', 'text-lg')}>
                      {guests.rooms}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("rooms", "increment")}
                      className={cn('w-10', 'h-10', 'rounded-full')}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Adults */}
                <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2')}>
                  <div>
                    <p className={cn('text-gray-800', 'font-semibold')}>Adults</p>
                    <p className={cn('text-xs', 'text-gray-500')}>(12+ years)</p>
                  </div>
                  <div className={cn('flex', 'items-center', 'gap-3')}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("adults", "decrement")}
                      className={cn('w-10', 'h-10', 'rounded-full')}
                      disabled={guests.adults === 1}
                    >
                      -
                    </Button>
                    <span className={cn('w-10', 'text-center', 'font-bold', 'text-lg')}>
                      {guests.adults}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("adults", "increment")}
                      className={cn('w-10', 'h-10', 'rounded-full')}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Children */}
                <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2')}>
                  <div>
                    <p className={cn('text-gray-800', 'font-semibold')}>Children</p>
                    <p className={cn('text-xs', 'text-gray-500')}>(0-12 years)</p>
                  </div>
                  <div className={cn('flex', 'items-center', 'gap-3')}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("children", "decrement")}
                      className={cn('w-10', 'h-10', 'rounded-full')}
                      disabled={guests.children === 0}
                    >
                      -
                    </Button>
                    <span className={cn('w-10', 'text-center', 'font-bold', 'text-lg')}>
                      {guests.children}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleGuestChange("children", "increment")}
                      className={cn('w-10', 'h-10', 'rounded-full')}
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




    </div>
  );
});

HotelBooking.displayName = "HotelBooking";

export default HotelBooking;