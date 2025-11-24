"use client";

import React, { useState } from "react";
import { 
  ClockIcon, 
  MapPinIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import BookingPopup from "./BookingPopup";

const HelicopterCard = ({ 
  schedule, 
  helicopter, 
  departureHelipad, 
  arrivalHelipad, 
  helipads, 
  searchCriteria 
}) => {
  const [showBookingPopup, setShowBookingPopup] = useState(false);

  const normaliseStops = (raw) => {
    try {
      const arr = Array.isArray(raw) ? raw : JSON.parse(raw || "[]");
      return [...new Set(arr.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
    } catch {
      return [];
    }
  };

  const getStopHelipads = () => {
    if (!schedule || !schedule.via_stop_id) return [];
    const stopIds = normaliseStops(schedule.via_stop_id);
    return stopIds.map(id => helipads.find(h => h.id === id)).filter(Boolean);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "Not set";
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateDuration = () => {
    if (!schedule?.departure_time || !schedule?.arrival_time) return "Duration not set";
    
    const [depHours, depMinutes] = schedule.departure_time.split(':').map(Number);
    const [arrHours, arrMinutes] = schedule.arrival_time.split(':').map(Number);
    
    const depTotalMinutes = depHours * 60 + depMinutes;
    const arrTotalMinutes = arrHours * 60 + arrMinutes;
    
    let durationMinutes = arrTotalMinutes - depTotalMinutes;
    if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle next day arrival
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const stopHelipads = getStopHelipads();
  const isActive = schedule?.status === 1;

  return (
    <>
      <div className={`bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-200 ${!isActive ? 'opacity-75' : ''}`}>
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-slate-800">
                  {helicopter?.helicopter_number || 'Unknown Helicopter'}
                </h3>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isActive 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' 
                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                }`}>
                  {isActive ? '✈️ Available' : '🚫 Unavailable'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                <CalendarDaysIcon className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Operates on {helicopter?.departure_day || 'Unknown'}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-800 mb-1">
                ₹{schedule?.price ? Number(schedule.price).toLocaleString('en-IN') : '0'}
              </div>
              <div className="text-sm text-slate-500 font-medium">per person</div>
              <div className="text-xs text-blue-600 font-medium mt-1">All inclusive</div>
            </div>
          </div>

          {/* Route Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Departure */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPinIcon className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-slate-800">Departure</span>
              </div>
              <div className="text-lg font-bold text-slate-800">
                {formatTime(schedule?.departure_time)}
              </div>
              <div className="text-sm text-slate-600">
                {departureHelipad?.helipad_name || 'Unknown Helipad'}
              </div>
              <div className="text-xs text-slate-500">
                {departureHelipad?.city || 'Unknown City'}
              </div>
            </div>

            {/* Duration & Stops */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ClockIcon className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-slate-800">Duration</span>
              </div>
              <div className="text-lg font-bold text-slate-800">
                {calculateDuration()}
              </div>
              <div className="text-sm text-slate-600">
                {stopHelipads.length === 0 ? 'Non-stop' : `${stopHelipads.length} stop${stopHelipads.length > 1 ? 's' : ''}`}
              </div>
              {stopHelipads.length > 0 && (
                <div className="text-xs text-slate-500 mt-1">
                  via {stopHelipads.map(h => h.city).join(', ')}
                </div>
              )}
            </div>

            {/* Arrival */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPinIcon className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-slate-800">Arrival</span>
              </div>
              <div className="text-lg font-bold text-slate-800">
                {formatTime(schedule?.arrival_time)}
              </div>
              <div className="text-sm text-slate-600">
                {arrivalHelipad?.helipad_name || 'Unknown Helipad'}
              </div>
              <div className="text-xs text-slate-500">
                {arrivalHelipad?.city || 'Unknown City'}
              </div>
            </div>
          </div>

          {/* Route Visualization */}
          <div className="flex items-center justify-center mb-6 px-4">
            <div className="flex items-center w-full max-w-md">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-red-500 mx-2 relative">
                {stopHelipads.map((_, index) => (
                  <div 
                    key={index}
                    className="absolute w-2 h-2 bg-blue-500 rounded-full top-1/2 transform -translate-y-1/2"
                    style={{ left: `${((index + 1) / (stopHelipads.length + 1)) * 100}%` }}
                  />
                ))}
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <UsersIcon className="w-4 h-4 text-blue-500" />
              <span>{helicopter?.seat_limit || 'N/A'} seats</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>Premium Service</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>Scenic Views</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
              <span>Professional Pilot</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowBookingPopup(true)}
              disabled={!isActive}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CalendarDaysIcon className="w-5 h-5" />
              {isActive ? 'Book Now' : 'Unavailable'}
            </button>
            <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Booking Popup */}
      {showBookingPopup && (
        <BookingPopup
          schedule={schedule}
          helicopter={helicopter}
          departureHelipad={departureHelipad}
          arrivalHelipad={arrivalHelipad}
          searchCriteria={searchCriteria}
          onClose={() => setShowBookingPopup(false)}
        />
      )}
    </>
  );
};

export default HelicopterCard;