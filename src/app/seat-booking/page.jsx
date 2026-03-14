"use client";

import React, { useState, Suspense, useEffect } from 'react';
import { ChevronLeft, Check, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import API from '@/services/api';
import CheckoutSidebar from '@/components/ScheduledFlight/CheckoutSidebar';

function SeatBookingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Search criteria from URL
    const [searchCriteria, setSearchCriteria] = useState({
        departure: searchParams.get('departure') || "",
        arrival: searchParams.get('arrival') || "",
        passengers: parseInt(searchParams.get('passengers') || '1'),
        date: searchParams.get('date') || ""
    });

    const [airports, setAirports] = useState([]);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const res = await API.airports.getAirports();
                if (Array.isArray(res)) {
                    setAirports(res);
                }
            } catch (err) {
                console.error("Error fetching airports:", err);
            }
        };
        fetchAirports();
    }, []);

    // State for passengers and their selections
    const [passengers, setPassengers] = useState([
        { id: 1, name: "John Doe", seat: "" },
        { id: 2, name: "John Doe 2", seat: "" }
    ]);

    const [activePassengerIndex, setActivePassengerIndex] = useState(0);

    // Available, Booked, and Pilot seats
    const bookedSeats = ["S1"];
    const pilotSeats = ["P1", "P2"];
    const allPassengerSeats = ["S1", "S2", "S3", "S4", "S5", "S6"];

    // Seat layout configuration (matching the image)
    // Back to front: [S5, S3, S1] for top, [S6, S4, S2] for bottom
    const seatLayout = {
        top: ["S5", "S3", "S1"],
        bottom: ["S6", "S4", "S2"]
    };

    const handleSeatClick = (seatId) => {
        if (bookedSeats.includes(seatId)) return;

        const newPassengers = [...passengers];

        // Find if this seat is already selected by ANY passenger
        const existingPassengerIndex = newPassengers.findIndex(p => p.seat === seatId);

        if (existingPassengerIndex !== -1) {
            // Deselect the seat
            newPassengers[existingPassengerIndex].seat = "";
            setPassengers(newPassengers);
            // Shift active index to this passenger so they can select a new seat
            setActivePassengerIndex(existingPassengerIndex);
            return;
        }

        // Assign the seat to the current active passenger
        newPassengers[activePassengerIndex].seat = seatId;
        setPassengers(newPassengers);

        // Auto-advance to the next passenger without a seat
        const nextPassengerIndex = newPassengers.findIndex(p => !p.seat);
        if (nextPassengerIndex !== -1) {
            setActivePassengerIndex(nextPassengerIndex);
        }
    };

    const isSeatSelectedByActive = (seatId) => {
        return passengers[activePassengerIndex].seat === seatId;
    };

    const isSeatBooked = (seatId) => {
        return bookedSeats.includes(seatId);
    };

    const getSeatStatus = (seatId) => {
        if (isSeatBooked(seatId)) return 'booked';
        if (passengers.some(p => p.seat === seatId)) {
            const pIndex = passengers.findIndex(p => p.seat === seatId);
            return pIndex === activePassengerIndex ? 'selected' : 'taken';
        }
        return 'available';
    };

    return (
        <div className="inter-font bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-[1400px] w-full flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-6 md:p-8 lg:p-12 relative">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="absolute left-4 md:left-8 top-6 md:top-12 p-2 hover:bg-gray-100 rounded-full transition-colors group z-30"
                    >
                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-gray-900" />
                    </button>

                    {/* Header */}

                    <div className="mb-8 pl-12 md:pl-12 mt-4 md:mt-0">
                        <h1 className="text-xl md:text-2xl font-medium text-gray-900 mb-1 md:mb-2">Select Seat</h1>
                        <p className="text-gray-500 text-sm md:text-md">Choose your preferred seat from the available options.</p>
                    </div>
                    <div className='bg-[#FAFDFF]'>
                        {/* Legend */}
                        <div className="flex flex-wrap justify-center bg-white border rounded-xl py-3 md:py-4 gap-3 md:gap-6 px-2">
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#4CAF50] border"></div>
                                <span className="text-xs md:text-sm font-medium text-gray-600">Selected</span>
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#F44336] border"></div>
                                <span className="text-xs md:text-sm font-medium text-gray-600">Booked</span>
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#F0F9FF] border"></div>
                                <span className="text-xs md:text-sm font-medium text-gray-600">Available</span>
                            </div>
                        </div>


                        {/* Aircraft Visualization with Background Image */}
                        <div className="relative flex justify-center px-4 md:px-8 lg:px-16 border-x border-b rounded-b-xl overflow-x-auto scrollbar-hide py-4">
                            <div
                                className="w-full sm:min-w-[580px] md:min-w-0 lg:max-w-4xl h-[160px] sm:h-[220px] md:h-[250px] bg-no-repeat bg-contain bg-center relative flex items-center"
                                style={{ backgroundImage: "url('/flights/Group-flight.svg')" }}
                            >
                                {/* Passenger Cabin Area - Overlay over SVG */}
                                <div className="absolute left-[12%] right-[35%] top-1/2 -translate-y-1/2 flex flex-col justify-center gap-6 md:gap-14">
                                    {/* Top Row Seats */}
                                    <div className="flex justify-center items-center gap-8 md:gap-26">
                                        {seatLayout.top.map(seatId => (
                                            <Seat
                                                key={seatId}
                                                id={seatId}
                                                status={getSeatStatus(seatId)}
                                                onClick={() => handleSeatClick(seatId)}
                                            />
                                        ))}
                                    </div>

                                    {/* Bottom Row Seats */}
                                    <div className="flex justify-center items-center gap-8 md:gap-26">
                                        {seatLayout.bottom.map(seatId => (
                                            <Seat
                                                key={seatId}
                                                id={seatId}
                                                status={getSeatStatus(seatId)}
                                                onClick={() => handleSeatClick(seatId)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Pilot / Cockpit Area - Overlay over SVG front section */}
                                <div className="absolute right-[24%] top-1/2 -translate-y-1/2 flex flex-col gap-6">
                                    {[1, 2].map(i => (
                                        <div key={i} className="relative group">
                                            <img
                                                src="/flights/Group2.svg"
                                                alt="Pilot Seat"
                                                className="md:w-8 md:h-8 w-2 h-2 object-contain rotate-[180deg]"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Passenger Selection Tabs */}
                    <div className="inter-font flex flex-wrap gap-4 mt-12">
                        {passengers.map((p, idx) => (
                            <button
                                key={p.id}
                                onClick={() => setActivePassengerIndex(idx)}
                                className={`flex items-center overflow-hidden rounded-xl border transition-all duration-300 ${activePassengerIndex === idx
                                    ? 'border-[#00B894] ring-2 ring-[#00B894]/20'
                                    : 'border-gray-200'
                                    }`}
                            >
                                <div className={`px-2 py-2 flex flex-col items-start min-w-[80px] ${activePassengerIndex === idx ? 'bg-[#00B894] text-white' : 'bg-white'
                                    }`}>
                                    <span className={`md:text-xs text-[10px] font-semibold ${activePassengerIndex === idx ? 'text-white' : 'text-[#2196F3]'
                                        }`}>{p.name}</span>
                                    <span className={`md:text-xs text-[10px] tracking-tight ${activePassengerIndex === idx ? 'text-white/90' : 'text-gray-400 font-medium'
                                        }`}>
                                        {p.seat ? `S${p.seat.replace('S', '')}` : 'Select Seat'}
                                    </span>
                                </div>
                                <div className={`px-1 py-2 h-full flex items-center justify-center font-bold text-md min-w-[28px] ${activePassengerIndex === idx ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    <span className="rotate-[90deg] inline-block">
                                        {p.seat ? p.seat : ''}
                                    </span>

                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-center md:justify-end mt-8 md:mt-12">
                        <button
                            onClick={() => router.push('/traveller-details')}
                            className="w-full md:w-auto bg-[#FF9F43] hover:bg-[#F39C12] text-white font-medium py-3.5 md:py-3 px-8 md:px-20 rounded-2xl md:rounded-[32px] transition-all duration-300 text-lg shadow-lg shadow-orange-200"
                        >
                            Continue
                        </button>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="w-full lg:w-[400px] xl:w-[440px] md:flex-shrink-0">
                    <div className="sticky top-8">
                        {(() => {
                            const depCode = airports.find(a => a.city.toLowerCase() === (searchCriteria.departure || "").toLowerCase())?.airport_code || "BHO";
                            const arrCode = airports.find(a => a.city.toLowerCase() === (searchCriteria.arrival || "").toLowerCase())?.airport_code || "JLR";
                            return (
                                <CheckoutSidebar
                                    departure={searchCriteria.departure || "Bhopal"}
                                    departureCode={depCode}
                                    arrival={searchCriteria.arrival || "Jabalpur"}
                                    arrivalCode={arrCode}
                                    passengers={searchCriteria.passengers || 1}
                                    passengersData={passengers}
                                />
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SeatBookingPage() {
    return (
        <Suspense fallback={
            <div className="inter-font min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B894]"></div>
            </div>
        }>
            <SeatBookingContent />
        </Suspense>
    );
}

function Seat({ id, status, onClick }) {
    const images = {
        available: '/flights/Group1.svg',
        booked: '/flights/Group.svg',
        selected: '/flights/Group3.svg',
        taken: '/flights/Group3.svg'
    };

    return (
        <div className="relative flex items-center group">
            {/* Seat Label - Black box vertical on the left */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 z-20">
                <div className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-l-md rounded-tr-md flex items-center justify-center lg:min-w-[20px] min-w-0" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                    {id}
                </div>
            </div>

            {/* Seat Image */}
            <div
                onClick={onClick}
                className={`relative w-10 h-10 cursor-pointer transition-all duration-30  z-10 flex items-center justify-center ${status === 'taken' ? 'opacity-40' : ''}`}
            >
                <img
                    src={images[status]}
                    alt={`Seat ${id}`}
                    className="lg:w-full lg:h-full w-4 h-4 object-contain rotate-[180deg]"
                />

                {/* Overlay Checkmark for Selected */}

            </div>
        </div>
    );
}


function PassengerIcon({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function PilotIcon({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
    );
}
