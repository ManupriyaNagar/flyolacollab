"use client";

import { Button } from "@/components/ui/button";
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
import API from "@/services/api";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
    FaCalendarCheck,
    FaHome,
    FaMapMarkerAlt,
    FaRupeeSign,
    FaUser
} from "react-icons/fa";

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

export default function MobileHotelBooking() {
    const [destination, setDestination] = useState("");
    const [checkInDate, setCheckInDate] = useState(() => getTomorrowDateIST());
    const [checkOutDate, setCheckOutDate] = useState("");
    const [guests, setGuests] = useState({
        rooms: 1,
        adults: 2,
        children: 0
    });
    const [priceRange, setPriceRange] = useState("any");
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
    const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
    
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
                
                if (response && response.data && Array.isArray(response.data)) {
                    const activeCities = response.data.filter(city => city.status === 0);
                    setCities(activeCities);
                    // Auto-select first city
                    if (activeCities.length > 0 && !destination) {
                        setDestination(activeCities[0].name);
                    }
                } else if (response && Array.isArray(response)) {
                    const activeCities = response.filter(city => city.status === 0);
                    setCities(activeCities);
                    // Auto-select first city
                    if (activeCities.length > 0 && !destination) {
                        setDestination(activeCities[0].name);
                    }
                } else {
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

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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

    const totalGuests = guests.adults + guests.children;
    const isSearchDisabled = !destination.trim() || !checkInDate || !checkOutDate;

    return (
        <div className="space-y-5">
            {/* Destination */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
            >
                <label className={cn('block', 'text-xs', 'font-bold', 'text-gray-600', 'mb-2', 'flex', 'items-center', 'gap-1')}>
                    <FaMapMarkerAlt className="text-blue-500" />
                    DESTINATION
                </label>
                <Select
                    value={destination}
                    onValueChange={setDestination}
                    disabled={loadingCities}
                >
                    <SelectTrigger className={cn('w-full', 'h-16', 'py-5', 'text-base', 'border-2', 'border-gray-200', 'rounded-2xl', 'bg-white', 'shadow-sm', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'transition-all', 'duration-300')}>
                        <SelectValue placeholder="Select destination city" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                        {cities.map((city) => (
                            <SelectItem key={city.id} value={city.name}>
                                <div className={cn('flex', 'items-center', 'justify-between', 'w-full')}>
                                    <div className={cn('flex', 'flex-col')}>
                                        <span className="font-medium">{city.name}</span>
                                        <span className={cn('text-xs', 'text-gray-500')}>
                                            {city.state}
                                        </span>
                                    </div>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </motion.div>

            {/* Check-in and Check-out Dates */}
            <div className={cn('grid', 'grid-cols-2', 'gap-4')}>
                {/* Check-in Date */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <label className={cn('block', 'text-xs', 'font-bold', 'text-gray-600', 'mb-2', 'flex', 'items-center', 'gap-1')}>
                        <FaCalendarCheck className="text-blue-500" />
                        CHECK-IN
                    </label>
                    <Input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => {
                            setCheckInDate(e.target.value);
                            // Auto-update checkout if needed
                            if (checkOutDate && new Date(e.target.value) >= new Date(checkOutDate)) {
                                const nextDay = new Date(e.target.value);
                                nextDay.setDate(nextDay.getDate() + 1);
                                setCheckOutDate(formatDateToInput(nextDay));
                            }
                        }}
                        min={new Date().toISOString().split("T")[0]}
                        className={cn('w-full', 'h-12', 'text-sm', 'border-2', 'border-gray-200', 'rounded-2xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'shadow-sm', 'transition-all', 'duration-300', 'bg-white')}
                    />
                </motion.div>

                {/* Check-out Date */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <label className={cn('block', 'text-xs', 'font-bold', 'text-gray-600', 'mb-2', 'flex', 'items-center', 'gap-1')}>
                        <FaCalendarCheck className="text-blue-500" />
                        CHECK-OUT
                    </label>
                    <Input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        min={checkInDate || new Date().toISOString().split("T")[0]}
                        className={cn('w-full', 'h-12', 'text-sm', 'border-2', 'border-gray-200', 'rounded-2xl', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-blue-500', 'shadow-sm', 'transition-all', 'duration-300', 'bg-white')}
                    />
                </motion.div>
            </div>

            {/* Guests and Price Range */}
            <div className={cn('grid', 'grid-cols-2', 'gap-4')}>
                {/* Guests */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative"
                    ref={guestDropdownRef}
                >
                    <label className={cn('block', 'text-xs', 'font-bold', 'text-gray-600', 'mb-2', 'flex', 'items-center', 'gap-1')}>
                        <FaUser className="text-blue-500" />
                        GUESTS
                    </label>
                    <div
                        onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                        className={`flex items-center gap-2 border-2 border-gray-200 rounded-2xl px-4 py-4 text-sm cursor-pointer bg-white shadow-sm transition-all duration-300 h-12 ${
                            isGuestDropdownOpen
                                ? "ring-2 ring-blue-500 border-blue-500"
                                : "hover:border-blue-300"
                        }`}
                    >
                        <div className={cn('p-1', 'bg-blue-100', 'rounded-lg')}>
                            <FaUser className={cn('text-blue-600', 'text-sm')} />
                        </div>
                        <div className={cn('flex-grow', 'min-w-0')}>
                            <span className={cn('text-gray-700', 'font-semibold', 'text-sm', 'whitespace-nowrap')}>
                                {totalGuests} Guest{totalGuests !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <svg
                            className={`w-5 h-5 text-blue-500 transition-transform duration-300 ${
                                isGuestDropdownOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    <AnimatePresence>
                        {isGuestDropdownOpen && (
                            <>
                                <motion.div
                                    key="overlay"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.3 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => setIsGuestDropdownOpen(false)}
                                    className={cn('fixed', 'inset-0', 'z-40', 'bg-black', 'backdrop-blur-md', 'md:hidden')}
                                />

                                <motion.div
                                    key="sheet"
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: "100%", opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className={cn('fixed', 'md:absolute', 'inset-x-0', 'md:left-0', 'md:right-0', 'bottom-0', 'md:top-full', 'md:mt-3', 'z-50', 'mx-auto', 'md:mx-0', 'w-full', 'max-w-md', 'md:max-w-none', 'bg-white/90', 'backdrop-blur-lg', 'rounded-3xl', 'md:rounded-3xl', 'shadow-xl', 'ring-1', 'ring-black/5', 'px-6', 'py-6', 'space-y-6', 'max-h-[65vh]', 'md:max-h-[30vh]', 'overflow-y-auto')}
                                >
                                    <div className={cn('mx-auto', 'h-1.5', 'w-12', 'rounded-full', 'bg-gray-300/70', 'md:hidden', 'mb-2')} />

                                    {/* Rooms */}
                                    <div className={cn('flex', 'items-center', 'justify-between')}>
                                        <div className={cn('flex', 'items-center', 'gap-3')}>
                                            <div className={cn('w-10', 'h-10', 'bg-purple-100', 'rounded-xl', 'flex', 'justify-center', 'items-center')}>
                                                <FaHome className={cn('text-purple-600', 'text-sm')} />
                                            </div>
                                            <div>
                                                <p className={cn('font-semibold', 'text-gray-900')}>Rooms</p>
                                            </div>
                                        </div>

                                        <div className={cn('flex', 'items-center', 'gap-4')}>
                                            <button
                                                disabled={guests.rooms === 1}
                                                onClick={() => handleGuestChange("rooms", "decrement")}
                                                className={cn('counterBtn', 'border-purple-200', 'text-purple-600', 'disabled:opacity-40')}
                                            >–</button>

                                            <span className={cn('w-8', 'text-center', 'font-bold', 'text-lg')}>
                                                {guests.rooms}
                                            </span>

                                            <button
                                                onClick={() => handleGuestChange("rooms", "increment")}
                                                className={cn('counterBtn', 'bg-purple-500', 'text-white', 'hover:bg-purple-600')}
                                            >+</button>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Adults */}
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
                                                disabled={guests.adults === 1}
                                                onClick={() => handleGuestChange("adults", "decrement")}
                                                className={cn('counterBtn', 'border-blue-200', 'text-blue-600', 'disabled:opacity-40')}
                                            >–</button>

                                            <span className={cn('w-8', 'text-center', 'font-bold', 'text-lg')}>
                                                {guests.adults}
                                            </span>

                                            <button
                                                onClick={() => handleGuestChange("adults", "increment")}
                                                className={cn('counterBtn', 'bg-blue-500', 'text-white', 'hover:bg-blue-600')}
                                            >+</button>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Children */}
                                    <div className={cn('flex', 'items-center', 'justify-between')}>
                                        <div className={cn('flex', 'items-center', 'gap-3')}>
                                            <div className={cn('w-10', 'h-10', 'bg-green-100', 'rounded-xl', 'flex', 'justify-center', 'items-center')}>
                                                <FaUser className={cn('text-green-600', 'text-xs')} />
                                            </div>
                                            <div>
                                                <p className={cn('font-semibold', 'text-gray-900')}>Children</p>
                                                <p className={cn('text-xs', 'text-gray-500')}>(0‑12 yrs)</p>
                                            </div>
                                        </div>

                                        <div className={cn('flex', 'items-center', 'gap-4')}>
                                            <button
                                                disabled={guests.children === 0}
                                                onClick={() => handleGuestChange("children", "decrement")}
                                                className={cn('counterBtn', 'border-green-200', 'text-green-600', 'disabled:opacity-40')}
                                            >–</button>

                                            <span className={cn('w-8', 'text-center', 'font-bold', 'text-lg')}>
                                                {guests.children}
                                            </span>

                                            <button
                                                onClick={() => handleGuestChange("children", "increment")}
                                                className={cn('counterBtn', 'bg-green-500', 'text-white', 'hover:bg-green-600')}
                                            >+</button>
                                        </div>
                                    </div>

                                    {/* Done */}
                                    <button
                                        onClick={() => setIsGuestDropdownOpen(false)}
                                        className={cn('w-full', 'h-12', 'mt-2', 'bg-gradient-to-r', 'from-blue-500', 'to-blue-500', 'text-white', 'font-semibold', 'rounded-2xl', 'shadow-md', 'hover:brightness-105', 'active:brightness-95', 'active:scale-95', 'transition')}
                                    >
                                        Done
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Price Range */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="relative"
                    ref={priceDropdownRef}
                >
                    <label className={cn('block', 'text-xs', 'font-bold', 'text-gray-600', 'mb-2', 'flex', 'items-center', 'gap-1')}>
                        <FaRupeeSign className="text-blue-500" />
                        PRICE
                    </label>
                    <div
                        onClick={() => setIsPriceDropdownOpen(!isPriceDropdownOpen)}
                        className={`flex items-center gap-2 border-2 border-gray-200 rounded-2xl px-4 py-4 text-sm cursor-pointer bg-white shadow-sm transition-all duration-300 h-12 ${
                            isPriceDropdownOpen
                                ? "ring-2 ring-blue-500 border-blue-500"
                                : "hover:border-blue-300"
                        }`}
                    >
                        <div className={cn('flex-grow', 'min-w-0')}>
                            <span className={cn('text-gray-700', 'font-semibold', 'text-xs', 'truncate', 'block')}>
                                {priceRanges.find(range => range.id === priceRange)?.label || "Any Price"}
                            </span>
                        </div>
                        <svg
                            className={`w-5 h-5 text-blue-500 transition-transform duration-300 ${
                                isPriceDropdownOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    <AnimatePresence>
                        {isPriceDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className={cn('absolute', 'top-full', 'mt-2', 'left-0', 'right-0', 'w-full', 'bg-white', 'border-2', 'border-gray-100', 'rounded-2xl', 'shadow-2xl', 'z-50', 'py-2', 'max-h-80', 'overflow-y-auto')}
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
                                        <div className="font-medium text-sm">{range.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Search Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-2"
            >
                <Link
                    href={{
                        pathname: "/hotels",
                        query: {
                            destination: destination || "",
                            checkin: checkInDate || "",
                            checkout: checkOutDate || "",
                            rooms: guests.rooms,
                            adults: guests.adults,
                            children: guests.children,
                            guests: totalGuests,
                            priceRange: priceRange
                        },
                    }}
                >
                    <Button
                        className={`w-full h-12 text-lg font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-xl ${
                            isSearchDisabled
                                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                                : "bg-gradient-to-r from-purple-600 via-purple-600 to-purple-600 hover:from-purple-700 hover:via-purple-700 hover:to-purple-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                        disabled={isSearchDisabled}
                    >
                        <FaHome className="text-xl" />
                        Search Hotels
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
