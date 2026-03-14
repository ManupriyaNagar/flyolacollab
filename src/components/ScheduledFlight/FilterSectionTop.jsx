// 251198


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
        setActiveDropdown("date");

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

    const [startDate, setStartDate] = useState(date ? new Date(date) : null);
    const [endDate, setEndDate] = useState(returnDate ? new Date(returnDate) : null);

    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());

    const [tripType, setTripType] = useState("oneway");

    const formatMobileDatePrimary = (dateStr) => {
        if (!dateStr) return "Select Date";
        const d = new Date(dateStr);
        return `${d.getDate()} ${d.toLocaleDateString("en-US", { month: "short" })}`;
    };
    const formatMobileDateSecondary = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return `${d.toLocaleDateString("en-US", { weekday: "short" })}, ${d.getFullYear()}`;
    };

    const getLocationDisplay = (val, type) => {
        const opt = locationOptions.find((o) => o.value === val);
        if (!opt) return { city: type === 'from' ? "Select" : "Select", code: "", detail: "Select City" };
        const parts = opt.label.split("-");
        const main = parts[0].trim();
        const detail = parts.length > 1 ? parts.slice(1).join("-").trim() : "Airport";
        const codeMatch = main.match(/\b([A-Z]{3})\b/);
        const code = codeMatch ? codeMatch[1] : "";
        const city = main.replace(/\b([A-Z]{3})\b/g, "").replace(/[\(\)]/g, "").trim() || main;
        return { city, code, detail };
    }

    return (
        <div ref={dropdownRef}>


            {/* === DESKTOP / TABLET VIEW (Single Row) === */}
            <div className="bg-white w-full">
                <div
                    className="hidden md:block w-full inter-font py-2 px-4 lg:px-10 shadow-sm mb-6 mt-4 relative z-40"
                >
                    <div className="flex items-center flex-wrap md:flex-nowrap lg:flex-nowrap gap-2 lg:gap-3 py-1 w-full">

                        {/* From & To */}
                        <div className="flex items-center shrink-0">

                            <div className="relative">
                                <div
                                    className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 lg:py-3 bg-sky-50 hover:bg-blue-100 rounded-l-full cursor-pointer min-w-[140px] lg:min-w-[200px]"
                                    onClick={() =>
                                        setActiveDropdown(
                                            activeDropdown === "departure" ? null : "departure"
                                        )
                                    }
                                >
                                    <img src="/flights/flight_takeoff.svg" className="w-4 h-4 lg:w-5 lg:h-5" />

                                    <span className="text-xs lg:text-sm text-gray-800 truncate max-w-[100px] lg:max-w-max">
                                        {locationOptions.find((o) => o.value === departure)?.label ||
                                            "All Departure Airports"}
                                    </span>

                                    <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 ml-auto" />
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
                                className="w-6 h-6 lg:w-10 lg:h-10 shrink-0 flex items-center justify-center bg-white rounded-full shadow-md z-10 -mx-3"
                            >
                                <ArrowLeftRight className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />
                            </button>

                            {/* Arrival */}
                            <div className="relative">
                                <div
                                    className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 lg:py-3 bg-sky-50 hover:bg-blue-100 rounded-r-full cursor-pointer min-w-[140px] lg:min-w-[200px] pl-4 lg:pl-5"
                                    onClick={() =>
                                        setActiveDropdown(
                                            activeDropdown === "arrival" ? null : "arrival"
                                        )
                                    }
                                >
                                    <img src="/flights/flight_land.svg" className="w-4 h-4 lg:w-5 lg:h-5" />

                                    <span className="text-xs lg:text-sm text-gray-800 truncate max-w-[100px] lg:max-w-max">
                                        {locationOptions.find((o) => o.value === arrival)?.label ||
                                            "All Arrival Airports"}
                                    </span>

                                    <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 ml-auto" />
                                </div>

                                <AnimatePresence>
                                    {activeDropdown === "arrival" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 lg:left-auto lg:right-0 mt-2 w-[95vw] md:w-[400px] bg-white rounded-3xl shadow-2xl border z-50 p-6"
                                        >
                                            <h3 className="text-lg font-bold mb-3">Arrival</h3>

                                            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
                                                {locationOptions.map((option, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            onArrivalChange?.(option.value);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="px-4 py-3 rounded-full border text-sm hover:bg-sky-50 transition-colors"
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>


                        {/* Date */}
                        <div className="flex items-center gap-1 lg:gap-2 shrink-0">

                            <div
                                onClick={() =>
                                    setActiveDropdown(activeDropdown === "date" ? null : "date")
                                }
                                className="min-w-[120px] lg:min-w-[200px] h-[36px] lg:h-[48px] bg-sky-50 hover:bg-blue-100 rounded-full px-3 lg:px-4 flex items-center gap-2 lg:gap-3 cursor-pointer"
                            >
                                <img src="/flights/calendar_month.svg" className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />

                                <span className="text-xs lg:text-sm whitespace-nowrap">
                                    {date ? formatDateDisplay(date) : "Departure"}
                                </span>
                            </div>

                            {!isReturnActive ? (
                                <div
                                    onClick={handleAddReturn}
                                    className="h-[36px] lg:h-[48px] flex items-center gap-1 lg:gap-2 bg-sky-50 hover:bg-blue-100 px-3 lg:px-4 rounded-full cursor-pointer"
                                >
                                    <Plus className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600 shrink-0" />
                                    <span className="text-xs lg:text-sm whitespace-nowrap">Add return</span>
                                </div>
                            ) : (
                                <div className="relative h-[36px] lg:h-[48px] bg-sky-50 rounded-full flex items-center px-3 lg:px-4">
                                    <span className="text-xs lg:text-sm whitespace-nowrap">{formatDateDisplay(returnDate)}</span>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveReturn();
                                        }}
                                        className="ml-2"
                                    >
                                        <X size={14} className="shrink-0" />
                                    </button>
                                </div>
                            )}

                            <AnimatePresence>
                                {activeDropdown === "date" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 mt-4 w-[95vw] md:w-[700px] lg:w-[900px] bg-white rounded-3xl shadow-2xl border z-50 p-6 lg:p-8"
                                    >
                                        <div className="flex justify-between items-center mb-6">

                                            <h3 className="text-xl font-semibold">Set the Date</h3>

                                            <div className="flex items-center gap-2">

                                                <button
                                                    onClick={() => {
                                                        if (month === 0) {
                                                            setMonth(11);
                                                            setYear(year - 1);
                                                        } else {
                                                            setMonth(month - 1);
                                                        }
                                                    }}
                                                    className="p-2 rounded-full hover:bg-gray-100"
                                                >
                                                    ←
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        if (month === 11) {
                                                            setMonth(0);
                                                            setYear(year + 1);
                                                        } else {
                                                            setMonth(month + 1);
                                                        }
                                                    }}
                                                    className="p-2 rounded-full hover:bg-gray-100"
                                                >
                                                    →
                                                </button>

                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                                            <CalendarMonth
                                                month={month}
                                                year={year}
                                                startDate={startDate}
                                                endDate={endDate}
                                                setStartDate={setStartDate}
                                                setEndDate={setEndDate}
                                                onDepartureChange={onDepartureChange}
                                                onReturnDateChange={onReturnDateChange}
                                            />

                                            <CalendarMonth
                                                month={month + 1}
                                                year={month === 11 ? year + 1 : year}
                                                startDate={startDate}
                                                endDate={endDate}
                                                setStartDate={setStartDate}
                                                setEndDate={setEndDate}
                                                onDepartureChange={onDepartureChange}
                                                onReturnDateChange={onReturnDateChange}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Passengers & Class */}
                        <div className="flex items-center gap-1 lg:gap-2 shrink-0">
                            {/* Passengers */}
                            <div className="relative">
                                <div
                                    onClick={() =>
                                        setActiveDropdown(
                                            activeDropdown === "passengers" ? null : "passengers"
                                        )
                                    }
                                    className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-2xl lg:bg-transparent hover:bg-gray-50 cursor-pointer h-[36px] lg:h-[48px]"
                                >
                                    <img src="/flights/person.svg" className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" />
                                    <span className="font-bold text-xs lg:text-sm">{totalPassengers}</span>
                                    <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" />
                                </div>

                                <AnimatePresence>
                                    {activeDropdown === "passengers" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 lg:right-auto lg:left-0 mt-2 w-[300px] bg-white rounded-3xl shadow-2xl border z-50 p-6"
                                        >
                                            <h3 className="text-lg font-bold mb-4">Passengers</h3>

                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-bold text-sm">Adults</div>
                                                    <div className="text-[11px] text-gray-500">&gt; 12 yrs</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={(e) => { e.stopPropagation(); updateCount("adults", false); }} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
                                                    <span className="w-4 text-center font-bold">{counts.adults}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); updateCount("adults", true); }} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-bold text-sm">Children</div>
                                                    <div className="text-[11px] text-gray-500">2-12 yrs</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={(e) => { e.stopPropagation(); updateCount("children", false); }} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
                                                    <span className="w-4 text-center font-bold">{counts.children}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); updateCount("children", true); }} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-bold text-sm">Infants</div>
                                                    <div className="text-[11px] text-gray-500">&lt; 2 yrs</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={(e) => { e.stopPropagation(); updateCount("infants", false); }} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"><Minus className="w-4 h-4" /></button>
                                                    <span className="w-4 text-center font-bold">{counts.infants}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); updateCount("infants", true); }} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"><Plus className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Class */}
                            <div className="relative">
                                <div
                                    onClick={() =>
                                        setActiveDropdown(
                                            activeDropdown === "class" ? null : "class"
                                        )
                                    }
                                    className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 lg:py-3 rounded-full lg:bg-transparent hover:bg-gray-50 cursor-pointer h-[36px] lg:h-[48px]"
                                >
                                    <span className="text-xs lg:text-sm whitespace-nowrap">{flightClass}</span>
                                    <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" />
                                </div>

                                <AnimatePresence>
                                    {activeDropdown === "class" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-2 w-[220px] bg-white rounded-3xl shadow-2xl border z-50 p-6"
                                        >
                                            <h3 className="text-lg font-bold mb-3">Class</h3>
                                            <div className="flex flex-col gap-2">
                                                {["All Class", "Economy", "Premium Economy", "Business", "First Class"].map((cls) => (
                                                    <button
                                                        key={cls}
                                                        onClick={(e) => { e.stopPropagation(); handleClassSelect(cls); }}
                                                        className={`px-4 py-2 rounded-xl text-left text-sm transition-colors ${flightClass === cls ? "bg-sky-50 font-bold text-blue-600" : "hover:bg-gray-100"}`}
                                                    >
                                                        {cls}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="ml-auto shrink-0 flex justify-end">
                            <button
                                onClick={onSearch}
                                className="flex items-center justify-center gap-1 lg:gap-2 bg-[#ff9933] hover:bg-[#ff8822] text-white px-2 lg:px-10 py-1 lg:py-3 rounded-full lg:font-semibold h-[26px] lg:h-[48px] text-sm lg:text-base"
                            >
                                <Search className="w-3 h-3 lg:w-5 lg:h-5" />
                                <span className="lg:inline md:text-xs lg:text-lg">Search</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>




            {/* === MOBILE VIEW === */}
            <div className="md:hidden block w-full inter-font bg-white/80 backdrop-blur-md py-4 px-4 md:px-10 shadow-sm mb-6 mt-4 relative z-40">
                <div className="flex items-center justify-between mb-6 relative">
                    <X className="w-6 h-6 text-gray-400 cursor-pointer" />
                    <h2 className="text-[17px] font-bold text-gray-800 absolute left-1/2 -translate-x-1/2">Modify Flight Search</h2>
                </div>

                <div className="flex bg-white mb-4 rounded-[12px] p-1 shadow-sm border border-gray-100 items-center justify-between">
                    <button
                        onClick={() => { setTripType("oneway"); handleRemoveReturn(); }}
                        className={`flex-1 py-3 text-[14px] font-medium rounded-[10px] transition-colors ${tripType === 'oneway' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 bg-transparent'}`}
                    >
                        One way
                    </button>
                    <button
                        onClick={() => { setTripType("roundtrip"); handleAddReturn(); }}
                        className={`flex-1 py-3 text-[14px] font-medium rounded-[10px] transition-colors ${tripType === 'roundtrip' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 bg-transparent'}`}
                    >
                        Roundtrip
                    </button>
                </div>

                <div className="flex flex-row gap-2 relative mb-2">
                    <div
                        className="flex-1 bg-white border border-gray-200 rounded-[12px] p-3 cursor-pointer overflow-hidden"
                        onClick={() => setActiveDropdown(activeDropdown === "departure" ? null : "departure")}
                    >
                        <div className="text-[11px] font-bold text-gray-500 mb-1">FROM</div>
                        {(() => {
                            const loc = getLocationDisplay(departure, 'from');
                            return (
                                <>
                                    <div className="text-[16px] font-bold text-black flex items-center gap-1 leading-tight truncate">
                                        <span className="truncate">{loc.city}</span> <span className="text-gray-500 font-normal shrink-0">{loc.code}</span>
                                    </div>
                                    <div className="text-[12px] text-gray-400 truncate mt-1">{loc.detail}</div>
                                </>
                            )
                        })()}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSwap?.();
                        }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[34px] h-[34px] flex items-center justify-center bg-white border border-[#e0e0e0] rounded-full shadow-sm z-10 text-blue-500 hover:bg-gray-50"
                    >
                        <ArrowLeftRight className="w-4 h-4" />
                    </button>

                    <div
                        className="flex-1 bg-white border border-gray-200 rounded-[12px] p-3 cursor-pointer overflow-hidden pl-5"
                        onClick={() => setActiveDropdown(activeDropdown === "arrival" ? null : "arrival")}
                    >
                        <div className="text-[11px] font-bold text-gray-500 mb-1">TO</div>
                        {(() => {
                            const loc = getLocationDisplay(arrival, 'to');
                            return (
                                <>
                                    <div className="text-[16px] font-bold text-black flex items-center gap-1 leading-tight truncate">
                                        <span className="truncate">{loc.city}</span> <span className="text-gray-500 font-normal shrink-0">{loc.code}</span>
                                    </div>
                                    <div className="text-[12px] text-gray-400 truncate mt-1">{loc.detail}</div>
                                </>
                            )
                        })()}
                    </div>
                </div>

                <div className="flex flex-row gap-2 mb-2">
                    <div
                        className="flex-1 bg-white border border-gray-200 rounded-[12px] p-3 cursor-pointer overflow-hidden"
                        onClick={() => setActiveDropdown(activeDropdown === "date" ? null : "date")}
                    >
                        <div className="text-[11px] font-bold text-gray-500 mb-1">DEPARTURE DATE</div>
                        <div className="text-[16px] font-bold text-black leading-tight flex items-baseline gap-1 truncate mb-3">
                            {formatMobileDatePrimary(date)}
                            <span className="text-[12px] text-gray-500 font-normal shrink-0">{formatMobileDateSecondary(date)}</span>
                        </div>
                    </div>

                    <div
                        className={`flex-1 bg-white border border-gray-200 rounded-[12px] p-3 cursor-pointer overflow-hidden relative ${!isReturnActive ? 'opacity-70' : ''}`}
                        onClick={() => {
                            if (!isReturnActive) { setTripType('roundtrip'); handleAddReturn(); }
                            else setActiveDropdown(activeDropdown === "date" ? null : "date");
                        }}
                    >
                        {isReturnActive && (
                            <div
                                onClick={(e) => { e.stopPropagation(); setTripType('oneway'); handleRemoveReturn(); }}
                                className="absolute top-2 right-2 p-0.5 bg-gray-300 hover:bg-gray-400 rounded-full text-white cursor-pointer z-10 transition-colors"
                            >
                                <X className="w-3 h-3" strokeWidth={3} />
                            </div>
                        )}
                        <div className="text-[11px] font-bold text-gray-500 mb-1">RETURN DATE</div>
                        <div className="text-[16px] font-bold text-black leading-tight flex items-baseline gap-1 truncate mb-3">
                            {isReturnActive ? formatMobileDatePrimary(returnDate) : ""}
                            {isReturnActive && <span className="text-[12px] text-gray-500 font-normal shrink-0">{formatMobileDateSecondary(returnDate)}</span>}
                        </div>
                    </div>
                </div>

                <div
                    className="w-full bg-white border border-gray-200 rounded-[12px] p-3 mb-20 cursor-pointer"
                    onClick={() => setActiveDropdown(activeDropdown === "passengers" ? null : "passengers")}
                >
                    <div className="text-[11px] font-bold text-gray-500 mb-1">TRAVELLER & CLASS</div>
                    <div className="text-[16px] text-gray-800 leading-tight mb-3">
                        <span className="font-bold text-black text-[17px]">{totalPassengers}</span>, {flightClass === "All Class" ? "Eco/Prem. Eco" : flightClass}
                    </div>
                </div>



                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-[110]">
                    <button
                        onClick={onSearch}
                        className="w-full bg-[#FD9931] hover:bg-[#e05300] text-white py-[15px] rounded-[8px] font-bold text-[16px] shadow-sm tracking-wide"
                    >
                        SEARCH FLIGHTS
                    </button>
                </div>

                {/* --- MOBILE FULL SCREEN DROPDOWNS --- */}
                <AnimatePresence>
                    {(activeDropdown && ["departure", "arrival", "date", "passengers"].includes(activeDropdown)) && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); }}
                                className="fixed inset-0 bg-black/40 z-[140]"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: "100%" }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed inset-x-0 bottom-0 top-[15%] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[150] flex flex-col overflow-hidden"
                            >
                                <div className="flex items-center justify-between p-5 border-b">
                                    <h3 className="text-lg font-bold capitalize">{activeDropdown === "passengers" ? "Travellers & Class" : activeDropdown}</h3>
                                    <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); }} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="w-5 h-5" /></button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5 relative">
                                    {activeDropdown === "departure" || activeDropdown === "arrival" ? (
                                        <div className="flex flex-col gap-3">
                                            {locationOptions.map((option, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        if (activeDropdown === "departure") onDepartureChange?.(option.value);
                                                        else onArrivalChange?.(option.value);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="px-4 py-4 rounded-2xl border border-gray-200 text-base text-left font-medium active:bg-sky-50 shadow-sm"
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    ) : activeDropdown === "date" ? (
                                        <div className="flex flex-col gap-8 pb-10">
                                            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-full mb-2">
                                                <button
                                                    onClick={() => {
                                                        if (month === 0) { setMonth(11); setYear(year - 1); } else { setMonth(month - 1); }
                                                    }}
                                                    className="p-3 bg-white shadow-sm border rounded-full hover:bg-gray-100"
                                                >
                                                    ←
                                                </button>
                                                <span className="font-bold text-gray-700 px-4">Change Month</span>
                                                <button
                                                    onClick={() => {
                                                        if (month === 11) { setMonth(0); setYear(year + 1); } else { setMonth(month + 1); }
                                                    }}
                                                    className="p-3 bg-white shadow-sm border rounded-full hover:bg-gray-100"
                                                >
                                                    →
                                                </button>
                                            </div>

                                            <CalendarMonth
                                                month={month}
                                                year={year}
                                                startDate={startDate}
                                                endDate={endDate}
                                                setStartDate={setStartDate}
                                                setEndDate={setEndDate}
                                                onDepartureChange={onDepartureChange}
                                                onReturnDateChange={onReturnDateChange}
                                            />
                                            <CalendarMonth
                                                month={month + 1}
                                                year={month === 11 ? year + 1 : year}
                                                startDate={startDate}
                                                endDate={endDate}
                                                setStartDate={setStartDate}
                                                setEndDate={setEndDate}
                                                onDepartureChange={onDepartureChange}
                                                onReturnDateChange={onReturnDateChange}
                                            />
                                        </div>
                                    ) : activeDropdown === "passengers" ? (
                                        <div className="flex flex-col gap-6 pb-12">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-bold text-lg">Adults</div>
                                                    <div className="text-sm text-gray-500">&gt; 12 yrs</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button onClick={(e) => { e.stopPropagation(); updateCount("adults", false); }} className="w-12 h-12 rounded-full border flex items-center justify-center bg-gray-50 active:bg-gray-200"><Minus className="w-6 h-6" /></button>
                                                    <span className="w-6 text-center font-bold text-xl">{counts.adults}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); updateCount("adults", true); }} className="w-12 h-12 rounded-full border flex items-center justify-center bg-gray-50 active:bg-gray-200"><Plus className="w-6 h-6" /></button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-bold text-lg">Children</div>
                                                    <div className="text-sm text-gray-500">2-12 yrs</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button onClick={(e) => { e.stopPropagation(); updateCount("children", false); }} className="w-12 h-12 rounded-full border flex items-center justify-center bg-gray-50 active:bg-gray-200"><Minus className="w-6 h-6" /></button>
                                                    <span className="w-6 text-center font-bold text-xl">{counts.children}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); updateCount("children", true); }} className="w-12 h-12 rounded-full border flex items-center justify-center bg-gray-50 active:bg-gray-200"><Plus className="w-6 h-6" /></button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-2">
                                                <div>
                                                    <div className="font-bold text-lg">Infants</div>
                                                    <div className="text-sm text-gray-500">&lt; 2 yrs</div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <button onClick={(e) => { e.stopPropagation(); updateCount("infants", false); }} className="w-12 h-12 rounded-full border flex items-center justify-center bg-gray-50 active:bg-gray-200"><Minus className="w-6 h-6" /></button>
                                                    <span className="w-6 text-center font-bold text-xl">{counts.infants}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); updateCount("infants", true); }} className="w-12 h-12 rounded-full border flex items-center justify-center bg-gray-50 active:bg-gray-200"><Plus className="w-6 h-6" /></button>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mt-2">Class</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {["All Class", "Economy", "Premium Economy", "Business", "First Class"].map((cls) => (
                                                    <button
                                                        key={cls}
                                                        onClick={(e) => { e.stopPropagation(); handleClassSelect(cls); }}
                                                        className={`px-3 py-4 rounded-2xl border text-center text-[15px] font-bold shadow-sm transition-colors ${flightClass === cls ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 active:bg-gray-100"}`}
                                                    >
                                                        {cls}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FilterSectionTop;




function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, current: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, current: true });
    }

    while (days.length % 7 !== 0) {
        days.push({ day: days.length, current: false });
    }

    return days;
}




function CalendarMonth({ month, year, selectedDate, setSelectedDate }) {
    const days = generateCalendar(month, year);
    const monthName = new Date(year, month).toLocaleString("default", {
        month: "long",
    });

    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    return (
        <div className="w-full">
            <h2 className="text-lg font-semibold mb-4 text-center">
                {monthName} {year}
            </h2>

            <div className="grid grid-cols-7 text-center text-sm mb-2">
                {weekdays.map((d, i) => (
                    <div
                        key={i}
                        className={`font-medium ${i === 0 ? "text-red-500" : ""}`}
                    >
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 text-center gap-y-2">
                {days.map((d, i) => {
                    const isSelected =
                        selectedDate?.day === d.day &&
                        selectedDate?.month === month &&
                        selectedDate?.year === year;

                    return (
                        <div
                            key={i}
                            onClick={() =>
                                d.current &&
                                setSelectedDate({ day: d.day, month: month, year: year })
                            }
                            className={`flex items-center justify-center w-10 h-10 mx-auto rounded-full cursor-pointer
              ${isSelected
                                    ? "bg-blue-500 text-white"
                                    : d.current
                                        ? "text-gray-800 hover:bg-gray-100"
                                        : "text-gray-300"
                                }`}
                        >
                            {d.day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}