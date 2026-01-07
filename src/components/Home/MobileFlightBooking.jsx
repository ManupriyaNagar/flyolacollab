"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
    FaCalendarCheck,
    FaClock,
    FaDollarSign,
    FaExchangeAlt,
    FaHelicopter,
    FaHome,
    FaPlane,
    FaPlaneDeparture,
    FaUser
} from "react-icons/fa";
import { MdErrorOutline, MdFlightLand, MdFlightTakeoff } from "react-icons/md";
import MobileHotelBooking from "./MobileHotelBooking";
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
    const [helipads, setHelipads] = useState([]);
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
                return;
            }

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
            } catch (error) {
                setAirportFetchError(error.message);
            }
        };
        
        const fetchHelipads = async () => {
            // Check cache first for faster loading
            const cached = sessionStorage.getItem('helipads_data');
            const cacheTime = sessionStorage.getItem('helipads_cache_time');

            if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 300000) {
                setHelipads(JSON.parse(cached));
                return;
            }

            setAirportFetchError(null);
            try {
                const response = await fetch(`${BASE_URL}/helipads`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch helipads: ${response.status}`);
                }
                const data = await response.json();

                // Cache for faster subsequent loads
                sessionStorage.setItem('helipads_data', JSON.stringify(data));
                sessionStorage.setItem('helipads_cache_time', Date.now().toString());

                setHelipads(data);
            } catch (error) {
                setAirportFetchError(error.message);
            }
        };
        
        fetchAirports();
        fetchHelipads();
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
        if (serviceType === "helicopter") {
            const helipad = helipads.find((h) => h.helipad_code === code);
            return helipad ? helipad.city : "";
        } else {
            const airport = airports.find((a) => a.airport_code === code);
            return airport ? airport.city : "";
        }
    };

    const getFilteredLocations = () => {
        if (serviceType === "helicopter") {
            return helipads;
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
        <div className={cn('block', 'md:hidden', 'min-h-screen', 'bg-gradient-to-br', 'from-blue-600', 'via-blue-600', 'to-blue-700', 'relative', 'overflow-hidden')}>
            {/* Background Pattern */}
            <div className={cn('absolute', 'inset-0', 'opacity-5')}>
                <div className={cn('absolute', 'top-10', 'left-10', 'w-16', 'h-16', 'border', 'border-white', 'rounded-full')}></div>
                <div className={cn('absolute', 'top-32', 'right-8', 'w-12', 'h-12', 'border', 'border-white', 'rounded-full')}></div>
                <div className={cn('absolute', 'bottom-40', 'left-6', 'w-8', 'h-8', 'border', 'border-white', 'rounded-full')}></div>
                <div className={cn('absolute', 'bottom-20', 'right-12', 'w-20', 'h-20', 'border', 'border-white', 'rounded-full')}></div>
            </div>

            <div className={cn('relative', 'z-10', 'px-4', 'py-6', 'safe-area-inset')}>
                {/* Mobile Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={cn('relative','border', 'border-blue-300',   'overflow-hidden', 'bg-gradient-to-r', 'from-blue-600', 'to-blue-500', 'rounded-3xl', 'text-center', 'mb-8', 'py-6')}
                >
       

           
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={cn('text-3xl', 'font-extrabold', 'text-white', 'mb-2', 'drop-shadow-md')}
                    >
                        {serviceType === "helicopter" ? "Book Your Helicopter" : serviceType === "hotel" ? "Book Your Hotel" : "Book Your Flight"}
                    </motion.h1>

           
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={cn('text-blue-100', 'text-base', 'mb-4')}
                    >
                        {serviceType === "helicopter" ? "Experience luxury helicopter travel" : serviceType === "hotel" ? "Find perfect stays at best prices" : "Experience premium aviation on mobile"}
                    </motion.p>

 
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className={cn('flex', 'items-center', 'justify-center', 'gap-2', 'text-xs', 'text-blue-200')}
                    >
                        <FaClock className="text-sm" />
                        <span>Safe • Comfortable • Reliable</span>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className={cn('bg-white', 'backdrop-blur-xl', 'shadow-2xl', 'rounded-3xl', 'border', 'border-white/30', 'overflow-visible')}>
                        <CardContent className="p-1">
                            {/* Service Type Toggle */}
                            <div className={cn('flex', 'gap-2', 'mb-5', 'p-1', 'bg-gray-100', 'rounded-2xl')}>
                                <button
                                    onClick={() => {
                                        setServiceType("flight");
                                        setDeparture("");
                                        setArrival("");
                                    }}
                                    className={`flex-1 py-3 px-2 rounded-xl font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1 ${serviceType === "flight"
                                        ? "bg-white text-blue-600 shadow-md"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <FaPlane className="text-base" />
                                    Flight
                                </button>
                                <button
                                    onClick={() => {
                                        setServiceType("helicopter");
                                        setDeparture("");
                                        setArrival("");
                                    }}
                                    className={`flex-1 py-3 px-2 rounded-xl font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1 ${serviceType === "helicopter"
                                        ? "bg-white text-red-600 shadow-md"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <FaHelicopter className="text-base" />
                                    Heli
                                </button>
                                <button
                                    onClick={() => {
                                        setServiceType("hotel");
                                    }}
                                    className={`flex-1 py-3 px-2 rounded-xl font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1 ${serviceType === "hotel"
                                        ? "bg-white text-purple-600 shadow-md"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <FaHome className="text-base" />
                                    Hotel
                                </button>
                            </div>

                            {/* Mobile Form Layout */}
                            <div className="space-y-5">
                                {/* Show Hotel Booking Form when hotel service is selected */}
                                {serviceType === "hotel" ? (
                                    <MobileHotelBooking />
                                ) : (
                                    <>
                                {/* From/To Section */}
                                <div className="space-y-3">
                                    {/* Departure */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="relative"
                                    >
                                        <label className={cn('block', 'text-xs', 'font-bold', 'text-gray-600', 'mb-2', 'flex', 'items-center', 'gap-1')}>
                                            <MdFlightTakeoff className="text-blue-500" />
                                            FROM
                                        </label>
                                        <Select
                                            value={departure}
                                            onValueChange={setDeparture}
                                            disabled={!!airportFetchError}
                                        >
                                            <SelectTrigger className={cn('w-full', 'h-16', 'text-base', 'border-2', 'border-gray-200', 'rounded-md', 'bg-white', 'shadow-sm', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all', 'duration-300')}>
                                                <SelectValue placeholder="Select departure city" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {airportFetchError ? (
                                                    <SelectItem value="error" disabled>
                                                        <MdErrorOutline className="mr-2" /> Error loading data
                                                    </SelectItem>
                                                ) : (
                                                    getFilteredLocations().map((location) => (
                                                        <SelectItem key={`dep-${location.id}`} value={serviceType === "helicopter" ? location.helipad_code : location.airport_code}>
                                                            <div className={cn('flex', 'items-center', 'justify-between', 'w-full')}>
                                                                <div className={cn('flex', 'flex-row', 'items-center', 'gap-2')}>
                                                                    <span className="font-medium">{location.city}</span>
                                                                    <span className={cn('text-xs', 'text-gray-500' , 'text-left')}>
                                                                        ({serviceType === "helicopter" ? location.helipad_code : location.airport_code})
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </motion.div>

                                    {/* Swap Button */}
                                    <div className={cn('flex', 'justify-center', '-my-1')}>
                                        <button
                                            onClick={() => {
                                                const temp = departure;
                                                setDeparture(arrival);
                                                setArrival(temp);
                                            }}
                                            className={cn('p-3', 'bg-blue-500', 'text-white', 'rounded-full', 'hover:bg-blue-600', 'transition-colors', 'shadow-sm', 'z-10')}
                                        >
                                            <FaExchangeAlt className={cn('text-lg', 'transform', 'rotate-90')} />
                                        </button>
                                    </div>

                                    {/* Arrival */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <label className={cn('block', 'text-xs', 'font-bold', 'text-gray-600', 'mb-2', 'flex', 'items-center', 'gap-1')}>
                                            <MdFlightLand className="text-blue-500" />
                                            TO
                                        </label>
                                        <Select
                                            value={arrival}
                                            onValueChange={setArrival}
                                            disabled={!!airportFetchError}
                                        >
                                            <SelectTrigger className={cn('w-full', 'h-16', 'text-base', 'border-2', 'border-gray-200', 'rounded-md', 'bg-white', 'shadow-sm', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all', 'duration-300')}>
                                                <SelectValue placeholder="Select destination city" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {airportFetchError ? (
                                                    <SelectItem value="error" disabled>
                                                        <MdErrorOutline className="mr-2" /> Error loading data
                                                    </SelectItem>
                                                ) : (
                                                    getFilteredLocations().map((location) => (
                                                        <SelectItem key={`arr-${location.id}`} value={serviceType === "helicopter" ? location.helipad_code : location.airport_code}>
                                                            <div className={cn('flex', 'items-center', 'justify-between', 'w-full')}>
                                                                <div className={cn('flex', 'flex-row', 'items-center', 'gap-2')}>
                                                                    <span className="font-medium">{location.city}</span>
                                                                    <span className={cn('text-xs', 'text-gray-500' , 'text-left')}>
                                                                        ({serviceType === "helicopter" ? location.helipad_code : location.airport_code})
                                                                    </span>
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
                                <div className={cn('grid', 'grid-cols-2', 'gap-4')}>
                                    {/* Date */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <label className={cn('block', 'text-xs', 'font-bold', 'text-gray-600', 'mb-2', 'flex', 'items-center', 'gap-1')}>
                                            <FaCalendarCheck className="text-blue-500" />
                                            DEPARTURE
                                        </label>
                                        <Input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                            className={cn('w-full', 'h-12', 'text-sm', 'border-2', 'border-gray-200', 'rounded-2xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'shadow-sm', 'transition-all', 'duration-300', 'bg-white')}
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
                                        <label className={cn('block', 'text-xs', 'font-bold', 'text-gray-600', 'mb-2', 'flex', 'items-center', 'gap-1')}>
                                            <FaUser className="text-blue-500" />
                                            PASSENGERS
                                        </label>
                                        <div
                                            onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}
                                            className={`flex items-center gap-2 border-2 border-gray-200 rounded-2xl px-4 py-4 text-sm cursor-pointer bg-white shadow-sm transition-all duration-300 h-12 ${isPassengerDropdownOpen
                                                ? "ring-2 ring-blue-500 border-blue-500"
                                                : "hover:border-blue-300"
                                                }`}
                                        >
                                            <div className={cn('p-1', 'bg-blue-100', 'rounded-lg')}>
                                                <FaUser className={cn('text-blue-600', 'text-sm')} />
                                            </div>
                                            <div className={cn('flex-grow', 'min-w-0')}>
                                                <span className={cn('text-gray-700', 'font-semibold', 'text-sm', 'whitespace-nowrap')}>
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
                                                        className={cn('fixed', 'inset-0', 'z-40', 'bg-black', 'backdrop-blur-md', 'md:hidden')}
                                                    />

                                                    <motion.div
                                                        key="sheet"
                                                        /* ⬇ phone: bottom‑sheet   desktop: normal popover */
                                                        initial={{ y: "100%", opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: "100%", opacity: 0 }}
                                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                                        className={cn('fixed', 'md:absolute', 'inset-x-0', 'md:left-0', 'md:right-0', 'bottom-0', 'md:top-full', 'md:mt-3', 'z-50', 'mx-auto', 'md:mx-0', 'w-full', 'max-w-md', 'md:max-w-none', 'bg-white/90', 'backdrop-blur-lg', 'rounded-3xl', 'md:rounded-3xl', 'shadow-xl', 'ring-1', 'ring-black/5', 'space-y-6', 'max-h-[65vh]', 'md:max-h-[30vh]', 'overflow-y-auto')}
                                                    >
                                                        {/* drag‑bar */}
                                                        <div className={cn('mx-auto', 'h-1.5', 'w-12', 'rounded-full', 'bg-gray-300/70', 'md:hidden', 'mb-2')} />

                                                        {/* === ADULTS === */}
                                                        <div className={cn('flex', 'items-center', 'justify-between')}>
                                                            <div className={cn('flex', 'items-center', 'gap-3')}>
                                                                <div className={cn('w-10', 'h-10', 'bg-blue-100', 'rounded-xl', 'flex', 'justify-center', 'items-center')}>
                                                                    <FaUser className={cn('text-blue-600', 'text-sm')} />
                                                                </div>
                                                                <div>
                                                                    <p className={cn('font-semibold', 'text-gray-900')}>Adults</p>
                                                                    <p className={cn('text-xs', 'text-gray-500')}>(12+ yrs)</p>
                                                                </div>
                                                            </div>

                                                            <div className={cn('flex', 'items-center', 'gap-4')}>
                                                                <button
                                                                    disabled={passengerData.adults <= 1}
                                                                    onClick={() => handlePassengerChange("adults", "decrement")}
                                                                    className={cn('counterBtn', 'border-blue-200', 'text-blue-600', 'disabled:opacity-40')}
                                                                >–</button>

                                                                <span className={cn('w-8', 'text-center', 'font-bold', 'text-lg')}>
                                                                    {passengerData.adults}
                                                                </span>

                                                                <button
                                                                    onClick={() => handlePassengerChange("adults", "increment")}
                                                                    className={cn('counterBtn', 'bg-blue-500', 'text-white', 'hover:bg-blue-600')}
                                                                >+</button>
                                                            </div>
                                                        </div>

                                                        <Separator />

                                                        {/* === CHILDREN === */}
                                                        <div className={cn('flex', 'items-center', 'justify-between')}>
                                                            <div className={cn('flex', 'items-center', 'gap-3')}>
                                                                <div className={cn('w-10', 'h-10', 'bg-green-100', 'rounded-xl', 'flex', 'justify-center', 'items-center')}>
                                                                    <FaUser className={cn('text-green-600', 'text-xs')} />
                                                                </div>
                                                                <div>
                                                                    <p className={cn('font-semibold', 'text-gray-900')}>Children</p>
                                                                    <p className={cn('text-xs', 'text-gray-500')}>(2‑12 yrs)</p>
                                                                </div>
                                                            </div>

                                                            <div className={cn('flex', 'items-center', 'gap-4')}>
                                                                <button
                                                                    disabled={passengerData.children === 0}
                                                                    onClick={() => handlePassengerChange("children", "decrement")}
                                                                    className={cn('counterBtn', 'border-green-200', 'text-green-600', 'disabled:opacity-40')}
                                                                >–</button>

                                                                <span className={cn('w-8', 'text-center', 'font-bold', 'text-lg')}>
                                                                    {passengerData.children}
                                                                </span>

                                                                <button
                                                                    disabled={passengerData.adults === 0}
                                                                    onClick={() => handlePassengerChange("children", "increment")}
                                                                    className={cn('counterBtn', 'bg-green-500', 'text-white', 'hover:bg-green-600', 'disabled:opacity-40')}
                                                                >+</button>
                                                            </div>
                                                        </div>

                                                        <Separator />

                                                        {/* === INFANTS === */}
                                                        <div className={cn('flex', 'items-center', 'justify-between')}>
                                                            <div className={cn('flex', 'items-center', 'gap-3')}>
                                                                <div className={cn('w-10', 'h-10', 'bg-pink-100', 'rounded-xl', 'flex', 'justify-center', 'items-center')}>
                                                                    <FaUser className={cn('text-pink-600', 'text-xs')} />
                                                                </div>
                                                                <div>
                                                                    <p className={cn('font-semibold', 'text-gray-900')}>Infants</p>
                                                                    <p className={cn('text-xs', 'text-gray-500')}>(0‑2 yrs)</p>
                                                                </div>
                                                            </div>

                                                            <div className={cn('flex', 'items-center', 'gap-4')}>
                                                                <button
                                                                    disabled={passengerData.infants === 0}
                                                                    onClick={() => handlePassengerChange("infants", "decrement")}
                                                                    className={cn('counterBtn', 'border-pink-200', 'text-pink-600', 'disabled:opacity-40')}
                                                                >–</button>

                                                                <span className={cn('w-8', 'text-center', 'font-bold', 'text-lg')}>
                                                                    {passengerData.infants}
                                                                </span>

                                                                <button
                                                                    disabled={passengerData.adults === 0}
                                                                    onClick={() => handlePassengerChange("infants", "increment")}
                                                                    className={cn('counterBtn', 'bg-pink-500', 'text-white', 'hover:bg-pink-600', 'disabled:opacity-40')}
                                                                >+</button>
                                                            </div>
                                                        </div>

                                                        {/* Warning */}
                                                        {passengerData.adults === 0 &&
                                                            (passengerData.children > 0 || passengerData.infants > 0) && (
                                                                <div className={cn('bg-amber-50', 'border', 'border-amber-200', 'rounded-2xl', 'p-4', 'text-sm', 'text-amber-800', 'flex', 'gap-2')}>
                                                                    ⚠ At least one adult must accompany children/infants.
                                                                </div>
                                                            )}

                                                        {/* Done */}
                                                        <button
                                                            onClick={() => setIsPassengerDropdownOpen(false)}
                                                            className={cn('w-full', 'h-12', 'mt-2', 'bg-gradient-to-r', 'from-blue-500', 'to-blue-500', 'text-white', 'font-semibold', 'rounded-2xl', 'shadow-md', 'hover:brightness-105', 'active:brightness-95', 'active:scale-95', 'transition')}
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
                                        className={cn('bg-red-50', 'border-l-4', 'border-red-500', 'p-3', 'rounded-lg')}
                                    >
                                        <div className={cn('flex', 'items-center')}>
                                            <MdErrorOutline className={cn('text-red-500', 'text-lg', 'mr-2')} />
                                            <div>
                                                <p className={cn('text-red-800', 'font-semibold', 'text-sm')}>Connection Error</p>
                                                <p className={cn('text-red-600', 'text-xs')}>Failed to load airport data. Please try again.</p>
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
                                    >
                                        <Button
                                            className={`w-full h-12 text-lg font-bold rounded-xl flex items-center gap-3 transition-all duration-300 shadow-xl ${isSearchDisabled
                                                ? "bg-blue-600 cursor-not-allowed text-gray-600"
                                                : serviceType === "helicopter"
                                                    ? "bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-700 hover:via-orange-700 hover:to-red-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                                                    : "bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 hover:from-blue-700 hover:via-blue-700 hover:to-blue-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                                                }`}
                                            disabled={isSearchDisabled}
                                        >
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
                                        </Button>
                                    </Link>
                                </motion.div>

                                {/* Quick Actions */}
                           
                                    </>
                                )}
                            </div>


                        </CardContent>
                    </Card>
                </motion.div>

                {/* Mobile Features */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className={cn('mt-8', 'space-y-4')}
                >
                    <div className={cn('bg-white/15', 'backdrop-blur-sm', 'rounded-3xl', 'p-5')}>
                        <h3 className={cn('text-white', 'font-bold', 'text-center', 'mb-5', 'text-lg')}>Why Choose Flyola?</h3>
                        <div className={cn('grid', 'grid-cols-3', 'gap-4')}>
                            <div className="text-center">
                                <div className={cn('w-14', 'h-14', 'bg-white/20', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mx-auto', 'mb-3')}>
                                    <FaPlane className={cn('text-white', 'text-xl')} />
                                </div>
                                <p className={cn('text-white', 'text-xs', 'font-medium')}>Safe Flights</p>
                            </div>
                            <div className="text-center">
                                <div className={cn('w-14', 'h-14', 'bg-white/20', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mx-auto', 'mb-3')}>
                                    <FaClock className={cn('text-white', 'text-xl')} />
                                </div>
                                <p className={cn('text-white', 'text-xs', 'font-medium')}>24/7 Support</p>
                            </div>
                            <div className="text-center">
                                <div className={cn('w-14', 'h-14', 'bg-white/20', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mx-auto', 'mb-3')}>
                                    <FaDollarSign className={cn('text-white', 'text-xl')} />
                                </div>
                                <p className={cn('text-white', 'text-xs', 'font-medium')}>Best Prices</p>
                            </div>
                        </div>
                    </div>

                    {/* Special Offers Banner */}

                </motion.div>
            </div>
        </div>
    );
}