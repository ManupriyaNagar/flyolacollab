"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { debounce } from "lodash";
import BASE_URL from "@/baseUrl/baseUrl";

const AdminJoyrideSlotsManager = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSlot, setEditingSlot] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editFormData, setEditFormData] = useState({
    departureDay: 'Monday',
    departureTime: '',
    arrivalTime: '',
    seatLimit: '',
    price: '',
    status: 1,
  });
  const [errors, setErrors] = useState({});

  // Fetch all joyride schedules
  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const [schedulesRes, helipadsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/joyride-schedules`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${BASE_URL}/helipads`)
      ]);
      
      if (!schedulesRes.ok) {
        throw new Error('Failed to fetch schedules');
      }
      
      const schedulesData = await schedulesRes.json();
      const helipadsData = helipadsRes.ok ? await helipadsRes.json() : [];
      
      // Create helipad map
      const helipadMap = {};
      helipadsData.forEach(h => {
        helipadMap[h.id] = `${h.helipad_name} (${h.helipad_code})`;
      });
      
      // Add helipad names to schedules
      const enrichedSchedules = schedulesData.map(schedule => ({
        ...schedule,
        startHelipadName: helipadMap[schedule.start_helipad_id] || 'Unknown',
        stopHelipadName: helipadMap[schedule.stop_helipad_id] || 'Unknown'
      }));
      
      setSlots(enrichedSchedules);
    } catch (err) {
      toast.error('Error fetching joy ride schedules');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load slots on component mount
  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle edit button click
  const handleEditClick = (slot) => {
    setEditingSlot(slot);
    setEditFormData({
      departureDay: slot.departure_day || 'Monday',
      departureTime: slot.departure_time ? slot.departure_time.substring(0, 5) : '',
      arrivalTime: slot.arrival_time ? slot.arrival_time.substring(0, 5) : '',
      seatLimit: slot.seat_limit || '',
      price: slot.price || '',
      status: slot.status !== undefined ? slot.status : 1,
    });
    setErrors({});
  };

  // Handle edit form input change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Validate edit form
  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.departureDay) {
      newErrors.departureDay = 'Departure day is required';
    }
    
    if (!editFormData.departureTime) {
      newErrors.departureTime = 'Departure time is required';
    }
    
    if (!editFormData.seatLimit || editFormData.seatLimit < 1) {
      newErrors.seatLimit = 'At least 1 seat is required';
    }
    
    if (!editFormData.price || editFormData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEditForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${BASE_URL}/api/joyride-schedules/${editingSlot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          departureDay: editFormData.departureDay,
          departureTime: editFormData.departureTime,
          arrivalTime: editFormData.arrivalTime || null,
          seatLimit: parseInt(editFormData.seatLimit),
          price: parseFloat(editFormData.price),
          status: parseInt(editFormData.status),
        }),
      });

      if (response.ok) {
        await fetchSlots(); // Refresh the list
        setEditingSlot(null);
        setEditFormData({ 
          departureDay: 'Monday',
          departureTime: '',
          arrivalTime: '',
          seatLimit: '',
          price: '',
          status: 1,
        });
        setErrors({});
        toast.success('Joy ride schedule updated successfully!');
      } else {
        const data = await response.json();
        if (response.status === 401) {
          toast.error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          toast.error('Access denied. Admin privileges required.');
        } else {
          toast.error(data.error || data.message || 'Failed to update joy ride slot');
        }
      }
    } catch (err) {
      toast.error('An error occurred while updating the joy ride slot');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete button click
  const handleDeleteClick = async () => {
    if (!showDeleteConfirm) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${BASE_URL}/api/joyride-schedules/${showDeleteConfirm}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setSlots(slots.filter((slot) => slot.id !== showDeleteConfirm));
        toast.success('Joy ride schedule deleted successfully!');
      } else {
        const data = await response.json();
        if (response.status === 401) {
          toast.error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          toast.error('Access denied. Admin privileges required.');
        } else if (response.status === 400) {
          toast.error(data.error || 'Cannot delete slot with existing bookings');
        } else {
          toast.error(data.error || data.message || 'Failed to delete joy ride slot');
        }
      }
    } catch (err) {
      toast.error('An error occurred while deleting the joy ride slot');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(null);
    }
  };

  // Close edit modal
  const handleCloseEdit = () => {
    setEditingSlot(null);
    setEditFormData({ 
      departureDay: 'Monday',
      departureTime: '',
      arrivalTime: '',
      seatLimit: '',
      price: '',
      status: 1,
    });
    setErrors({});
  };

  // Filtered and sorted slots
  const filteredSlots = useMemo(() => {
    let filtered = slots.filter((slot) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        slot.departure_day?.toLowerCase().includes(searchLower) ||
        slot.departure_time?.toLowerCase().includes(searchLower) ||
        slot.arrival_time?.toLowerCase().includes(searchLower) ||
        slot.seat_limit?.toString().includes(searchLower) ||
        slot.price?.toString().includes(searchLower) ||
        slot.startHelipadName?.toLowerCase().includes(searchLower) ||
        slot.stopHelipadName?.toLowerCase().includes(searchLower)
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue ? bValue.toLowerCase() : '';
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [slots, searchTerm, sortConfig]);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowsUpDownIcon className="w-4 h-4 text-slate-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowsUpDownIcon className="w-4 h-4 text-green-500 rotate-180" /> :
      <ArrowsUpDownIcon className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
              <ClockIcon className="w-8 h-8 text-white" />
            </div>
            Joy Ride Schedules Management
          </h1>
          <p className="text-slate-600 mt-2">View and manage all weekly recurring joy ride schedules</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            placeholder="Search schedules by day, time, helipad, seats, or price..."
            disabled={loading}
          />
        </div>
      </div>

      {/* Slots Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-cyan-600" />
            Joy Ride Schedules ({filteredSlots.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { key: 'departure_day', label: 'Day', sortable: true },
                  { key: 'route', label: 'Route', sortable: false },
                  { key: 'departure_time', label: 'Departure', sortable: true },
                  { key: 'arrival_time', label: 'Arrival', sortable: true },
                  { key: 'seat_limit', label: 'Seats', sortable: true },
                  { key: 'price', label: 'Price (INR)', sortable: true },
                  { key: 'status', label: 'Status', sortable: true },
                  { key: 'actions', label: 'Actions', sortable: false },
                ].map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
                    }`}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500">Loading schedules...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900 font-medium">
                          {slot.departure_day}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-slate-900 font-medium">{slot.startHelipadName}</div>
                        <div className="text-slate-500">→ {slot.stopHelipadName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{slot.departure_time ? slot.departure_time.substring(0, 5) : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{slot.arrival_time ? slot.arrival_time.substring(0, 5) : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{slot.seat_limit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CurrencyDollarIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900 font-semibold">₹{parseFloat(slot.price).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        slot.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {slot.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(slot)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          disabled={loading}
                          title="Edit schedule"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(slot.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={loading}
                          title="Delete schedule"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <SparklesIcon className="w-12 h-12 text-slate-300" />
                      <div>
                        <p className="text-slate-500 font-medium">No joy ride schedules found</p>
                        <p className="text-slate-400 text-sm">
                          {searchTerm ? "Try adjusting your search terms" : "Create your first joy ride schedule to get started"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Transition show={!!editingSlot} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseEdit}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <PencilIcon className="w-6 h-6 text-cyan-600" />
                    </div>
                    <Dialog.Title className="text-xl font-semibold text-slate-900">
                      Edit Joy Ride Schedule
                    </Dialog.Title>
                  </div>
                  <button
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={handleCloseEdit}
                    disabled={loading}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Departure Day
                    </label>
                    <select
                      name="departureDay"
                      value={editFormData.departureDay}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                        errors.departureDay ? 'border-red-300 bg-red-50' : 'border-slate-300'
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Departure Time
                    </label>
                    <input
                      type="time"
                      name="departureTime"
                      value={editFormData.departureTime}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                        errors.departureTime ? 'border-red-300 bg-red-50' : 'border-slate-300'
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Arrival Time (Optional)
                    </label>
                    <input
                      type="time"
                      name="arrivalTime"
                      value={editFormData.arrivalTime}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Seat Limit
                    </label>
                    <input
                      type="number"
                      name="seatLimit"
                      value={editFormData.seatLimit}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                        errors.seatLimit ? 'border-red-300 bg-red-50' : 'border-slate-300'
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Price per Seat (INR)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                        errors.price ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                      min="0.01"
                      step="0.01"
                      disabled={loading}
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      disabled={loading}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
                      onClick={handleCloseEdit}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg font-semibold disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircleIcon className="w-4 h-4" />
                      )}
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition show={!!showDeleteConfirm} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowDeleteConfirm(null)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <Dialog.Title className="text-lg font-semibold text-slate-900">
                    Confirm Delete
                  </Dialog.Title>
                </div>
                
                <p className="text-slate-600 mb-6">
                  Are you sure you want to delete this joy ride slot? This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                  <button
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                    onClick={() => setShowDeleteConfirm(null)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                    onClick={handleDeleteClick}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      "Delete"
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

export default AdminJoyrideSlotsManager;