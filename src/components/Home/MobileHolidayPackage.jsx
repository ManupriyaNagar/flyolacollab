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
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
    FaCalendarCheck,
    FaMapMarkerAlt,
    FaSuitcase,
    FaUser
} from "react-icons/fa";
import { MdFlightLand, MdFlightTakeoff } from "react-icons/md";

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

export default function MobileHolidayPackage({ airports = [], isLoadingAirports = false, airportFetchError = null }) {
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

    const isSearchDisabled = !fromCity || !toCity || !departureDate || totalGuests === 0 || airportFetchError;

    return (
        <div className="space-y-5">
            {/* From/To City */}
            <div className="space-y-3">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <label className={cn('block', 'text-xs', 'font-bold', 'text-gray-600', 'mb-2', 'flex', 'items-center', 'gap-1')}>
                        <MdFlightTakeoff className="text-blue-500" />
                        FROM CITY
                    </label>
                    <Select
                        value={fromCity}
                        onValueChange={setFromCity}
                        disabled={!!airportFetchError && packageAirports.length === 0}
                    >
                        <SelectTrigger className={cn('w-full', 'h-16', 'text-base', 'border-2', 'border-gray-200', 'rounded-2xl', 'bg-white', 'shadow-sm', 'focus:ring-2', 'focus:ring-blue-500', 'transition-all')}>
                            <SelectValue placeholder="From City" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            {packageAirports.map((airport) => (
                                <SelectItem key={`p-from-${airport.id}`} value={airport.airport_code}>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{airport.city}</span>
                                        <span className="text-xs text-gray-500">{airport.airport_code}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <label className={cn('block', 'text-xs', 'font-bold', 'text-gray-600', 'mb-2', 'flex', 'items-center', 'gap-1')}>
                        <MdFlightLand className="text-blue-500" />
                        TO CITY
                    </label>
                    <Select
                        value={toCity}
                        onValueChange={setToCity}
                        disabled={!!airportFetchError}
                    >
                        <SelectTrigger className={cn('w-full', 'h-16', 'text-base', 'border-2', 'border-gray-200', 'rounded-2xl', 'bg-white', 'shadow-sm', 'focus:ring-2', 'focus:ring-blue-500', 'transition-all')}>
                            <SelectValue placeholder="To City" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            {packageAirports.map((airport) => (
                                <SelectItem key={`p-to-${airport.id}`} value={airport.airport_code}>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{airport.city}</span>
                                        <span className="text-xs text-gray-500">{airport.airport_code}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </motion.div>
            </div>

            {/* Departure Date and Travellers */}
            <div className={cn('grid', 'grid-cols-2', 'gap-4')}>
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
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className={cn('w-full', 'h-12', 'text-sm', 'border-2', 'border-gray-200', 'rounded-2xl', 'bg-white')}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative"
                    ref={guestDropdownRef}
                >
                    <label className={cn('block', 'text-xs', 'font-bold', 'text-gray-600', 'mb-2', 'flex', 'items-center', 'gap-1')}>
                        <FaUser className="text-blue-500" />
                        TRAVELLERS
                    </label>
                    <div
                        onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                        className={`flex items-center gap-2 border-2 border-gray-200 rounded-2xl px-3 py-4 text-sm cursor-pointer bg-white h-12 ${isGuestDropdownOpen ? "ring-2 ring-blue-500 border-blue-500" : ""
                            }`}
                    >
                        <span className="text-gray-700 font-semibold text-xs truncate">
                            {totalGuests} Traveller{totalGuests !== 1 ? "s" : ""}
                        </span>
                    </div>

                    <AnimatePresence>
                        {isGuestDropdownOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.3 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsGuestDropdownOpen(false)}
                                    className="fixed inset-0 z-40 bg-black backdrop-blur-sm md:hidden"
                                />
                                <motion.div
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: "100%", opacity: 0 }}
                                    className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-[32px] p-6 space-y-6 shadow-2xl"
                                >
                                    <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300 mb-2" />

                                    {/* Same guest logic as Hotel Booking but for Packages */}
                                    {[
                                        { label: "Rooms", type: "rooms", sub: "Number of rooms" },
                                        { label: "Adults", type: "adults", sub: "12+ yrs" },
                                        { label: "Children", type: "children", sub: "0-12 yrs" }
                                    ].map((item) => (
                                        <div key={item.type} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-gray-900">{item.label}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-black">{item.sub}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleGuestChange(item.type, "decrement")}
                                                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold disabled:opacity-30"
                                                    disabled={item.type === "rooms" ? guests.rooms === 1 : item.type === "adults" ? guests.adults === 1 : guests.children === 0}
                                                >–</button>
                                                <span className="font-bold w-4 text-center">{guests[item.type]}</span>
                                                <button
                                                    onClick={() => handleGuestChange(item.type, "increment")}
                                                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold"
                                                >+</button>
                                            </div>
                                        </div>
                                    ))}
                                    <Button onClick={() => setIsGuestDropdownOpen(false)} className="w-full h-12 rounded-2xl bg-blue-600 text-white font-bold">Done</Button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Search Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-2"
            >
                <Link
                    href={{
                        pathname: "/holiday-packages",
                        query: {
                            fromCity: getCityFromCode(fromCity) || "",
                            toCity: getCityFromCode(toCity) || "",
                            fromCityCode: fromCity || "",
                            toCityCode: toCity || "",
                            departureDate,
                            rooms: guests.rooms,
                            adults: guests.adults,
                            children: guests.children,
                        },
                    }}
                >
                    <Button
                        className={`w-full h-14 text-lg font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-xl ${isSearchDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white"
                            }`}
                        disabled={isSearchDisabled}
                    >
                        <FaSuitcase className="text-xl" />
                        Search Packages
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
