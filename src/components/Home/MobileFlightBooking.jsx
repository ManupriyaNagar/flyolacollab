"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    FaPlaneDeparture,
    FaUser,
    FaHelicopter,
    FaCalendarCheck,
    FaPlane,
    FaExchangeAlt,
    FaDollarSign,
    FaClock
} from "react-icons/fa";
import { MdErrorOutline, MdFlightTakeoff, MdFlightLand } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import BASE_URL from "@/baseUrl/baseUrl";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
// Removed unused Loader import

export default function MobileFlightBooking() {
    const [departure, setDeparture] = useState("");
    const [arrival, setArrival] = useState("");
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
    });
    const [passengerData, setPassengerData] = useState({
        adults: 1,
        children: 0,
        infants: 0,
    });
    const [airports, setAirports] = useState([]);
    const [isLoadingAirports, setIsLoadingAirports] = useState(false);
    const [airportFetchError, setAirportFetchError] = useState(null);
    const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
    const [serviceType, setServiceType] = useState("flight");
    const dropdownRef = useRef(null);

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

                // Cache for faster subsequent loads
                sessionStorage.setItem('airports_data', JSON.stringify(data));
                sessionStorage.setItem('airports_cache_time', Date.now().toString());

                setAirports(data);
                // Mobile airports loaded successfully
            } catch (error) {
                setAirportFetchError(error.message);
            } finally {
                setIsLoadingAirports(false);
            }
        };
        fetchAirports();
    }, []);

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
    };

    const totalPassengers =
        passengerData.adults + passengerData.children + passengerData.infants;

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


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsPassengerDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getCityFromCode = (code) => {
        const airport = airports.find((a) => a.airport_code === code || a.helipad_code === code);
        return airport ? airport.city : "";
    };

    const getFilteredAirports = () => {
        if (serviceType === "helicopter") {
            return airports.filter((airport) => airport.has_helipad);
        }
        return airports;
    };

    const isSearchDisabled =
        !departure ||
        !arrival ||
        !date ||
        totalPassengers === 0 ||
        airportFetchError;

    return (
        <div className="block md:hidden min-h-screen bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-16 h-16 border border-white rounded-full"></div>
                <div className="absolute top-32 right-8 w-12 h-12 border border-white rounded-full"></div>
                <div className="absolute bottom-40 left-6 w-8 h-8 border border-white rounded-full"></div>
                <div className="absolute bottom-20 right-12 w-20 h-20 border border-white rounded-full"></div>
            </div>

            <div className="relative z-10 px-4 py-6 safe-area-inset">
                {/* Mobile Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="
        relative overflow-hidden
        bg-gradient-to-r from-blue-600 to-blue-500
        rounded-3xl
        text-center mb-8 py-6
      "
                >
                    {/* Decorative wave at the top */}
                    <div className="absolute top-0 left-1/2 w-[150%] -translate-x-1/2 -mt-4 pointer-events-none">
                        <svg
                            viewBox="0 0 1440 320"
                            className="w-full h-8 fill-white/10"
                        >
                            <path
                                d="M0,64L48,90.7C96,117,192,171,288,186.7C384,203,480,181,576,181.3C672,181,768,203,864,213.3C960,224,1056,224,1152,213.3C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                            />
                        </svg>
                    </div>

                    {/* Plane icon with hover & pulse */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.1 }}
                        className="flex justify-center mb-4"
                    >
                        <div className="
          bg-white/20 backdrop-blur-sm
          rounded-full p-3 shadow-lg
        ">
                            <FaPlane className="h-8 w-8 text-white animate-pulse" />
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-3xl font-extrabold text-white mb-2 drop-shadow-md"
                    >
                        {serviceType === "helicopter" ? "Book Your Helicopter" : "Book Your Flight"}
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        variants={itemVariants}
                        className="text-blue-100 text-base mb-4"
                    >
                        {serviceType === "helicopter" ? "Experience luxury helicopter travel" : "Experience premium aviation on mobile"}
                    </motion.p>

                    {/* Features line */}
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center justify-center gap-2 text-xs text-blue-200"
                    >
                        <FaClock className="text-sm" />
                        <span>Safe • Comfortable • Reliable</span>
                    </motion.div>
                </motion.div>
                {/* Mobile Flight Search Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="bg-white/98 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/30 overflow-visible">
                        <CardContent className="p-5">
                            {/* Service Type Toggle */}
                            <div className="flex gap-2 mb-5 p-1 bg-gray-100 rounded-2xl">
                                <button
                                    onClick={() => {
                                        setServiceType("flight");
                                        setDeparture("");
                                        setArrival("");
                                    }}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${serviceType === "flight"
                                        ? "bg-white text-blue-600 shadow-md"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <FaPlane className="text-lg" />
                                    Flight
                                </button>
                                <button
                                    onClick={() => {
                                        setServiceType("helicopter");
                                        setDeparture("");
                                        setArrival("");
                                    }}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${serviceType === "helicopter"
                                        ? "bg-white text-red-600 shadow-md"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <FaHelicopter className="text-lg" />
                                    Helicopter
                                </button>
                            </div>

                            {/* Mobile Form Layout */}
                            <div className="space-y-5">
                                {/* From/To Section */}
                                <div className="space-y-3">
                                    {/* Departure */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="relative"
                                    >
                                        <label className="block text-xs font-bold text-gray-600 mb-2 flex items-center gap-1">
                                            <MdFlightTakeoff className="text-blue-500" />
                                            FROM
                                        </label>
                                        <Select
                                            value={departure}
                                            onValueChange={setDeparture}
                                            disabled={!!airportFetchError}
                                        >
                                            <SelectTrigger className="w-full py-5 h-[16rem] text-base border-2 border-gray-200 rounded-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
                                                <SelectValue placeholder="Select departure city" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {airportFetchError ? (
                                                    <SelectItem value="error" disabled>
                                                        <MdErrorOutline className="mr-2" /> Error loading data
                                                    </SelectItem>
                                                ) : (
                                                    getFilteredAirports().map((airport) => (
                                                        <SelectItem key={`dep-${airport.id}`} value={serviceType === "helicopter" ? airport.helipad_code : airport.airport_code}>
                                                            <div className="flex items-center justify-between w-full">
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{airport.city}</span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {serviceType === "helicopter" ? airport.helipad_code : airport.airport_code}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-1 ml-2">
                                                                    {serviceType === "flight" && <FaPlane className="text-blue-500 text-xs" title="Airport available" />}
                                                                    {serviceType === "helicopter" && <FaHelicopter className="text-red-500 text-xs" title="Helipad available" />}
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </motion.div>

                                    {/* Swap Button */}
                                    <div className="flex justify-center -my-1">
                                        <button
                                            onClick={() => {
                                                const temp = departure;
                                                setDeparture(arrival);
                                                setArrival(temp);
                                            }}
                                            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg z-10"
                                        >
                                            <FaExchangeAlt className="text-lg transform rotate-90" />
                                        </button>
                                    </div>

                                    {/* Arrival */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <label className="block text-xs font-bold text-gray-600 mb-2 flex items-center gap-1">
                                            <MdFlightLand className="text-blue-500" />
                                            TO
                                        </label>
                                        <Select
                                            value={arrival}
                                            onValueChange={setArrival}
                                            disabled={!!airportFetchError}
                                        >
                                            <SelectTrigger className="w-full h-16 py-5 text-base border-2 border-gray-200 rounded-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300">
                                                <SelectValue placeholder="Select destination city" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {airportFetchError ? (
                                                    <SelectItem value="error" disabled>
                                                        <MdErrorOutline className="mr-2" /> Error loading data
                                                    </SelectItem>
                                                ) : (
                                                    getFilteredAirports().map((airport) => (
                                                        <SelectItem key={`arr-${airport.id}`} value={serviceType === "helicopter" ? airport.helipad_code : airport.airport_code}>
                                                            <div className="flex items-center justify-between w-full">
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{airport.city}</span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {serviceType === "helicopter" ? airport.helipad_code : airport.airport_code}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-1 ml-2">
                                                                    {serviceType === "flight" && <FaPlane className="text-blue-500 text-xs" title="Airport available" />}
                                                                    {serviceType === "helicopter" && <FaHelicopter className="text-red-500 text-xs" title="Helipad available" />}
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </motion.div>
                                </div>

                                {/* Date and Passengers Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Date */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <label className="block text-xs font-bold text-gray-600 mb-2 flex items-center gap-1">
                                            <FaCalendarCheck className="text-blue-500" />
                                            DEPARTURE
                                        </label>
                                        <Input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                            className="w-full h-14 text-sm border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-300 bg-white"
                                        />
                                    </motion.div>

                                    {/* Passengers */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="relative"
                                        ref={dropdownRef}
                                    >
                                        <label className="block text-xs font-bold text-gray-600 mb-2 flex items-center gap-1">
                                            <FaUser className="text-blue-500" />
                                            PASSENGERS
                                        </label>
                                        <div
                                            onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}
                                            className={`flex items-center gap-2 border-2 border-gray-200 rounded-2xl px-4 py-4 text-sm cursor-pointer bg-white shadow-sm transition-all duration-300 h-14 ${isPassengerDropdownOpen
                                                ? "ring-2 ring-blue-500 border-blue-500"
                                                : "hover:border-blue-300"
                                                }`}
                                        >
                                            <div className="p-1 bg-blue-100 rounded-lg">
                                                <FaUser className="text-blue-600 text-sm" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <span className="text-gray-700 font-semibold text-sm whitespace-nowrap">
                                                    {totalPassengers} {totalPassengers === 1 ? "Passenger" : "Passengers"}
                                                </span>
                                            </div>
                                            <svg
                                                className={`w-5 h-5 text-blue-500 transition-transform duration-300 ${isPassengerDropdownOpen ? "rotate-180" : ""
                                                    }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>

                                        <AnimatePresence>
                                            {isPassengerDropdownOpen && (
                                                <>
                                                    {/* dim + blur everything behind the sheet on phones */}
                                                    <motion.div
                                                        key="overlay"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 0.3 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        onClick={() => setIsPassengerDropdownOpen(false)}
                                                        className="fixed inset-0 z-40 bg-black backdrop-blur-md md:hidden"
                                                    />

                                                    <motion.div
                                                        key="sheet"
                                                        /* ⬇ phone: bottom‑sheet   desktop: normal popover */
                                                        initial={{ y: "100%", opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: "100%", opacity: 0 }}
                                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                                        className="
          fixed md:absolute
          inset-x-0 md:left-0 md:right-0
          bottom-0 md:top-full md:mt-3
          z-50
          mx-auto md:mx-0
          w-full max-w-md md:max-w-none
          bg-white/90 backdrop-blur-lg
          rounded-3xl md:rounded-3xl
          shadow-xl ring-1 ring-black/5
          px-6 py-6 space-y-6
          max-h-[65vh] md:max-h-[30vh] overflow-y-auto
        "
                                                    >
                                                        {/* drag‑bar */}
                                                        <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300/70 md:hidden mb-2" />

                                                        {/* === ADULTS === */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex justify-center items-center">
                                                                    <FaUser className="text-blue-600 text-sm" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">Adults</p>
                                                                    <p className="text-xs text-gray-500">(12+ yrs)</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <button
                                                                    disabled={passengerData.adults <= 1}
                                                                    onClick={() => handlePassengerChange("adults", "decrement")}
                                                                    className="counterBtn border-blue-200 text-blue-600 disabled:opacity-40"
                                                                >–</button>

                                                                <span className="w-8 text-center font-bold text-lg">
                                                                    {passengerData.adults}
                                                                </span>

                                                                <button
                                                                    onClick={() => handlePassengerChange("adults", "increment")}
                                                                    className="counterBtn bg-blue-500 text-white hover:bg-blue-600"
                                                                >+</button>
                                                            </div>
                                                        </div>

                                                        <Separator />

                                                        {/* === CHILDREN === */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-green-100 rounded-xl flex justify-center items-center">
                                                                    <FaUser className="text-green-600 text-xs" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">Children</p>
                                                                    <p className="text-xs text-gray-500">(2‑12 yrs)</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <button
                                                                    disabled={passengerData.children === 0}
                                                                    onClick={() => handlePassengerChange("children", "decrement")}
                                                                    className="counterBtn border-green-200 text-green-600 disabled:opacity-40"
                                                                >–</button>

                                                                <span className="w-8 text-center font-bold text-lg">
                                                                    {passengerData.children}
                                                                </span>

                                                                <button
                                                                    disabled={passengerData.adults === 0}
                                                                    onClick={() => handlePassengerChange("children", "increment")}
                                                                    className="counterBtn bg-green-500 text-white hover:bg-green-600 disabled:opacity-40"
                                                                >+</button>
                                                            </div>
                                                        </div>

                                                        <Separator />

                                                        {/* === INFANTS === */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-pink-100 rounded-xl flex justify-center items-center">
                                                                    <FaUser className="text-pink-600 text-xs" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">Infants</p>
                                                                    <p className="text-xs text-gray-500">(0‑2 yrs)</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <button
                                                                    disabled={passengerData.infants === 0}
                                                                    onClick={() => handlePassengerChange("infants", "decrement")}
                                                                    className="counterBtn border-pink-200 text-pink-600 disabled:opacity-40"
                                                                >–</button>

                                                                <span className="w-8 text-center font-bold text-lg">
                                                                    {passengerData.infants}
                                                                </span>

                                                                <button
                                                                    disabled={passengerData.adults === 0}
                                                                    onClick={() => handlePassengerChange("infants", "increment")}
                                                                    className="counterBtn bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-40"
                                                                >+</button>
                                                            </div>
                                                        </div>

                                                        {/* Warning */}
                                                        {passengerData.adults === 0 &&
                                                            (passengerData.children > 0 || passengerData.infants > 0) && (
                                                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 flex gap-2">
                                                                    ⚠ At least one adult must accompany children/infants.
                                                                </div>
                                                            )}

                                                        {/* Done */}
                                                        <button
                                                            onClick={() => setIsPassengerDropdownOpen(false)}
                                                            className="w-full h-12 mt-2 bg-gradient-to-r from-blue-500 to-blue-500
                     text-white font-semibold rounded-2xl shadow-md
                     hover:brightness-105 active:brightness-95 active:scale-95
                     transition"
                                                        >
                                                            Done
                                                        </button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>


                                    </motion.div>
                                </div>

                                {/* Error Message */}
                                {airportFetchError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <MdErrorOutline className="text-red-500 text-lg mr-2" />
                                            <div>
                                                <p className="text-red-800 font-semibold text-sm">Connection Error</p>
                                                <p className="text-red-600 text-xs">Failed to load airport data. Please try again.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Search Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="pt-2"
                                >
                                    <Link
                                        href={{
                                            pathname: serviceType === "helicopter" ? "/helicopter-flight" : "/scheduled-flight",
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
                                        passHref
                                        legacyBehavior
                                    >
                                        <Button
                                            asChild
                                            className={`w-full h-16 text-lg font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-xl ${isSearchDisabled
                                                ? "bg-blue-600 cursor-not-allowed text-gray-600"
                                                : serviceType === "helicopter"
                                                    ? "bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-700 hover:via-orange-700 hover:to-red-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                                                    : "bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 hover:from-blue-700 hover:via-blue-700 hover:to-blue-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                                                }`}
                                            disabled={isSearchDisabled}
                                        >
                                            <a className="flex items-center gap-3 justify-center w-full text-white">
                                                {serviceType === "helicopter" ? (
                                                    <>
                                                        <FaHelicopter className="text-xl" />
                                                        Search Helicopters
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaPlaneDeparture className="text-xl" />
                                                        Search Flights
                                                    </>
                                                )}
                                            </a>
                                        </Button>
                                    </Link>
                                </motion.div>

                                {/* Quick Actions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="grid grid-cols-2 gap-3 pt-4"
                                >
                                    <Button
                                        asChild
                                        className="h-14 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl flex items-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <a>
                                            <FaDollarSign className="text-lg" />
                                            <span className="text-sm">Charter</span>
                                        </a>
                                    </Button>

                                    <Button
                                        asChild
                                        className="h-14 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-semibold rounded-2xl flex items-center gap-2 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <Link href="/joy-ride">
                                            <FaPlane className="text-lg" />
                                            <span className="text-sm">Joy Rides</span>
                                        </Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Mobile Features */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mt-8 space-y-4"
                >
                    <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-5">
                        <h3 className="text-white font-bold text-center mb-5 text-lg">Why Choose Flyola?</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <FaPlane className="text-white text-xl" />
                                </div>
                                <p className="text-white text-xs font-medium">Safe Flights</p>
                            </div>
                            <div className="text-center">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <FaClock className="text-white text-xl" />
                                </div>
                                <p className="text-white text-xs font-medium">24/7 Support</p>
                            </div>
                            <div className="text-center">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <FaDollarSign className="text-white text-xl" />
                                </div>
                                <p className="text-white text-xs font-medium">Best Prices</p>
                            </div>
                        </div>
                    </div>

                    {/* Special Offers Banner */}

                </motion.div>
            </div>
        </div>
    );
}