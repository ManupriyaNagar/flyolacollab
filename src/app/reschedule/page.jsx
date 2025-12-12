"use client";

import { cn } from "@/lib/utils";
import API from "@/services/api";
import {
  ArrowPathIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
const ReschedulePageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const bookingId = searchParams.get("bookingId");
  const pnr = searchParams.get("pnr");
  const bookingType = searchParams.get("type") || "flight";

  const [loading, setLoading] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [allSeats, setAllSeats] = useState([]);
  const [reschedulingFee, setReschedulingFee] = useState(0);

  useEffect(() => {
    if (bookingId) {
      fetchReschedulingDetails();
    }
  }, [bookingId]);

  // Refetch schedules when date changes
  useEffect(() => {
    if (bookingId && selectedDate && bookingDetails) {
      fetchSchedulesForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchReschedulingDetails = async () => {
    try {
      setLoading(true);
      const response = await API.rescheduling.getReschedulingDetails(bookingId, bookingType);
      
      if (response.data.success) {
        setBookingDetails(response.data.booking);
        setAvailableSchedules(response.data.availableSchedules);
        setReschedulingFee(response.data.reschedulingFee);
        setSelectedDate(response.data.booking.currentBookDate);
      }
    } catch (error) {
      console.error("Error fetching rescheduling details:", error);
      toast.error(error.response?.data?.error || "Failed to load rescheduling details");
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedulesForDate = async (date) => {
    try {
      setLoadingSchedules(true);
      const response = await API.rescheduling.getReschedulingDetails(bookingId, bookingType, date);
      
      if (response.data.success) {
        setAvailableSchedules(response.data.availableSchedules);
        // Reset selected schedule when date changes
        setSelectedSchedule(null);
        setSelectedSeats([]);
        setAvailableSeats([]);
        setAllSeats([]);
      }
    } catch (error) {
      console.error("Error fetching schedules for date:", error);
      toast.error(error.response?.data?.error || "Failed to load schedules for selected date");
    } finally {
      setLoadingSchedules(false);
    }
  };

  // Fetch available seats when a schedule is selected
  const fetchAvailableSeats = async (schedule) => {
    if (!schedule || !selectedDate) return;
    
    try {
      setLoadingSeats(true);
      
      // Generate all possible seats based on totalSeats
      const totalSeats = schedule.totalSeats || 6;
      const generatedAllSeats = Array.from({ length: totalSeats }, (_, i) => `S${i + 1}`);
      setAllSeats(generatedAllSeats);
      
      // Fetch available seats from API
      const response = bookingType === "helicopter"
        ? await API.bookings.getAvailableHelicopterSeats(schedule.id, selectedDate)
        : await API.bookings.getAvailableSeats(schedule.id, selectedDate);
      
      console.log("Available seats API response:", response);
      
      // The API returns { availableSeats: [...] } or { data: { availableSeats: [...] } }
      const seatsData = response?.availableSeats || response?.data?.availableSeats;
      
      if (seatsData && Array.isArray(seatsData)) {
        // Filter to only include valid seats from allSeats
        const validSeats = seatsData.filter(seat => generatedAllSeats.includes(seat));
        setAvailableSeats(validSeats);
        // Auto-select first available seats up to passenger count
        const autoSelected = validSeats.slice(0, bookingDetails.noOfPassengers);
        setSelectedSeats(autoSelected);
      } else {
        // Fallback: assume all seats are available
        console.warn("No availableSeats in response, using fallback");
        setAvailableSeats(generatedAllSeats);
        setSelectedSeats(generatedAllSeats.slice(0, bookingDetails.noOfPassengers));
      }
    } catch (error) {
      console.error("Error fetching available seats:", error);
      // Fallback on error
      const totalSeats = schedule.totalSeats || 6;
      const fallbackSeats = Array.from({ length: totalSeats }, (_, i) => `S${i + 1}`);
      setAllSeats(fallbackSeats);
      setAvailableSeats(fallbackSeats);
      setSelectedSeats(fallbackSeats.slice(0, bookingDetails.noOfPassengers));
    } finally {
      setLoadingSeats(false);
    }
  };

  // Handle schedule selection
  const handleScheduleSelect = (schedule) => {
    // Check if enough seats are available for all passengers
    if (schedule.availableSeats >= bookingDetails.noOfPassengers) {
      setSelectedSchedule(schedule);
      setSelectedSeats([]);
      fetchAvailableSeats(schedule);
    } else if (schedule.availableSeats > 0) {
      toast.error(`Only ${schedule.availableSeats} seat(s) available, but you need ${bookingDetails.noOfPassengers} seat(s)`);
    }
  };

  // Handle seat toggle
  const handleSeatToggle = (seat) => {
    if (!availableSeats.includes(seat)) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seat)) {
        return prev.filter(s => s !== seat);
      } else if (prev.length < bookingDetails.noOfPassengers) {
        return [...prev, seat];
      }
      return prev;
    });
  };

  // Calculate payment amount
  const calculatePaymentAmount = () => {
    if (!selectedSchedule || !bookingDetails) return { total: 0, reschedulingFee: 0, fareDifference: 0 };
    
    const originalFare = parseFloat(bookingDetails.totalFare);
    const newFare = parseFloat(selectedSchedule.price) * bookingDetails.noOfPassengers;
    const fee = originalFare * 0.10; // 10% rescheduling fee
    const fareDiff = newFare - originalFare;
    const total = fee + (fareDiff > 0 ? fareDiff : 0);
    
    return {
      originalFare,
      newFare,
      reschedulingFee: fee,
      fareDifference: fareDiff,
      total
    };
  };

  const paymentInfo = calculatePaymentAmount();

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleReschedule = async () => {
    if (!selectedSchedule) {
      toast.error("Please select a new schedule");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    if (selectedSeats.length !== bookingDetails.noOfPassengers) {
      toast.error(`Please select ${bookingDetails.noOfPassengers} seat(s)`);
      return;
    }

    try {
      setRescheduling(true);

      // First, create payment order to check if payment is required
      const orderResponse = await API.rescheduling.createReschedulingOrder(bookingId, {
        bookingType,
        newScheduleId: selectedSchedule.id
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.error || "Failed to create order");
      }

      // If no payment required (downgrade or same price), proceed directly
      if (!orderResponse.data.paymentRequired) {
        const rescheduleData = {
          newScheduleId: selectedSchedule.id,
          newBookDate: selectedDate,
          newSeatLabels: selectedSeats
        };

        const response = bookingType === "helicopter"
          ? await API.rescheduling.rescheduleHelicopterBooking(bookingId, rescheduleData)
          : await API.rescheduling.rescheduleFlightBooking(bookingId, rescheduleData);

        if (response.data.success) {
          toast.success("Booking rescheduled successfully!");
          router.push(`/user-dashboard/${bookingType === "helicopter" ? "helicopter-" : ""}bookings`);
        }
        return;
      }

      // Payment required - load Razorpay
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(orderResponse.data.amount * 100),
        currency: orderResponse.data.currency,
        name: "Flyola Aviation",
        description: `Rescheduling Fee - PNR: ${pnr}`,
        order_id: orderResponse.data.orderId,
        handler: async function (response) {
          try {
            // Verify payment and complete rescheduling
            const verifyResponse = await API.rescheduling.verifyReschedulingPayment(bookingId, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingType,
              newScheduleId: selectedSchedule.id,
              newBookDate: selectedDate,
              newSeatLabels: selectedSeats
            });

            if (verifyResponse.data.success) {
              toast.success("Payment successful! Booking rescheduled.");
              router.push(`/user-dashboard/${bookingType === "helicopter" ? "helicopter-" : ""}bookings`);
            } else {
              throw new Error(verifyResponse.data.error || "Payment verification failed");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: bookingDetails?.passengerName || "",
          email: bookingDetails?.email || "",
          contact: bookingDetails?.phone || ""
        },
        theme: {
          color: "#EA580C"
        },
        modal: {
          ondismiss: function () {
            setRescheduling(false);
            toast.info("Payment cancelled");
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Error rescheduling booking:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to reschedule booking");
      setRescheduling(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <div className={cn('w-16', 'h-16', 'border-4', 'border-orange-600', 'border-t-transparent', 'rounded-full', 'animate-spin', 'mx-auto', 'mb-4')}></div>
          <p className="text-gray-600">Loading rescheduling options...</p>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className={cn('text-center', 'p-8', 'bg-white', 'rounded-xl', 'shadow-lg', 'max-w-md')}>
          <ExclamationTriangleIcon className={cn('w-16', 'h-16', 'text-red-600', 'mx-auto', 'mb-4')} />
          <h2 className={cn('text-2xl', 'font-bold', 'text-gray-800', 'mb-4')}>Booking Not Found</h2>
          <p className={cn('text-gray-600', 'mb-6')}>Unable to load booking details.</p>
          <button
            onClick={() => router.back()}
            className={cn('px-6', 'py-3', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700')}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-gray-50', 'py-8', 'px-4')}>
      <div className={cn('max-w-6xl', 'mx-auto')}>
        {/* Header */}
        <div className={cn('bg-white', 'rounded-xl', 'shadow-lg', 'p-6', 'mb-6')}>
          <div className={cn('flex', 'items-center', 'gap-4', 'mb-4')}>
            <ArrowPathIcon className={cn('w-8', 'h-8', 'text-orange-600')} />
            <div>
              <h1 className={cn('text-2xl', 'font-bold', 'text-gray-800')}>Reschedule Booking</h1>
              <p className="text-gray-600">PNR: {pnr} | Booking #{bookingDetails.bookingNo}</p>
            </div>
          </div>

          {/* Warning */}
          <div className={cn('bg-orange-50', 'border', 'border-orange-200', 'rounded-lg', 'p-4')}>
            <div className={cn('flex', 'gap-3')}>
              <ExclamationTriangleIcon className={cn('w-6', 'h-6', 'text-orange-600', 'flex-shrink-0')} />
              <div className={cn('text-sm', 'text-orange-800')}>
                <p className={cn('font-semibold', 'mb-1')}>Important Information:</p>
                <ul className={cn('list-disc', 'list-inside', 'space-y-1')}>
                  <li>Rescheduling fee: ₹{reschedulingFee.toLocaleString()} (10% of booking amount)</li>
                  <li>Rescheduled bookings are non-refundable</li>
                  <li>Rescheduling must be done at least 24 hours before departure</li>
                  <li>Fare difference (if any) will be charged</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Current Booking Details */}
        <div className={cn('bg-white', 'rounded-xl', 'shadow-lg', 'p-6', 'mb-6')}>
          <h2 className={cn('text-xl', 'font-bold', 'text-gray-800', 'mb-4')}>Current Booking</h2>
          
          {/* Current Route */}
          {bookingDetails.currentRoute && (
            <div className={cn('mb-4', 'p-4', 'bg-blue-50', 'rounded-lg', 'border', 'border-blue-200')}>
              <p className={cn('text-sm', 'font-medium', 'text-blue-800', 'mb-2')}>Booked Route:</p>
              <div className={cn('flex', 'items-center', 'gap-3')}>
                <div className={cn('flex', 'items-center', 'gap-2')}>
                  <span className={cn('font-bold', 'text-blue-900')}>
                    {bookingDetails.currentRoute.from?.name || 'Unknown'}
                  </span>
                  <span className={cn('text-xs', 'text-blue-700', 'bg-blue-100', 'px-2', 'py-1', 'rounded')}>
                    {bookingDetails.currentRoute.from?.code || 'N/A'}
                  </span>
                </div>
                <svg className={cn('w-6', 'h-6', 'text-blue-600')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className={cn('flex', 'items-center', 'gap-2')}>
                  <span className={cn('font-bold', 'text-blue-900')}>
                    {bookingDetails.currentRoute.to?.name || 'Unknown'}
                  </span>
                  <span className={cn('text-xs', 'text-blue-700', 'bg-blue-100', 'px-2', 'py-1', 'rounded')}>
                    {bookingDetails.currentRoute.to?.code || 'N/A'}
                  </span>
                </div>
              </div>
              <p className={cn('text-xs', 'text-blue-600', 'mt-2')}>
                You can only reschedule to flights on the same route
              </p>
            </div>
          )}

          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4')}>
            <div className={cn('flex', 'items-center', 'gap-3')}>
              <CalendarDaysIcon className={cn('w-6', 'h-6', 'text-blue-600')} />
              <div>
                <p className={cn('text-sm', 'text-gray-600')}>Date</p>
                <p className="font-semibold">{bookingDetails.currentBookDate}</p>
              </div>
            </div>
            <div className={cn('flex', 'items-center', 'gap-3')}>
              <CurrencyRupeeIcon className={cn('w-6', 'h-6', 'text-green-600')} />
              <div>
                <p className={cn('text-sm', 'text-gray-600')}>Total Fare</p>
                <p className="font-semibold">₹{parseFloat(bookingDetails.totalFare).toLocaleString()}</p>
              </div>
            </div>
            <div className={cn('flex', 'items-center', 'gap-3')}>
              <ClockIcon className={cn('w-6', 'h-6', 'text-purple-600')} />
              <div>
                <p className={cn('text-sm', 'text-gray-600')}>Passengers</p>
                <p className="font-semibold">{bookingDetails.noOfPassengers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Schedules */}
        <div className={cn('bg-white', 'rounded-xl', 'shadow-lg', 'p-6', 'mb-6')}>
          <h2 className={cn('text-xl', 'font-bold', 'text-gray-800', 'mb-4')}>Select New Schedule</h2>
          
          {/* Date Selector */}
          <div className="mb-6">
            <label className={cn('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2')}>
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={cn('w-full', 'px-4', 'py-2', 'border', 'border-gray-300', 'rounded-lg', 'focus:ring-2', 'focus:ring-orange-500')}
            />
          </div>

          {/* Schedule Options */}
          {loadingSchedules ? (
            <div className={cn('text-center', 'py-12')}>
              <div className={cn('w-12', 'h-12', 'border-4', 'border-orange-600', 'border-t-transparent', 'rounded-full', 'animate-spin', 'mx-auto', 'mb-4')}></div>
              <p className="text-gray-600">Loading schedules...</p>
            </div>
          ) : availableSchedules.length === 0 ? (
            <div className={cn('text-center', 'py-12', 'bg-gray-50', 'rounded-lg')}>
              <p className="text-gray-600">No schedules available for the selected date.</p>
              <p className={cn('text-sm', 'text-gray-500', 'mt-2')}>Please try a different date.</p>
            </div>
          ) : (
            <>
              {/* Warning if all schedules don't have enough seats */}
              {availableSchedules.every(s => s.availableSeats < bookingDetails?.noOfPassengers) && (
                <div className={cn('mb-4', 'p-4', 'bg-red-50', 'border', 'border-red-200', 'rounded-lg')}>
                  <div className={cn('flex', 'items-start', 'gap-3')}>
                    <ExclamationTriangleIcon className={cn('w-6', 'h-6', 'text-red-600', 'flex-shrink-0', 'mt-0.5')} />
                    <div>
                      <p className={cn('font-semibold', 'text-red-800')}>No Suitable Flights Available</p>
                      <p className={cn('text-sm', 'text-red-700', 'mt-1')}>
                        No flights have enough seats for {bookingDetails?.noOfPassengers} passenger(s) on this date. 
                        Please try selecting a different date.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
              {availableSchedules.map((schedule) => {
                const notEnoughSeats = schedule.availableSeats < bookingDetails?.noOfPassengers;
                const isSoldOut = schedule.availableSeats === 0;
                const isDisabled = isSoldOut || notEnoughSeats;
                
                return (
                <div
                  key={schedule.id}
                  onClick={() => handleScheduleSelect(schedule)}
                  className={`p-5 border-2 rounded-lg transition-all ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed bg-gray-50'
                      : selectedSchedule?.id === schedule.id
                      ? 'border-orange-600 bg-orange-50 cursor-pointer'
                      : 'border-gray-200 hover:border-orange-300 cursor-pointer hover:shadow-md'
                  }`}
                >
                  {/* Route Information */}
                  <div className={cn('flex', 'items-center', 'gap-3', 'mb-3')}>
                    <div className={cn('flex', 'items-center', 'gap-2')}>
                      <span className={cn('text-sm', 'font-medium', 'text-gray-500')}>From:</span>
                      <span className={cn('font-bold', 'text-gray-800')}>
                        {schedule.departureLocation?.name || 'Unknown'}
                      </span>
                      <span className={cn('text-xs', 'text-gray-500', 'bg-gray-100', 'px-2', 'py-1', 'rounded')}>
                        {schedule.departureLocation?.code || 'N/A'}
                      </span>
                    </div>
                    <svg className={cn('w-5', 'h-5', 'text-gray-400')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className={cn('flex', 'items-center', 'gap-2')}>
                      <span className={cn('text-sm', 'font-medium', 'text-gray-500')}>To:</span>
                      <span className={cn('font-bold', 'text-gray-800')}>
                        {schedule.arrivalLocation?.name || 'Unknown'}
                      </span>
                      <span className={cn('text-xs', 'text-gray-500', 'bg-gray-100', 'px-2', 'py-1', 'rounded')}>
                        {schedule.arrivalLocation?.code || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Time and Price */}
                  <div className={cn('flex', 'justify-between', 'items-center')}>
                    <div className="flex-1">
                      <p className={cn('font-semibold', 'text-lg', 'text-gray-800')}>
                        {schedule.departureTime} - {schedule.arrivalTime}
                      </p>
                      <div className={cn('flex', 'items-center', 'gap-4', 'mt-2')}>
                        <p className={`text-sm font-medium ${
                          schedule.availableSeats === 0 
                            ? 'text-red-600' 
                            : schedule.availableSeats < 5 
                            ? 'text-orange-600' 
                            : 'text-green-600'
                        }`}>
                          {schedule.availableSeats === 0 
                            ? 'Sold Out' 
                            : `${schedule.availableSeats} seats available`}
                        </p>
                        {schedule.totalSeats > 0 && (
                          <p className={cn('text-xs', 'text-gray-500')}>
                            ({schedule.bookedSeats}/{schedule.totalSeats} booked)
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn('text-2xl', 'font-bold', 'text-gray-800')}>
                        ₹{parseFloat(schedule.price).toLocaleString()}
                      </p>
                      <p className={cn('text-sm', 'text-gray-600')}>per person</p>
                    </div>
                  </div>

                  {/* Sold Out / Not Enough Seats Overlay */}
                  {isDisabled && (
                    <div className={cn('mt-3', 'text-center')}>
                      <span className={cn('inline-block', 'bg-red-100', 'text-red-700', 'px-4', 'py-1', 'rounded-full', 'text-sm', 'font-semibold')}>
                        {isSoldOut 
                          ? 'No seats available' 
                          : `Only ${schedule.availableSeats} seat(s) - Need ${bookingDetails?.noOfPassengers}`}
                      </span>
                    </div>
                  )}
                </div>
              );
              })}
            </div>
          </>
          )}
        </div>

        {/* Seat Selection */}
        {selectedSchedule && (
          <div className={cn('bg-white', 'rounded-xl', 'shadow-lg', 'p-6', 'mb-6')}>
            <h2 className={cn('text-xl', 'font-bold', 'text-gray-800', 'mb-4')}>Select Seats</h2>
            <p className={cn('text-sm', 'text-gray-600', 'mb-4')}>
              Select {bookingDetails.noOfPassengers} seat(s) - {selectedSeats.length}/{bookingDetails.noOfPassengers} selected
            </p>
            
            {loadingSeats ? (
              <div className={cn('py-8', 'space-y-4')}>
                <div className={cn('flex', 'items-center', 'justify-center', 'mb-4')}>
                  <div className={cn('h-4', 'w-48', 'bg-gray-200', 'rounded', 'animate-pulse')}></div>
                </div>
                <div className={cn('grid', 'grid-cols-3', 'gap-3', 'max-w-xs', 'mx-auto')}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={cn('h-12', 'bg-gray-200', 'rounded-lg', 'animate-pulse')}></div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* Legend */}
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

                {/* Seat Grid */}
                <div className={cn('bg-gray-50', 'p-4', 'rounded-xl', 'border', 'border-gray-200')}>
                  <div className={cn('text-center', 'mb-4')}>
                    <div className={cn('inline-block', 'bg-gray-800', 'text-white', 'px-4', 'py-1', 'rounded-full', 'text-xs', 'font-medium')}>
                      ✈️ FRONT OF AIRCRAFT
                    </div>
                  </div>
                  <div className={cn('grid', 'grid-cols-2', 'gap-3', 'max-w-xs', 'mx-auto')}>
                    {allSeats.map((seat) => {
                      const isSelected = selectedSeats.includes(seat);
                      const isAvailable = availableSeats.includes(seat);
                      const isDisabled = !isAvailable || (selectedSeats.length >= bookingDetails.noOfPassengers && !isSelected);
                      
                      return (
                        <button
                          key={seat}
                          onClick={() => handleSeatToggle(seat)}
                          disabled={isDisabled}
                          className={cn(
                            'h-12', 'rounded-lg', 'text-sm', 'font-bold', 'transition-colors', 'duration-150',
                            isSelected && 'bg-green-500 text-white shadow-md',
                            !isSelected && isAvailable && 'bg-blue-200 text-gray-800 hover:bg-blue-300',
                            !isAvailable && 'bg-red-200 text-gray-500 cursor-not-allowed'
                          )}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected seats summary */}
                {selectedSeats.length > 0 && (
                  <div className={cn('mt-4', 'p-3', 'bg-green-50', 'border', 'border-green-200', 'rounded-lg')}>
                    <p className={cn('text-sm', 'text-green-800')}>
                      <span className={cn('font-semibold')}>Selected seats:</span> {selectedSeats.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Payment Summary */}
        {selectedSchedule && selectedSeats.length === bookingDetails?.noOfPassengers && (
          <div className={cn('bg-white', 'rounded-xl', 'shadow-lg', 'p-6', 'mb-6')}>
            <h2 className={cn('text-xl', 'font-bold', 'text-gray-800', 'mb-4')}>Payment Summary</h2>
            <div className={cn('space-y-3')}>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <span className={cn('text-gray-600')}>Original Fare</span>
                <span className={cn('font-semibold')}>₹{paymentInfo.originalFare?.toLocaleString('en-IN')}</span>
              </div>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <span className={cn('text-gray-600')}>New Fare ({bookingDetails.noOfPassengers} × ₹{parseFloat(selectedSchedule.price).toLocaleString('en-IN')})</span>
                <span className={cn('font-semibold')}>₹{paymentInfo.newFare?.toLocaleString('en-IN')}</span>
              </div>
              <div className={cn('flex', 'justify-between', 'items-center')}>
                <span className={cn('text-gray-600')}>Rescheduling Fee (10%)</span>
                <span className={cn('font-semibold', 'text-orange-600')}>₹{paymentInfo.reschedulingFee?.toLocaleString('en-IN')}</span>
              </div>
              {paymentInfo.fareDifference > 0 && (
                <div className={cn('flex', 'justify-between', 'items-center')}>
                  <span className={cn('text-gray-600')}>Fare Difference</span>
                  <span className={cn('font-semibold', 'text-orange-600')}>₹{paymentInfo.fareDifference?.toLocaleString('en-IN')}</span>
                </div>
              )}
              {paymentInfo.fareDifference < 0 && (
                <div className={cn('flex', 'justify-between', 'items-center')}>
                  <span className={cn('text-gray-600')}>Fare Difference (No refund)</span>
                  <span className={cn('font-semibold', 'text-gray-400')}>-₹{Math.abs(paymentInfo.fareDifference)?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className={cn('border-t', 'border-gray-200', 'pt-3', 'mt-3')}>
                <div className={cn('flex', 'justify-between', 'items-center', 'text-lg')}>
                  <span className={cn('font-bold', 'text-gray-800')}>Total Payment Required</span>
                  <span className={cn('font-bold', 'text-green-600')}>
                    {paymentInfo.total > 0 ? `₹${paymentInfo.total?.toLocaleString('en-IN')}` : 'No payment required'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={cn('flex', 'gap-4')}>
          <button
            onClick={() => router.back()}
            className={cn('flex-1', 'px-6', 'py-3', 'bg-gray-500', 'text-white', 'rounded-lg', 'hover:bg-gray-600', 'transition-colors')}
          >
            Cancel
          </button>
          <button
            onClick={handleReschedule}
            disabled={rescheduling || !selectedSchedule || selectedSeats.length !== bookingDetails?.noOfPassengers}
            className={cn('flex-1', 'px-6', 'py-3', 'bg-orange-600', 'text-white', 'rounded-lg', 'hover:bg-orange-700', 'transition-colors', 'disabled:opacity-50', 'disabled:cursor-not-allowed', 'flex', 'items-center', 'justify-center', 'gap-2')}
          >
            {rescheduling ? (
              <>
                <div className={cn('w-5', 'h-5', 'border-2', 'border-white', 'border-t-transparent', 'rounded-full', 'animate-spin')}></div>
                Processing...
              </>
            ) : selectedSeats.length !== bookingDetails?.noOfPassengers ? (
              <>
                <ArrowPathIcon className={cn('w-5', 'h-5')} />
                Select {bookingDetails?.noOfPassengers - selectedSeats.length} more seat(s)
              </>
            ) : paymentInfo.total > 0 ? (
              <>
                <CurrencyRupeeIcon className={cn('w-5', 'h-5')} />
                Pay ₹{paymentInfo.total?.toLocaleString('en-IN')} & Reschedule
              </>
            ) : (
              <>
                <ArrowPathIcon className={cn('w-5', 'h-5')} />
                Confirm Reschedule
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ReschedulePage() {
  return (
    <Suspense fallback={
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <div className={cn('w-16', 'h-16', 'border-4', 'border-orange-600', 'border-t-transparent', 'rounded-full', 'animate-spin', 'mx-auto', 'mb-4')}></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ReschedulePageContent />
    </Suspense>
  );
}
