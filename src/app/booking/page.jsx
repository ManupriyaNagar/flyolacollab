"use client";

import { FaUserFriends, FaClock, FaPlane, FaHelicopter, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import BASE_URL from "@/baseUrl/baseUrl";
import { cn } from "@/lib/utils";

const tz = "Asia/Kolkata";

// Memoized seat button component to prevent unnecessary re-renders
const SeatButton = ({ seat, isSelected, isAvailable, onToggle, disabled }) => (
    <button
        onClick={() => onToggle(seat)}
        className={`h-12 rounded-lg text-sm font-bold transition-colors duration-150 ${isSelected
            ? "bg-green-500 text-white shadow-md"
            : isAvailable
                ? "bg-blue-200 text-gray-800 hover:bg-blue-300"
                : "bg-red-200 text-gray-500 cursor-not-allowed"
            }`}
        disabled={disabled || !isAvailable}
    >
        {seat}
    </button>
);

const BookingPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get booking data from URL parameters
    const departure = searchParams.get('departure') || '';
    const arrival = searchParams.get('arrival') || '';
    const selectedDate = searchParams.get('date') || '';
    const scheduleId = searchParams.get('scheduleId') || '';
    const price = searchParams.get('price') || '0';
    const departureTime = searchParams.get('departureTime') || '';
    const arrivalTime = searchParams.get('arrivalTime') || '';
    const passengers = parseInt(searchParams.get('passengers') || '1');
    const bookingType = searchParams.get('type') || 'flight'; // 'flight' or 'helicopter'

    const [passengerData] = useState({
        adults: passengers || 1,
        children: 0,
        infants: 0,
    });
    const [availableSeats, setAvailableSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Seat hold state
    const [seatHoldExpiry, setSeatHoldExpiry] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [isHoldingSeats, setIsHoldingSeats] = useState(false);

    // Memoized constants to prevent recalculation
    const basePrice = useMemo(() => parseFloat(price || 2000), [price]);
    const childDiscount = 0.5;
    const infantFee = 10;
    const totalPassengers = useMemo(() => passengerData.adults + passengerData.children, [passengerData.adults, passengerData.children]);
    const allSeats = useMemo(() => ["S1", "S2", "S3", "S4", "S5", "S6"], []);

    // Optimized date validation
    const formattedDate = useMemo(() => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) return selectedDate;
        return new Date().toISOString().split("T")[0];
    }, [selectedDate]);

    // Optimized time formatting
    const formatTime = useCallback((t) => {
        if (!t) return "N/A";
        if (/^\d{6}$/.test(t)) return `${t.slice(0, 2)}:${t.slice(2, 4)}`;
        if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5);
        try {
            return new Date(`1970-01-01 ${t}`).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: tz,
            });
        } catch {
            return "N/A";
        }
    }, []);

    const formattedDepartureTime = useMemo(() => formatTime(departureTime), [departureTime, formatTime]);
    const formattedArrivalTime = useMemo(() => formatTime(arrivalTime), [arrivalTime, formatTime]);

    const fetchAvailableSeats = useCallback(async () => {
        if (!scheduleId) {
            setError(`Missing ${bookingType} schedule information`);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token") || "";
            const apiEndpoint = bookingType === 'helicopter' 
                ? `${BASE_URL}/helicopter-seat/available-seats?schedule_id=${scheduleId}&bookDate=${formattedDate}`
                : `${BASE_URL}/booked-seat/available-seats?schedule_id=${scheduleId}&bookDate=${formattedDate}`;
            
            const response = await fetch(apiEndpoint, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Seats API failed: ${response.status}`);
            }

            const data = await response.json();
            const seats = Array.isArray(data.availableSeats)
                ? data.availableSeats.filter((seat) => allSeats.includes(seat))
                : allSeats;

            setAvailableSeats(seats);
            setSelectedSeats(seats.slice(0, totalPassengers));
            setError(null);
        } catch (err) {
            setError(`Unable to load seats. Using fallback.`);
            setAvailableSeats(allSeats);
            setSelectedSeats(allSeats.slice(0, totalPassengers));
        } finally {
            setLoading(false);
        }
    }, [scheduleId, formattedDate, allSeats, totalPassengers]);

    useEffect(() => {
        fetchAvailableSeats();
    }, [fetchAvailableSeats]);

    // Hold seats API call
    const holdSeats = useCallback(async (seats) => {
        if (!seats || seats.length === 0) return;
        
        setIsHoldingSeats(true);
        try {
            const token = localStorage.getItem("token") || "";
            const userId = localStorage.getItem("userId") || `guest_${Date.now()}`;
            
            const response = await fetch(`${BASE_URL}/booked-seat/hold-seats`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    schedule_id: parseInt(scheduleId),
                    bookDate: formattedDate,
                    seat_labels: seats,
                    held_by: userId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to hold seats');
            }

            const data = await response.json();
            setSeatHoldExpiry(new Date(data.expiresAt));
            console.log('[Seat Hold] Seats held successfully until:', data.expiresAt);
        } catch (err) {
            console.error('[Seat Hold] Failed to hold seats:', err);
            setError(`Failed to reserve seats: ${err.message}`);
            // Revert seat selection on failure
            setSelectedSeats([]);
        } finally {
            setIsHoldingSeats(false);
        }
    }, [scheduleId, formattedDate]);

    // Release seats API call
    const releaseSeats = useCallback(async (seats) => {
        if (!seats || seats.length === 0) return;
        
        try {
            const token = localStorage.getItem("token") || "";
            const userId = localStorage.getItem("userId") || `guest_${Date.now()}`;
            
            // Note: You'll need to add a release endpoint in backend
            // For now, seats will auto-expire after 10 minutes
            console.log('[Seat Hold] Seats will auto-release after timeout');
        } catch (err) {
            console.error('[Seat Hold] Failed to release seats:', err);
        }
    }, []);

    const handleSeatToggle = useCallback(async (seat) => {
        const isCurrentlySelected = selectedSeats.includes(seat);
        
        if (isCurrentlySelected) {
            // Deselecting a seat
            const newSeats = selectedSeats.filter((s) => s !== seat);
            setSelectedSeats(newSeats);
            
            // If all seats deselected, clear hold
            if (newSeats.length === 0) {
                setSeatHoldExpiry(null);
                setTimeRemaining(null);
            } else {
                // Re-hold remaining seats
                await holdSeats(newSeats);
            }
        } else {
            // Selecting a new seat
            if (selectedSeats.length < totalPassengers) {
                const newSeats = [...selectedSeats, seat];
                setSelectedSeats(newSeats);
                
                // Hold the new seat selection
                await holdSeats(newSeats);
            }
        }
    }, [selectedSeats, totalPassengers, holdSeats]);

    // Countdown timer for seat hold
    useEffect(() => {
        if (!seatHoldExpiry) {
            setTimeRemaining(null);
            return;
        }

        const interval = setInterval(() => {
            const now = new Date();
            const diff = seatHoldExpiry - now;
            
            if (diff <= 0) {
                // Hold expired
                setTimeRemaining(null);
                setSeatHoldExpiry(null);
                setSelectedSeats([]);
                setError('Seat hold expired. Please select seats again.');
                clearInterval(interval);
            } else {
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [seatHoldExpiry]);

    const calculateTotalPrice = useMemo(() => {
        const adultPrice = basePrice * passengerData.adults;
        const childPrice = basePrice * passengerData.children * childDiscount;
        const infantPrice = passengerData.infants * infantFee;
        return (adultPrice + childPrice + infantPrice).toFixed(2);
    }, [basePrice, passengerData]);

    const handleConfirmBooking = useCallback(() => {
        if (selectedSeats.length !== totalPassengers) {
            alert(`Please select exactly ${totalPassengers} seat(s) for all passengers.`);
            return;
        }
        try {
            // Get additional params for helicopter bookings
            const departureCode = searchParams.get('departureCode') || departure.substring(0, 3).toUpperCase();
            const arrivalCode = searchParams.get('arrivalCode') || arrival.substring(0, 3).toUpperCase();
            const helicopterNumber = searchParams.get('helicopterNumber');
            const flightNumber = searchParams.get('flightNumber');
            
            const bookingData = {
                departure,
                arrival,
                departureCode,
                arrivalCode,
                selectedDate: formattedDate,
                passengers: passengerData,
                totalPrice: calculateTotalPrice,
                flightSchedule: {
                    id: scheduleId,
                    price: basePrice,
                    departure_time: departureTime,
                    arrival_time: arrivalTime,
                },
                selectedSeats,
                bookingType: bookingType,
                helicopterNumber: helicopterNumber,
                flightNumber: flightNumber,
            };
            localStorage.setItem("bookingData", JSON.stringify(bookingData));
            router.push("/combined-booking-page");
        } catch (error) {
            alert("An error occurred while processing your booking. Please try again.");
        }
    }, [router, departure, arrival, formattedDate, passengerData, calculateTotalPrice, scheduleId, basePrice, departureTime, arrivalTime, selectedSeats, totalPassengers, bookingType, searchParams]);

    const handleRetry = useCallback(() => {
        setError(null);
        fetchAvailableSeats();
    }, [fetchAvailableSeats]);

    // Validate required parameters
    if (!departure || !arrival || !selectedDate || !scheduleId) {
        
        return (
            <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center', 'p-4')}>
                <div className={cn('bg-white', 'rounded-2xl', 'shadow-xl', 'p-8', 'max-w-lg', 'w-full', 'text-center')}>
                    <div className={cn('text-red-500', 'text-6xl', 'mb-4')}>⚠️</div>
                    <h1 className={cn('text-2xl', 'font-bold', 'text-gray-800', 'mb-4')}>Missing Booking Information</h1>
                    <p className={cn('text-gray-600', 'mb-6')}>
                        Some required booking details are missing. Please go back and select a {bookingType} again.
                    </p>
                    <div className={cn('text-sm', 'text-gray-500', 'mb-4')}>
                        Missing: {[
                            !departure && 'departure',
                            !arrival && 'arrival', 
                            !selectedDate && 'date',
                            !scheduleId && 'schedule ID'
                        ].filter(Boolean).join(', ')}
                    </div>
                    <Link
                        href={bookingType === 'helicopter' ? "/helicopter-flight" : "/scheduled-flight"}
                        className={cn('inline-flex', 'items-center', 'gap-2', 'px-6', 'py-3', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors')}
                    >
                        <FaArrowLeft />
                        Back to {bookingType === 'helicopter' ? 'Helicopters' : 'Flights'}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('min-h-screen', 'bg-gray-50', 'py-8', 'px-4')}>
            <div className={cn('max-w-7xl', 'mx-auto')}>
                {/* Header */}
                <div className={cn('bg-gradient-to-r', 'from-blue-600', 'to-indigo-700', 'text-white', 'p-6', 'rounded-t-3xl')}>
                    <div className={cn('flex', 'items-center', 'justify-between')}>
                        <div>
                            <h1 className={cn('text-3xl', 'font-bold', 'flex', 'items-center', 'gap-3')}>
                                {bookingType === 'helicopter' ? 
                                    <FaHelicopter className="text-yellow-300" /> : 
                                    <FaPlane className="text-yellow-300" />
                                }
                                Complete Your Booking
                            </h1>
                            <p className={cn('text-blue-100', 'mt-2')}>Secure your seats in just a few clicks</p>
                        </div>
                        <Link
                            href={bookingType === 'helicopter' ? "/helicopter-flight" : "/scheduled-flight"}
                            className={cn('text-white/80', 'hover:text-white', 'hover:bg-white/20', 'p-3', 'rounded-full', 'transition-all', 'flex', 'items-center', 'gap-2')}
                        >
                            <FaArrowLeft />
                            <span className={cn('hidden', 'sm:inline')}>Back to {bookingType === 'helicopter' ? 'Helicopters' : 'Flights'}</span>
                        </Link>
                    </div>
                </div>

                <div className={cn('bg-white', 'rounded-b-3xl', 'shadow-xl', 'p-6', 'space-y-6')}>
                    {/* Flight/Helicopter Details */}
                    <div className={`bg-gradient-to-br ${bookingType === 'helicopter' ? 'from-red-50 to-pink-50 border-red-200' : 'from-blue-50 to-indigo-50 border-blue-200'} p-6 rounded-2xl border`}>
                        <h3 className={cn('text-lg', 'font-semibold', 'text-gray-800', 'mb-4', 'flex', 'items-center', 'gap-2')}>
                            {bookingType === 'helicopter' ? 
                                <FaHelicopter className="text-red-600" /> : 
                                <FaPlane className="text-blue-600" />
                            }
                            {bookingType === 'helicopter' ? 'Helicopter' : 'Flight'} Details
                        </h3>
                        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                            <div className="space-y-3">
                                <div className={cn('flex', 'items-center', 'gap-3')}>
                                    <div className={cn('w-2', 'h-2', 'bg-green-500', 'rounded-full')}></div>
                                    <span className={cn('text-sm', 'text-gray-600')}>From:</span>
                                    <span className={cn('font-semibold', 'text-gray-800')}>{departure}</span>
                                </div>
                                <div className={cn('flex', 'items-center', 'gap-3')}>
                                    <div className={cn('w-2', 'h-2', 'bg-red-500', 'rounded-full')}></div>
                                    <span className={cn('text-sm', 'text-gray-600')}>To:</span>
                                    <span className={cn('font-semibold', 'text-gray-800')}>{arrival}</span>
                                </div>
                                <div className={cn('flex', 'items-center', 'gap-3')}>
                                    <FaCalendarAlt className="text-blue-500" size={12} />
                                    <span className={cn('text-sm', 'text-gray-600')}>Date:</span>
                                    <span className={cn('font-semibold', 'text-gray-800')}>
                                        {new Date(formattedDate).toLocaleDateString("en-US", {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className={cn('bg-white', 'p-3', 'rounded-xl', 'border', 'border-gray-200')}>
                                    <div className={cn('flex', 'items-center', 'justify-between')}>
                                        <span className={cn('text-sm', 'text-gray-600', 'flex', 'items-center', 'gap-2')}>
                                            <FaClock className="text-green-500" />
                                            Departure
                                        </span>
                                        <span className={cn('font-bold', 'text-lg', 'text-gray-800')}>{formattedDepartureTime}</span>
                                    </div>
                                </div>
                                <div className={cn('bg-white', 'p-3', 'rounded-xl', 'border', 'border-gray-200')}>
                                    <div className={cn('flex', 'items-center', 'justify-between')}>
                                        <span className={cn('text-sm', 'text-gray-600', 'flex', 'items-center', 'gap-2')}>
                                            <FaClock className="text-blue-500" />
                                            Arrival
                                        </span>
                                        <span className={cn('font-bold', 'text-lg', 'text-gray-800')}>{formattedArrivalTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Passenger Information */}
                    <div className={cn('bg-gradient-to-br', 'from-green-50', 'to-emerald-50', 'p-6', 'rounded-2xl', 'border', 'border-green-200')}>
                        <h3 className={cn('text-lg', 'font-semibold', 'text-gray-800', 'mb-4', 'flex', 'items-center', 'gap-2')}>
                            <FaUserFriends className="text-green-600" />
                            Passenger Details
                        </h3>
                        <div className={cn('grid', 'grid-cols-3', 'gap-4')}>
                            <div className={cn('text-center', 'bg-white', 'p-4', 'rounded-xl', 'border', 'border-green-200')}>
                                <div className={cn('text-2xl', 'font-bold', 'text-green-600')}>{passengerData.adults}</div>
                                <div className={cn('text-sm', 'text-gray-600')}>Adults</div>
                            </div>
                            <div className={cn('text-center', 'bg-white', 'p-4', 'rounded-xl', 'border', 'border-green-200')}>
                                <div className={cn('text-2xl', 'font-bold', 'text-blue-600')}>{passengerData.children}</div>
                                <div className={cn('text-sm', 'text-gray-600')}>Children</div>
                            </div>
                            <div className={cn('text-center', 'bg-white', 'p-4', 'rounded-xl', 'border', 'border-green-200')}>
                                <div className={cn('text-2xl', 'font-bold', 'text-purple-600')}>{passengerData.infants}</div>
                                <div className={cn('text-sm', 'text-gray-600')}>Infants</div>
                            </div>
                        </div>
                    </div>

                    {/* Seat Selection */}
                    <div className={cn('bg-gradient-to-br', 'from-yellow-50', 'to-orange-50', 'p-6', 'rounded-2xl', 'border', 'border-yellow-200')}>
                        <h3 className={cn('text-lg', 'font-semibold', 'text-gray-800', 'mb-4', 'flex', 'items-center', 'gap-2')}>
                            <svg className={cn('w-5', 'h-5', 'text-yellow-600')} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" />
                            </svg>
                            Select Your Seats ({selectedSeats.length}/{totalPassengers})
                        </h3>

                        {loading ? (
                            <div className={cn('py-8', 'space-y-4')}>
                                <div className={cn('flex', 'items-center', 'justify-center', 'mb-4')}>
                                    <div className={cn('h-4', 'w-48', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
                                </div>
                                <div className={cn('grid', 'grid-cols-6', 'gap-2')}>
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <div key={i} className={cn('h-10', 'w-10', 'bg-gray-200', 'rounded-lg', 'animate-pulse')}></div>
                                    ))}
                                </div>
                            </div>
                        ) : error && availableSeats.length === 0 ? (
                            <div className={cn('text-center', 'py-6', 'bg-red-50', 'rounded-xl', 'border', 'border-red-200')}>
                                <p className={cn('text-red-600', 'mb-3')}>{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className={cn('px-4', 'py-2', 'bg-red-500', 'text-white', 'rounded-lg', 'hover:bg-red-600', 'transition-colors')}
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className={cn('mb-4', 'flex', 'items-center', 'justify-center', 'gap-6', 'text-sm')}>
                                    <div className={cn('flex', 'items-center', 'gap-2')}>
                                        <div className={cn('w-4', 'h-4', 'bg-green-500', 'rounded')}></div>
                                        <span>Selected</span>
                                    </div>
                                    <div className={cn('flex', 'items-center', 'gap-2')}>
                                        <div className={cn('w-4', 'h-4', 'bg-blue-200', 'rounded')}></div>
                                        <span>Available</span>
                                    </div>
                                    <div className={cn('flex', 'items-center', 'gap-2')}>
                                        <div className={cn('w-4', 'h-4', 'bg-red-200', 'rounded')}></div>
                                        <span>Occupied</span>
                                    </div>
                                </div>

                                <div className={cn('bg-white', 'p-4', 'rounded-xl', 'border', 'border-gray-200')}>
                                    <div className={cn('text-center', 'mb-4')}>
                                        <div className={cn('inline-block', 'bg-gray-800', 'text-white', 'px-4', 'py-1', 'rounded-full', 'text-xs', 'font-medium')}>
                                            ✈️ FRONT OF AIRCRAFT
                                        </div>
                                    </div>
                                    <div className={cn('grid', 'grid-cols-2', 'gap-3', 'max-w-[10rem]', 'mx-auto')}>
                                        {allSeats.map((seat) => (
                                            <SeatButton
                                                key={seat}
                                                seat={seat}
                                                isSelected={selectedSeats.includes(seat)}
                                                isAvailable={availableSeats.includes(seat)}
                                                onToggle={handleSeatToggle}
                                                disabled={selectedSeats.length >= totalPassengers && !selectedSeats.includes(seat)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price Summary */}
                    <div className={cn('bg-gradient-to-br', 'from-purple-50', 'to-pink-50', 'p-6', 'rounded-2xl', 'border', 'border-purple-200')}>
                        <h3 className={cn('text-lg', 'font-semibold', 'text-gray-800', 'mb-4')}>Price Breakdown</h3>
                        <div className="space-y-3">
                            <div className={cn('flex', 'justify-between', 'items-center')}>
                                <span className="text-gray-600">Base Price (Adults: {passengerData.adults})</span>
                                <span className="font-semibold">₹{(basePrice * passengerData.adults).toLocaleString('en-IN')}</span>
                            </div>
                            {passengerData.children > 0 && (
                                <div className={cn('flex', 'justify-between', 'items-center')}>
                                    <span className="text-gray-600">Children ({passengerData.children}) - 50% off</span>
                                    <span className="font-semibold">₹{(basePrice * passengerData.children * childDiscount).toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            {passengerData.infants > 0 && (
                                <div className={cn('flex', 'justify-between', 'items-center')}>
                                    <span className="text-gray-600">Infants ({passengerData.infants})</span>
                                    <span className="font-semibold">₹{(passengerData.infants * infantFee).toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className={cn('border-t', 'border-gray-300', 'pt-3')}>
                                <div className={cn('flex', 'justify-between', 'items-center', 'text-xl', 'font-bold')}>
                                    <span className="text-gray-800">Total Amount</span>
                                    <span className="text-green-600">₹{parseFloat(calculateTotalPrice).toLocaleString('en-IN')}</span>
                                </div>
                                <p className={cn('text-xs', 'text-gray-500', 'mt-1')}>✅ Includes all taxes and fees</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4')}>
                        <Link
                            href={bookingType === 'helicopter' ? "/helicopter-flight" : "/scheduled-flight"}
                            className={cn('flex-1', 'py-4', 'px-6', 'bg-gray-100', 'text-gray-700', 'rounded-2xl', 'text-lg', 'font-bold', 'hover:bg-gray-200', 'transition-colors', 'text-center')}
                        >
                            ← Back to {bookingType === 'helicopter' ? 'Helicopters' : 'Flights'}
                        </Link>
                        <button
                            onClick={handleConfirmBooking}
                            className={cn('flex-1', 'py-4', 'px-6', 'bg-gradient-to-r', 'from-green-600', 'to-blue-600', 'text-white', 'rounded-2xl', 'text-lg', 'font-bold', 'hover:from-green-700', 'hover:to-blue-700', 'transition-all', 'duration-200', 'shadow-lg', 'hover:shadow-xl', 'disabled:from-gray-400', 'disabled:to-gray-500', 'disabled:cursor-not-allowed')}
                            disabled={loading || (error && availableSeats.length === 0) || selectedSeats.length !== totalPassengers}
                        >
                            {loading ? (
                                <div className={cn('flex', 'items-center', 'justify-center', 'gap-3')}>
                                    <div className={cn('h-5', 'w-5', 'bg-white/30', 'rounded', 'animate-pulse')}></div>
                                    Processing...
                                </div>
                            ) : selectedSeats.length !== totalPassengers ? (
                                `Select ${totalPassengers - selectedSeats.length} more seat${totalPassengers - selectedSeats.length > 1 ? 's' : ''}`
                            ) : (
                                `🎫 Confirm Booking - ₹${parseFloat(calculateTotalPrice).toLocaleString('en-IN')}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookingPage = () => {
    return (
        <Suspense fallback={
            <div className={cn('min-h-screen', 'bg-gray-50', 'py-8', 'px-4')}>
                <div className={cn('max-w-7xl', 'mx-auto')}>
                    {/* Header Skeleton */}
                    <div className={cn('bg-gradient-to-r', 'from-gray-300', 'to-gray-400', 'p-6', 'rounded-t-3xl', 'animate-pulse')}>
                        <div className={cn('flex', 'items-center', 'justify-between')}>
                            <div>
                                <div className={cn('h-8', 'w-64', 'bg-gray-400', 'rounded', 'mb-2')}></div>
                                <div className={cn('h-4', 'w-48', 'bg-gray-400', 'rounded')}></div>
                            </div>
                            <div className={cn('h-12', 'w-32', 'bg-gray-400', 'rounded-full')}></div>
                        </div>
                    </div>
                    
                    <div className={cn('bg-white', 'rounded-b-3xl', 'shadow-xl', 'p-6', 'space-y-6')}>
                        {/* Flight Details Skeleton */}
                        <div className={cn('bg-gray-50', 'p-6', 'rounded-2xl')}>
                            <div className={cn('h-6', 'w-32', 'bg-gray-200', 'rounded', 'mb-4', 'animate-pulse')}></div>
                            <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4')}>
                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className={cn('flex', 'items-center', 'gap-3')}>
                                            <div className={cn('w-2', 'h-2', 'bg-gray-200', 'rounded-full', 'animate-pulse')}></div>
                                            <div className={cn('h-4', 'w-16', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
                                            <div className={cn('h-4', 'w-24', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <div key={i} className={cn('bg-gray-100', 'p-3', 'rounded-xl')}>
                                            <div className={cn('flex', 'items-center', 'justify-between')}>
                                                <div className={cn('h-4', 'w-20', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
                                                <div className={cn('h-6', 'w-16', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Passenger Details Skeleton */}
                        <div className={cn('bg-gray-50', 'p-6', 'rounded-2xl')}>
                            <div className={cn('h-6', 'w-40', 'bg-gray-200', 'rounded', 'mb-4', 'animate-pulse')}></div>
                            <div className={cn('grid', 'grid-cols-3', 'gap-4')}>
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className={cn('text-center', 'bg-white', 'p-4', 'rounded-xl')}>
                                        <div className={cn('h-8', 'w-8', 'bg-gray-200', 'rounded', 'mx-auto', 'mb-2', 'animate-pulse')}></div>
                                        <div className={cn('h-4', 'w-16', 'bg-gray-200', 'rounded', 'mx-auto', 'animate-pulse')}></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Seat Selection Skeleton */}
                        <div className={cn('bg-gray-50', 'p-6', 'rounded-2xl')}>
                            <div className={cn('h-6', 'w-48', 'bg-gray-200', 'rounded', 'mb-4', 'animate-pulse')}></div>
                            <div className={cn('py-8', 'space-y-4')}>
                                <div className={cn('flex', 'items-center', 'justify-center', 'mb-4')}>
                                    <div className={cn('h-4', 'w-48', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
                                </div>
                                <div className={cn('grid', 'grid-cols-2', 'gap-3', 'max-w-[10rem]', 'mx-auto')}>
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className={cn('h-12', 'bg-gray-200', 'rounded-lg', 'animate-pulse')}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4')}>
                            <div className={cn('flex-1', 'h-16', 'bg-gray-200', 'rounded-2xl', 'animate-pulse')}></div>
                            <div className={cn('flex-1', 'h-16', 'bg-gray-200', 'rounded-2xl', 'animate-pulse')}></div>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <BookingPageContent />
        </Suspense>
    );
};

export default BookingPage;