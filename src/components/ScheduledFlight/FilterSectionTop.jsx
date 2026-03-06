"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    ChevronDown,
    Search,
    ArrowLeftRight,
    Plus,
    Minus,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterManager } from "@/lib/business/FilterManager";

const FilterSectionTop = ({
    departure = "",
    arrival = "",
    date = "",
    passengers = 1,
    flightClass = "All Class",
    locations = [],
    onDepartureChange,
    onArrivalChange,
    onDateChange,
    onPassengersChange,
    onClassChange,
    onSearch,
    onSwap,
    returnDate = "",
    onReturnDateChange,
}) => {
    const [isReturnActive, setIsReturnActive] = useState(!!returnDate);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const [counts, setCounts] = useState({
        adults: passengers || 1,
        children: 0,
        infants: 0,
    });

    const locationOptions = FilterManager.getLocationOptions(locations, "flight");

    const dropdownRef = useRef(null);

    useEffect(() => {
        setIsReturnActive(!!returnDate);
    }, [returnDate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateCount = (type, increment) => {
        setCounts((prev) => {
            const newValue = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1);
            if (type === "adults" && newValue < 1) return prev;

            const newCounts = { ...prev, [type]: newValue };
            const total =
                newCounts.adults + newCounts.children + newCounts.infants;

            onPassengersChange?.(total);

            return newCounts;
        });
    };

    const handleClassSelect = (val) => {
        onClassChange?.(val);
        setActiveDropdown(null);
    };

    const totalPassengers =
        counts.adults + counts.children + counts.infants;

    const handleAddReturn = () => {
        setIsReturnActive(true);

        if (date) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            const formatted = nextDay.toISOString().split("T")[0];
            onReturnDateChange?.(formatted);
        }
    };

    const handleRemoveReturn = () => {
        setIsReturnActive(false);
        onReturnDateChange?.("");
    };

    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return "Select Date";
        const d = new Date(dateStr);
        const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
        const day = d.getDate();
        const month = d.toLocaleDateString("en-US", { month: "long" });
        return `${weekday} ${day} ${month}`;
    };

    return (
        <div
            className="w-full inter-font bg-white/80 backdrop-blur-md py-4 px-4 md:px-10 shadow-sm mb-6 mt-4 relative z-40"
            ref={dropdownRef}
        >
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3 py-1">

                {/* Departure */}
                <div className="flex items-center gap-1 w-full md:w-auto">

                    <div className="relative w-full md:w-auto">
                        <div
                            className="flex items-center gap-2 px-4 py-3 bg-sky-50 hover:bg-blue-100 rounded-l-full cursor-pointer w-full md:min-w-[200px]"
                            onClick={() =>
                                setActiveDropdown(
                                    activeDropdown === "departure" ? null : "departure"
                                )
                            }
                        >
                            <img src="/flights/flight_takeoff.svg" className="w-5 h-5" />

                            <span className="text-sm text-gray-800 truncate">
                                {locationOptions.find((o) => o.value === departure)?.label ||
                                    "All Departure Airports"}
                            </span>

                            <ChevronDown className="w-4 h-4 ml-auto" />
                        </div>

                        <AnimatePresence>
                            {activeDropdown === "departure" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-2 w-[95vw] md:w-[400px] bg-white rounded-3xl shadow-2xl border z-50 p-6"
                                >
                                    <h3 className="text-lg font-bold mb-3">Departure</h3>

                                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                                        {locationOptions.map((option, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    onDepartureChange?.(option.value);
                                                    setActiveDropdown(null);
                                                }}
                                                className="px-4 py-3 rounded-full border text-sm"
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Swap */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSwap?.();
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md -mx-2"
                    >
                        <ArrowLeftRight className="w-4 h-4" />
                    </button>

                    {/* Arrival */}
                    <div className="relative w-full md:w-auto">
                        <div
                            className="flex items-center gap-2 px-4 py-3 bg-sky-50 hover:bg-blue-100 rounded-r-full cursor-pointer w-full md:min-w-[200px]"
                            onClick={() =>
                                setActiveDropdown(
                                    activeDropdown === "arrival" ? null : "arrival"
                                )
                            }
                        >
                            <img src="/flights/flight_land.svg" className="w-5 h-5" />

                            <span className="text-sm text-gray-800 truncate">
                                {locationOptions.find((o) => o.value === arrival)?.label ||
                                    "All Arrival Airports"}
                            </span>

                            <ChevronDown className="w-4 h-4 ml-auto" />
                        </div>
                    </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 w-full md:w-auto">

                    <div
                        onClick={() =>
                            setActiveDropdown(activeDropdown === "date" ? null : "date")
                        }
                        className="min-w-[150px] md:min-w-[200px] h-[48px] bg-sky-50 hover:bg-blue-100 rounded-full px-4 flex items-center gap-3 cursor-pointer"
                    >
                        <img src="/flights/calendar_month.svg" className="w-5 h-5" />

                        <span className="text-sm">
                            {date ? formatDateDisplay(date) : "Departure"}
                        </span>
                    </div>

                    {!isReturnActive ? (
                        <div
                            onClick={handleAddReturn}
                            className="h-[48px] flex items-center gap-2 bg-sky-50 px-4 rounded-full cursor-pointer"
                        >
                            <Plus className="w-4 h-4 text-blue-600" />
                            <span>Add return</span>
                        </div>
                    ) : (
                        <div className="relative h-[48px] bg-sky-50 px-4 rounded-full flex items-center">
                            {formatDateDisplay(returnDate)}

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveReturn();
                                }}
                                className="ml-2"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <AnimatePresence>
                        {activeDropdown === "date" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 mt-4 w-[95vw] md:w-[850px] bg-white rounded-3xl shadow-2xl border z-50 p-6"
                            >
                                <h3 className="text-lg font-semibold mb-4">
                                    Select Date
                                </h3>

                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1 text-center">Calendar 1</div>
                                    <div className="flex-1 text-center">Calendar 2</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Passengers */}
                <div className="relative">
                    <div
                        onClick={() =>
                            setActiveDropdown(
                                activeDropdown === "passengers" ? null : "passengers"
                            )
                        }
                        className="flex items-center gap-2 px-4 py-3 rounded-2xl hover:bg-gray-50 cursor-pointer"
                    >
                        <img src="/flights/person.svg" className="w-5 h-5" />
                        <span className="font-bold">{totalPassengers}</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>

                {/* Class */}
                <div className="relative">
                    <div
                        onClick={() =>
                            setActiveDropdown(
                                activeDropdown === "class" ? null : "class"
                            )
                        }
                        className="flex items-center gap-2 px-4 py-3 rounded-full hover:bg-gray-50 cursor-pointer"
                    >
                        {flightClass}
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>

                {/* Search */}
                <div className="w-full md:w-auto md:ml-auto flex justify-center md:justify-end">
                    <button
                        onClick={onSearch}
                        className="flex items-center gap-2 bg-[#ff9933] hover:bg-[#ff8822] text-white px-6 md:px-10 py-3 rounded-full font-bold shadow-lg"
                    >
                        <Search className="w-5 h-5" />
                        Search
                    </button>
                </div>

            </div>
        </div>
    );
};

export default FilterSectionTop;