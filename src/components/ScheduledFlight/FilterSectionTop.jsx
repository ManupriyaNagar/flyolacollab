"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    ChevronDown,
    Search,
    ArrowLeftRight,
    Plus,
    Minus,
    X
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
    onReturnDateChange
}) => {
    const [isReturnActive, setIsReturnActive] = useState(!!returnDate);

    // Sync isReturnActive with returnDate prop
    React.useEffect(() => {
        setIsReturnActive(!!returnDate);
    }, [returnDate]);
    const [activeDropdown, setActiveDropdown] = useState(null); // 'passengers', 'class', 'departure', 'arrival', 'date'
    const [counts, setCounts] = useState({
        adults: passengers || 1,
        children: 0,
        infants: 0
    });

    const locationOptions = FilterManager.getLocationOptions(locations, 'flight');
    const dateInputRef = useRef(null);
    const returnDateInputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Handle outside clicks to close dropdowns
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
        setCounts(prev => {
            const newValue = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1);
            // Validation: at least 1 adult
            if (type === 'adults' && newValue < 1) return prev;

            const newCounts = { ...prev, [type]: newValue };
            const total = newCounts.adults + newCounts.children + newCounts.infants;
            onPassengersChange?.(total);
            return newCounts;
        });
    };

    const handleClassSelect = (val) => {
        onClassChange?.(val);
        setActiveDropdown(null);
    };

    const totalPassengers = counts.adults + counts.children + counts.infants;

    // Sync counts with passengers prop
    React.useEffect(() => {
        if (passengers && passengers !== totalPassengers) {
            setCounts({
                adults: Math.max(1, passengers),
                children: 0,
                infants: 0
            });
        }
    }, [passengers]);

    const handleAddReturn = () => {
        setIsReturnActive(true);
        if (date) {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            const formattedNextDay = nextDay.toISOString().split('T')[0];
            onReturnDateChange?.(formattedNextDay);
        }
    };

    const handleRemoveReturn = () => {
        setIsReturnActive(false);
        onReturnDateChange?.("");
    };

    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return "Select Date";
        const d = new Date(dateStr);
        const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
        const day = d.getDate();
        const month = d.toLocaleDateString('en-US', { month: 'long' });
        return `${weekday} ${day} ${month}`;
    };

    const generateCalendar = (monthOffset = 0) => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0);

        const days = [];
        const startDay = firstDay.getDay(); // 0 is Sunday

        // Add empty pads
        const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth() + monthOffset, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dateObj = new Date(now.getFullYear(), now.getMonth() + monthOffset, i);
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const d = String(dateObj.getDate()).padStart(2, '0');
            days.push({ day: i, isCurrentMonth: true, date: `${y}-${m}-${d}` });
        }

        // Fill remaining spaces to make 6 rows (42 days)
        const totalPads = 35 - days.length;
        for (let i = 1; i <= totalPads; i++) {
            days.push({ day: i, isCurrentMonth: false });
        }

        return {
            title: firstDay.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
            days
        };
    };

    const renderCalendar = (cal) => {
        const departureDate = date;
        const arrivalDate = returnDate;

        return (
            <div className="flex-1 inter-font">
                <h4 className="text-center font-semibold text-gray-900 mb-4 text-sm">{cal.title}</h4>
                <div className="grid grid-cols-7 text-center">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <div key={d} className={`text-sm font-semibold mb-4 ${d === 'Su' ? 'text-red-500' : 'text-gray-900'}`}>{d}</div>
                    ))}
                    {cal.days.map((d, i) => {
                        const isSunday = i % 7 === 0;
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        const currentDateObj = new Date(d.date);
                        currentDateObj.setHours(0, 0, 0, 0);

                        const isPast = currentDateObj < today;
                        if (!d.isCurrentMonth) {
                            return <div key={i} className="h-10 flex items-center justify-center text-sm font-light text-gray-200">{d.day}</div>;
                        }

                        const isDeparture = d.date === departureDate;
                        const isReturn = isReturnActive && d.date === arrivalDate;
                        const isInRange = isReturnActive && departureDate && arrivalDate &&
                            d.date > departureDate && d.date < arrivalDate;

                        return (
                            <div
                                key={i}
                                onClick={() => {
                                    if (isPast) return;
                                    if (!isReturnActive) {
                                        onDateChange?.(d.date);
                                        setActiveDropdown(null);
                                    } else {
                                        if (!departureDate || (departureDate && arrivalDate)) {
                                            onDateChange?.(d.date);
                                            onReturnDateChange?.("");
                                        } else if (d.date < departureDate) {
                                            onDateChange?.(d.date);
                                        } else if (d.date === departureDate) {
                                            // Handle same day if needed
                                        } else {
                                            onReturnDateChange?.(d.date);
                                        }
                                    }
                                }}
                                className={`relative h-8 flex items-center justify-center transition-all
            ${isPast ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
            ${isInRange ? 'bg-blue-100' : ''}
            ${isDeparture && isReturnActive && arrivalDate ? 'bg-blue-100 rounded-l-full' : ''}
            ${isReturn ? 'bg-blue-100 rounded-r-full' : ''}
        `}
                            >
                                <div
                                    className={`relative z-10 flex items-center justify-center h-8 w-8 text-sm font-light rounded-full transition-all
                ${isPast
                                            ? 'text-gray-400'
                                            : (isDeparture || isReturn)
                                                ? 'bg-[#0099ff] !text-white shadow-md'
                                                : isSunday
                                                    ? 'text-red-500 hover:bg-gray-100'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                        }
            `}
                                >
                                    {d.day}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full inter-font bg-white/80 backdrop-blur-md py-4 px-10 shadow-sm mb-6 mt-4 relative z-40" ref={dropdownRef}>
            <div className="flex flex-nowrap items-center gap-4 py-1">
                {/* Departure and Arrival Group */}
                <div className="flex items-center gap-1">
                    {/* Departure */}
                    <div className="relative">
                        <div
                            className="flex items-center gap-2 px-4 py-3 cursor-pointer transition-all bg-sky-50 hover:bg-blue-100 rounded-bl-full rounded-tl-full hover:rounded-tl-none whitespace-nowrap min-w-[200px]"
                            onClick={() => setActiveDropdown(activeDropdown === 'departure' ? null : 'departure')}
                        >
                            <img src="/flights/flight_takeoff.svg" className="w-5 h-5" />
                            <span className="text-md font-light text-gray-800">
                                {locationOptions.find(opt => opt.value === departure)?.label || "All Departure Airports"}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-800 transition-transform ${activeDropdown === 'departure' ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                            {activeDropdown === 'departure' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-2 w-[400px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-6"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Departure</h3>
                                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        <button
                                            onClick={() => {
                                                onDepartureChange?.("");
                                                setActiveDropdown(null);
                                            }}
                                            className={`px-4 py-3 rounded-full border text-sm font-medium transition-all ${!departure
                                                ? "border-sky-500 text-sky-600 bg-sky-50"
                                                : "border-gray-200 text-gray-500 hover:border-sky-300 hover:text-sky-500 hover:bg-sky-50/50 text-center"
                                                }`}
                                        >
                                            All Departure Airports
                                        </button>
                                        {locationOptions.map((option, index) => (
                                            <button
                                                key={`dep-opt-${index}`}
                                                onClick={() => {
                                                    onDepartureChange?.(option.value);
                                                    setActiveDropdown(null);
                                                }}
                                                className={`px-4 py-3 rounded-full border text-sm font-medium transition-all ${departure === option.value
                                                    ? "border-sky-500 text-sky-600 bg-sky-50"
                                                    : "border-gray-200 text-gray-500 hover:border-sky-300 hover:text-sky-500 hover:bg-sky-50/50 text-center"
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Swap Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSwap && onSwap();
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md z-10 -mx-2 hover:scale-110 active:scale-95 transition-all flex-shrink-0"
                    >
                        <ArrowLeftRight className="w-4 h-4" />
                    </button>

                    {/* Arrival */}
                    <div className="relative">
                        <div
                            className="flex items-center gap-2 px-4 py-3  bg-sky-50  hover:bg-blue-100 rounded-r-full hover:rounded-br-none cursor-pointer transition-all whitespace-nowrap min-w-[200px]"
                            onClick={() => setActiveDropdown(activeDropdown === 'arrival' ? null : 'arrival')}
                        >
                            <img src="/flights/flight_land.svg" className="w-5 h-5" />
                            <span className="text-md font-light text-gray-800">
                                {locationOptions.find(opt => opt.value === arrival)?.label || "All Arrival Airports"}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-800 transition-transform ${activeDropdown === 'arrival' ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                            {activeDropdown === 'arrival' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-2 w-[400px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-6"
                                >
                                    <h3 className="text-md font-bold text-gray-900 mb-2">Arrival</h3>
                                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        <button
                                            onClick={() => {
                                                onArrivalChange?.("");
                                                setActiveDropdown(null);
                                            }}
                                            className={`px-4 py-3 rounded-full border text-sm font-medium transition-all ${!arrival
                                                ? "border-sky-500 text-sky-600 bg-sky-50"
                                                : "border-gray-200 text-gray-500 hover:border-sky-300 hover:text-sky-500 hover:bg-sky-50/50 text-center"
                                                }`}
                                        >
                                            All Arrival Airports
                                        </button>
                                        {locationOptions.map((option, index) => (
                                            <button
                                                key={`arr-opt-${index}`}
                                                onClick={() => {
                                                    onArrivalChange?.(option.value);
                                                    setActiveDropdown(null);
                                                }}
                                                className={`px-4 py-3 rounded-full border text-sm font-medium transition-all ${arrival === option.value
                                                    ? "border-sky-500 text-sky-600 bg-sky-50"
                                                    : "border-gray-200 text-gray-500 hover:border-sky-300 hover:text-sky-500 hover:bg-sky-50/50 text-center"
                                                    }`}
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

                {/* Date Selection Section */}
                <div className="flex items-center gap-1 relative">
                    {/* Departure Date Trigger */}
                    <div
                        onClick={() => setActiveDropdown(activeDropdown === 'date' ? null : 'date')}
                        className="relative min-w-[200px] h-[48px] bg-sky-50 hover:bg-blue-100 rounded-full px-4 flex items-center gap-3 cursor-pointer transition-colors group"
                    >
                        <img src="/flights/calendar_month.svg" className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-800 pointer-events-none">
                            {date ? formatDateDisplay(date) : "Departure"}
                        </span>
                    </div>

                    {/* Return Date Trigger / Add Return */}
                    {!isReturnActive ? (
                        <div
                            onClick={handleAddReturn}
                            className="min-w-[170px] h-[48px] flex items-center gap-3 bg-sky-50 px-6 rounded-full transition-all cursor-pointer hover:bg-blue-100 whitespace-nowrap group"
                        >
                            <Plus className="w-4 h-4 text-[#0133EA]" />
                            <span className="text-md font-light text-[#0133EA] group-hover:text-[#0133EA]">Add return</span>
                        </div>
                    ) : (
                        <div
                            onClick={() => setActiveDropdown(activeDropdown === 'date' ? null : 'date')}
                            className="relative min-w-[200px] h-[48px] bg-sky-50 hover:bg-blue-100 rounded-full px-4 flex items-center gap-3 cursor-pointer transition-colors group"
                        >
                            <span className="text-sm font-medium text-gray-800 pointer-events-none">
                                {returnDate ? formatDateDisplay(returnDate) : "Return"}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveReturn();
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-gray-200/50 hover:bg-gray-200 rounded-full transition-colors z-20"
                            >
                                <X className="w-3.5 h-3.5 text-gray-600" />
                            </button>
                        </div>
                    )}

                    {/* Custom Date Picker Dropdown */}
                    <AnimatePresence>
                        {activeDropdown === 'date' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute inter-font top-full left-0 mt-4 w-[850px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-8"
                            >
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">Set the Date</h3>
                                        <button onClick={() => setActiveDropdown(null)} className="text-black hover:text-gray-600">
                                            <X size={24} />
                                        </button>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <div className="relative inter-font flex w-fit bg-slate-100 p-1 rounded-full">
                                            <button
                                                onClick={() => handleRemoveReturn()}
                                                className={`px-8 py-2 rounded-full text-sm font-light transition-all ${!isReturnActive ? 'bg-white text-black' : 'text-black'
                                                    }`}
                                            >
                                                One Way
                                            </button>

                                            <button
                                                onClick={() => handleAddReturn()}
                                                className={`px-8 py-2 rounded-full text-sm font-light transition-all ${isReturnActive ? 'bg-white text-black' : 'text-black'
                                                    }`}
                                            >
                                                Round Trip
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-12 mt-6">
                                    {renderCalendar(generateCalendar(0))}
                                    {renderCalendar(generateCalendar(1))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Passengers Selection */}
                <div className="relative">
                    <div
                        className="flex items-center gap-2 px-4 py-3 rounded-2xl cursor-pointer transition-all hover:bg-gray-50"
                        onClick={() => setActiveDropdown(activeDropdown === 'passengers' ? null : 'passengers')}
                    >
                        <img src="/flights/person.svg" className="w-5 h-5" />
                        <span className="text-sm font-bold text-gray-800">{totalPassengers}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-800 transition-transform ${activeDropdown === 'passengers' ? 'rotate-180' : ''}`} />
                    </div>

                    <AnimatePresence>
                        {activeDropdown === 'passengers' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 mt-2 w-[352px] h-[188px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Set Passenger</h3>

                                <div className="space-y-2">
                                    {/* Adults */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-light text-gray-800">Adult (above 12 years old)</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => updateCount('adults', false)}
                                                className="w-7 h-7 rounded-full border border-sky-400 flex items-center justify-center text-sky-500 hover:bg-sky-50 transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="text-base font-bold text-gray-900 w-4 text-center">{counts.adults}</span>
                                            <button
                                                onClick={() => updateCount('adults', true)}
                                                className="w-7 h-7 rounded-full border border-sky-400 flex items-center justify-center text-sky-500 hover:bg-sky-50 transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Children */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-light text-gray-800">Children (2 - 11 years old)</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => updateCount('children', false)}
                                                className="w-7 h-7 rounded-full border border-sky-400 flex items-center justify-center text-sky-500 hover:bg-sky-50 transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="text-base font-bold text-gray-900 w-4 text-center">{counts.children}</span>
                                            <button
                                                onClick={() => updateCount('children', true)}
                                                className="w-7 h-7 rounded-full border border-sky-400 flex items-center justify-center text-sky-500 hover:bg-sky-50 transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Infants */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-light text-gray-800">Infant (below 2 years old)</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => updateCount('infants', false)}
                                                className="w-7 h-7 rounded-full border border-sky-400 flex items-center justify-center text-sky-500 hover:bg-sky-50 transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="text-base font-bold text-gray-900 w-4 text-center">{counts.infants}</span>
                                            <button
                                                onClick={() => updateCount('infants', true)}
                                                className="w-7 h-7 rounded-full border border-sky-400 flex items-center justify-center text-sky-500 hover:bg-sky-50 transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Class Selection */}
                <div className="relative">
                    <div
                        className="flex items-center gap-2 px-4 py-3 rounded-full cursor-pointer transition-all hover:bg-gray-50 whitespace-nowrap"
                        onClick={() => setActiveDropdown(activeDropdown === 'class' ? null : 'class')}
                    >
                        <span className="text-md font-light text-gray-800">{flightClass}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-800 transition-transform ${activeDropdown === 'class' ? 'rotate-180' : ''}`} />
                    </div>

                    <AnimatePresence>
                        {activeDropdown === 'class' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 mt-2 w-[400px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 p-6 "
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Class</h3>

                                <div className="grid grid-cols-2 gap-2">
                                    {["Economy", "Business", "Premium Economy", "First Class"].map((cls) => (
                                        <button
                                            key={cls}
                                            onClick={() => handleClassSelect(cls)}
                                            className={`px-4 py-3 rounded-full border text-sm font-medium transition-all ${flightClass === cls
                                                ? "border-sky-500 text-sky-600 bg-sky-50"
                                                : "border-gray-200 text-gray-500 hover:border-sky-300 hover:text-sky-500 hover:bg-sky-50/50 text-center"
                                                }`}
                                        >
                                            {cls}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Search Button */}
                <div className="ml-auto flex-shrink-0 pl-4">
                    <button
                        onClick={onSearch}
                        className="flex items-center gap-2 bg-[#ff9933] hover:bg-[#ff8822] active:scale-95 text-white px-10 py-3 rounded-full font-bold transition-all shadow-lg shadow-orange-100"
                    >
                        <Search className="w-5 h-5 stroke-[3px]" />
                        <span>Search</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSectionTop;
