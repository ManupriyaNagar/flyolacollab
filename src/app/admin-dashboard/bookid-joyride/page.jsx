"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PlusIcon,
  CalendarDaysIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import BASE_URL from "@/baseUrl/baseUrl";
import Loader from "@/components/Loader";
import { useEffect } from 'react';
import { MapPinIcon } from "@heroicons/react/24/outline";

const AdminJoyrideSlotsPage = () => {
  const [scheduleData, setScheduleData] = useState({
    departureDay: 'Monday',
    startHelipadId: '',
    stopHelipadId: '',
    departureTime: '',
    arrivalTime: '',
    seatLimit: 6,
    price: '',
    status: 1,
  });
  const [helipads, setHelipads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHelipads, setLoadingHelipads] = useState(true);
  const [errors, setErrors] = useState({});

  // Fetch helipads on component mount
  useEffect(() => {
    const fetchHelipads = async () => {
      try {
        const response = await fetch(`${BASE_URL}/helipads`);
        if (response.ok) {
          const data = await response.json();
          setHelipads(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        toast.error('Failed to load helipads');
      } finally {
        setLoadingHelipads(false);
      }
    };

    fetchHelipads();
  }, []);

  // Handle changes to form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({ ...scheduleData, [name]: value });

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!scheduleData.departureDay) {
      newErrors.departureDay = 'Departure day is required';
    }

    if (!scheduleData.departureTime) {
      newErrors.departureTime = 'Departure time is required';
    }

    if (!scheduleData.seatLimit || scheduleData.seatLimit < 1) {
      newErrors.seatLimit = 'At least 1 seat is required';
    }

    if (!scheduleData.price || scheduleData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!scheduleData.startHelipadId) {
      newErrors.startHelipadId = 'Start helipad is required';
    }

    if (!scheduleData.stopHelipadId) {
      newErrors.stopHelipadId = 'Stop helipad is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('Please sign in to continue');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/joyride-schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          departureDay: scheduleData.departureDay,
          startHelipadId: parseInt(scheduleData.startHelipadId),
          stopHelipadId: parseInt(scheduleData.stopHelipadId),
          departureTime: scheduleData.departureTime,
          arrivalTime: scheduleData.arrivalTime || null,
          seatLimit: parseInt(scheduleData.seatLimit),
          price: parseFloat(scheduleData.price),
          status: parseInt(scheduleData.status),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Joy ride schedule created successfully!');
        setScheduleData({
          departureDay: 'Monday',
          startHelipadId: '',
          stopHelipadId: '',
          departureTime: '',
          arrivalTime: '',
          seatLimit: 6,
          price: '',
          status: 1,
        });
        setErrors({});
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create joy ride schedule');
      }
    } catch (err) {
      toast.error('An error occurred while creating the joy ride schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            Joy Ride Schedule Management
          </h1>
          <p className="text-slate-600 mt-2">Create and manage weekly recurring joy ride schedules</p>
        </div>
      </div>

      {/* Create Slot Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <PlusIcon className="w-6 h-6 text-green-600" />
            Create New Joy Ride Schedule
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Departure Day */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                Departure Day
              </label>
              <select
                name="departureDay"
                value={scheduleData.departureDay}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.departureDay ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                disabled={loading}
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
              {errors.departureDay && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.departureDay}
                </p>
              )}
            </div>

            {/* Departure Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                Departure Time
              </label>
              <input
                type="time"
                name="departureTime"
                value={scheduleData.departureTime}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.departureTime ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                disabled={loading}
              />
              {errors.departureTime && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.departureTime}
                </p>
              )}
            </div>

            {/* Arrival Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                Arrival Time (Optional)
              </label>
              <input
                type="time"
                name="arrivalTime"
                value={scheduleData.arrivalTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>

            {/* Seat Limit */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <UsersIcon className="w-4 h-4 inline mr-1" />
                Seat Limit
              </label>
              <input
                type="number"
                name="seatLimit"
                value={scheduleData.seatLimit}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.seatLimit ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                min="1"
                disabled={loading}
              />
              {errors.seatLimit && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.seatLimit}
                </p>
              )}
            </div>

            {/* Start Helipad */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <MapPinIcon className="w-4 h-4 inline mr-1" />
                Start Helipad
              </label>
              <select
                name="startHelipadId"
                value={scheduleData.startHelipadId}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.startHelipadId ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                disabled={loading || loadingHelipads}
              >
                <option value="">Select Start Helipad</option>
                {helipads.map((helipad) => (
                  <option key={helipad.id} value={helipad.id}>
                    {helipad.helipad_name} ({helipad.helipad_code}) - {helipad.city}
                  </option>
                ))}
              </select>
              {errors.startHelipadId && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.startHelipadId}
                </p>
              )}
            </div>

            {/* Stop Helipad */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <MapPinIcon className="w-4 h-4 inline mr-1" />
                Stop Helipad
              </label>
              <select
                name="stopHelipadId"
                value={scheduleData.stopHelipadId}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.stopHelipadId ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                disabled={loading || loadingHelipads}
              >
                <option value="">Select Stop Helipad</option>
                {helipads.map((helipad) => (
                  <option key={helipad.id} value={helipad.id}>
                    {helipad.helipad_name} ({helipad.helipad_code}) - {helipad.city}
                  </option>
                ))}
              </select>
              {errors.stopHelipadId && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.stopHelipadId}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
                Price per Seat (INR)
              </label>
              <input
                type="number"
                name="price"
                value={scheduleData.price}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.price ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                min="0.01"
                step="0.01"
                placeholder="Enter price per seat"
                disabled={loading}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.price}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                Status
              </label>
              <select
                name="status"
                value={scheduleData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={loading}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg font-semibold disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <Loader inline={true} size="sm" />
              ) : (
                <CheckCircleIcon className="w-5 h-5" />
              )}
              {!loading && 'Create Joy Ride Schedule'}
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <SparklesIcon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800 mb-2">Joy Ride Schedule Information</h3>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Schedules repeat weekly on the selected day (e.g., every Monday)</li>
              <li>• Set departure and arrival times for the joy ride</li>
              <li>• Specify seat limit and price per seat</li>
              <li>• Customers can book for any future date matching the schedule day</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJoyrideSlotsPage;