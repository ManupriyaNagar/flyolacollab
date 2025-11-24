"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  SparklesIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import BASE_URL from "@/baseUrl/baseUrl";

export default function AdminJoyrideBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/api/joyride-slots/joyride-bookings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        toast.error(err.message || 'An error occurred while fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

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

  const toggleRow = (bookingId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  };

  // Filtered and sorted bookings
  const filteredBookings = useMemo(() => {
    let filtered = bookings.filter((booking) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.id?.toString().includes(searchLower) ||
        booking.user?.name?.toLowerCase().includes(searchLower) ||
        booking.user?.email?.toLowerCase().includes(searchLower) ||
        booking.email?.toLowerCase().includes(searchLower) ||
        booking.phone?.toLowerCase().includes(searchLower) ||
        booking.slot?.date?.toLowerCase().includes(searchLower) ||
        booking.slot?.time?.toLowerCase().includes(searchLower) ||
        booking.passengers?.some(p => p.name?.toLowerCase().includes(searchLower))
      );
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'slot') {
          aValue = a.slot?.date || '';
          bValue = b.slot?.date || '';
        } else if (sortConfig.key === 'user') {
          aValue = a.user?.name || '';
          bValue = b.user?.name || '';
        } else if (sortConfig.key === 'passengers') {
          aValue = a.passengers?.length || 0;
          bValue = b.passengers?.length || 0;
        } else if (sortConfig.key === 'total_price') {
          aValue = parseFloat(a.total_price) || 0;
          bValue = parseFloat(b.total_price) || 0;
        }
        
        if (typeof aValue === 'string') {
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
  }, [bookings, searchTerm, sortConfig]);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowsUpDownIcon className="w-4 h-4 text-slate-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowsUpDownIcon className="w-4 h-4 text-purple-500 rotate-180" /> :
      <ArrowsUpDownIcon className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <CalendarDaysIcon className="w-8 h-8 text-white" />
            </div>
            Joy Ride Bookings
          </h1>
          <p className="text-slate-600 mt-2">View and manage all joy ride bookings and customer details</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Search bookings by ID, user, email, phone, date, or passenger name..."
            disabled={loading}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-purple-600" />
            Joy Ride Bookings ({filteredBookings.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { key: 'id', label: 'Booking ID', sortable: true },
                  { key: 'user', label: 'User', sortable: true },
                  { key: 'slot', label: 'Date & Time', sortable: true },
                  { key: 'passengers', label: 'Passengers', sortable: true },
                  { key: 'total_price', label: 'Total Price', sortable: true },
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
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500">Loading bookings...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <SparklesIcon className="w-12 h-12 text-slate-300" />
                      <div>
                        <p className="text-slate-500 font-medium">No bookings found</p>
                        <p className="text-slate-400 text-sm">
                          {searchTerm ? "Try adjusting your search terms" : "No joy ride bookings available"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <React.Fragment key={booking.id}>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900">#{booking.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <UserIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 truncate" title={booking.user?.name || 'N/A'}>
                              {booking.user?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-slate-500 truncate" title={booking.user?.email || 'N/A'}>
                              {booking.user?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="w-4 h-4 text-slate-400" />
                          <div>
                            <div className="font-medium text-slate-900">
                              {booking.slot?.date ? new Date(booking.slot.date).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              {booking.slot?.time || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <UsersIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{booking.passengers?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-900">
                            ₹{booking.total_price != null ? Number(booking.total_price).toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleRow(booking.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-sm font-medium"
                        >
                          {expandedRows[booking.id] ? (
                            <>
                              <EyeSlashIcon className="w-4 h-4" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <EyeIcon className="w-4 h-4" />
                              Show Details
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Row Details */}
                    {expandedRows[booking.id] && (
                      <tr>
                        <td colSpan={6} className="px-6 py-6 bg-gradient-to-r from-slate-50 to-purple-50">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Passengers Section */}
                            <div className="bg-white rounded-xl p-4 border border-slate-200">
                              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <UsersIcon className="w-5 h-5 text-purple-600" />
                                Passengers ({booking.passengers?.length || 0})
                              </h4>
                              {booking.passengers?.length > 0 ? (
                                <div className="space-y-2">
                                  {booking.passengers.map((passenger, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                      <span className="font-medium text-slate-700">{passenger.name}</span>
                                      <span className="text-sm text-slate-500">Weight: {passenger.weight} kg</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-slate-500 text-sm">No passenger information available</p>
                              )}
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white rounded-xl p-4 border border-slate-200">
                              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <PhoneIcon className="w-5 h-5 text-purple-600" />
                                Contact Information
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <EnvelopeIcon className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-700">{booking.email || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <PhoneIcon className="w-4 h-4 text-slate-400" />
                                  <span className="text-slate-700">{booking.phone || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Billing Information */}
                            {booking.billing && (
                              <div className="lg:col-span-2 bg-white rounded-xl p-4 border border-slate-200">
                                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                  <MapPinIcon className="w-5 h-5 text-purple-600" />
                                  Billing Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Name</label>
                                    <p className="text-slate-700">{booking.billing.billing_name || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</label>
                                    <p className="text-slate-700">{booking.billing.billing_email || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</label>
                                    <p className="text-slate-700">{booking.billing.billing_number || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Address</label>
                                    <p className="text-slate-700">{booking.billing.billing_address || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Country</label>
                                    <p className="text-slate-700">{booking.billing.billing_country || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">State</label>
                                    <p className="text-slate-700">{booking.billing.billing_state || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pin Code</label>
                                    <p className="text-slate-700">{booking.billing.billing_pin_code || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">GST Number</label>
                                    <p className="text-slate-700">{booking.billing.GST_Number || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <SparklesIcon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-purple-800 mb-2">Joy Ride Booking Management</h3>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• View detailed information about each joy ride booking</li>
              <li>• Track passenger details and contact information</li>
              <li>• Monitor booking dates, times, and pricing</li>
              <li>• Access billing information for customer support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}