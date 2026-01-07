"use client";

import { cn } from "@/lib/utils";
import API from "@/services/api";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AdminReschedulePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingType, setBookingType] = useState("flight"); // flight or helicopter
  const [loading, setLoading] = useState(false);
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
  const [waiveFee, setWaiveFee] = useState(false);

  const searchBooking = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a PNR");
      return;
    }

    try {
      setLoading(true);
      setBookingDetails(null);
      setAvailableSchedules([]);
      setSelectedSchedule(null);
      
      const response = await API.rescheduling.getReschedulingDetails(searchQuery, bookingType);
      
      if (response.data.success) {
        setBookingDetails(response.data.booking);
        setAvailableSchedules(response.data.availableSchedules);
        setSelectedDate(response.data.booking.currentBookDate);
        toast.success("Booking found!");
      }
    } catch (error) {
      console.error("Error searching booking:", error);
      toast.error(error.response?.data?.error || "Booking not found");
    } finally {
      setLoading(false);
    }
  };


  const fetchSchedulesForDate = async (date) => {
    if (!bookingDetails) return;
    
    try {
      setLoadingSchedules(true);
      const response = await API.rescheduling.getReschedulingDetails(
        bookingDetails.pnr, 
        bookingDetails.bookingType, 
        date
      );
      
      if (response.data.success) {
        setAvailableSchedules(response.data.availableSchedules);
        setSelectedSchedule(null);
        setSelectedSeats([]);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to load schedules");
    } finally {
      setLoadingSchedules(false);
    }
  };

  const fetchAvailableSeats = async (schedule) => {
    if (!schedule || !selectedDate) return;
    
    try {
      setLoadingSeats(true);
      
      const totalSeats = schedule.totalSeats || 6;
      const generatedAllSeats = Array.from({ length: totalSeats }, (_, i) => `S${i + 1}`);
      setAllSeats(generatedAllSeats);
      
      const response = bookingType === "helicopter"
        ? await API.bookings.getAvailableHelicopterSeats(schedule.id, selectedDate)
        : await API.bookings.getAvailableSeats(schedule.id, selectedDate);
      
      const seatsData = response?.availableSeats || response?.data?.availableSeats;
      
      if (seatsData && Array.isArray(seatsData)) {
        const validSeats = seatsData.filter(seat => generatedAllSeats.includes(seat));
        setAvailableSeats(validSeats);
        const autoSelected = validSeats.slice(0, bookingDetails.noOfPassengers);
        setSelectedSeats(autoSelected);
      } else {
        setAvailableSeats(generatedAllSeats);
        setSelectedSeats(generatedAllSeats.slice(0, bookingDetails.noOfPassengers));
      }
    } catch (error) {
      console.error("Error fetching seats:", error);
      const totalSeats = schedule.totalSeats || 6;
      const fallbackSeats = Array.from({ length: totalSeats }, (_, i) => `S${i + 1}`);
      setAllSeats(fallbackSeats);
      setAvailableSeats(fallbackSeats);
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleScheduleSelect = (schedule) => {
    if (schedule.availableSeats >= bookingDetails.noOfPassengers) {
      setSelectedSchedule(schedule);
      setSelectedSeats([]);
      fetchAvailableSeats(schedule);
    } else if (schedule.availableSeats > 0) {
      toast.error(`Only ${schedule.availableSeats} seat(s) available, need ${bookingDetails.noOfPassengers}`);
    }
  };

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

  const handleAdminReschedule = async () => {
    if (!selectedSchedule || !selectedDate || selectedSeats.length !== bookingDetails.noOfPassengers) {
      toast.error("Please complete all selections");
      return;
    }

    try {
      setRescheduling(true);

      const response = await API.rescheduling.adminReschedule(bookingDetails.pnr, {
        bookingType: bookingDetails.bookingType,
        newScheduleId: selectedSchedule.id,
        newBookDate: selectedDate,
        newSeatLabels: selectedSeats,
        waiveFee: waiveFee
      });

      if (response.data.success) {
        toast.success("Booking rescheduled successfully!");
        // Reset form
        setBookingDetails(null);
        setAvailableSchedules([]);
        setSelectedSchedule(null);
        setSelectedSeats([]);
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Error rescheduling:", error);
      toast.error(error.response?.data?.error || "Failed to reschedule");
    } finally {
      setRescheduling(false);
    }
  };

  // Calculate payment info
  const calculatePayment = () => {
    if (!selectedSchedule || !bookingDetails) return null;
    
    const originalFare = parseFloat(bookingDetails.totalFare);
    const newFare = parseFloat(selectedSchedule.price) * bookingDetails.noOfPassengers;
    const reschedulingFee = waiveFee ? 0 : originalFare * 0.10;
    const fareDifference = newFare - originalFare;
    const total = waiveFee ? 0 : (reschedulingFee + (fareDifference > 0 ? fareDifference : 0));
    
    return { originalFare, newFare, reschedulingFee, fareDifference, total };
  };

  const paymentInfo = calculatePayment();


  return (
    <div className={cn("min-h-screen", "bg-gray-50", "p-6")}>
      <div className={cn("max-w-6xl", "mx-auto")}>
        {/* Header */}
        <div className={cn("bg-white", "rounded-xl", "shadow-lg", "p-6", "mb-6")}>
          <div className={cn("flex", "items-center", "gap-4")}>
            <ArrowPathIcon className={cn("w-8", "h-8", "text-orange-600")} />
            <div>
              <h1 className={cn("text-2xl", "font-bold", "text-gray-800")}>Admin Reschedule Booking</h1>
              <p className={cn("text-gray-600")}>Reschedule bookings without payment gateway</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className={cn("bg-white", "rounded-xl", "shadow-lg", "p-6", "mb-6")}>
          <h2 className={cn("text-lg", "font-semibold", "text-gray-800", "mb-4")}>Search Booking</h2>
          
          <div className={cn("grid", "grid-cols-1", "md:grid-cols-3", "gap-4", "mb-4")}>
            <div>
              <label className={cn("block", "text-sm", "font-medium", "text-gray-700", "mb-1")}>Booking Type</label>
              <select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value)}
                className={cn("w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-lg")}
              >
                <option value="flight">Flight</option>
                <option value="helicopter">Helicopter</option>
              </select>
            </div>
            
            <div>
              <label className={cn("block", "text-sm", "font-medium", "text-gray-700", "mb-1")}>PNR</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                placeholder="Enter PNR (e.g., FLY123ABC)"
                className={cn("w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-lg")}
                onKeyPress={(e) => e.key === "Enter" && searchBooking()}
              />
            </div>
            
            <div className={cn("flex", "items-end")}>
              <button
                onClick={searchBooking}
                disabled={loading}
                className={cn("w-full", "px-4", "py-2", "bg-blue-600", "text-white", "rounded-lg", "hover:bg-blue-700", "disabled:opacity-50", "flex", "items-center", "justify-center", "gap-2")}
              >
                {loading ? (
                  <div className={cn("w-5", "h-5", "border-2", "border-white", "border-t-transparent", "rounded-full", "animate-spin")}></div>
                ) : (
                  <>
                    <MagnifyingGlassIcon className={cn("w-5", "h-5")} />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        {bookingDetails && (
          <>
            <div className={cn("bg-white", "rounded-xl", "shadow-lg", "p-6", "mb-6")}>
              <h2 className={cn("text-lg", "font-semibold", "text-gray-800", "mb-4")}>Current Booking</h2>
              
              <div className={cn("grid", "grid-cols-2", "md:grid-cols-4", "gap-4")}>
                <div>
                  <p className={cn("text-sm", "text-gray-600")}>PNR</p>
                  <p className={cn("font-semibold")}>{bookingDetails.pnr}</p>
                </div>
                <div>
                  <p className={cn("text-sm", "text-gray-600")}>Booking No</p>
                  <p className={cn("font-semibold")}>{bookingDetails.bookingNo}</p>
                </div>
                <div>
                  <p className={cn("text-sm", "text-gray-600")}>Date</p>
                  <p className={cn("font-semibold")}>{bookingDetails.currentBookDate}</p>
                </div>
                <div>
                  <p className={cn("text-sm", "text-gray-600")}>Passengers</p>
                  <p className={cn("font-semibold")}>{bookingDetails.noOfPassengers}</p>
                </div>
                <div>
                  <p className={cn("text-sm", "text-gray-600")}>Total Fare</p>
                  <p className={cn("font-semibold", "text-green-600")}>₹{parseFloat(bookingDetails.totalFare).toLocaleString()}</p>
                </div>
                <div>
                  <p className={cn("text-sm", "text-gray-600")}>Route</p>
                  <p className={cn("font-semibold")}>{bookingDetails.currentRoute?.from?.name} → {bookingDetails.currentRoute?.to?.name}</p>
                </div>
              </div>
            </div>

            {/* Schedule Selection */}
            <div className={cn("bg-white", "rounded-xl", "shadow-lg", "p-6", "mb-6")}>
              <h2 className={cn("text-lg", "font-semibold", "text-gray-800", "mb-4")}>Select New Schedule</h2>
              
              <div className={cn("mb-4")}>
                <label className={cn("block", "text-sm", "font-medium", "text-gray-700", "mb-1")}>Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    fetchSchedulesForDate(e.target.value);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className={cn("w-full", "md:w-64", "px-3", "py-2", "border", "border-gray-300", "rounded-lg")}
                />
              </div>

              {loadingSchedules ? (
                <div className={cn("text-center", "py-8")}>
                  <div className={cn("w-8", "h-8", "border-4", "border-orange-600", "border-t-transparent", "rounded-full", "animate-spin", "mx-auto")}></div>
                </div>
              ) : availableSchedules.length === 0 ? (
                <p className={cn("text-gray-500", "text-center", "py-8")}>No schedules available for this date</p>
              ) : (
                <div className={cn("space-y-3")}>
                  {availableSchedules.map((schedule) => {
                    const notEnoughSeats = schedule.availableSeats < bookingDetails.noOfPassengers;
                    const isDisabled = schedule.availableSeats === 0 || notEnoughSeats;
                    
                    return (
                      <div
                        key={schedule.id}
                        onClick={() => !isDisabled && handleScheduleSelect(schedule)}
                        className={cn(
                          "p-4", "border-2", "rounded-lg", "transition-all",
                          isDisabled ? "opacity-50 cursor-not-allowed bg-gray-50" :
                          selectedSchedule?.id === schedule.id ? "border-orange-600 bg-orange-50 cursor-pointer" :
                          "border-gray-200 hover:border-orange-300 cursor-pointer"
                        )}
                      >
                        <div className={cn("flex", "justify-between", "items-center")}>
                          <div>
                            <p className={cn("font-semibold")}>{schedule.departureTime} - {schedule.arrivalTime}</p>
                            <p className={cn("text-sm", schedule.availableSeats < 3 ? "text-orange-600" : "text-green-600")}>
                              {schedule.availableSeats} seats available
                            </p>
                          </div>
                          <div className={cn("text-right")}>
                            <p className={cn("text-xl", "font-bold")}>₹{parseFloat(schedule.price).toLocaleString()}</p>
                            <p className={cn("text-sm", "text-gray-500")}>per person</p>
                          </div>
                        </div>
                        {notEnoughSeats && (
                          <p className={cn("text-red-600", "text-sm", "mt-2")}>
                            Need {bookingDetails.noOfPassengers} seats, only {schedule.availableSeats} available
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>


            {/* Seat Selection */}
            {selectedSchedule && (
              <div className={cn("bg-white", "rounded-xl", "shadow-lg", "p-6", "mb-6")}>
                <h2 className={cn("text-lg", "font-semibold", "text-gray-800", "mb-4")}>
                  Select Seats ({selectedSeats.length}/{bookingDetails.noOfPassengers})
                </h2>
                
                {loadingSeats ? (
                  <div className={cn("text-center", "py-8")}>
                    <div className={cn("w-8", "h-8", "border-4", "border-orange-600", "border-t-transparent", "rounded-full", "animate-spin", "mx-auto")}></div>
                  </div>
                ) : (
                  <div>
                    <div className={cn("flex", "gap-4", "mb-4", "text-sm")}>
                      <div className={cn("flex", "items-center", "gap-2")}>
                        <div className={cn("w-4", "h-4", "bg-green-500", "rounded")}></div>
                        <span>Selected</span>
                      </div>
                      <div className={cn("flex", "items-center", "gap-2")}>
                        <div className={cn("w-4", "h-4", "bg-blue-200", "rounded")}></div>
                        <span>Available</span>
                      </div>
                      <div className={cn("flex", "items-center", "gap-2")}>
                        <div className={cn("w-4", "h-4", "bg-red-200", "rounded")}></div>
                        <span>Occupied</span>
                      </div>
                    </div>
                    
                    <div className={cn("grid", "grid-cols-6", "gap-2", "max-w-md")}>
                      {allSeats.map((seat) => {
                        const isSelected = selectedSeats.includes(seat);
                        const isAvailable = availableSeats.includes(seat);
                        
                        return (
                          <button
                            key={seat}
                            onClick={() => handleSeatToggle(seat)}
                            disabled={!isAvailable}
                            className={cn(
                              "h-12", "rounded-lg", "font-bold", "transition-colors",
                              isSelected ? "bg-green-500 text-white" :
                              isAvailable ? "bg-blue-200 hover:bg-blue-300" :
                              "bg-red-200 cursor-not-allowed"
                            )}
                          >
                            {seat}
                          </button>
                        );
                      })}
                    </div>
                    
                    {selectedSeats.length > 0 && (
                      <p className={cn("mt-4", "text-green-700")}>
                        Selected: {selectedSeats.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Waive Fee Option & Summary */}
            {selectedSchedule && selectedSeats.length === bookingDetails.noOfPassengers && (
              <div className={cn("bg-white", "rounded-xl", "shadow-lg", "p-6", "mb-6")}>
                <h2 className={cn("text-lg", "font-semibold", "text-gray-800", "mb-4")}>Payment Summary</h2>
                
                {/* Waive Fee Toggle */}
                <div className={cn("mb-4", "p-4", "bg-yellow-50", "border", "border-yellow-200", "rounded-lg")}>
                  <label className={cn("flex", "items-center", "gap-3", "cursor-pointer")}>
                    <input
                      type="checkbox"
                      checked={waiveFee}
                      onChange={(e) => setWaiveFee(e.target.checked)}
                      className={cn("w-5", "h-5", "rounded")}
                    />
                    <span className={cn("font-medium", "text-yellow-800")}>
                      Waive rescheduling fee and fare difference (Admin privilege)
                    </span>
                  </label>
                </div>
                
                {paymentInfo && (
                  <div className={cn("space-y-2")}>
                    <div className={cn("flex", "justify-between")}>
                      <span className={cn("text-gray-600")}>Original Fare</span>
                      <span>₹{paymentInfo.originalFare.toLocaleString()}</span>
                    </div>
                    <div className={cn("flex", "justify-between")}>
                      <span className={cn("text-gray-600")}>New Fare</span>
                      <span>₹{paymentInfo.newFare.toLocaleString()}</span>
                    </div>
                    <div className={cn("flex", "justify-between")}>
                      <span className={cn("text-gray-600")}>Rescheduling Fee (10%)</span>
                      <span className={waiveFee ? "line-through text-gray-400" : ""}>
                        ₹{(paymentInfo.originalFare * 0.10).toLocaleString()}
                      </span>
                    </div>
                    {paymentInfo.fareDifference !== 0 && (
                      <div className={cn("flex", "justify-between")}>
                        <span className={cn("text-gray-600")}>Fare Difference</span>
                        <span className={waiveFee ? "line-through text-gray-400" : paymentInfo.fareDifference > 0 ? "text-red-600" : "text-green-600"}>
                          {paymentInfo.fareDifference > 0 ? "+" : ""}₹{paymentInfo.fareDifference.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className={cn("border-t", "pt-2", "mt-2")}>
                      <div className={cn("flex", "justify-between", "font-bold", "text-lg")}>
                        <span>Customer Pays</span>
                        <span className={cn("text-green-600")}>
                          {waiveFee ? "₹0 (Waived)" : `₹${paymentInfo.total.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <div className={cn("flex", "gap-4")}>
              <button
                onClick={() => {
                  setBookingDetails(null);
                  setSearchQuery("");
                }}
                className={cn("flex-1", "px-6", "py-3", "bg-gray-500", "text-white", "rounded-lg", "hover:bg-gray-600")}
              >
                Cancel
              </button>
              <button
                onClick={handleAdminReschedule}
                disabled={rescheduling || !selectedSchedule || selectedSeats.length !== bookingDetails?.noOfPassengers}
                className={cn("flex-1", "px-6", "py-3", "bg-orange-600", "text-white", "rounded-lg", "hover:bg-orange-700", "disabled:opacity-50", "flex", "items-center", "justify-center", "gap-2")}
              >
                {rescheduling ? (
                  <>
                    <div className={cn("w-5", "h-5", "border-2", "border-white", "border-t-transparent", "rounded-full", "animate-spin")}></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className={cn("w-5", "h-5")} />
                    Confirm Reschedule (No Payment)
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
