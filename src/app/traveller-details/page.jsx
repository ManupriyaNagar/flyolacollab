"use client";

import React, { useState } from "react";
import FilterSectionTop from "@/components/ScheduledFlight/FilterSectionTop";
import CheckoutSidebar from "@/components/ScheduledFlight/CheckoutSidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    ChevronRight,
    ArrowRight,
    Info,
    Plus,
    User,
    Armchair,
    ChevronDown,
    MapPin,
    Utensils,
    Coffee,
    MonitorPlay,
    LayoutGrid,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Traveller/Hero";
import { Passenger } from "@/components/Traveller/Passenger";
import { RightSidebar } from "@/components/Traveller/RightSidebar";
import { BottomBooking } from "@/components/Traveller/BottomBooking";

export default function TravellerDetailsPage() {
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);

    // --- New Interactive State ---
    const [passengers, setPassengers] = useState([
        { id: 1, name: "Aloy Nugroho", idNumber: "ID7839201847", seat: null }
    ]);
    const [selectedOffer, setSelectedOffer] = useState("SALE");
    const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
    const [currentPassengerId, setCurrentPassengerId] = useState(null);

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
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header />

            {/* Search Bar at top */}
            <div className="">
                <FilterSectionTop
                    departure="BHO"
                    arrival="INR"
                    date="2026-03-17"
                    passengers={passengers.length}
                />
            </div>

            <main className="">
                {/* Stepper */}
                <Hero />


                <div className="mx-auto px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Flight Summary Card */}
                        <div className="">
                            <div className="">
                                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-light text-gray-900 tracking-tight">
                                            Flight from <span className="font-light">Bhopal</span> to <span className="font-light">Indor</span>
                                        </h2>
                                        <p className="text-gray-500 text-sm mt-1 font-medium opacity-70">
                                            Wed, 25 Feb • Non-stop • 2h 25m • Economy
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full"
                                    >
                                        <ChevronDown className={cn("transition-transform duration-300", isDetailsExpanded && "rotate-180")} />
                                    </button>
                                </div>

                                <div className="text-sm text-gray-400 mb-2 flex justify-between font-medium px-4">
                                    <span>The price is average for one person. Included all taxes and fees.</span>
                                    <span>Showing 1-10 of 100 results</span>
                                </div>

                                {/* Main Flight Info */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-8">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="flex items-center gap-1">
                                                    <img src="/flights/Layer_1.png" alt="Flyola" className=" w-6 h-6" />
                                                    <span className="font-light text-xl text-gray-900 tracking-tight">Flyola</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-gray-400 text-sm font-mono uppercase tracking-widest">SA 8092</span>
                                                    <span className="bg-[#10B981] text-white text-[10px] px-2.5 py-1 rounded-md font-medium uppercase tracking-widest shadow-sm">Business</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-red-500 font-medium text-3xl tracking-tight">
                                                INR 7,000<span className="text-sm font-light text-gray-400 ml-1">/pax</span>
                                            </div>
                                            <div className="text-gray-300 text-sm line-through font-light mt-1">INR 9,000</div>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-6 py-6 bg-white  rounded-3xl">
                                            <div className="flex flex-col items-center">
                                                <span className="text-3xl font-medium text-gray-900 tracking-tighter">06:45</span>
                                                <span className="text-xs text-gray-400 font-light uppercase tracking-widest">BHO</span>
                                            </div>

                                            <div className="flex-1 flex flex-col items-center">
                                                <div className="relative w-full flex items-center justify-center">
                                                    <div className="absolute w-full border-t-[2px] border-dotted border-gray-200" />
                                                    <div className="relative z-10 w-full flex justify-between">
                                                        <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" />
                                                        <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" />
                                                    </div>
                                                    <div className="absolute bg-white px-4">
                                                        <img src="/flights/flight_takeoff.svg" alt="plane" className="w-8 h-8 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 mt-3">
                                                    <span className="text-[12px] text-gray-400 font-light">1h 50min</span>
                                                    <span className="text-[12px] text-gray-400 font-light tracking-tight">• Direct Flight</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <span className="text-3xl font-medium text-gray-900 tracking-tighter">08:00</span>
                                                <span className="text-xs text-gray-400 font-light uppercase tracking-widest">INR</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-4 mt-10">
                                            <div className="text-red-500 text-xs font-light mb-1.5 uppercase tracking-wider">2 seats remaining</div>
                                            <div>
                                                <button className="text-sky-400 text-xs font-medium flex items-center gap-1 hover:underline uppercase tracking-widest group">
                                                    See Details <ChevronDown size={14} className="stroke-[3px] transition-transform group-hover:translate-y-0.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {isDetailsExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
                                                    <div className="space-y-8 relative">
                                                        {/* Vertical Timeline */}
                                                        <div className="absolute left-27 top-[14px] bottom-[14px] w-px border-l-[2px] border-dotted border-gray-200" />

                                                        <div className="flex items-start gap-8">
                                                            <div className="flex flex-col items-center gap-3 mb-2">
                                                                <span className="font-medium text-gray-900 text-xl tracking-tighter">06.45</span>
                                                                <span className="text-[10px] text-gray-400 font-light uppercase tracking-widest">18 Apr, Wed</span>
                                                            </div>
                                                            <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-gray-100 z-10" />

                                                            <div>

                                                                <div className="flex items-center gap-3">
                                                                    <span className="font-medium text-gray-900 tracking-tight">Bhopal (BHO)</span>
                                                                    <span className="text-gray-400 text-sm font-medium">• Raja Bhoj Airport</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="">
                                                            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-widest px-4 py-2 rounded-full w-fit">1h 50m</div>
                                                        </div>

                                                        <div className="flex items-start gap-8">
                                                            <div className="flex flex-col items-center gap-3 mb-2">
                                                                <span className="font-medium text-gray-900 text-xl tracking-tighter">06.45</span>
                                                                <span className="text-[10px] text-gray-400 font-light uppercase tracking-widest">18 Apr, Wed</span>
                                                            </div>
                                                            <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-gray-100 z-10" />

                                                            <div>

                                                                <div className="flex items-center gap-3">
                                                                    <span className="font-medium text-gray-900 tracking-tight">Bhopal (BHO)</span>
                                                                    <span className="text-gray-400 text-sm font-medium">• Raja Bhoj Airport</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="">
                                                        {[
                                                            { label: "Flyola 737", icon: <img src="/flights/flight_takeoff.svg" className="" /> },
                                                            { label: "Meal Included", icon: <Utensils size={18} className="" /> },
                                                            { label: "Beverages Included", icon: <Coffee size={18} className="" /> },
                                                            { label: "On-demand video", icon: <MonitorPlay size={18} className="" /> },
                                                            { label: "2-2 layout", icon: <LayoutGrid size={18} className="" /> }
                                                        ].map((item, idx) => (
                                                            <div key={idx} className="flex items-center justify-end group">
                                                                <span className="text-gray-600 font-light text-sm tracking-tight">{item.label}</span>
                                                                <div className="w-8 h-8 flex items-center justify-center transition-all">
                                                                    {item.icon}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Passenger Details & Seat Section */}
                        <Passenger
                            passengers={passengers}
                            onAdd={addPassenger}
                            onUpdate={updatePassenger}
                            onRemove={removePassenger}
                            onSelectSeat={handleSelectSeat}
                        />
                        {/* Bottom Booking Bar */}
                        <BottomBooking totalPrice={totalPrice} />

                    </div>

                    {/* Right Content (Sidebar) */}
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
            </main>

            {/* Seat Selection Modal */}
            <AnimatePresence>
                {isSeatModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-medium">Select Seat for {passengers.find(p => p.id === currentPassengerId)?.name || 'Passenger'}</h2>
                                <button onClick={() => setIsSeatModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <Plus className="rotate-45" />
                                </button>
                            </div>

                            <div className="grid grid-cols-6 gap-4 mb-8">
                                {['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6'].map(seat => (
                                    <button
                                        key={seat}
                                        onClick={() => {
                                            updatePassenger(currentPassengerId, { seat });
                                            setIsSeatModalOpen(false);
                                        }}
                                        className={cn(
                                            "h-12 border-2 rounded-xl flex items-center justify-center transition-all font-medium",
                                            passengers.find(p => p.id === currentPassengerId)?.seat === seat
                                                ? "bg-blue-600 border-blue-600 text-white"
                                                : "border-gray-200 hover:border-blue-400 text-gray-600"
                                        )}
                                    >
                                        {seat}
                                    </button>
                                ))}
                            </div>

                            <p className="text-center text-gray-400 text-sm">Select a seat to continue</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}