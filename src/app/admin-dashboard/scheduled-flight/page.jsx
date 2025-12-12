"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import { Dialog, Transition } from "@headlessui/react";
import {
    ArrowsUpDownIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    PaperAirplaneIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    XCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ENTRIES_PER_PAGE = [10, 25, 50, 100];
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SCHEDULE_TYPES = ["All", "Recurring", "One-Time"];

const FlightSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [filterDay, setFilterDay] = useState("All Days");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All"); // New: filter by schedule type
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [formData, setFormData] = useState({
    flight_id: "",
    departure_airport_id: "",
    arrival_airport_id: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    status: 1,
    via_stop_id: "[]",
    is_one_time: 0,
    specific_date: "",
    is_one_time: 0, // New: one-time flight flag
    specific_date: "", // New: specific date for one-time flights
  });

  // Fetch data with validation
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Get current month for fetching schedules
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const currentMonth = `${year}-${month}`;
      
      const [flightsRes, schedulesRes, airportsRes] = await Promise.all([
        fetch(`${BASE_URL}/flights`),
        fetch(`${BASE_URL}/flight-schedules?month=${currentMonth}`),
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

      setFlights(flightsData);
      setAirports(airportsData);
      
      // Deduplicate schedules - show each unique schedule only once
      const uniqueSchedulesMap = new Map();
      
      schedulesData.forEach((schedule) => {
        // Create a unique key based on schedule configuration (not date)
        const uniqueKey = `${schedule.flight_id}-${schedule.departure_airport_id}-${schedule.arrival_airport_id}-${schedule.departure_time}-${schedule.arrival_time}`;
        
        // Only keep the first occurrence of each unique schedule
        if (!uniqueSchedulesMap.has(uniqueKey)) {
          uniqueSchedulesMap.set(uniqueKey, schedule);
        }
      });
      
      // Convert map back to array
      const uniqueSchedules = Array.from(uniqueSchedulesMap.values());
      
      setSchedules(
        uniqueSchedules.map((schedule) => {
          // Use the Flight object from the API response if available, otherwise search in flightsData
          const flight = schedule.Flight || flightsData.find((f) => f.id === schedule.flight_id) || {};
          const stops = schedule.via_stop_id
            ? JSON.parse(schedule.via_stop_id || "[]").length > 0
              ? JSON.parse(schedule.via_stop_id)
                  .map((id) => airportsData.find((a) => a.id === id)?.airport_name || `Invalid ID: ${id}`)
                  .join(", ")
              : "Direct"
            : "Direct";
          return {
            ...schedule,
            flight_number: flight.flight_number || "N/A",
            departure_day: flight.departure_day || "N/A",
            startAirport: airportsData.find((a) => a.id === schedule.departure_airport_id)?.airport_name || `Invalid ID: ${schedule.departure_airport_id}`,
            endAirport: airportsData.find((a) => a.id === schedule.arrival_airport_id)?.airport_name || `Invalid ID: ${schedule.arrival_airport_id}`,
            stops,
            status: schedule.status === 1 ? "Active" : "Inactive",
            date: schedule.updated_at ? new Date(schedule.updated_at).toLocaleDateString("en-GB") : "N/A",
            recurring_type: schedule.is_one_time === 1 ? "One-Time" : "Recurring",
            specific_date_display: schedule.is_one_time === 1 && schedule.specific_date 
              ? new Date(schedule.specific_date).toLocaleDateString("en-GB")
              : null,
          };
        })
      );
    } catch (err) {
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "status" || name.includes("airport_id") ? Number(value) : value,
    }));
  };

  // Handle stops change
  const handleStopsChange = (e) => {
    const { value, checked } = e.target;
    const currentStops = JSON.parse(formData.via_stop_id || "[]");
    let updatedStops;
    if (checked) {
      updatedStops = [...currentStops, Number(value)];
    } else {
      updatedStops = currentStops.filter((id) => id !== Number(value));
    }
    setFormData({
      ...formData,
      via_stop_id: JSON.stringify(updatedStops),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${BASE_URL}/flight-schedules/${formData.id}` : `${BASE_URL}/flight-schedules`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          via_stop_id: formData.via_stop_id,
        }),
      });
      
      if (!response.ok) throw new Error("Error saving schedule");
      
      setShowModal(false);
      setFormData({
        flight_id: "",
        departure_airport_id: "",
        arrival_airport_id: "",
        departure_time: "",
        arrival_time: "",
        price: "",
        status: 1,
        via_stop_id: "[]",
    is_one_time: 0,
    specific_date: "",
      });
      setIsEdit(false);
      toast.success(isEdit ? "Schedule updated!" : "Schedule added!");
      await fetchData();
    } catch (err) {
      toast.error("Failed to save schedule.");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (schedule) => {
    setIsEdit(true);
    setFormData({
      id: schedule.id,
      flight_id: schedule.flight_id,
      departure_airport_id: schedule.departure_airport_id,
      arrival_airport_id: schedule.arrival_airport_id,
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
      price: schedule.price,
      status: schedule.status === "Active" ? 1 : 0,
      via_stop_id: schedule.via_stop_id || "[]",
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/flight-schedules/${showDeleteConfirm}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error deleting schedule");
      await fetchData();
      toast.success("Schedule deleted!");
    } catch (err) {
      toast.error("Failed to delete schedule.");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(null);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (schedule) => {
    setLoading(true);
    const newStatus = schedule.status === "Active" ? 0 : 1;
    try {
      const response = await fetch(`${BASE_URL}/flight-schedules/${schedule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flight_id: schedule.flight_id,
          departure_airport_id: schedule.departure_airport_id,
          arrival_airport_id: schedule.arrival_airport_id,
          departure_time: schedule.departure_time,
          arrival_time: schedule.arrival_time,
          price: schedule.price,
          status: newStatus,
        }),
      });
      if (!response.ok) throw new Error("Error updating status");
      await fetchData();
      toast.success(`Schedule ${newStatus === 1 ? "activated" : "deactivated"}!`);
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    let filtered = schedules.filter((schedule) => {
      // Day filter - check if departure_day exists and matches
      const matchesDay = filterDay === "All Days" || 
                         (schedule.departure_day && schedule.departure_day === filterDay);
      
      // Status filter - handle both string and number status values
      const scheduleStatus = schedule.status === 1 || schedule.status === "Active" ? "Active" : "Inactive";
      const matchesStatus = filterStatus === "All" || filterStatus === scheduleStatus;
      
      // Type filter - recurring vs one-time
      const matchesType = filterType === "All" || 
                         (filterType === "Recurring" && schedule.recurring_type === "Recurring") ||
                         (filterType === "One-Time" && schedule.recurring_type === "One-Time");
      
      // Search filter
      const matchesSearch =
        (schedule.flight_number && schedule.flight_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (schedule.startAirport && schedule.startAirport.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (schedule.endAirport && schedule.endAirport.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesDay && matchesStatus && matchesType && matchesSearch;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
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
  }, [schedules, filterDay, filterStatus, filterType, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredSchedules.length / entriesPerPage) || 1;
  const paginatedSchedules = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredSchedules.slice(start, start + entriesPerPage);
  }, [filteredSchedules, currentPage, entriesPerPage]);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowsUpDownIcon className="w-4 h-4 text-slate-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowsUpDownIcon className="w-4 h-4 text-blue-500 rotate-180" /> :
      <ArrowsUpDownIcon className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
              <ClockIcon className="w-8 h-8 text-white" />
            </div>
            Flight Schedule Management
          </h1>
          <p className="text-slate-600 mt-2">Manage flight schedules, timings, and pricing</p>
        </div>
        
        <button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg font-semibold"
          onClick={() => {
            setIsEdit(false);
            setFormData({
              flight_id: "",
              departure_airport_id: "",
              arrival_airport_id: "",
              departure_time: "",
              arrival_time: "",
              price: "",
              status: 1,
              via_stop_id: "[]",
    is_one_time: 0,
    specific_date: "",
            });
            setShowModal(true);
          }}
          disabled={loading}
        >
          <PlusIcon className="w-5 h-5" />
          Add Schedule
        </button>
      </div>

      {/* Tab Filters */}
      <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-slate-200 p-1.5">
        {SCHEDULE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => {
              setFilterType(type);
              setCurrentPage(1);
            }}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              filterType === type
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search schedules..."
              />
            </div>
            
            <select
              value={filterDay}
              onChange={(e) => {
                setFilterDay(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option>All Days</option>
              {WEEK_DAYS.map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ENTRIES_PER_PAGE.map((num) => (
                <option key={num}>{num}</option>
              ))}
            </select>
            <span className="text-sm text-slate-600">entries</span>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-purple-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
            Flight Schedules ({filteredSchedules.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { key: 'flight_number', label: 'Flight' },
                  { key: 'startAirport', label: 'Route' },
                  { key: 'departure_time', label: 'Time' },
                  { key: 'price', label: 'Price' },
                  { key: 'stops', label: 'Stops' },
                  { key: 'recurring_type', label: 'Type' },
                  { key: 'status', label: 'Status' },
                ].map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500">Loading schedules...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedSchedules.length ? (
                paginatedSchedules.map((schedule) => (
                  <tr key={`${schedule.id}-${schedule.departure_date || schedule.updated_at}`} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <PaperAirplaneIcon className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-900">{schedule.flight_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 max-w-[300px]">
                        <MapPinIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-900 truncate" title={schedule.startAirport}>
                          {schedule.startAirport}
                        </span>
                        <span className="text-slate-400 flex-shrink-0">→</span>
                        <MapPinIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-slate-900 truncate" title={schedule.endAirport}>
                          {schedule.endAirport}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">
                          {new Date(`1970-01-01T${schedule.departure_time}`).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - {new Date(`1970-01-01T${schedule.arrival_time}`).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CurrencyDollarIcon className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-900">₹{schedule.price}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium max-w-[150px] truncate ${
                          schedule.stops === "Direct" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}
                        title={schedule.stops}
                      >
                        {schedule.stops}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            schedule.recurring_type === "Recurring" 
                              ? "bg-purple-100 text-purple-800" 
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {schedule.recurring_type === "Recurring" ? "🔁 Weekly" : "📅 One-Time"}
                        </span>
                        {schedule.specific_date_display && (
                          <span className="text-xs text-slate-600">
                            {schedule.specific_date_display}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(schedule)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          schedule.status === "Active"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                        disabled={loading}
                      >
                        {schedule.status === "Active" ? (
                          <CheckCircleIcon className="w-3 h-3" />
                        ) : (
                          <XCircleIcon className="w-3 h-3" />
                        )}
                        {schedule.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          disabled={loading}
                          title="Edit schedule"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(schedule.id)}
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
                      <ClockIcon className="w-12 h-12 text-slate-300" />
                      <div>
                        <p className="text-slate-500 font-medium">No schedules found</p>
                        <p className="text-slate-400 text-sm">
                          {searchTerm ? "Try adjusting your search terms" : "Add your first schedule to get started"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-6 border-t border-slate-200">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    } disabled:opacity-50`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Transition show={showModal} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowModal(false)}>
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
              <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ClockIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <Dialog.Title className="text-xl font-semibold text-slate-900">
                      {isEdit ? "Edit Schedule" : "Add New Schedule"}
                    </Dialog.Title>
                  </div>
                  <button
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Flight <span className="text-xs text-slate-500">({flights.filter(f => f.status === 1).length} active flights available)</span>
                      </label>
                      <select
                        name="flight_id"
                        value={formData.flight_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        disabled={loading}
                      >
                        <option value="">
                          {flights.filter(f => f.status === 1).length > 0 
                            ? "Select a flight" 
                            : "No active flights available"}
                        </option>
                        {flights
                          .filter((flight) => flight.status === 1) // Only show active flights
                          .map((flight) => (
                            <option key={flight.id} value={flight.id}>
                              {flight.flight_number}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Price (INR)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        min="0"
                        step="0.01"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Departure Airport
                      </label>
                      <select
                        name="departure_airport_id"
                        value={formData.departure_airport_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        disabled={loading}
                      >
                        <option value="">Select Airport</option>
                        {airports.map((airport) => (
                          <option key={airport.id} value={airport.id}>
                            {airport.airport_name} ({airport.airport_code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Arrival Airport
                      </label>
                      <select
                        name="arrival_airport_id"
                        value={formData.arrival_airport_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        disabled={loading}
                      >
                        <option value="">Select Airport</option>
                        {airports.map((airport) => (
                          <option key={airport.id} value={airport.id}>
                            {airport.airport_name} ({airport.airport_code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Departure Time
                      </label>
                      <input
                        type="time"
                        name="departure_time"
                        value={formData.departure_time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Arrival Time
                      </label>
                      <input
                        type="time"
                        name="arrival_time"
                        value={formData.arrival_time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Stop Airports (Optional)
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-xl p-4 bg-slate-50">
                      {airports.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {airports.map((airport) => (
                            <div key={airport.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`stop-airport-${airport.id}`}
                                value={airport.id}
                                checked={JSON.parse(formData.via_stop_id || "[]").includes(airport.id)}
                                onChange={handleStopsChange}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                disabled={
                                  loading ||
                                  airport.id === formData.departure_airport_id ||
                                  airport.id === formData.arrival_airport_id
                                }
                              />
                              <label
                                htmlFor={`stop-airport-${airport.id}`}
                                className={`ml-2 text-sm cursor-pointer ${
                                  loading ||
                                  airport.id === formData.departure_airport_id ||
                                  airport.id === formData.arrival_airport_id
                                    ? "text-slate-400"
                                    : "text-slate-700"
                                }`}
                              >
                                {airport.airport_name} ({airport.airport_code})
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No airports available</p>
                      )}
                    </div>
                  </div>

                  {/* One-Time Flight Option */}
                  <div className="border-t border-slate-200 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        id="is_one_time"
                        checked={formData.is_one_time === 1}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            is_one_time: e.target.checked ? 1 : 0,
                            specific_date: e.target.checked ? formData.specific_date : "",
                          });
                        }}
                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        disabled={loading}
                      />
                      <label htmlFor="is_one_time" className="text-sm font-semibold text-slate-700 cursor-pointer">
                        📅 One-Time Flight (Specific Date)
                      </label>
                    </div>
                    
                    {formData.is_one_time === 1 && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Specific Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="specific_date"
                          value={formData.specific_date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required={formData.is_one_time === 1}
                          disabled={loading}
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          This schedule will only run on the selected date
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={loading}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
                      onClick={() => setShowModal(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 ${
                        isEdit
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <PlusIcon className="w-5 h-5" />
                      )}
                      {isEdit ? "Update Schedule" : "Add Schedule"}
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
                  Are you sure you want to delete this schedule? This action cannot be undone.
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
                    onClick={handleDelete}
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

export default FlightSchedulePage;