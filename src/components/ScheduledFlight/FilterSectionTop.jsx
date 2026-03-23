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
    const [searchTerm, setSearchTerm] = useState("");

    const [counts, setCounts] = useState({
        adults: passengers || 1,
        children: 0,
        infants: 0,
    });

    const locationOptions = FilterManager.getLocationOptions(locations, "flight");
const filteredLocations = locationOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setIsReturnActive(!!returnDate);
    }, [returnDate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        
        if (activeDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeDropdown]);

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


            {/* === DESKTOP / TABLET VIEW === */}
            <div className="hidden md:block w-full bg-white inter-font overflow-visible">
   

                {/* Search Box Container */}
                <div className="max-w-[1600px] mx-auto px-4 lg:px-10">
                    <div className=" rounded-2xl p-2  bg-white">
                        
                        {/* === TABLET VIEW ONLY (Single Row) === */}
                        <div className="flex lg:hidden items-center flex-nowrap gap-2 py-1 w-full relative min-h-[60px]">
                            
                            {/* Departure & Arrival */}
                            <div className="flex items-center shrink-0">
                                <div className="relative">
                                    <div
                                        className="flex items-center gap-2 px-4 py-3 bg-sky-50 hover:bg-blue-100 rounded-l-full cursor-pointer min-w-[160px]"
                                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "departure" ? null : "departure"); }}
                                    >
                                        <img src="/flights/flight_takeoff.svg" className="w-5 h-5" alt="" />
                                        <span className="text-sm text-gray-800 truncate max-w-[100px]">
                                            {locationOptions.find((o) => o.value === departure)?.label || "All Departure Airports"}
                                        </span>
                                        <ChevronDown className="w-4 h-4 ml-auto" />
                                    </div>

                                    <AnimatePresence>
                                        {activeDropdown === "departure" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 mt-2 w-[90vw] md:w-[400px] bg-white rounded-3xl shadow-2xl border z-[50] p-6"
                                            >
                                             <h3 className="text-lg font-bold mb-3">Departure</h3>

{/* 🔍 Search Bar */}
<div className="flex items-center gap-2 border rounded-full px-4 py-2 mb-4">
    <Search className="w-4 h-4 text-gray-400" />
    <input
        type="text"
        placeholder="Search airport..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full outline-none text-sm"
    />
</div>

{/* ✈️ Airport List (FILTERED) */}
<div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
    {filteredLocations.map((option, i) => (
        <button
            key={i}
            onClick={() => {
                onDepartureChange?.(option.value);
                setActiveDropdown(null);
                setSearchTerm("");
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

                                <button
                                    onClick={(e) => { e.stopPropagation(); onSwap?.(); }}
                                    className="w-10 h-10 shrink-0 flex items-center justify-center bg-white rounded-full shadow-md z-10 -mx-3"
                                >
                                    <ArrowLeftRight className="w-4 h-4 text-blue-500" />
                                </button>

                                <div className="relative">
                                    <div
                                        className="flex items-center gap-2 px-4 py-3 bg-sky-50 hover:bg-blue-100 rounded-r-full cursor-pointer min-w-[120px] pl-5"
                                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "arrival" ? null : "arrival"); }}
                                    >
                                        <img src="/flights/flight_land.svg" className="w-5 h-5" alt="" />
                                        <span className="text-sm text-gray-800 truncate max-w-[800px]">
                                            {locationOptions.find((o) => o.value === arrival)?.label || "All Arrival Airports"}
                                        </span>
                                        <ChevronDown className="w-4 h-4 ml-auto" />
                                    </div>

                                    <AnimatePresence>
                                        {activeDropdown === "arrival" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full right-0 mt-2 w-[90vw] md:w-[400px] bg-white rounded-3xl shadow-2xl border z-[50] p-6"
                                            >
                                                <h3 className="text-lg font-bold mb-3">Arrival</h3>
                                                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
                                                    {locationOptions.map((option, i) => (
                                                        <button key={i} onClick={() => { onArrivalChange?.(option.value); setActiveDropdown(null); }} className="px-4 py-3 rounded-full border text-sm hover:bg-sky-50 transition-colors">{option.label}</button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="shrink-0 relative">
                                <div
                                    onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "date" ? null : "date"); }}
                                    className="min-w-[120px] h-[48px] bg-sky-50 hover:bg-blue-100 rounded-full px-4 flex items-center gap-3 cursor-pointer"
                                >
                                    <img src="/flights/calendar_month.svg" className="w-5 h-5 shrink-0" alt="" />
                                    <span className="text-sm whitespace-nowrap">
                                        {date ? formatDateDisplay(date) : "Departure"}
                                    </span>
                                </div>

                                <AnimatePresence>
                                    {activeDropdown === "date" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-[90vw] md:w-[700px] lg:w-[900px] bg-white rounded-3xl shadow-2xl border z-[50] p-6 lg:p-8"
                                        >
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-semibold">Set the Date</h3>
                                                <div className="flex gap-2">
                                                    <button onClick={(e) => { e.stopPropagation(); setMonth(m => m === 0 ? 11 : m - 1); if (month === 0) setYear(year - 1); }} className="p-2 border rounded-full hover:bg-gray-100">←</button>
                                                    <button onClick={(e) => { e.stopPropagation(); setMonth(m => m === 11 ? 0 : m + 1); if (month === 11) setYear(year + 1); }} className="p-2 border rounded-full hover:bg-gray-100">→</button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                                                <CalendarMonth month={month} year={year} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} onDepartureChange={onDepartureChange} onReturnDateChange={onReturnDateChange} />
                                                <div className="hidden md:block">
                                                    <CalendarMonth month={(month + 1) % 12} year={month === 11 ? year + 1 : year} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} onDepartureChange={onDepartureChange} onReturnDateChange={onReturnDateChange} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Passengers & Class */}
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="relative">
                                    <div
                                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "passengers" ? null : "passengers"); }}
                                        className="flex items-center gap-2 px-4 py-3 rounded-2xl hover:bg-gray-50 cursor-pointer h-[48px]"
                                    >
                                        <img src="/flights/person.svg" className="w-5 h-5 shrink-0" alt="" />
                                        <span className="font-bold text-sm">{totalPassengers}</span>
                                        <ChevronDown className="w-4 h-4 shrink-0" />
                                    </div>

                                    <AnimatePresence>
                                        {activeDropdown === "passengers" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full right-0 mt-2 w-[280px] bg-white rounded-3xl shadow-2xl border z-[50] p-6"
                                            >
                                                <h3 className="text-lg font-bold mb-4">Passengers</h3>
                                                {["adults", "children", "infants"].map(type => (
                                                    <div key={type} className="flex justify-between items-center mb-4">
                                                        <div>
                                                            <div className="font-bold text-sm capitalize">{type}</div>
                                                            <div className="text-[11px] text-gray-500">{type === "adults" ? "> 12 yrs" : type === "children" ? "2-12 yrs" : "< 2 yrs"}</div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button onClick={(e) => { e.stopPropagation(); updateCount(type, false); }} className="w-8 h-8 rounded-full border">-</button>
                                                            <span className="w-4 text-center font-bold">{counts[type]}</span>
                                                            <button onClick={(e) => { e.stopPropagation(); updateCount(type, true); }} className="w-8 h-8 rounded-full border">+</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="relative">
                                    <div
                                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "class" ? null : "class"); }}
                                        className="flex items-center gap-2 px-4 py-3 rounded-full hover:bg-gray-50 cursor-pointer h-[48px]"
                                    >
                                        <span className="text-sm whitespace-nowrap">{flightClass}</span>
                                        <ChevronDown className="w-4 h-4 shrink-0" />
                                    </div>

                                    <AnimatePresence>
                                        {activeDropdown === "class" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full right-0 mt-2 w-[200px] bg-white rounded-3xl shadow-2xl border z-[50] p-4"
                                            >
                                                {["All Class", "Economy", "Premium Economy", "Business", "First Class"].map(cls => (
                                                    <button key={cls} onClick={() => { handleClassSelect(cls); setActiveDropdown(null); }} className={`w-full text-left px-4 py-2 rounded-xl text-sm ${flightClass === cls ? "bg-blue-600 text-white font-bold" : "hover:bg-gray-50"}`}>{cls}</button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="shrink-0 ml-auto">
                                <button
                                    onClick={onSearch}
                                    className="flex items-center justify-center gap-2 bg-[#ff9933] hover:bg-[#ff8822] text-white px-6 py-3 rounded-full h-[48px] text-sm font-medium"
                                >
                                    <Search className="w-5 h-5" />
                                    <span>Search</span>
                                </button>
                            </div>


                        </div>


                        {/* === DESKTOP VIEW ONLY (Two Rows) === */}
                        <div className="hidden lg:flex flex-col gap-6 w-full">
                            
                            {/* Row 1: Locations & Date */}
                            <div className="flex items-center gap-4">
                                
                                {/* Departure & Arrival Group */}
                                <div className="flex items-center flex-1">
                                    <div className="relative flex-1">
                                        <div
                                            className="flex items-center gap-4 px-6 py-4 bg-sky-50 hover:bg-sky-100 transition-colors rounded-3xl cursor-pointer"
                                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "departure" ? null : "departure"); }}
                                        >
                                            <img src="/flights/flight_takeoff.svg" className="w-6 h-6" alt="" />
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">From</span>
                                                <span className="text-base font-bold text-gray-800">
                                                    {(() => {
                                                        const loc = getLocationDisplay(departure, 'from');
                                                        return `${loc.city} (${loc.code})`;
                                                    })()}
                                                </span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
                                        </div>

                                        <AnimatePresence>
                                            {activeDropdown === "departure" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-full left-0 mt-3 w-[400px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-6"
                                                >
                                                    <h3 className="text-lg font-bold mb-3">Departure</h3>
                                                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                                                        {locationOptions.map((option, i) => (
                                                            <button key={i} onClick={() => { onDepartureChange?.(option.value); setActiveDropdown(null); }} className="px-4 py-3 rounded-full border text-sm hover:bg-sky-50 transition-colors">
                                                                {option.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSwap?.(); }}
                                        className="w-12 h-12 shrink-0 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 z-10 -mx-6 hover:scale-110 transition-transform"
                                    >
                                        <ArrowLeftRight className="w-5 h-5 text-blue-500" />
                                    </button>

                                    <div className="relative flex-1">
                                        <div
                                            className="flex items-center gap-4 px-6 py-4 bg-sky-50 hover:bg-sky-100 transition-colors rounded-3xl cursor-pointer pl-10"
                                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "arrival" ? null : "arrival"); }}
                                        >
                                            <img src="/flights/flight_land.svg" className="w-6 h-6" alt="" />
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">To</span>
                                                <span className="text-base font-bold text-gray-800">
                                                    {(() => {
                                                        const loc = getLocationDisplay(arrival, 'to');
                                                        return `${loc.city} (${loc.code})`;
                                                    })()}
                                                </span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
                                        </div>

                                        <AnimatePresence>
                                            {activeDropdown === "arrival" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-full right-0 mt-3 w-[400px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-6"
                                                >
                                                    <h3 className="text-lg font-bold mb-3">Arrival</h3>
                                                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
                                                        {locationOptions.map((option, i) => (
                                                            <button key={i} onClick={() => { onArrivalChange?.(option.value); setActiveDropdown(null); }} className="px-4 py-3 rounded-full border text-sm hover:bg-sky-50 transition-colors">
                                                                {option.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Date Picker */}
                                <div className="relative min-w-[280px]">
                                    <div
                                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "date" ? null : "date"); }}
                                        className="h-[68px] bg-sky-50 hover:bg-sky-100 transition-colors rounded-3xl px-8 flex items-center gap-4 cursor-pointer"
                                    >
                                        <img src="/flights/calendar_month.svg" className="w-6 h-6 shrink-0" alt="" />
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</span>
                                            <span className="text-base font-bold text-gray-800 whitespace-nowrap">
                                                {date ? formatDateDisplay(date) : "Departure"}
                                            </span>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {activeDropdown === "date" && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full right-0 mt-4 w-[900px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-8"
                                            >
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-xl font-bold">Set the Date</h3>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => { if (month === 0) { setMonth(11); setYear(year - 1); } else { setMonth(month - 1); } }} className="p-2 border border-gray-100 rounded-full hover:bg-gray-50">←</button>
                                                        <button onClick={() => { if (month === 11) { setMonth(0); setYear(year + 1); } else { setMonth(month + 1); } }} className="p-2 border border-gray-100 rounded-full hover:bg-gray-50">→</button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-10">
                                                    <CalendarMonth month={month} year={year} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} onDepartureChange={onDepartureChange} onReturnDateChange={onReturnDateChange} />
                                                    <CalendarMonth month={month + 1} year={month === 11 ? year + 1 : year} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} onDepartureChange={onDepartureChange} onReturnDateChange={onReturnDateChange} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Add Return Pill */}
                                <div className="relative">
                                    {!isReturnActive ? (
                                        <div onClick={handleAddReturn} className="h-[68px] flex items-center gap-3 bg-sky-50/50 hover:bg-sky-100/50 transition-colors px-8 rounded-full cursor-pointer border-2 border-dashed border-sky-300">
                                            <Plus className="w-5 h-5 text-blue-500" />
                                            <span className="text-sm font-bold text-blue-600 whitespace-nowrap">Add return</span>
                                        </div>
                                    ) : (
                                        <div className="relative h-[68px] bg-sky-50 rounded-full flex items-center px-8 gap-4 min-w-[180px]">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Return</span>
                                                <span className="text-base font-bold text-gray-800 whitespace-nowrap">{formatDateDisplay(returnDate)}</span>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); handleRemoveReturn(); }} className="hover:bg-red-50 p-1.5 rounded-full transition-colors ml-auto">
                                                <X size={16} className="text-gray-400 hover:text-red-500" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>

                            {/* Row 2: Passengers, Class, Search */}
                            <div className="flex items-center justify-between mt-2">
                                
                                <div className="flex items-center gap-8 px-2">
                                    {/* Passengers Selector */}
                                    <div className="relative">
                                        <div
                                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "passengers" ? null : "passengers"); }}
                                            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors rounded-2xl cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src="/flights/person.svg" className="w-6 h-6 shrink-0" alt="" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Passengers</span>
                                                    <span className="font-bold text-gray-800 text-lg leading-tight">{totalPassengers}</span>
                                                </div>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </div>

                                        <AnimatePresence>
                                            {activeDropdown === "passengers" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-full left-0 mt-3 w-[320px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-6"
                                                >
                                                    <h3 className="text-lg font-bold mb-5">Passengers</h3>
                                                    <div className="space-y-5">
                                                        {[
                                                            { label: "Adults", sub: "> 12 yrs", type: "adults" },
                                                            { label: "Children", sub: "2-12 yrs", type: "children" },
                                                            { label: "Infants", sub: "< 2 yrs", type: "infants" }
                                                        ].map((pax) => (
                                                            <div key={pax.type} className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-bold text-base text-gray-800">{pax.label}</div>
                                                                    <div className="text-[11px] text-gray-400 font-medium">{pax.sub}</div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <button onClick={(e) => { e.stopPropagation(); updateCount(pax.type, false); }} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors">
                                                                        <Minus className="w-4 h-4 text-gray-600" />
                                                                    </button>
                                                                    <span className="w-4 text-center font-bold text-gray-800">{counts[pax.type]}</span>
                                                                    <button onClick={(e) => { e.stopPropagation(); updateCount(pax.type, true); }} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-colors">
                                                                        <Plus className="w-4 h-4 text-gray-600" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Flight Class Selector */}
                                    <div className="relative border-l border-gray-100 pl-8">
                                        <div
                                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "class" ? null : "class"); }}
                                            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors rounded-2xl cursor-pointer"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Class</span>
                                                <span className="text-gray-800 font-bold text-lg leading-tight">{flightClass}</span>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </div>

                                        <AnimatePresence>
                                            {activeDropdown === "class" && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    className="absolute top-full left-0 mt-3 w-[260px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-5"
                                                >
                                                    <h3 className="text-base font-bold mb-4 px-2">Travel Class</h3>
                                                    <div className="flex flex-col gap-1.5">
                                                        {["All Class", "Economy", "Premium Economy", "Business", "First Class"].map((cls) => (
                                                            <button
                                                                key={cls}
                                                                onClick={(e) => { e.stopPropagation(); handleClassSelect(cls); }}
                                                                className={`px-4 py-3 rounded-xl text-left text-sm transition-all ${flightClass === cls ? "bg-blue-600 font-bold text-white shadow-md shadow-blue-100" : "hover:bg-gray-50 text-gray-600"}`}
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

                                {/* Search Button */}
                                <button
                                    onClick={onSearch}
                                    className="bg-[#ff9933] hover:bg-[#ff8822] text-white px-16 py-5 rounded-3xl font-bold text-xl transition-all shadow-xl shadow-orange-100 flex items-center gap-4 hover:scale-[1.02] active:scale-[0.98] group"
                                >
                                    <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    <span>Search Flights</span>
                                </button>

                            </div>

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
                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "departure" ? null : "departure"); }}
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
                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "arrival" ? null : "arrival"); }}
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
                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "date" ? null : "date"); }}
                    >
                        <div className="text-[11px] font-bold text-gray-500 mb-1">DEPARTURE DATE</div>
                        <div className="text-[16px] font-bold text-black leading-tight flex items-baseline gap-1 truncate mb-3">
                            {formatMobileDatePrimary(date)}
                            <span className="text-[12px] text-gray-500 font-normal shrink-0">{formatMobileDateSecondary(date)}</span>
                        </div>
                    </div>

                    <div
                        className={`flex-1 bg-white border border-gray-200 rounded-[12px] p-3 cursor-pointer overflow-hidden relative ${!isReturnActive ? 'opacity-70' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
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
                    onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === "passengers" ? null : "passengers"); }}
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




function CalendarMonth({ month, year, startDate, endDate, setStartDate, setEndDate, onDepartureChange, onReturnDateChange }) {
    const days = generateCalendar(month, year);
    const monthName = new Date(year, month).toLocaleString("default", {
        month: "long",
    });

    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const isSelected = (day) => {
        if (!day || !day.current) return false;
        const d = new Date(year, month, day.day);
        if (startDate && d.toDateString() === startDate.toDateString()) return true;
        if (endDate && d.toDateString() === endDate.toDateString()) return true;
        return false;
    };

    const isInRange = (day) => {
        if (!day || !day.current || !startDate || !endDate) return false;
        const d = new Date(year, month, day.day);
        return d > startDate && d < endDate;
    };

    return (
        <div className="w-full">
            <h2 className="text-sm font-semibold mb-2 text-center text-gray-700">
                {monthName} {year}
            </h2>

            <div className="grid grid-cols-7 text-center text-[10px] mb-1 text-gray-400">
                {weekdays.map((d, i) => (
                    <div key={i} className="font-bold">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 text-center gap-y-1">
                {days.map((d, i) => {
                    const selected = isSelected(d);
                    const range = isInRange(d);

                    return (
                        <div
                            key={i}
                            onClick={() => {
                                if (!d.current) return;
                                const selectedDate = new Date(year, month, d.day);
                                const formatted = selectedDate.toISOString().split("T")[0];
                                
                                if (!startDate || (startDate && endDate)) {
                                    setStartDate(selectedDate);
                                    setEndDate(null);
                                    onDepartureChange?.(formatted);
                                } else if (startDate && !endDate) {
                                    if (selectedDate < startDate) {
                                        setStartDate(selectedDate);
                                        onDepartureChange?.(formatted);
                                    } else {
                                        setEndDate(selectedDate);
                                        onReturnDateChange?.(formatted);
                                    }
                                }
                            }}
                            className={`flex items-center justify-center w-8 h-8 mx-auto rounded-full cursor-pointer text-xs transition-colors
                                ${selected ? "bg-blue-600 text-white font-bold" : 
                                  range ? "bg-blue-50 text-blue-600" : 
                                  d.current ? "text-gray-700 hover:bg-gray-100" : "text-gray-200"}`}
                        >
                            {d.day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}