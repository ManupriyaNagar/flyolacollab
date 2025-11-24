"use client";

import React, { useState } from "react";
import { 
  XMarkIcon, 
  MapPinIcon, 
  ClockIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

const BookingPopup = ({ 
  schedule, 
  helicopter, 
  departureHelipad, 
  arrivalHelipad, 
  searchCriteria, 
  onClose 
}) => {
  const { authState } = useAuth();
  const router = useRouter();
  const [passengers, setPassengers] = useState(searchCriteria.passengers || 1);
  const [selectedDate, setSelectedDate] = useState(searchCriteria.date || '');
  const [isLoading, setIsLoading] = useState(false);

  const formatTime = (timeStr) => {
    if (!timeStr) return "Not set";
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateTotal = () => {
    return Number(schedule.price) * passengers;
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleBooking = async () => {
    if (!authState.isLoggedIn) {
      router.push('/sign-in');
      return;
    }

    if (!selectedDate) {
      alert('Please select a date for your flight');
      return;
    }

    // Check if selected date matches helicopter's operating day
    const selectedDayName = getDayName(selectedDate);
    if (selectedDayName !== helicopter.departure_day) {
      alert(`This helicopter only operates on ${helicopter.departure_day}s. Please select a ${helicopter.departure_day}.`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would implement the actual booking logic
      // For now, we'll just simulate a booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Booking request submitted successfully! You will receive a confirmation email shortly.');
      onClose();
    } catch (error) {
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const availableDates = generateDates();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Book Helicopter Flight</h2>
            <p className="text-slate-600">{helicopter?.helicopter_number}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Flight Details */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Flight Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium text-slate-800">From</div>
                  <div className="text-sm text-slate-600">
                    {departureHelipad?.helipad_name} ({departureHelipad?.city})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-red-500" />
                <div>
                  <div className="font-medium text-slate-800">To</div>
                  <div className="text-sm text-slate-600">
                    {arrivalHelipad?.helipad_name} ({arrivalHelipad?.city})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium text-slate-800">Departure</div>
                  <div className="text-sm text-slate-600">
                    {formatTime(schedule.departure_time)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="font-medium text-slate-800">Arrival</div>
                  <div className="text-sm text-slate-600">
                    {formatTime(schedule.arrival_time)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Booking Information</h3>
            
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Date *
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a date</option>
                {availableDates.map((date) => {
                  const dayName = getDayName(date);
                  const isOperatingDay = dayName === helicopter?.departure_day;
                  return (
                    <option 
                      key={date} 
                      value={date}
                      disabled={!isOperatingDay}
                      className={!isOperatingDay ? 'text-slate-400' : ''}
                    >
                      {getFormattedDate(date)} {!isOperatingDay ? '(Not available)' : ''}
                    </option>
                  );
                })}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                This helicopter operates on {helicopter?.departure_day}s only
              </p>
            </div>

            {/* Passengers */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Passengers *
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: helicopter?.seat_limit || 8 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Price per person</span>
                <span>₹{Number(schedule.price).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Passengers</span>
                <span>× {passengers}</span>
              </div>
              <div className="border-t border-slate-300 pt-2">
                <div className="flex justify-between text-lg font-bold text-slate-800">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>Professional Pilot</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>Safety Equipment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>Scenic Route</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>Premium Service</span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important Information:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Weather conditions may affect flight schedules</li>
                  <li>• Arrive 30 minutes before departure time</li>
                  <li>• Valid ID required for all passengers</li>
                  <li>• Weight restrictions may apply</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={isLoading || !selectedDate}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isLoading || !selectedDate
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CalendarDaysIcon className="w-5 h-5" />
                  {authState.isLoggedIn ? 'Confirm Booking' : 'Login to Book'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPopup;