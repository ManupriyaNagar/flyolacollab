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

const AdminJoyrideSlotsPage = () => {
  const [slotData, setSlotData] = useState({
    startDate: '',
    endDate: '',
    time: '',
    seats: 1,
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle changes to form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSlotData({ ...slotData, [name]: value });

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!slotData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!slotData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (slotData.startDate && slotData.endDate && new Date(slotData.startDate) > new Date(slotData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!slotData.time) {
      newErrors.time = 'Time is required';
    }

    if (!slotData.seats || slotData.seats < 1) {
      newErrors.seats = 'At least 1 seat is required';
    }

    if (!slotData.price || slotData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
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

      const response = await fetch(`${BASE_URL}/api/joyride-slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: slotData.startDate,
          endDate: slotData.endDate,
          time: slotData.time,
          seats: parseInt(slotData.seats),
          price: parseFloat(slotData.price),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || 'Joy ride slots created successfully!');
        setSlotData({ startDate: '', endDate: '', time: '', seats: 1, price: '' });
        setErrors({});
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create joy ride slots');
      }
    } catch (err) {
      toast.error('An error occurred while creating the joy ride slots');
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
            Joy Ride Slot Management
          </h1>
          <p className="text-slate-600 mt-2">Create and manage joy ride time slots and availability</p>
        </div>
      </div>

      {/* Create Slot Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <PlusIcon className="w-6 h-6 text-green-600" />
            Create New Joy Ride Slots
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={slotData.startDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.startDate ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                disabled={loading}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.startDate}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={slotData.endDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.endDate ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                disabled={loading}
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.endDate}
                </p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                Time
              </label>
              <input
                type="time"
                name="time"
                value={slotData.time}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.time ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                disabled={loading}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.time}
                </p>
              )}
            </div>

            {/* Number of Seats */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <UsersIcon className="w-4 h-4 inline mr-1" />
                Number of Seats
              </label>
              <input
                type="number"
                name="seats"
                value={slotData.seats}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.seats ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                min="1"
                disabled={loading}
              />
              {errors.seats && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {errors.seats}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
                Price per Seat (INR)
              </label>
              <input
                type="number"
                name="price"
                value={slotData.price}
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
              {!loading && 'Create Joy Ride Slots'}
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
            <h3 className="font-semibold text-green-800 mb-2">Joy Ride Slot Information</h3>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Slots will be created for each day between the start and end dates</li>
              <li>• Each slot will have the specified time and number of available seats</li>
              <li>• Price is set per seat for each booking</li>
              <li>• Customers can book multiple seats in a single slot</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJoyrideSlotsPage;