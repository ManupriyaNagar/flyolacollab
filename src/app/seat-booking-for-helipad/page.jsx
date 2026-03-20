"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function HelicopterSeatBooking() {
    const router = useRouter();
    const [passengers, setPassengers] = useState([
        { id: 1, name: "John Doe", seat: "" },
        { id: 2, name: "John Doe 2", seat: "" },
    ]);

    const [activePassengerIndex, setActivePassengerIndex] = useState(0);

    const bookedSeats = ["S1", "S5"]; // Sample booked seats to match visuals

    // 🚁 Passenger Seats Layout (2 rows of 3 seats in the cabin)
    const helicopterLayout = {
        row1: ["S1", "S2", "S3"],
        row2: ["S4", "S5", "S6"],
    };

    // 👨✈️ Pilot Seats
    const pilotSeats = ["P1", "P2"];

    const handleSeatClick = (seatId) => {
        if (bookedSeats.includes(seatId)) return;

        const updated = [...passengers];
        const alreadySelectedIndex = updated.findIndex((p) => p.seat === seatId);

        if (alreadySelectedIndex !== -1) {
            updated[alreadySelectedIndex].seat = "";
            setPassengers(updated);
            setActivePassengerIndex(alreadySelectedIndex);
            return;
        }

        updated[activePassengerIndex].seat = seatId;
        setPassengers(updated);

        const next = updated.findIndex((p) => !p.seat);
        if (next !== -1) setActivePassengerIndex(next);
    };

    const getSeatStatus = (seatId) => {
        if (bookedSeats.includes(seatId)) return "booked";
        if (passengers.some((p) => p.seat === seatId)) {
            const idx = passengers.findIndex((p) => p.seat === seatId);
            return idx === activePassengerIndex ? "selected" : "taken";
        }
        return "available";
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-0 sm:p-4 md:p-8 font-sans">
            <div className="w-full max-w-5xl bg-white rounded-none sm:rounded-[2rem] border-0 sm:border border-gray-100 p-6 sm:p-8 md:p-12 relative overflow-hidden min-h-screen sm:min-h-0">

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="absolute left-4 sm:left-6 top-8 sm:top-10 p-2.5 hover:bg-gray-100 rounded-full transition-all group z-30"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
                </button>

                {/* Header Section */}
                <div className="mb-8 p-0 pl-10 sm:pl-12">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">Select Seat</h1>
                    <p className="text-gray-500 text-sm sm:text-base font-medium">Choose your preferred seat from the available options.</p>
                </div>

                {/* Main Interactive Map Container */}
                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    {/* Visual Legend */}
                    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 py-4 sm:py-6 bg-white border-b border-gray-50">
                        <Legend color="bg-[#4CAF50]" label="Selected" />
                        <Legend color="bg-[#F44336]" label="Booked" />
                        <Legend color="bg-[#2196F3]" label="Pilot" />
                    </div>

                    {/* Helicopter Visualization Layer */}
                    <div className="relative flex justify-end py-10 sm:py-20 bg-[#fafdff] px-4 overflow-x-auto no-scrollbar scroll-smooth">
                        <div
                            className="w-full min-w-[700px] sm:min-w-[800px] h-[280px] sm:h-[320px] bg-no-repeat bg-contain bg-center relative flex items-center justify-center -mr-16 sm:-mr-0"
                            style={{ backgroundImage: "url('/flights/Helicop.svg')" }}
                        >
                            {/* Seat Placement Layout - Balanced in the cabin area */}
                            <div className="flex items-center gap-12 sm:gap-20 ml-80 sm:ml-120 mt-2">
                                {/* First Cabin Row (Left-side in helicopter visualization) */}
                                <div className="flex flex-col gap-6 sm:gap-8">
                                    {helicopterLayout.row1.map((seatId) => (
                                        <SeatComponent
                                            key={seatId}
                                            id={seatId}
                                            status={getSeatStatus(seatId)}
                                            onClick={() => handleSeatClick(seatId)}
                                        />
                                    ))}
                                </div>

                                {/* Second Cabin Row (Middle-side in helicopter visualization) */}
                                <div className="flex flex-col gap-6 sm:gap-8">
                                    {helicopterLayout.row2.map((seatId) => (
                                        <SeatComponent
                                            key={seatId}
                                            id={seatId}
                                            status={getSeatStatus(seatId)}
                                            onClick={() => handleSeatClick(seatId)}
                                        />
                                    ))}
                                </div>

                                {/* Front Cockpit Row (Pilot/Co-pilot area) */}
                                <div className="flex flex-col gap-2 justify-end">
                                    {pilotSeats.map((seatId) => (
                                        <div key={seatId} className="relative group">
                                            <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-l-md rounded-tr-md flex items-center justify-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(90deg)' }}>
                                                    {seatId}
                                                </div>
                                            </div>
                                            <img
                                                src="/flights/Group2.svg"
                                                alt="Pilot Seat"
                                                className="w-5 h-5 sm:w-6 sm:h-6 object-contain opacity-90 transition-transform group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Visual Hint for Scroll */}
                    <div className="sm:hidden text-center py-2 bg-gray-50 border-t border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Scroll to explore cabin →</p>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 pt-4">
                    {/* Passenger Selection Tabs Grid */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {passengers.map((p, idx) => (
                            <button
                                key={p.id}
                                onClick={() => setActivePassengerIndex(idx)}
                                className={cn(
                                    "flex items-stretch overflow-hidden rounded-xl sm:rounded-2xl border-2 transition-all duration-300 group w-full sm:min-w-[200px]",
                                    activePassengerIndex === idx
                                        ? "border-[#00B894] bg-[#00B894] shadow-lg shadow-[#00B894]/10"
                                        : "border-gray-100 bg-white hover:border-gray-200"
                                )}
                            >
                                <div className="flex-1 px-4 sm:px-5 py-3.5 sm:py-4 text-left">
                                    <h3 className={cn("text-sm sm:text-base font-bold mb-0.5", activePassengerIndex === idx ? "text-white" : "text-blue-600")}>
                                        {p.name}
                                    </h3>
                                    <p className={cn("text-[10px] sm:text-xs font-medium uppercase tracking-wider", activePassengerIndex === idx ? "text-white/80" : "text-gray-400 font-semibold")}>
                                        {p.seat ? "Seat Confirmed" : "Choose Seat"}
                                    </p>
                                </div>
                                <div className={cn(
                                    "px-3 sm:px-4 flex items-center justify-center font-black text-sm sm:text-base min-w-[40px] transition-colors",
                                    activePassengerIndex === idx ? "bg-black text-white" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                                )}>
                                    <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                        {p.seat || "—"}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Final Action Button */}
                    <button
                        onClick={() => router.push('/traveller-details')}
                        className="w-full lg:w-auto bg-[#ff9f43] hover:bg-[#f39c12] text-white font-black py-4 sm:py-4.5 px-10 sm:px-20 rounded-xl sm:rounded-full transition-all duration-300 text-lg sm:text-xl shadow-xl shadow-orange-100 hover:shadow-orange-200 active:scale-[0.98]"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

/* 🪑 Specialized Passenger Seat Component */
function SeatComponent({ id, status, onClick }) {
    const images = {
        available: '/flights/Group1.svg',
        booked: '/flights/Group.svg',
        selected: '/flights/Group3.svg',
        taken: '/flights/Group3.svg' // visual fallback for 'taken' by another passenger
    };

    return (
        <div
            className={cn(
                "relative flex items-center group cursor-pointer transition-all active:scale-90",
                status === "booked" ? "cursor-not-allowed" : "hover:scale-110"
            )}
            onClick={status !== "booked" ? onClick : undefined}
        >
            {/* Unique Vertical Seat Label */}
            <div className={cn(
                "absolute z-20 transition-all duration-200",
                status === 'selected' ? "opacity-100 scale-100" : "opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"
            )}>
                <div className="bg-black text-white text-[9px] font-black px-1.5 py-0.5 rounded-l-md rounded-tr-md min-w-[24px] flex items-center justify-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    {id}
                </div>
            </div>

            {/* Seat Visual Asset */}
            <div className={cn(
                "w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center",
                status === 'taken' && "opacity-60 saturate-[0.8]"
            )}>
                <img
                    src={images[status]}
                    alt={`Seat ${id}`}
                    className="w-full h-full object-contain drop-shadow-sm"
                />
            </div>
        </div>
    );
}

/* 🎯 Unified Legend Helper */
function Legend({ color, label }) {
    return (
        <div className="flex items-center gap-2 sm:gap-2.5">
            <div className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm shadow-sm", color)} />
            <span className="text-[10px] sm:text-sm font-bold text-gray-500 uppercase tracking-wide">{label}</span>
        </div>
    );
}