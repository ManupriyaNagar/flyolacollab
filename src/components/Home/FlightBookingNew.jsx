"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaPlaneDeparture,
  FaUser,
  FaHelicopter,
  FaCalendarCheck,
  FaPlane,
  FaClock,
  FaHome,
  FaUmbrellaBeach,
  FaTrain,
  FaBus,
  FaTaxi,
  FaPassport,
  FaMapMarkerAlt
} from "react-icons/fa";
import { MdErrorOutline, MdFlightTakeoff, MdFlightLand } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import BASE_URL from "@/baseUrl/baseUrl";
import { Separator } from "@/components/ui/separator";
import AirportAutocomplete from "./AirportAutocomplete";
import ServiceSelector from "./ServiceSelector";
import ServiceHeader from "./ServiceHeader";
import ComingSoonService from "./ComingSoonService";

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
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [passengerData, setPassengerData] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  
  // Helicopter booking state
  const [heliDeparture, setHeliDeparture] = useState("");
  const [heliArrival, setHeliArrival] = useState("");
  const [heliDate, setHeliDate] = useState("");
  const [heliPassengerData, setHeliPassengerData] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  
  const [airports, setAirports] = useState([]);
  const [isLoadingAirports, setIsLoadingAirports] = useState(false);
  const [airportFetchError, setAirportFetchError] = useState(null);

  // Filter airports for flight booking (only locations with airport_code)
  const flightAirports = airports.filter(airport => airport.airport_code);
  
  // Filter helipads for helicopter booking (all locations with helipad facilities)
  // Includes: Helipad-only + Airport with Helipad
  const helipads = airports.filter(airport => airport.has_helipad);
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
  const [isHeliPassengerDropdownOpen, setIsHeliPassengerDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const heliDropdownRef = useRef(null);

  useEffect(() => {
    const fetchAirports = async () => {
      // Check cache first for faster loading
      const cached = sessionStorage.getItem('airports_data');
      const cacheTime = sessionStorage.getItem('airports_cache_time');
      
      if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 300000) {
        setAirports(JSON.parse(cached));
        setIsLoadingAirports(false);
        return;
      }

      // setIsLoadingAirports(true); // Removed to prevent loading state
      setAirportFetchError(null);
      try {
        const response = await fetch(`${BASE_URL}/airport`);
        if (!response.ok) {
          throw new Error(`Failed to fetch airports: ${response.status}`);
        }
        const data = await response.json();
        setAirports(data);
        
        // Cache the data for 5 minutes
        sessionStorage.setItem('airports_data', JSON.stringify(data));
        sessionStorage.setItem('airports_cache_time', Date.now().toString());
        
        // Airports loaded successfully
      } catch (error) {
        setAirportFetchError(error.message);
      } finally {
        setIsLoadingAirports(false);
      }
    };
    fetchAirports();
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
    const airport = airports.find((a) => 
      a.airport_code === code || a.helipad_code === code
    );
    return airport ? airport.city : "";
  };

  const isSearchDisabled =
    !departure ||
    !arrival ||
    !date ||
    totalPassengers === 0 ||
    airportFetchError;

  // Check if either departure or arrival is a helipad-only location
  const isHelicopterRoute = () => {
    const departureAirport = airports.find(
      (a) => (a.airport_code || a.helipad_code) === departure
    );
    const arrivalAirport = airports.find(
      (a) => (a.airport_code || a.helipad_code) === arrival
    );

    // If either location is helipad-only (has_helipad=true and no airport_code), it's a helicopter route
    const isDepartureHelipadOnly = departureAirport?.has_helipad && !departureAirport?.airport_code;
    const isArrivalHelipadOnly = arrivalAirport?.has_helipad && !arrivalAirport?.airport_code;

    return isDepartureHelipadOnly || isArrivalHelipadOnly;
  };

    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute min-w-full min-h-full object-cover"
          >
            <source src="/backgroundvideo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30" />
        </div>
    
        {/* Show content directly without loading skeleton */}
        <AnimatePresence mode="wait">
          {(
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 w-full"
            >
              {/* Services Navigation Section */}
              <ServiceSelector 
                services={services}
                selectedService={selectedService}
                onServiceChange={setSelectedService}
              />

              {/* Main Booking Card */}
              <Card className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 mx-4 sm:mx-6 md:mx-20 lg:mx-32 overflow-visible">
                <CardContent className="p-6 sm:p-8 flex flex-col gap-8">
                  {/* Header Section - Only show for flights and helicopters */}
                  {(selectedService === "flights" || selectedService === "helicopters") && (
                    <ServiceHeader selectedService={selectedService} />
                  )}
    
                  {/* Flight/Helicopter Search Form */}
                  {selectedService === "flights" && (
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Departure Airport Autocomplete */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col"
                      >
                        <AirportAutocomplete
                          airports={flightAirports}
                          value={departure}
                          onChange={setDeparture}
                          placeholder="Departure city..."
                          label="From"
                          icon={MdFlightTakeoff}
                          disabled={!!airportFetchError}
                        />
                      </motion.div>
    
                      {/* Arrival Airport Autocomplete */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col"
                      >
                        <AirportAutocomplete
                          airports={flightAirports}
                          value={arrival}
                          onChange={setArrival}
                          placeholder="Destination city..."
                          label="To"
                          icon={MdFlightLand}
                          disabled={!!airportFetchError}
                        />
                      </motion.div>
    
                      {/* Date Input */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col"
                      >
                        <label
                          htmlFor="flight-date"
                          className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <FaCalendarCheck className="text-indigo-500" />
                          Departure Date
                        </label>
                        <Input
                          id="flight-date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full h-14 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-indigo-300 transition-all duration-300 bg-white"
                        />
                      </motion.div>
    
                      {/* Passenger Selection */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="relative flex flex-col"
                        ref={dropdownRef}
                      >
                        <label
                          htmlFor="passengers"
                          className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <FaUser className="text-indigo-500" />
                          Passengers
                        </label>
                        <div
                          id="passengers"
                          onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}
                          className={`flex items-center gap-3 border-2 rounded-xl px-4 py-4 text-sm cursor-pointer bg-white shadow-sm hover:border-indigo-300 transition-all duration-300 h-14 ${
                            isPassengerDropdownOpen
                              ? "border-indigo-500 ring-2 ring-indigo-500"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <FaUser className="text-indigo-600" />
                          </div>
                          <span className="text-gray-700 font-semibold flex-grow">
                            {totalPassengers} Passenger{totalPassengers !== 1 ? "s" : ""}
                          </span>
                          <svg
                            className={`w-5 h-5 ml-auto text-indigo-500 transition-transform duration-300 ${
                              isPassengerDropdownOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                        <AnimatePresence>
                          {isPassengerDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="absolute top-full mt-2 left-0 w-full min-w-[330px] max-w-[90vw] bg-white border-2 border-gray-100 rounded-2xl shadow-2xl z-30 p-6 space-y-4 overflow-y-auto max-h-[50vh]"
                            >
                              {/* Adults */}
                              <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                  <p className="text-gray-800 font-semibold">Adults</p>
                                  <p className="text-xs text-gray-500">(12+ years)</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("adults", "decrement")}
                                    className="w-10 h-10 rounded-full text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 transition-all"
                                    disabled={
                                      passengerData.adults ===
                                        (passengerData.children > 0 || passengerData.infants > 0
                                          ? 1
                                          : 0) && totalPassengers === passengerData.adults
                                    }
                                  >
                                    -
                                  </Button>
                                  <span className="w-10 text-center font-bold text-gray-800 text-lg">
                                    {passengerData.adults}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("adults", "increment")}
                                    className="w-10 h-10 rounded-full text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <Separator className="my-2" />
                              {/* Children */}
                              <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                  <p className="text-gray-800 font-semibold">Children</p>
                                  <p className="text-xs text-gray-500">(2-12 years)</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("children", "decrement")}
                                    className="w-10 h-10 rounded-full text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 transition-all"
                                    disabled={passengerData.children === 0}
                                  >
                                    -
                                  </Button>
                                  <span className="w-10 text-center font-bold text-gray-800 text-lg">
                                    {passengerData.children}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("children", "increment")}
                                    className="w-10 h-10 rounded-full text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 transition-all"
                                    disabled={passengerData.adults === 0}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <Separator className="my-2" />
                              {/* Infants */}
                              <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                  <p className="text-gray-800 font-semibold">Infants</p>
                                  <p className="text-xs text-gray-500">(0-2 years)</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("infants", "decrement")}
                                    className="w-10 h-10 rounded-full text-blue-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 transition-all"
                                    disabled={passengerData.infants === 0}
                                  >
                                    -
                                  </Button>
                                  <span className="w-10 text-center font-bold text-gray-800 text-lg">
                                    {passengerData.infants}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("infants", "increment")}
                                    className="w-10 h-10 rounded-full text-blue-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 transition-all"
                                    disabled={passengerData.adults === 0}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              {passengerData.adults === 0 &&
                                (passengerData.children > 0 || passengerData.infants > 0) && (
                                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600 font-medium">
                                      ⚠️ An adult must accompany children and infants.
                                    </p>
                                  </div>
                                )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
    
                      {/* Search Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex justify-center"
                      >
                        <Link
                          href={{
                            pathname: "/scheduled-flight",
                            query: {
                              departure: getCityFromCode(departure) || "",
                              arrival: getCityFromCode(arrival) || "",
                              departure_code: departure || "",
                              arrival_code: arrival || "",
                              date: date || "",
                              adults: passengerData.adults,
                              children: passengerData.children,
                              infants: passengerData.infants,
                              passengers: totalPassengers,
                            },
                          }}
                        >
                          <Button
                            className={`w-full mt-7 sm:w-auto h-14 px-8 text-lg font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 border shadow-3xl transform hover:-translate-y-1 ${
                              isSearchDisabled
                                ? "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-600"
                                : "bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 text-white"
                            }`}
                            disabled={isSearchDisabled}
                          >
                            <FaPlaneDeparture className="text-xl" />
                            <span>Search Flights</span>
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                  )}

                  {/* Helicopter Booking Form */}
                  {selectedService === "helicopters" && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Helicopter Departure */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col"
                      >
                        <AirportAutocomplete
                          airports={helipads}
                          value={heliDeparture}
                          onChange={setHeliDeparture}
                          placeholder="Departure helipad..."
                          label="From"
                          icon={MdFlightTakeoff}
                          disabled={!!airportFetchError}
                        />
                      </motion.div>

                      {/* Helicopter Arrival */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col"
                      >
                        <AirportAutocomplete
                          airports={helipads}
                          value={heliArrival}
                          onChange={setHeliArrival}
                          placeholder="Destination helipad..."
                          label="To"
                          icon={MdFlightLand}
                          disabled={!!airportFetchError}
                        />
                      </motion.div>

                      {/* Helicopter Date */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col"
                      >
                        <label
                          htmlFor="heli-date"
                          className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <FaCalendarCheck className="text-orange-500" />
                          Departure Date
                        </label>
                        <Input
                          id="heli-date"
                          type="date"
                          value={heliDate}
                          onChange={(e) => setHeliDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full h-14 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm hover:border-orange-300 transition-all duration-300 bg-white"
                        />
                      </motion.div>

                      {/* Helicopter Passengers */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="relative flex flex-col"
                        ref={heliDropdownRef}
                      >
                        <label
                          htmlFor="heli-passengers"
                          className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <FaUser className="text-orange-500" />
                          Passengers
                        </label>
                        <div
                          id="heli-passengers"
                          onClick={() => setIsHeliPassengerDropdownOpen(!isHeliPassengerDropdownOpen)}
                          className={`flex items-center gap-3 border-2 rounded-xl px-4 py-4 text-sm cursor-pointer bg-white shadow-sm hover:border-orange-300 transition-all duration-300 h-14 ${
                            isHeliPassengerDropdownOpen
                              ? "border-orange-500 ring-2 ring-orange-500"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <FaUser className="text-orange-600" />
                          </div>
                          <span className="text-gray-700 font-semibold flex-grow">
                            {totalHeliPassengers} Passenger{totalHeliPassengers !== 1 ? "s" : ""}
                          </span>
                          <svg
                            className={`w-5 h-5 ml-auto text-orange-500 transition-transform duration-300 ${
                              isHeliPassengerDropdownOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                        <AnimatePresence>
                          {isHeliPassengerDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="absolute top-full mt-2 left-0 w-full min-w-[330px] max-w-[90vw] bg-white border-2 border-gray-100 rounded-2xl shadow-2xl z-30 p-6 space-y-4"
                            >
                              {/* Adults */}
                              <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                  <p className="text-gray-800 font-semibold">Adults</p>
                                  <p className="text-xs text-gray-500">(12+ years)</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleHeliPassengerChange("adults", "decrement")}
                                    className="w-10 h-10 rounded-full text-orange-600 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 transition-all"
                                    disabled={heliPassengerData.adults === 0}
                                  >
                                    -
                                  </Button>
                                  <span className="w-10 text-center font-bold text-gray-800 text-lg">
                                    {heliPassengerData.adults}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleHeliPassengerChange("adults", "increment")}
                                    className="w-10 h-10 rounded-full text-orange-600 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all"
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <Separator className="my-2" />
                              {/* Children */}
                              <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                  <p className="text-gray-800 font-semibold">Children</p>
                                  <p className="text-xs text-gray-500">(2-12 years)</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleHeliPassengerChange("children", "decrement")}
                                    className="w-10 h-10 rounded-full text-orange-600 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 transition-all"
                                    disabled={heliPassengerData.children === 0}
                                  >
                                    -
                                  </Button>
                                  <span className="w-10 text-center font-bold text-gray-800 text-lg">
                                    {heliPassengerData.children}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleHeliPassengerChange("children", "increment")}
                                    className="w-10 h-10 rounded-full text-orange-600 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 transition-all"
                                    disabled={heliPassengerData.adults === 0}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <Separator className="my-2" />
                              {/* Infants */}
                              <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                  <p className="text-gray-800 font-semibold">Infants</p>
                                  <p className="text-xs text-gray-500">(0-2 years)</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleHeliPassengerChange("infants", "decrement")}
                                    className="w-10 h-10 rounded-full text-orange-600 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 transition-all"
                                    disabled={heliPassengerData.infants === 0}
                                  >
                                    -
                                  </Button>
                                  <span className="w-10 text-center font-bold text-gray-800 text-lg">
                                    {heliPassengerData.infants}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleHeliPassengerChange("infants", "increment")}
                                    className="w-10 h-10 rounded-full text-orange-600 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 transition-all"
                                    disabled={heliPassengerData.adults === 0}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              {heliPassengerData.adults === 0 &&
                                (heliPassengerData.children > 0 || heliPassengerData.infants > 0) && (
                                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600 font-medium">
                                      ⚠️ An adult must accompany children and infants.
                                    </p>
                                  </div>
                                )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Helicopter Search Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex justify-center"
                      >
                        <Link
                          href={{
                            pathname: "/helicopter-flight",
                            query: {
                              departure: getCityFromCode(heliDeparture) || "",
                              arrival: getCityFromCode(heliArrival) || "",
                              departure_code: heliDeparture || "",
                              arrival_code: heliArrival || "",
                              date: heliDate || "",
                              adults: heliPassengerData.adults,
                              children: heliPassengerData.children,
                              infants: heliPassengerData.infants,
                              passengers: totalHeliPassengers,
                            },
                          }}
                        >
                          <Button
                            className={`w-full mt-7 sm:w-auto h-14 px-8 text-lg font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 border shadow-3xl transform hover:-translate-y-1 ${
                              !heliDeparture || !heliArrival || !heliDate || totalHeliPassengers === 0 || airportFetchError
                                ? "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-600"
                                : "bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-700 hover:via-orange-700 hover:to-red-700 text-white"
                            }`}
                            disabled={!heliDeparture || !heliArrival || !heliDate || totalHeliPassengers === 0 || airportFetchError}
                          >
                            <FaHelicopter className="text-xl" />
                            <span>Search Helicopters</span>
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                  )}







                  {/* Coming Soon Services */}
                  {selectedService === "homestays" && <ComingSoonService serviceName="Homestays" />}
                  {selectedService === "packages" && <ComingSoonService serviceName="Holiday Packages" />}
                  {selectedService === "trains" && <ComingSoonService serviceName="Train Booking" />}
                  {selectedService === "buses" && <ComingSoonService serviceName="Bus Booking" />}
                  {selectedService === "cabs" && <ComingSoonService serviceName="Cab Booking" />}
                  {selectedService === "visa" && <ComingSoonService serviceName="Visa Services" />}
    
                  {/* Error Message */}
                  {airportFetchError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
                    >
                      <div className="flex items-center">
                        <MdErrorOutline className="text-red-500 text-xl mr-3" />
                        <div>
                          <p className="text-red-800 font-semibold">Connection Error</p>
                          <p className="text-red-600 text-sm">
                            Failed to load location data: {airportFetchError}. Please refresh or try again later.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}



{/* 
    
                  Quick Action Buttons
                  <div >
  <iframe 
    width="100%" 
    height="40%" 
    src="/video.mp4" 
    title="YouTube video player" 
    frameBorder="0" 
    allowFullScreen>
  </iframe>
</div> */}


                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
}





















