"use client";

import React, { useState } from "react";
import FilterSectionTop from "@/components/ScheduledFlight/FilterSectionTop";
import Header from "@/components/Header";
import {
    Plus,
    ChevronDown,
    Utensils,
    Coffee,
    MonitorPlay,
    LayoutGrid
} from "lucide-react";
import { IoAirplane } from "react-icons/io5";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Traveller/Hero";
import { Passenger } from "@/components/Traveller/Passenger";
import { RightSidebar } from "@/components/Traveller/RightSidebar";
import { useSearchParams } from "next/navigation";
import { BottomBooking } from "@/components/Traveller/BottomBooking";
import PassengerDetails from "@/components/Traveller/PassengerDetails";
import { useCallback, useEffect, useMemo } from "react";
import VehicleDetails from "@/components/booking/info/VehicleDetails";

export default function TravellerDetailsPage() {

    const searchParams = useSearchParams();




    // Get booking data from URL parameters
    const bookingParams = useMemo(() => ({
        departure: searchParams.get('departure') || '',
        arrival: searchParams.get('arrival') || '',
        selectedDate: searchParams.get('date') || '',
        scheduleId: searchParams.get('scheduleId') || '',
        price: searchParams.get('price') || '0',
        departureTime: searchParams.get('departureTime') || '',
        arrivalTime: searchParams.get('arrivalTime') || '',
        passengers: parseInt(searchParams.get('passengers') || '1'),
        bookingType: searchParams.get('type') || 'flight',
        departureCode: searchParams.get('departureCode') || '',
        arrivalCode: searchParams.get('arrivalCode') || '',
        helicopterNumber: searchParams.get('helicopterNumber'),
        flightNumber: searchParams.get('flightNumber')
    }), [searchParams]);

    // Format time
    const formatTime = useCallback((time) => {
        if (!time) return "N/A";
        if (/^\d{6}$/.test(time)) return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
        if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time.slice(0, 5);
        if (/^\d{2}:\d{2}$/.test(time)) return time;
        try {
            return new Date(`1970-01-01 ${time}`).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "Asia/Kolkata",
            });
        } catch {
            return "N/A";
        }
    }, []);

    const formatDate = useCallback((iso) => {
        if (!iso) return "N/A";
        return new Date(iso).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata",
        });
    }, []);

    // Flight Information setup
    const schedule = useMemo(() => ({
        departure_time: searchParams.get("departureTime") || "06:45",
        arrival_time: searchParams.get("arrivalTime") || "08:00",
        price: searchParams.get("price") || "7000",
        flight_number: searchParams.get("flightNumber") || "SA 8092",
        class: searchParams.get("class") || "Business"
    }), [searchParams]);

    const departureLocation = useMemo(() => ({
        city: searchParams.get("departure") || "Bhopal",
        airport_code: searchParams.get("departureCode") || "BHO",
        name: "Raja Bhoj Airport"
    }), [searchParams]);

    const arrivalLocation = useMemo(() => ({
        city: searchParams.get("arrival") || "Indore",
        airport_code: searchParams.get("arrivalCode") || "IDR",
        name: "Devi Ahilya Bai Holkar Airport"
    }), [searchParams]);

    const selectedDate = searchParams.get("date") || new Date().toISOString().split('T')[0];
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
    const [filterDepartureCity, setFilterDepartureCity] = useState("");
    const [filterArrivalCity, setFilterArrivalCity] = useState("");
    const [searchCriteria, setSearchCriteria] = useState({
        departure: "",
        arrival: "",
        date: "",
        returnDate: "",
        passengers: 1,
    });
    const [flightClass, setFlightClass] = useState("All Class");
    const [filterMinSeats, setFilterMinSeats] = useState(0);
    const [flightAirports, setFlightAirports] = useState([]);

    // --- New Interactive State ---
    const [passengers, setPassengers] = useState([
        { id: 1, name: "Aloy Nugroho", idNumber: "ID7839201847", seat: null }
    ]);
    const [selectedOffer, setSelectedOffer] = useState("SALE");
    const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
    const [currentPassengerId, setCurrentPassengerId] = useState(null);

    const stops = []; // Initialize stops to fix ReferenceError
    const stopCount = stops?.length || 0;
    const isNonStop = stopCount === 0;
    const stopText = isNonStop ? "Non-Stop" : `${stopCount} Stop${stopCount > 1 ? "s" : ""}`;

    const addPassenger = () => {
        setPassengers([...passengers, {
            id: Date.now(),
            name: "",
            idNumber: "",
            seat: null
        }]);
    };

    const updatePassenger = (id, data) => {
        setPassengers(passengers.map(p => p.id === id ? { ...p, ...data } : p));
    };

    const removePassenger = (id) => {
        if (passengers.length > 1) {
            setPassengers(passengers.filter(p => p.id !== id));
        }
    };

    const handleSelectSeat = (id) => {
        setCurrentPassengerId(id);
        setIsSeatModalOpen(true);
    };

    // Calculate Fares
    const baseFarePerPax = 9000;
    const taxesPerPax = 600;
    const discountAmount = selectedOffer === "SALE" ? 605 : 0;

    const totalBaseFare = baseFarePerPax * passengers.length;
    const totalTaxes = taxesPerPax * passengers.length;
    const totalPrice = (totalBaseFare + totalTaxes) - discountAmount;

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Search Bar at top */}
            <div className="">
                <FilterSectionTop
                    departure={filterDepartureCity}
                    arrival={filterArrivalCity}
                    date={searchCriteria.date}
                    passengers={filterMinSeats}
                    flightClass={flightClass}
                    locations={flightAirports}
                    onDepartureChange={(city) => {
                        setFilterDepartureCity(city);
                        setSearchCriteria(prev => ({ ...prev, departure: city }));
                    }}
                    onArrivalChange={(city) => {
                        setFilterArrivalCity(city);
                        setSearchCriteria(prev => ({ ...prev, arrival: city }));
                    }}
                    onDateChange={(newDate) => {
                        setSearchCriteria(prev => ({ ...prev, date: newDate }));
                        fetchData(newDate);
                    }}
                    onPassengersChange={(val) => {
                        setFilterMinSeats(val);
                        setSearchCriteria(prev => ({ ...prev, passengers: val }));
                    }}
                    onClassChange={(val) => {
                        setFlightClass(val);
                    }}
                    onSwap={() => {
                        const d = filterDepartureCity;
                        const a = filterArrivalCity;
                        setFilterDepartureCity(a);
                        setFilterArrivalCity(d);
                        setSearchCriteria(prev => ({ ...prev, departure: a, arrival: d }));
                    }}
                    onSearch={() => fetchData(searchCriteria.date)}
                    returnDate={searchCriteria.returnDate}
                    onReturnDateChange={(newDate) => {
                        setSearchCriteria(prev => ({ ...prev, returnDate: newDate }));
                    }}
                />
            </div>
            <div className="pt-10">
                <Hero />
            </div>


            <main className="">
                <div className="mx-auto sm:px-6 lg:px-8 xl:px-10 grid grid-cols-1 md:grid-cols-5 xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-12">
                    {/* Left Content */}
                    <div className="md:col-span-3 xl:col-span-2 space-y-6 md:px-0 px-4">
                        {/* Flight Summary Card */}
                        <div className="">
                            <div className="">
                                <div className="bg-white rounded-2xl border border-gray-100 lg:p-6 p-2 flex justify-between items-start lg:mb-6 mb-2">
                                    <div>
                                        <h2 className="lg:text-2xl md:text-sm text-[8px] font-light text-gray-900">
                                            Flight from <span className="font-light">Bhopal</span> to <span className="font-light">Indor</span>
                                        </h2>

                                    </div>
                                    <div className="flex">
                                        <p className="text-gray-500 lg:text-sm md:text-xs text-[8px] lg:font-medium font-light opacity-70">
                                            Wed, 25 Feb • Non-stop • 2h 25m • Economy
                                        </p>
                                        <button

                                            className="text-gray-400 hover:text-gray-600 transition-colors  hover:bg-gray-50 rounded-full"
                                        >
                                            <ChevronDown className={cn("transition-transform duration-300", "w-4 h-4")} />
                                        </button>
                                    </div>
                                </div>

                                <div className="md:text-sm text-[8px] text-gray-400 mb-2 flex justify-between font-medium md:px-4 px-2">
                                    <span>The price is average for one person. Included all taxes and fees.</span>
                                    <span>Showing 1-10 of 100 results</span>
                                </div>

                                {/* Main Flight Info */}
                                <VehicleDetails
                                    bookingType={bookingParams.bookingType}
                                    departure={bookingParams.departure}
                                    arrival={bookingParams.arrival}
                                    date={bookingParams.selectedDate}
                                    departureTime={formatTime(bookingParams.departureTime)}
                                    arrivalTime={formatTime(bookingParams.arrivalTime)}
                                    price={bookingParams.price}
                                    flightNumber={bookingParams.flightNumber || bookingParams.helicopterNumber || "SA 8092"}
                                    departureCode={bookingParams.departureCode}
                                    arrivalCode={bookingParams.arrivalCode}
                                />

                            </div>

                        </div>
                        <PassengerDetails />

                    </div>

                    {/* Right Content (Sidebar) */}
                    <div className="md:col-span-2 xl:col-span-1">
                        <div className="sticky top-20">
                            <RightSidebar
                                passengers={passengers}
                                selectedOffer={selectedOffer}
                                onOfferSelect={setSelectedOffer}
                                baseFare={totalBaseFare}
                                taxes={totalTaxes}
                                discount={discountAmount}
                                totalPrice={totalPrice}
                            />
                        </div>
                    </div>
                </div>

            </main>

        </div>
    );
}