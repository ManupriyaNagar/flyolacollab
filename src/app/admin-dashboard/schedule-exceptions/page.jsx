"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { debounce } from "lodash";

const ScheduleExceptionsPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [airports, setAirports] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // Set default date to today
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
  }, []);

  // Fetch schedules for selected date
  const fetchSchedules = useCallback(async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    try {
      const [year, month] = selectedDate.split('-');
      const monthParam = `${year}-${month}`;
      
      const [flightsRes, schedulesRes, airportsRes] = await Promise.all([
        fetch(`${BASE_URL}/flights?user=true`),
        fetch(`${BASE_URL}/flight-schedules?user=true&month=${monthParam}`),
        fetch(`${BASE_URL}/airport`),
      ]);
      
      if (!flightsRes.ok || !schedulesRes.ok || !airportsRes.ok) {
        throw new Error("Failed to fetch data");
      }
      
      const [flightsData, schedulesData, airportsData] = await Promise.all([
        flightsRes.json(),
        schedulesRes.json(),
        airportsRes.json(),
      ]);

      setAirports(airportsData);
      
      // Filter schedules for selected date and only active ones
      const dateSchedules = schedulesData.filter(s => 
        s.departure_date === selectedDate && s.status === 1
      );
      
      setSchedules(
        dateSchedules.map((schedule) => {
          const flight = schedule.Flight || flightsData.find((f) => f.id === schedule.flight_id) || {};
          const depAirport = airportsData.find((a) => a.id === schedule.departure_airport_id);
          const arrAirport = airportsData.find((a) => a.id === schedule.arrival_airport_id);
          
          return {
            ...schedule,
            flight_number: flight.flight_number || "N/A",
            departure_day: flight.departure_day || "N/A",
            startAirport: depAirport?.airport_name || "Unknown",
            startAirportCode: depAirport?.airport_code || "",
            endAirport: arrAirport?.airport_name || "Unknown",
            endAirportCode: arrAirport?.airport_code || "",
            isCancelled: schedule.has_exception && schedule.exception_type === 'CANCEL',
          };
        })
      );
    } catch (err) {
      toast.error("Failed to load schedules.");
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      fetchSchedules();
    }
  }, [selectedDate, fetchSchedules]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Handle cancel schedule
  const handleCancelSchedule = async () => {
    if (!selectedSchedule || !cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/flight-schedules/${selectedSchedule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selectedSchedule,
          status: 0,
          cancellation_reason: cancelReason,
        }),
      });
      
      if (!response.ok) throw new Error("Failed to cancel schedule");
      
      toast.success("Schedule cancelled successfully!");
      setShowCancelModal(false);
      setSelectedSchedule(null);
      setCancelReason("");
      await fetchSchedules();
    } catch (err) {
      toast.error("Failed to cancel schedule.");
    } finally {
      setLoading(false);
    }
  };

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const matchesSearch =
        (schedule.flight_number && schedule.flight_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (schedule.startAirport && schedule.startAirport.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (schedule.endAirport && schedule.endAirport.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });
  }, [schedules, searchTerm]);

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg">
            <NoSymbolIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Schedule Cancellation
            </h1>
            <p className="text-slate-600 mt-1">Cancel specific schedules for particular dates</p>
          </div>
        </div>
      </div>

      {/* Filters - Simplified */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <CalendarDaysIcon className="w-4 h-4 text-blue-500" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 font-medium"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <MagnifyingGlassIcon className="w-4 h-4 text-blue-500" />
              Search Flights
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search by flight number or airport..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
              {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Select a Date'}
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {filteredSchedules.length} {filteredSchedules.length === 1 ? 'Schedule' : 'Schedules'}
            </span>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-500 font-medium">Loading schedules...</span>
              </div>
            </div>
          ) : filteredSchedules.length > 0 ? (
            <div className="space-y-3">
              {filteredSchedules.map((schedule) => (
                <div
                  key={`${schedule.id}-${schedule.departure_date}`}
                  className={`group border rounded-xl p-5 transition-all hover:shadow-md ${
                    schedule.isCancelled 
                      ? 'border-red-200 bg-red-50/50' 
                      : 'border-slate-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Flight Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="text-lg font-bold text-slate-900">
                          {schedule.flight_number}
                        </h4>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {schedule.departure_day}
                        </span>
                        {schedule.isCancelled && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
                            <NoSymbolIcon className="w-3.5 h-3.5" />
                            CANCELLED
                          </span>
                        )}
                      </div>
                      
                      {/* Route & Time Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <MapPinIcon className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500 mb-0.5">Departure</p>
                            <p className="font-semibold text-slate-900 truncate" title={schedule.startAirport}>
                              {schedule.startAirport}
                            </p>
                            <p className="text-sm text-slate-600">({schedule.startAirportCode})</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <MapPinIcon className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500 mb-0.5">Arrival</p>
                            <p className="font-semibold text-slate-900 truncate" title={schedule.endAirport}>
                              {schedule.endAirport}
                            </p>
                            <p className="text-sm text-slate-600">({schedule.endAirportCode})</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <ClockIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-500 mb-0.5">Flight Time</p>
                            <p className="font-semibold text-slate-900">
                              {new Date(`1970-01-01T${schedule.departure_time}`).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })} - {new Date(`1970-01-01T${schedule.arrival_time}`).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      {!schedule.isCancelled ? (
                        <button
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            setShowCancelModal(true);
                          }}
                          className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold flex items-center gap-2 shadow-sm hover:shadow-md"
                          disabled={loading}
                        >
                          <NoSymbolIcon className="w-4 h-4" />
                          Cancel
                        </button>
                      ) : (
                        <div className="px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-semibold">
                          Cancelled
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-slate-100 rounded-full">
                  <CalendarDaysIcon className="w-12 h-12 text-slate-400" />
                </div>
                <div>
                  <p className="text-slate-700 font-semibold text-lg">No active schedules found</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {selectedDate ? "No flights scheduled for this date" : "Please select a date to view schedules"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Transition show={showCancelModal} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowCancelModal(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <Dialog.Title className="text-xl font-bold text-slate-900">
                    Cancel Schedule
                  </Dialog.Title>
                </div>
                
                {selectedSchedule && (
                  <div className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Flight:</span>
                        <span className="font-semibold text-slate-900">{selectedSchedule.flight_number}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Route:</span>
                        <span className="font-semibold text-slate-900 text-right">
                          {selectedSchedule.startAirport} → {selectedSchedule.endAirport}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Date:</span>
                        <span className="font-semibold text-slate-900">{selectedDate}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Reason for Cancellation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    rows={4}
                    placeholder="e.g., Weather conditions, Maintenance, etc."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
                    onClick={() => {
                      setShowCancelModal(false);
                      setCancelReason("");
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleCancelSchedule}
                    disabled={loading || !cancelReason.trim()}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Cancelling...</span>
                      </div>
                    ) : (
                      "Confirm Cancellation"
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ScheduleExceptionsPage;
