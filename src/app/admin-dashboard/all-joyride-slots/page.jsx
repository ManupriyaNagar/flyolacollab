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
    date: '',
    time: '',
    seats: '',
    price: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch all joyride slots
  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${BASE_URL}/api/joyride-slots`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch slots');
      }
      const data = await response.json();
      setSlots(data);
    } catch (err) {
      toast.error('Error fetching joy ride slots');
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
      date: slot.date,
      time: slot.time,
      seats: slot.seats,
      price: slot.price,
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

    if (!editFormData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!editFormData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!editFormData.seats || editFormData.seats < 1) {
      newErrors.seats = 'At least 1 seat is required';
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
      const response = await fetch(`${BASE_URL}/api/joyride-slots/${editingSlot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: editFormData.date,
          time: editFormData.time,
          seats: parseInt(editFormData.seats),
          price: parseFloat(editFormData.price),
        }),
      });

      if (response.ok) {
        const updatedSlot = await response.json();
        setSlots(slots.map((slot) => (slot.id === editingSlot.id ? updatedSlot.slot : slot)));
        setEditingSlot(null);
        setEditFormData({ date: '', time: '', seats: '', price: '' });
        setErrors({});
        toast.success('Joy ride slot updated successfully!');
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
      const response = await fetch(`${BASE_URL}/api/joyride-slots/${showDeleteConfirm}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setSlots(slots.filter((slot) => slot.id !== showDeleteConfirm));
        toast.success('Joy ride slot deleted successfully!');
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
    setEditFormData({ date: '', time: '', seats: '', price: '' });
    setErrors({});
  };

  // Filtered and sorted slots
  const filteredSlots = useMemo(() => {
    let filtered = slots.filter((slot) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        slot.date?.toLowerCase().includes(searchLower) ||
        slot.time?.toLowerCase().includes(searchLower) ||
        slot.seats?.toString().includes(searchLower) ||
        slot.price?.toString().includes(searchLower)
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'date') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
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
            Joy Ride Slots Management
          </h1>
          <p className="text-slate-600 mt-2">View and manage all available joy ride time slots</p>
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
            placeholder="Search slots by date, time, seats, or price..."
            disabled={loading}
          />
        </div>
      </div>

      {/* Slots Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-cyan-600" />
            Joy Ride Slots ({filteredSlots.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { key: 'date', label: 'Date', sortable: true },
                  { key: 'time', label: 'Time', sortable: true },
                  { key: 'seats', label: 'Seats', sortable: true },
                  { key: 'price', label: 'Price (INR)', sortable: true },
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
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500">Loading slots...</span>
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
                          {new Date(slot.date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{slot.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{slot.seats}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CurrencyDollarIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900 font-semibold">₹{slot.price}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(slot)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          disabled={loading}
                          title="Edit slot"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(slot.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={loading}
                          title="Delete slot"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <SparklesIcon className="w-12 h-12 text-slate-300" />
                      <div>
                        <p className="text-slate-500 font-medium">No joy ride slots found</p>
                        <p className="text-slate-400 text-sm">
                          {searchTerm ? "Try adjusting your search terms" : "Create your first joy ride slot to get started"}
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
                      Edit Joy Ride Slot
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
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={editFormData.date}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                        errors.date ? 'border-red-300 bg-red-50' : 'border-slate-300'
                      }`}
                      disabled={loading}
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={editFormData.time}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                        errors.time ? 'border-red-300 bg-red-50' : 'border-slate-300'
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Number of Seats
                    </label>
                    <input
                      type="number"
                      name="seats"
                      value={editFormData.seats}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all ${
                        errors.seats ? 'border-red-300 bg-red-50' : 'border-slate-300'
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