"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaBus,
  FaChevronDown,
  FaHelicopter,
  FaHome,
  FaPlane,
  FaRegCalendarAlt,
  FaSearch,
  FaTaxi,
  FaTrain,
  FaUmbrellaBeach
} from "react-icons/fa";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";   // ✅ v1
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2"; // ✅ v2
import { MdErrorOutline, MdFlightLand, MdFlightTakeoff } from "react-icons/md";

import BASE_URL from "@/baseUrl/baseUrl";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AirportAutocomplete from "./AirportAutocomplete";

import ComingSoonService from "./ComingSoonService";

import { DayPicker } from "react-day-picker";
import BookingFormSkeleton from "./BookingFormSkeleton";
import HotelBooking from "./HotelBooking";

import Link from "next/link";
import HolidayPackage from "./HolidayPackage";


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
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};






export default function FlightBooking() {
  // Services list
  const services = [
    { label: "Flight", value: "flights", icon: FaPlane },
    { label: "Helicopter", value: "helicopters", icon: FaHelicopter },
    { label: "Hotels", value: "hotels", icon: FaHome },
    { label: "Holiday Package", value: "packages", icon: FaUmbrellaBeach },
    { label: "Weekly Schedule", value: "schedule", icon: FaRegCalendarAlt }
  ];

  // Service selection state
  const [selectedService, setSelectedService] = useState("flights");

  // Flight booking state
  const [tripType, setTripType] = useState("oneWay"); // oneWay, roundTrip, multiCity
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");

  const [returnDate, setReturnDate] = useState("");
  const [travelClass, setTravelClass] = useState("Economy"); // Economy, Premium Economy, Business, First Class
  const [passengerData, setPassengerData] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  // Helicopter booking state
  const [heliTripType, setHeliTripType] = useState("oneWay");
  const [heliDeparture, setHeliDeparture] = useState("");
  const [heliArrival, setHeliArrival] = useState("");
  const [heliDate, setHeliDate] = useState(() => getTomorrowDateIST());
  const [heliReturnDate, setHeliReturnDate] = useState("");
  const [heliTravelClass, setHeliTravelClass] = useState("Economy");
  const [heliPassengerData, setHeliPassengerData] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });


  const router = useRouter();
  const [airports, setAirports] = useState([]);
  const [helipads, setHelipads] = useState([]);
  const [isLoadingAirports, setIsLoadingAirports] = useState(true);
  const [airportFetchError, setAirportFetchError] = useState(null);
  const [schedulePrices, setSchedulePrices] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(false);

  const heliDropdownRef = useRef(null);
  const hotelBookingRef = useRef(null);
  const holidayPackageRef = useRef(null);
  const [date, setDate] = useState(() => getTomorrowDateIST());

  // Filter airports for flight booking (only locations with airport_code)
  const flightAirports = airports.filter(airport => airport.airport_code);
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
  const [isHeliPassengerDropdownOpen, setIsHeliPassengerDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedDate = date ? new Date(date) : new Date();

  const day = selectedDate.getDate(); // 15
  const month = selectedDate.toLocaleString("en-US", { month: "short" }); // Nov
  const yearShort = selectedDate.getFullYear().toString().slice(-2); // 25
  const weekday = selectedDate.toLocaleString("en-US", { weekday: "long" }); // Saturday

  const minDate = new Date().toISOString().split("T")[0];
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMode, setCalendarMode] = useState("flight"); // flight, helicopter, hotelCheckin, hotelCheckout, packageDate

  // Close calendar when clicking anywhere outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the clicked element is inside the calendar modal
      const isCalendarElement = event.target.closest('[data-calendar-modal]');

      // Close calendar if clicking anywhere outside the calendar
      if (isCalendarOpen && !isCalendarElement) {
        setIsCalendarOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      // Close calendar when pressing Escape key
      if (event.key === 'Escape' && isCalendarOpen) {
        setIsCalendarOpen(false);
      }
    };

    // Add event listeners when calendar is open
    if (isCalendarOpen) {
      document.addEventListener('click', handleClickOutside, true);
      document.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCalendarOpen]);

  useEffect(() => {
    const fetchLocations = async () => {
      // Check cache first for faster loading
      const cachedAirports = sessionStorage.getItem('airports_data');
      const cachedHelipads = sessionStorage.getItem('helipads_data');
      const cacheTime = sessionStorage.getItem('locations_cache_time');

      if (cachedAirports && cachedHelipads && cacheTime && (Date.now() - parseInt(cacheTime)) < 300000) {
        setAirports(JSON.parse(cachedAirports));
        setHelipads(JSON.parse(cachedHelipads));
        setIsLoadingAirports(false);
        return;
      }

      setIsLoadingAirports(true);
      setAirportFetchError(null);
      try {
        // Fetch both airports and helipads in parallel
        const [airportsResponse, helipadsResponse] = await Promise.all([
          fetch(`${BASE_URL}/airport`),
          fetch(`${BASE_URL}/helipads`)
        ]);

        if (!airportsResponse.ok) {
          throw new Error(`Failed to fetch airports: ${airportsResponse.status}`);
        }
        if (!helipadsResponse.ok) {
          throw new Error(`Failed to fetch helipads: ${helipadsResponse.status}`);
        }

        const airportsData = await airportsResponse.json();
        const helipadsData = await helipadsResponse.json();

        setAirports(airportsData);
        setHelipads(helipadsData);

        // Cache the data for 5 minutes
        sessionStorage.setItem('airports_data', JSON.stringify(airportsData));
        sessionStorage.setItem('helipads_data', JSON.stringify(helipadsData));
        sessionStorage.setItem('locations_cache_time', Date.now().toString());

        // Locations loaded successfully
      } catch (error) {
        setAirportFetchError(error.message);
      } finally {
        setIsLoadingAirports(false);
      }
    };
    fetchLocations();
  }, []);

  const totalPassengers =
    passengerData.adults + passengerData.children + passengerData.infants;

  const totalHeliPassengers =
    heliPassengerData.adults + heliPassengerData.children + heliPassengerData.infants;

  const handlePassengerChange = (type, action) => {
    setPassengerData((prev) => {
      let newValue = prev[type];
      if (action === "increment") {
        newValue = prev[type] + 1;
      } else {
        newValue = Math.max(0, prev[type] - 1);
      }

      if (
        type === "adults" &&
        newValue === 0 &&
        (prev.children > 0 ||
          prev.infants > 0 ||
          (prev.adults === 1 && prev.children === 0 && prev.infants === 0))
      ) {
        return prev;
      }
      return { ...prev, [type]: newValue };
    });
  };

  // Synchronize calendar mode for sub-components
  useEffect(() => {
    if (selectedService === "hotels" && hotelBookingRef.current) {
      hotelBookingRef.current.setOpenCalendar((mode) => {
        setCalendarMode(mode);
        setIsCalendarOpen(true);
      });
    }
    if (selectedService === "packages" && holidayPackageRef.current) {
      holidayPackageRef.current.setOpenCalendar((mode) => {
        setCalendarMode(mode);
        setIsCalendarOpen(true);
      });
    }
  }, [selectedService]);

  const handleHeliPassengerChange = (type, action) => {
    setHeliPassengerData((prev) => {
      let newValue = prev[type];
      if (action === "increment") {
        newValue = prev[type] + 1;
      } else {
        newValue = Math.max(0, prev[type] - 1);
      }

      if (
        type === "adults" &&
        newValue === 0 &&
        (prev.children > 0 ||
          prev.infants > 0 ||
          (prev.adults === 1 && prev.children === 0 && prev.infants === 0))
      ) {
        return prev;
      }
      if (
        newValue === 0 &&
        prev.adults === 0 &&
        type !== "adults" &&
        totalHeliPassengers - prev[type] === 0
      ) {
        return prev;
      }

      return { ...prev, [type]: newValue };
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPassengerDropdownOpen(false);
      }
      if (heliDropdownRef.current && !heliDropdownRef.current.contains(event.target)) {
        setIsHeliPassengerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCityFromCode = (code) => {
    const airport = airports.find((a) => a.airport_code === code);
    return airport ? airport.city : "";
  };

  const getHelipadCityFromCode = (code) => {
    const helipad = helipads.find((h) => h.helipad_code === code);
    return helipad ? helipad.city : "";
  };

  const isSearchDisabled =
    !departure ||
    !arrival ||
    !date ||
    totalPassengers === 0 ||
    airportFetchError;




  useEffect(() => {
    if (!airports.length) return;

    // Set default airports for flights (different from and to)
    const departureAirport = airports.find((a) => a.id === 1 && a.airport_code);
    const arrivalAirport = airports.find((a) => a.id === 2 && a.airport_code) || airports.find((a) => a.id !== 1 && a.airport_code);

    if (departureAirport && !departure) {
      setDeparture(departureAirport.airport_code);
    }
    if (arrivalAirport && !arrival) {
      setArrival(arrivalAirport.airport_code);
    }
  }, [airports, departure, arrival]);

  useEffect(() => {
    if (!helipads.length) return;

    // Set default helipads for helicopters (different from and to)
    const departureHelipad = helipads.find((h) => h.id === 1);
    const arrivalHelipad = helipads.find((h) => h.id === 2) || helipads.find((h) => h.id !== 1);

    if (departureHelipad && !heliDeparture) {
      setHeliDeparture(departureHelipad.helipad_code);
    }
    if (arrivalHelipad && !heliArrival) {
      setHeliArrival(arrivalHelipad.helipad_code);
    }
  }, [helipads, heliDeparture, heliArrival]);

  // Set openCalendar function on child component refs
  useEffect(() => {
    if (hotelBookingRef.current && hotelBookingRef.current.setOpenCalendar) {
      hotelBookingRef.current.setOpenCalendar((mode) => {
        setCalendarMode(mode);
        setIsCalendarOpen(true);
      });
    }
    if (holidayPackageRef.current && holidayPackageRef.current.setOpenCalendar) {
      holidayPackageRef.current.setOpenCalendar((mode) => {
        setCalendarMode(mode);
        setIsCalendarOpen(true);
      });
    }
  }, [selectedService]);



  const CustomDayContent = ({ date, activeModifiers }) => {
    if (!date) return null;

    const isToday = activeModifiers?.today;
    const isSelected = activeModifiers?.selected;

    const dateStr = formatDateToInput(date);
    const dayPrices = schedulePrices[dateStr] || [];
    const prices = dayPrices.map(p => p.price);
    const lowestPrice = prices.length ? Math.min(...prices) : null;

    return (
      <div className="flex flex-col items-center justify-center leading-none">
        <span
          className={cn(
            "text-[14px]",
            isSelected && "text-white font-semibold",
            isToday && !isSelected && "text-blue-600 font-semibold"
          )}
        >
          {date.getDate()}
        </span>

        {lowestPrice && !isSelected && (
          <span className="text-[9px] mt-[2px] text-green-600 font-medium">
            ₹{lowestPrice > 999
              ? (lowestPrice / 1000).toFixed(1) + "k"
              : lowestPrice}
          </span>
        )}
      </div>
    );
  };
  return (
    <div className={cn('relative', 'flex', 'flex-col', 'items-center', 'justify-start', 'min-h-screen', 'w-full')}>
      {/* Background Layer with Darker Overlay */}
      <div
        className={cn('absolute', 'w-full', 'h-full', 'bg-cover', 'bg-center', 'bg-no-repeat', 'h-[70vh]')}
        style={{ backgroundImage: "url('/flights/banner.svg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-[#FD9931]/40" />
      </div>

      {/* Content Section */}
      <div className={cn('relative', 'z-10', 'w-full', 'max-w-7xl', 'mx-auto', 'pt-24', 'px-4', 'sm:px-6', 'lg:px-8', 'flex', 'flex-col', 'items-center')}>
        {/* Main Hero Headings */}
        <motion.div
          className="text-center mb-10"
        >
          {/* 🔸 Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-4xl font-semibold text-white mb-4 tracking-tight">
            Plan Your Perfect Getaway <br /> All in One Place
          </h1>

          <p className="text-white/80 mt-4 text-lg text-center">
            Discover stays, activities, and travel options tailored for your journey
          </p>

          {/* 🔸 Search Bar */}
          <div className="mt-8 w-full max-w-2xl relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Where to?"
              className="w-full pl-14 pr-6 py-4 rounded-full bg-white text-gray-700 text-lg shadow-xl outline-none"
            />
          </div>

        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            className={cn('relative', 'z-10', 'w-full', 'max-w-6xl')}
          >
            <Card className={cn(
              "relative",
              "bg-white",
              "shadow-[0_20px_50px_rgba(0,0,0,0.1)]",
              "rounded-[40px]",
              "border-none",
              "overflow-visible",
              "w-full"
            )}>
              <CardContent className={cn('md:p-10', 'flex', 'flex-col', 'gap-10')}>

                {/* Service Tabs (Image Style - Radio with dot and underline) */}
                <div className="flex flex-wrap items-center gap-8 px-4 border-b border-gray-100">
                  {services.map((service) => {
                    const isActive = selectedService === service.value;
                    return (
                      <button
                        key={service.value}
                        onClick={() => setSelectedService(service.value)}
                        className={cn(
                          "group flex items-center gap-2 border-b-2 border-[#0334EA] transition-all duration-300 relative",
                          isActive
                            ? "border-[#0334EA] text-[#0334EA]"
                            : "border-transparent text-gray-400 hover:text-gray-600"
                        )}
                      >
                        <div
                          className={cn(
                            "w-2.5 h-2.5 rounded-full mr-1",
                            isActive ? "bg-blue-600" : "bg-[#DBDBDB]/60"
                          )}
                        />
                        <span className={cn(
                          "text-lg font-semibold",
                          isActive ? "text-[#676767]" : "text-[#676767]/45"
                        )}>
                          {service.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Booking Form Content */}
                <div className="flex flex-col gap-6">
                  {(selectedService === "flights" || selectedService === "helicopters") && (
                    <motion.div
                      className="flex flex-wrap lg:flex-nowrap items-end gap-3 w-full"
                    >
                      {/* From Field */}
                      <div className="flex-1 min-w-[200px] space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">From</label>
                        <div className="bg-gray-100/80 rounded-2xl px-4 py-2 border border-transparent transition-all hover:bg-gray-200/80 group">
                          <AirportAutocomplete
                            airports={selectedService === "helicopters" ? helipads : flightAirports}
                            value={selectedService === "helicopters" ? heliDeparture : departure}
                            onChange={(val) => selectedService === "helicopters" ? setHeliDeparture(val) : setDeparture(val)}
                            placeholder="Departure"
                            label=""
                            disabled={!!airportFetchError}
                          />
                        </div>
                      </div>

                      {/* Swap Button */}
                      <div className="mb-2">
                        <button
                          onClick={() => {
                            if (selectedService === "flights") {
                              const temp = departure;
                              setDeparture(arrival);
                              setArrival(temp);
                            } else {
                              const temp = heliDeparture;
                              setHeliDeparture(heliArrival);
                              setHeliArrival(temp);
                            }
                          }}
                          className="w-11 h-11 bg-[#FD9931] text-white rounded-full shadow-lg transition-all flex items-center justify-center transform active:scale-95 z-20"
                        >
                          <HiOutlineSwitchHorizontal className="w-6 h-6" />
                        </button>
                      </div>

                      {/* To Field */}
                      <div className="flex-1 min-w-[200px] space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">To</label>
                        <div className="bg-gray-100/80 rounded-2xl px-4 py-2 border border-transparent transition-all hover:bg-gray-200/80">
                          <AirportAutocomplete
                            airports={selectedService === "helicopters" ? helipads : flightAirports}
                            value={selectedService === "helicopters" ? heliArrival : arrival}
                            onChange={(val) => selectedService === "helicopters" ? setHeliArrival(val) : setArrival(val)}
                            placeholder="Arrival"
                            label=""
                            disabled={!!airportFetchError}
                          />
                        </div>
                      </div>

                      {/* Departure Date */}
                      <div className="flex-1 min-w-[170px] space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Departure Date</label>
                        <button
                          onClick={() => {
                            setCalendarMode(selectedService === "helicopters" ? 'helicopter' : 'flight');
                            setIsCalendarOpen(true);
                          }}
                          className="w-full h-[72px] bg-gray-100/80 rounded-2xl px-4 py-2 border border-transparent transition-all hover:bg-gray-200/80 flex items-center justify-between group"
                        >
                          <span className="text-gray-900 font-light text-lg">
                            {new Date((selectedService === "helicopters" ? heliDate : date) + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </span>
                          <FaRegCalendarAlt className="text-gray-400 group-hover:text-blue-500 transition-colors w-5 h-5" />
                        </button>
                      </div>

                      {/* Return Date (General) */}
                      <div className="flex-1 min-w-[160px] space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1">Return Date</label>
                        <button
                          onClick={() => {
                            if (selectedService === "flights") {
                              setTripType(tripType === "oneWay" ? "roundTrip" : "oneWay");
                              if (tripType === "oneWay") {
                                setCalendarMode('flight');
                                setIsCalendarOpen(true);
                              }
                            } else {
                              setHeliTripType(heliTripType === "oneWay" ? "roundTrip" : "oneWay");
                              if (heliTripType === "oneWay") {
                                setCalendarMode('helicopter');
                                setIsCalendarOpen(true);
                              }
                            }
                          }}
                          className="w-full h-[72px] bg-gray-100/80 rounded-2xl px-4 py-2 border border-transparent transition-all hover:bg-gray-200/80 flex items-center justify-between group"
                        >
                          <span className="text-gray-900 font-light text-lg">
                            {(selectedService === "flights" ? returnDate : heliReturnDate)
                              ? new Date((selectedService === "flights" ? returnDate : heliReturnDate) + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                              : "General"}
                          </span>
                          <FaChevronDown className={cn("text-gray-400 text-xs transition-transform", (selectedService === "flights" ? tripType === "roundTrip" : heliTripType === "roundTrip") && "rotate-180")} />
                        </button>
                      </div>

                      {/* Travellers */}
                      <div className="flex-1 min-w-[200px] space-y-2 relative" ref={dropdownRef}>
                        <label className="text-sm font-semibold text-gray-400 ml-1">Travellers & Class</label>
                        <button
                          onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}
                          className="w-full h-[72px] bg-gray-100/80 rounded-2xl px-4 py-2 border border-transparent transition-all hover:bg-gray-200/80 flex items-center justify-between group"
                        >
                          <div className="flex flex-col items-start leading-tight">
                            <span className="text-gray-900 font-light text-lg tracking-tighter">
                              {totalPassengers} Traveller
                            </span>
                            <span className="text-[11px] text-gray-400 font-bold">
                              {travelClass}
                            </span>
                          </div>
                          <FaChevronDown className={cn("text-gray-400 text-xs transition-transform", isPassengerDropdownOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                          {isPassengerDropdownOpen && (
                            <motion.div

                              className="absolute top-full right-0 mt-3 w-[320px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[110] p-6 border border-gray-100"
                            >
                              <div className="space-y-6">
                                {[
                                  { label: "Adults", sub: "12+ yrs", type: "adults" },
                                  { label: "Children", sub: "2-12 yrs", type: "children" },
                                  { label: "Infants", sub: "0-2 yrs", type: "infants" }
                                ].map((item) => (
                                  <div key={item.type} className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                      <span className="font-medium text-gray-900">{item.label}</span>
                                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.sub}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <button
                                        onClick={() => handlePassengerChange(item.type, "decrement")}
                                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all font-bold"
                                      >–</button>
                                      <span className="font-medium text-gray-900 w-4 text-center tracking-tighter">{passengerData[item.type]}</span>
                                      <button
                                        onClick={() => handlePassengerChange(item.type, "increment")}
                                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all font-bold"
                                      >+</button>
                                    </div>
                                  </div>
                                ))}

                                <div className="pt-4 border-t border-gray-100">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Travel Class</span>
                                  <div className="flex flex-wrap gap-2">
                                    {["Economy", "Premium Economy", "Business", "First Class"].map((cls) => (
                                      <button
                                        key={cls}
                                        onClick={() => setTravelClass(cls)}
                                        className={cn(
                                          "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                                          travelClass === cls
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        )}
                                      >
                                        {cls}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <Button
                                  onClick={() => setIsPassengerDropdownOpen(false)}
                                  className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 mt-2"
                                >
                                  Done
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {selectedService === "hotels" && <HotelBooking ref={hotelBookingRef} />}
                  {selectedService === "packages" && <HolidayPackage ref={holidayPackageRef} airports={airports} />}
                  {selectedService === "schedule" && <ComingSoonService serviceName="Weekly Schedule" />}
                </div>


              </CardContent>

            </Card>
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-5 -mt-10">
              <Button
                onClick={() => {
                  if (selectedService === "hotels" && hotelBookingRef.current) {
                    const url = hotelBookingRef.current.handleSearch();
                    router.push(url);
                  } else if (selectedService === "packages" && holidayPackageRef.current) {
                    const url = holidayPackageRef.current.handleSearch();
                    router.push(url);
                  } else if (selectedService === "flights" || selectedService === "helicopters") {
                    const query = selectedService === "helicopters" ? {
                      departure: getHelipadCityFromCode(heliDeparture) || "",
                      arrival: getHelipadCityFromCode(heliArrival) || "",
                      departure_code: heliDeparture || "",
                      arrival_code: heliArrival || "",
                      date: heliDate || "",
                      returnDate: heliReturnDate || "",
                      tripType: heliTripType,
                      travelClass: heliTravelClass,
                      adults: heliPassengerData.adults,
                      children: heliPassengerData.children,
                      infants: heliPassengerData.infants,
                      passengers: totalHeliPassengers,
                    } : {
                      departure: getCityFromCode(departure) || "",
                      arrival: getCityFromCode(arrival) || "",
                      departure_code: departure || "",
                      arrival_code: arrival || "",
                      date: date || "",
                      returnDate: returnDate || "",
                      tripType: tripType,
                      travelClass: travelClass,
                      adults: passengerData.adults,
                      children: passengerData.children,
                      infants: passengerData.infants,
                      passengers: totalPassengers,
                    };

                    const pathname = selectedService === "helicopters" ? "/helicopter-flight" : "/scheduled-flight";
                    const queryString = new URLSearchParams(query).toString();
                    router.push(`${pathname}?${queryString}`);
                  }
                }}
                className={cn(
                  "px-10 py-8 text-lg font-semibold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 bg-[#0334EA] hover:bg-blue-700 text-white min-w-[240px]"
                )}
              >
                {selectedService === "hotels" ? "Search Hotels" :
                  selectedService === "packages" ? "Search Packages" :
                    `Search ${selectedService === "helicopters" ? "Helicopter" : "Flight"}`}
              </Button>

              <Button
                variant="outline"
                className="px-2 py-8 z-10 text-lg font-semibold rounded-full border-2 border-[#213D77] text-[#213D77] bg-white hover:bg-blue-50 transition-all duration-300 shadow-xl min-w-[240px]"
              >
                Joyride
              </Button>
            </div>

            {airportFetchError && (
              <motion.div
                className={cn('bg-red-50', 'border-l-4', 'border-red-500', 'p-4', 'rounded-lg', 'mt-4')}
              >
                <div className={cn('flex', 'items-center')}>
                  <MdErrorOutline className={cn('text-red-500', 'text-xl', 'mr-3')} />
                  <div>
                    <p className={cn('text-red-800', 'font-semibold')}>Connection Error</p>
                    <p className={cn('text-red-600', 'text-sm')}>
                      Failed to load location data: {airportFetchError}. Please refresh or try again later.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}