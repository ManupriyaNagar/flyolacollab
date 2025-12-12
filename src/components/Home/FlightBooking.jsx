"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FaBus,
  FaHelicopter,
  FaHome,
  FaPassport,
  FaPlane,
  FaTaxi,
  FaTrain,
  FaUmbrellaBeach
} from "react-icons/fa";
import { MdErrorOutline, MdFlightLand, MdFlightTakeoff } from "react-icons/md";

import BASE_URL from "@/baseUrl/baseUrl";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AirportAutocomplete from "./AirportAutocomplete";
import ServiceSelector from "./ServiceSelector";

import ComingSoonService from "./ComingSoonService";
import TripTypeSelector from "./TripTypeSelector";

import { DayPicker } from "react-day-picker";
import BookingFormSkeleton from "./BookingFormSkeleton";


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






export default function FlightBooking() {
  // Services list
  const services = [
    { label: "Flights", value: "flights", icon: FaPlane },
    { label: "Helicopter", value: "helicopters", icon: FaHelicopter },
    { label: "Homestays", value: "homestays", icon: FaHome },
    { label: "Holiday", value: "packages", icon: FaUmbrellaBeach },
    { label: "Trains", value: "trains", icon: FaTrain },
    { label: "Buses", value: "buses", icon: FaBus },
    { label: "Cabs", value: "cabs", icon: FaTaxi },
    { label: "Visa", value: "visa", icon: FaPassport },
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
  

  const [airports, setAirports] = useState([]);
  const [helipads, setHelipads] = useState([]);
  const [isLoadingAirports, setIsLoadingAirports] = useState(true);
  const [airportFetchError, setAirportFetchError] = useState(null);

  const heliDropdownRef = useRef(null);
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
      if (
        newValue === 0 &&
        prev.adults === 0 &&
        type !== "adults" &&
        totalPassengers - prev[type] === 0
      ) {
        return prev;
      }

      return { ...prev, [type]: newValue };
    });
  };

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




    return (
      <div className={cn('relative', '-mt-20', 'flex', 'flex-col', 'items-center', 'justify-center', 'min-h-screen', 'p-4')}>

       


       <div
  className={cn('absolute', 'inset-0', 'w-full', 'h-full',  'bg-cover', 'bg-center', 'bg-no-repeat')}
  style={{ backgroundImage: "url('/background.png')"  }}
>
  <div className={cn('absolute', 'inset-0')} />


          <div className={cn('absolute', 'inset-0', 'bg-black/30')} />
        </div>
    
        {/* Show content directly without loading skeleton */}
        <AnimatePresence mode="wait">
          {(
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn('relative', 'z-10', 'bg-transparent', 'w-full')}
            >
              {/* Services Navigation Section */}
              <ServiceSelector 
                services={services}
                selectedService={selectedService}
                onServiceChange={setSelectedService}
              />

              {/* Main Booking Card with Search Button Outside */}
              <div className={cn('relative', )}>
              <Card className={cn(  "relative",     
    "z-20",       ' bg-white/50', 'backdrop-blur-xl', 'shadow-2xl', 'rounded-3xl', 'border', 'border-white/20', 'mx-4', 'sm:mx-6', 'md:mx-20', 'lg:mx-26', 'overflow-visible')}>
                <CardContent className={cn('p-6', 'sm:p-8', 'flex', 'flex-col', 'my-12', 'z-10', 'gap-6', 'pb-16')}>
                  {/* Trip Type Selector - Flights */}
                  {selectedService === "flights" && (
                    <TripTypeSelector 
                      tripType={tripType}
                      setTripType={setTripType}
                      serviceType="flights"
                    />
                  )}
                  

             
                  {/* Flight/Helicopter Search Form */}
                  {selectedService === "flights" && (
                    isLoadingAirports ? (
                      <BookingFormSkeleton />
                    ) : (
                      <div className="  ">
                    <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-3', 'lg:grid-cols-5', 'gap-1')}>
                      {/* Departure Airport Autocomplete */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
  className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
                      >
                        <div className="flex">
                        <label className={cn('text-sm', 'text-gray-950')}>
                          From
                        </label>
                                 </div>
                    <AirportAutocomplete
  airports={flightAirports}
  value={departure}
  onChange={setDeparture}
  placeholder="Departure city..."
  label=""
  icon={MdFlightTakeoff}
  disabled={!!airportFetchError && airports.length === 0}
/>

                      </motion.div>
    
                      {/* Arrival Airport Autocomplete */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
  className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
                      >
                        <label className={cn('text-sm', 'text-gray-950')}>
                          To
                        </label>
                        <AirportAutocomplete
                          airports={flightAirports}
                          value={arrival}
                          onChange={setArrival}
                     
                          label=""
                          icon={MdFlightLand}
                          disabled={!!airportFetchError}
                        />
                      </motion.div>
    
                      {/* Departure Date Input */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.7 }}
  className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
  onClick={() => setIsCalendarOpen(true)}
>
  <label
    htmlFor="flight-date"
    className={cn('mb-2', 'text-sm', 'text-gray-950', 'flex', 'items-center', 'gap-1')}
  >
    Departure Date
  </label>

  {/* Visible formatted date */}
  <div className={cn('flex', 'flex-col')}>
    <div className={cn('flex', 'items-baseline', 'gap-2')}>
      <span className={cn('text-4xl', 'font-bold', 'leading-none')}>{day}</span>

      <span className={cn('text-lg', 'font-semibold', 'leading-none')}>
        {month}
        <span className={cn('align-top', 'text-sm', 'font-semibold', 'ml-0.5')}>
          ’{yearShort}
        </span>
      </span>
    </div>

    <span className={cn('mt-1', 'text-sm', 'text-gray-500')}>{weekday}</span>
  </div>
</motion.div>



{/* calander */}










                      {/* Return Date Input */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.75 }}
                        className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
                         onClick={() => setIsCalendarOpen(true)}
                      >
                        <label
                          htmlFor="return-date"
                          className={cn('mb-2', 'text-sm', 'text-gray-950')}
                        >
                          Return Date
                        </label>
                        {tripType === "roundTrip" ? (
                          <div className="relative">
                            <input
                              id="return-date"
                              type="date"
                              value={returnDate}
                              onChange={(e) => setReturnDate(e.target.value)}
                              min={date || new Date().toISOString().split("T")[0]}
                              className={cn('absolute', 'inset-0', 'w-full', 'h-full', 'opacity-0', 'cursor-pointer', 'z-10')}
                            />
                            <div className={cn('w-full', 'h-14', 'border-2', 'border-gray-200', 'rounded-xl', 'bg-white', 'px-4', 'py-2', 'flex', 'flex-col', 'justify-center', 'cursor-pointer')}>
                              {returnDate ? (
                                <>
                                  <div className={cn('flex', 'items-baseline', 'gap-1')}>
                                    <span className={cn('text-2xl', 'font-bold', 'text-gray-900')}>
                                      {new Date(returnDate + 'T00:00:00').getDate()}
                                    </span>
                                    <span className={cn('text-sm', 'font-semibold', 'text-gray-900')}>
                                      {new Date(returnDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}'{new Date(returnDate + 'T00:00:00').getFullYear().toString().slice(-2)}
                                    </span>
                                  </div>
                                  <div className={cn('text-xs', 'text-gray-600')}>
                                    {new Date(returnDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                                  </div>
                                </>
                              ) : (
                                <span className={cn('text-sm', 'text-gray-400')}>Select date</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => setTripType("roundTrip")}
                            className={cn('w-full', 'h-14', 'rounded-xl', 'flex', 'items-center', 'justify-center', 'cursor-pointer', 'hover:border-blue-300', 'hover:bg-blue-50', 'transition-all', 'duration-300', 'bg-white', 'px-3')}
                          >
                            <span className={cn('text-xs', 'text-gray-900', 'font-semibold', 'text-center', 'leading-tight')}>
                              Tap to add a return for bigger<br />discount
                            </span>
                          </div>
                        )}
                      </motion.div>
    
                      {/* Travellers & Class Selection */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
  className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
                        ref={dropdownRef}
                      >
                        <label
                          htmlFor="passengers"
                          className={cn('text-sm', 'text-gray-950', 'flex', 'items-center', 'gap-1')}
                        >
                          Travellers & Class
                          
                        </label>
                        <div
                          id="passengers"
                          onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}
                          className={`flex flex-col justify-center  cursor-pointer bg-white hover:border-blue-300 transition-all duration-300 h-14 ${
                            isPassengerDropdownOpen
                              ? "border-blue-500"
                              : "border-gray-200"
                          }`}
                        >
                          <div className={cn('flex', 'items-baseline', 'gap-1')}>
                            <span className={cn('text-2xl', 'font-bold', 'text-gray-900')}>
                              {totalPassengers}
                            </span>
                            <span className={cn('text-sm', 'font-semibold', 'text-gray-900')}>
                              Traveller{totalPassengers !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className={cn('text-xs', 'text-gray-600')}>
                            {travelClass === "Premium Economy" ? "Economy/ Premium Economy" : travelClass}
                          </div>
                        </div>
                        <AnimatePresence>
                          {isPassengerDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className={cn('absolute', 'top-full', 'mt-2', 'left-0', 'w-full', 'min-w-[330px]', 'max-w-[90vw]', 'bg-white', 'border-2', 'border-gray-100', 'rounded-2xl', 'shadow-2xl', 'z-50', 'p-6', 'space-y-4', 'overflow-y-auto', 'max-h-[60vh]')}
                            >
                              {/* Adults */}
                              <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2', 'rounded-lg', 'hover:bg-gray-50', 'transition-colors')}>
                                <div>
                                  <p className={cn('text-gray-800', 'font-semibold')}>Adults</p>
                                  <p className={cn('text-xs', 'text-gray-500')}>(12+ years)</p>
                                </div>
                                <div className={cn('flex', 'items-center', 'gap-3')}>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("adults", "decrement")}
                                    className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                                    disabled={
                                      passengerData.adults ===
                                        (passengerData.children > 0 || passengerData.infants > 0
                                          ? 1
                                          : 0) && totalPassengers === passengerData.adults
                                    }
                                  >
                                    -
                                  </Button>
                                  <span className={cn('w-10', 'text-center', 'font-bold', 'text-gray-800', 'text-lg')}>
                                    {passengerData.adults}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("adults", "increment")}
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
                                  <p className={cn('text-xs', 'text-gray-500')}>(2-12 years)</p>
                                </div>
                                <div className={cn('flex', 'items-center', 'gap-3')}>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("children", "decrement")}
                                    className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                                    disabled={passengerData.children === 0}
                                  >
                                    -
                                  </Button>
                                  <span className={cn('w-10', 'text-center', 'font-bold', 'text-gray-800', 'text-lg')}>
                                    {passengerData.children}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("children", "increment")}
                                    className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                                    disabled={passengerData.adults === 0}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <Separator className="my-2" />
                              {/* Infants */}
                              <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2', 'rounded-lg', 'hover:bg-gray-50', 'transition-colors')}>
                                <div>
                                  <p className={cn('text-gray-800', 'font-semibold')}>Infants</p>
                                  <p className={cn('text-xs', 'text-gray-500')}>(0-2 years)</p>
                                </div>
                                <div className={cn('flex', 'items-center', 'gap-3')}>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("infants", "decrement")}
                                    className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                                    disabled={passengerData.infants === 0}
                                  >
                                    -
                                  </Button>
                                  <span className={cn('w-10', 'text-center', 'font-bold', 'text-gray-800', 'text-lg')}>
                                    {passengerData.infants}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("infants", "increment")}
                                    className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                                    disabled={passengerData.adults === 0}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              {passengerData.adults === 0 &&
                                (passengerData.children > 0 || passengerData.infants > 0) && (
                                  <div className={cn('mt-4', 'p-3', 'bg-red-50', 'border', 'border-red-200', 'rounded-lg')}>
                                    <p className={cn('text-sm', 'text-red-600', 'font-medium')}>
                                      ⚠️ An adult must accompany children and infants.
                                    </p>
                                  </div>
                                )}
                              
                              <Separator className="my-3" />
                              
                              {/* Travel Class Selection */}
                              <div className="space-y-3">
                                <p className={cn('text-gray-800', 'font-semibold', 'text-sm')}>Choose Travel Class</p>
                                <div className={cn('grid', 'grid-cols-2', 'gap-2')}>
                                  {["Economy", "Premium Economy", "Business", "First Class"].map((classType) => (
                                    <button
                                      key={classType}
                                      onClick={() => setTravelClass(classType)}
                                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        travelClass === classType
                                          ? "bg-blue-600 text-white shadow-md"
                                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                      }`}
                                    >
                                      {classType}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
    
                    </div>
                    
                    {/* Search Button - Full Width Below Form */}
   




                      </div>
                    )
                  )}

                  {/* Trip Type Selector - Helicopter */}
                  {selectedService === "helicopters" && (
                    <TripTypeSelector 
                      tripType={heliTripType}
                      setTripType={setHeliTripType}
                      serviceType="helicopters"
                    />
                  )}

                  {/* Helicopter Booking Form */}
                  {selectedService === "helicopters" && (
                    isLoadingAirports ? (
                      <BookingFormSkeleton />
                    ) : (
                      <div className="  ">
                    <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-3', 'lg:grid-cols-5', 'gap-1')}>
                     
                      {/* Helicopter Departure */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
  className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
                      >
                        <div className="flex">
                        <label className={cn('text-sm', 'text-gray-950')}>
                          From
                        </label>
                                 </div>
                    <AirportAutocomplete
  airports={helipads}
  value={heliDeparture}
  onChange={setHeliDeparture}
  placeholder="Departure helipad..."
  label=""
  icon={MdFlightTakeoff}
  disabled={!!airportFetchError && airports.length === 0}
/>

                      </motion.div>

                      {/* Helicopter Arrival */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
  className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
                      >
                        <label className={cn('text-sm', 'text-gray-950')}>
                          To
                        </label>
                        <AirportAutocomplete
                          airports={helipads}
                          value={heliArrival}
                          onChange={setHeliArrival}
                     
                          label=""
                          icon={MdFlightLand}
                          disabled={!!airportFetchError}
                        />
                      </motion.div>

                      {/* Helicopter Departure Date */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.7 }}
  className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
  onClick={() => setIsCalendarOpen(true)}
>
  <label
    htmlFor="heli-date"
    className={cn('mb-2', 'text-sm', 'text-gray-950', 'flex', 'items-center', 'gap-1')}
  >
    Departure Date
  </label>

  {/* Visible formatted date */}
  <div className={cn('flex', 'flex-col')}>
    <div className={cn('flex', 'items-baseline', 'gap-2')}>
      <span className={cn('text-4xl', 'font-bold', 'leading-none')}>{new Date(heliDate + 'T00:00:00').getDate()}</span>

      <span className={cn('text-lg', 'font-semibold', 'leading-none')}>
        {new Date(heliDate + 'T00:00:00').toLocaleString("en-US", { month: "short" })}
        <span className={cn('align-top', 'text-sm', 'font-semibold', 'ml-0.5')}>
          '{new Date(heliDate + 'T00:00:00').getFullYear().toString().slice(-2)}
        </span>
      </span>
    </div>

    <span className={cn('mt-1', 'text-sm', 'text-gray-500')}>{new Date(heliDate + 'T00:00:00').toLocaleString("en-US", { weekday: "long" })}</span>
  </div>
</motion.div>

                      {/* Helicopter Return Date */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.75 }}
                        className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
                         onClick={() => setIsCalendarOpen(true)}
                      >
                        <label
                          htmlFor="heli-return-date"
                          className={cn('mb-2', 'text-sm', 'text-gray-950')}
                        >
                          Return Date
                        </label>
                        {heliTripType === "roundTrip" ? (
                          <div className="relative">
                            <input
                              id="heli-return-date"
                              type="date"
                              value={heliReturnDate}
                              onChange={(e) => setHeliReturnDate(e.target.value)}
                              min={heliDate || new Date().toISOString().split("T")[0]}
                              className={cn('absolute', 'inset-0', 'w-full', 'h-full', 'opacity-0', 'cursor-pointer', 'z-10')}
                            />
                            <div className={cn('w-full', 'h-14', 'border-2', 'border-gray-200', 'rounded-xl', 'bg-white', 'px-4', 'py-2', 'flex', 'flex-col', 'justify-center', 'cursor-pointer')}>
                              {heliReturnDate ? (
                                <>
                                  <div className={cn('flex', 'items-baseline', 'gap-1')}>
                                    <span className={cn('text-2xl', 'font-bold', 'text-gray-900')}>
                                      {new Date(heliReturnDate + 'T00:00:00').getDate()}
                                    </span>
                                    <span className={cn('text-sm', 'font-semibold', 'text-gray-900')}>
                                      {new Date(heliReturnDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}'{new Date(heliReturnDate + 'T00:00:00').getFullYear().toString().slice(-2)}
                                    </span>
                                  </div>
                                  <div className={cn('text-xs', 'text-gray-600')}>
                                    {new Date(heliReturnDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                                  </div>
                                </>
                              ) : (
                                <span className={cn('text-sm', 'text-gray-400')}>Select date</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => setHeliTripType("roundTrip")}
                            className={cn('w-full', 'h-14', 'rounded-xl', 'flex', 'items-center', 'justify-center', 'cursor-pointer', 'hover:border-blue-300', 'hover:bg-blue-50', 'transition-all', 'duration-300', 'bg-white', 'px-3')}
                          >
                            <span className={cn('text-xs', 'text-gray-900', 'font-semibold', 'text-center', 'leading-tight')}>
                              Tap to add a return for bigger<br />discount
                            </span>
                          </div>
                        )}
                      </motion.div>

                      {/* Helicopter Travellers & Class */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
  className={cn('relative', 'flex', 'flex-col', 'rounded-sm', 'border', 'border-gray-200', 'bg-white', 'px-4', 'py-3', 'shadow-sm', 'cursor-pointer')}
                        ref={heliDropdownRef}
                      >
                        <label
                          htmlFor="heli-passengers"
                          className={cn('text-sm', 'text-gray-950', 'flex', 'items-center', 'gap-1')}
                        >
                          Travellers & Class
                          
                        </label>
                        <div
                          id="heli-passengers"
                          onClick={() => setIsHeliPassengerDropdownOpen(!isHeliPassengerDropdownOpen)}
                          className={`flex flex-col justify-center  cursor-pointer bg-white hover:border-blue-300 transition-all duration-300 h-14 ${
                            isHeliPassengerDropdownOpen
                              ? "border-blue-500"
                              : "border-gray-200"
                          }`}
                        >
                          <div className={cn('flex', 'items-baseline', 'gap-1')}>
                            <span className={cn('text-2xl', 'font-bold', 'text-gray-900')}>
                              {totalHeliPassengers}
                            </span>
                            <span className={cn('text-sm', 'font-semibold', 'text-gray-900')}>
                              Traveller{totalHeliPassengers !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className={cn('text-xs', 'text-gray-600')}>
                            {heliTravelClass === "Premium Economy" ? "Economy/ Premium Economy" : heliTravelClass}
                          </div>
                        </div>
                        <AnimatePresence>
                          {isHeliPassengerDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className={cn('absolute', 'top-full', 'mt-2', 'left-0', 'w-full', 'min-w-[330px]', 'max-w-[90vw]', 'bg-white', 'border-2', 'border-gray-100', 'rounded-2xl', 'shadow-2xl', 'z-50', 'p-6', 'space-y-4', 'overflow-y-auto', 'max-h-[60vh]')}
                            >
                              {/* Adults */}
                              <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2', 'rounded-lg', 'hover:bg-gray-50', 'transition-colors')}>
                                <div>
                                  <p className={cn('text-gray-800', 'font-semibold')}>Adults</p>
                                  <p className={cn('text-xs', 'text-gray-500')}>(12+ years)</p>
                                </div>
                                <div className={cn('flex', 'items-center', 'gap-3')}>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleHeliPassengerChange("adults", "decrement")}
                                    className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                                    disabled={
                                      heliPassengerData.adults ===
                                        (heliPassengerData.children > 0 || heliPassengerData.infants > 0
                                          ? 1
                                          : 0) && totalHeliPassengers === heliPassengerData.adults
                                    }
                                  >
                                    -
                                  </Button>
                                  <span className={cn('w-10', 'text-center', 'font-bold', 'text-gray-800', 'text-lg')}>
                                    {heliPassengerData.adults}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleHeliPassengerChange("adults", "increment")}
                                    className={cn('w-10', 'h-10', 'rounded-full', 'text-orange-600', 'border-2', 'border-orange-200', 'hover:bg-orange-50', 'hover:border-orange-300', 'transition-all')}
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
                                  <p className={cn('text-xs', 'text-gray-500')}>(2-12 years)</p>
                                </div>
                                <div className={cn('flex', 'items-center', 'gap-3')}>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleHeliPassengerChange("children", "decrement")}
                                    className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                                    disabled={heliPassengerData.children === 0}
                                  >
                                    -
                                  </Button>
                                  <span className={cn('w-10', 'text-center', 'font-bold', 'text-gray-800', 'text-lg')}>
                                    {heliPassengerData.children}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleHeliPassengerChange("children", "increment")}
                                    className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                                    disabled={heliPassengerData.adults === 0}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <Separator className="my-2" />
                              {/* Infants */}
                              <div className={cn('flex', 'items-center', 'justify-between', 'py-3', 'px-2', 'rounded-lg', 'hover:bg-gray-50', 'transition-colors')}>
                                <div>
                                  <p className={cn('text-gray-800', 'font-semibold')}>Infants</p>
                                  <p className={cn('text-xs', 'text-gray-500')}>(0-2 years)</p>
                                </div>
                                <div className={cn('flex', 'items-center', 'gap-3')}>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleHeliPassengerChange("infants", "decrement")}
                                    className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                                    disabled={heliPassengerData.infants === 0}
                                  >
                                    -
                                  </Button>
                                  <span className={cn('w-10', 'text-center', 'font-bold', 'text-gray-800', 'text-lg')}>
                                    {heliPassengerData.infants}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleHeliPassengerChange("infants", "increment")}
                                    className={cn('w-10', 'h-10', 'rounded-full', 'text-blue-600', 'border-2', 'border-blue-200', 'hover:bg-blue-50', 'hover:border-blue-300', 'disabled:opacity-50', 'transition-all')}
                                    disabled={heliPassengerData.adults === 0}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              {heliPassengerData.adults === 0 &&
                                (heliPassengerData.children > 0 || heliPassengerData.infants > 0) && (
                                  <div className={cn('mt-4', 'p-3', 'bg-red-50', 'border', 'border-red-200', 'rounded-lg')}>
                                    <p className={cn('text-sm', 'text-red-600', 'font-medium')}>
                                      ⚠️ An adult must accompany children and infants.
                                    </p>
                                  </div>
                                )}
                              
                              <Separator className="my-3" />
                              
                              {/* Travel Class Selection */}
                              <div className="space-y-3">
                                <p className={cn('text-gray-800', 'font-semibold', 'text-sm')}>Choose Travel Class</p>
                                <div className={cn('grid', 'grid-cols-2', 'gap-2')}>
                                  {["Economy", "Premium Economy", "Business", "First Class"].map((classType) => (
                                    <button
                                      key={classType}
                                      onClick={() => setHeliTravelClass(classType)}
                                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        heliTravelClass === classType
                                          ? "bg-blue-600 text-white shadow-md"
                                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                      }`}
                                    >
                                      {classType}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                      </div>
                    )
                  )}

                  {/* Coming Soon Services */}
                  {selectedService === "homestays" && <ComingSoonService serviceName="Homestays" />}
                  {selectedService === "packages" && <ComingSoonService serviceName="Holiday Packages" />}
                  {selectedService === "trains" && <ComingSoonService serviceName="Train Booking" />}
                  {selectedService === "buses" && <ComingSoonService serviceName="Bus Booking" />}
                  {selectedService === "cabs" && <ComingSoonService serviceName="Cab Booking" />}
                  {selectedService === "visa" && <ComingSoonService serviceName="Visa Services" />}
    
                 
                  {airportFetchError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn('bg-red-50', 'border-l-4', 'border-red-500', 'p-4', 'rounded-lg')}
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





                </CardContent>
                
              </Card>
              
              {/* Search Button - Outside card with overlap */}
              {(selectedService === "flights" || selectedService === "helicopters") && (
                <Button
                  asChild
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-7 z-20 px-16 py-3 h-14 text-lg font-bold rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 ${
                    selectedService === "helicopters"
                      ? (!heliDeparture || !heliArrival || !heliDate || totalHeliPassengers === 0 || airportFetchError
                          ? "bg-orange-400 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-700 text-white")
                      : (isSearchDisabled
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-700 hover:bg-blue-900 text-white")
                  }`}
                  disabled={selectedService === "helicopters" 
                    ? (!heliDeparture || !heliArrival || !heliDate || totalHeliPassengers === 0 || airportFetchError)
                    : isSearchDisabled
                  }
                >
                  <Link
                    href={{
                      pathname: selectedService === "helicopters" ? "/helicopter-flight" : "/scheduled-flight",
                      query: selectedService === "helicopters" ? {
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
                      },
                    }}
                    className={cn('flex', 'items-center', 'gap-3')}
                  >
                    <span>SEARCH</span>
                  </Link>
                </Button>
              )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>



        <AnimatePresence>
  {isCalendarOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn('fixed', 'inset-0', 'z-[200]', 'flex', 'items-center', 'justify-center', 'bg-black/40', 'backdrop-blur-sm')}
      onClick={() => setIsCalendarOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn('bg-white', 'rounded-3xl', 'shadow-2xl', 'p-6', 'sm:p-8', 'w-full', 'max-w-3xl', 'relative', 'mx-4')}
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={() => setIsCalendarOpen(false)}
          className={cn('absolute', 'top-4', 'right-4', 'z-10', 'w-10', 'h-10', 'flex', 'items-center', 'justify-center', 'rounded-full', 'bg-gray-100', 'hover:bg-gray-200', 'transition-colors')}
          aria-label="Close calendar"
        >
          <svg className={cn('w-5', 'h-5', 'text-gray-600')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
   

        <DayPicker
          mode="single"
          selected={new Date(selectedService === "helicopters" ? heliDate : date)}
          onSelect={(d) => {
            if (!d) return;
            const formattedDate = formatDateToInput(d);
            if (selectedService === "helicopters") {
              setHeliDate(formattedDate);
            } else {
              setDate(formattedDate);
            }
            setIsCalendarOpen(false);           // close popup
          }}
          numberOfMonths={2}                    // like screenshot
          fromDate={new Date()}                 // min = today
          captionLayout="buttons"
          weekStartsOn={0}
          className="mx-auto"
        />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>



      </div>
    );
}





















