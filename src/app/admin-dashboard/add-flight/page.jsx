"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import API from "@/services/api";
import { Dialog, Transition } from "@headlessui/react";
import {
    ArrowsUpDownIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    PaperAirplaneIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    UsersIcon,
    XCircleIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Authentication helper function
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Enhanced fetch with authentication
const authenticatedFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    credentials: 'include',
  });
};

// Helper functions
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function normaliseStops(raw) {
  try {
    if (raw === '"[]"') return [];
    const arr = Array.isArray(raw) ? raw : JSON.parse(raw || "[]");
    return [...new Set(arr.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
  } catch (e) {
    return [];
  }
}

function validateFlightBody(fd) {
  const errors = [];
  if (!fd.flight_number.trim()) errors.push("Flight number is required");
  if (!fd.start_airport_id || !fd.end_airport_id) errors.push("Start & End airport required");

  const stops = normaliseStops(fd.airport_stop_ids);
  if (fd.start_airport_id === fd.end_airport_id && stops.length === 0) {
    errors.push("For flights starting and ending at the same airport, at least one stop is required");
  }
  if (!WEEK_DAYS.includes(fd.departure_day)) errors.push("Invalid departure day");
  if (!Number.isInteger(fd.seat_limit) || fd.seat_limit < 1) errors.push("Seat limit must be ≥1");

  if (stops.includes(fd.start_airport_id) || stops.includes(fd.end_airport_id)) {
    errors.push("Stops may not include start/end airports");
  }

  return { errors, clean: { ...fd, airport_stop_ids: stops } };
}

const FlightsPage = () => {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentFlight, setCurrentFlight] = useState(null);
  const [formData, setFormData] = useState({
    flight_number: "",
    departure_day: "Monday",
    start_airport_id: "",
    end_airport_id: "",
    airport_stop_ids: "[]",
    seat_limit: 6,
    status: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [dayFilter, setDayFilter] = useState("ALL DAYS");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Fetch flights and airports
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [flightsData, airportsData] = await Promise.all([
          authenticatedFetch(`${BASE_URL}/flights`).then(res => res.json()),
          API.airports.getAirports(),
        ]);

        const airportIds = new Set(airportsData.map((a) => a.id));
        const normalizedFlights = flightsData.map((flight) => {
          const stops = normaliseStops(flight.airport_stop_ids);
          return { ...flight, airport_stop_ids: stops };
        });

        setFlights(normalizedFlights);
        setAirports(airportsData);
      } catch (error) {
        toast.error("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "seat_limit" || name.includes("airport_id") ? Number(value) : value,
    });
  };

  // Handle airport stops change
  const handleStopsChange = (e) => {
    const { value, checked } = e.target;
    const currentStops = normaliseStops(formData.airport_stop_ids);
    let updatedStops;
    if (checked) {
      updatedStops = [...currentStops, Number(value)];
    } else {
      updatedStops = currentStops.filter((id) => id !== Number(value));
    }
    setFormData({
      ...formData,
      airport_stop_ids: JSON.stringify(updatedStops),
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { errors, clean } = validateFlightBody(formData);
    if (errors.length) {
      toast.error(errors[0]);
      setIsLoading(false);
      return;
    }

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${BASE_URL}/flights/${currentFlight.id}` : `${BASE_URL}/flights`;

    try {
      const payload = {
        ...clean,
        airport_stop_ids: normaliseStops(clean.airport_stop_ids),
      };

      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          flight_number: "",
          departure_day: "Monday",
          start_airport_id: "",
          end_airport_id: "",
          airport_stop_ids: "[]",
          seat_limit: 6,
          status: 1,
        });
        setIsEdit(false);
        toast.success(isEdit ? "Flight updated!" : "Flight added!");

        // Refresh flights
        const flightsData = await authenticatedFetch(`${BASE_URL}/flights`).then(res => res.json());
        const normalizedFlights = flightsData.map((flight) => ({
          ...flight,
          airport_stop_ids: normaliseStops(flight.airport_stop_ids),
        }));
        setFlights(normalizedFlights);
      } else {
        const errorText = await response.text();
        throw new Error(`Error saving flight: ${errorText}`);
      }
    } catch (error) {
      toast.error(`Failed to save flight: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirmation
  const confirmDelete = async () => {
    if (!showDeleteConfirm) return;
    setIsLoading(true);
    try {
      await API.admin.deleteFlight(showDeleteConfirm);

      setFlights(flights.filter((f) => f.id !== showDeleteConfirm));
      toast.success("Flight deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete flight.");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(null);
    }
  };

  // Handle edit
  const handleEdit = (flight) => {
    setIsEdit(true);
    setCurrentFlight(flight);
    setFormData({
      flight_number: flight.flight_number,
      departure_day: flight.departure_day,
      start_airport_id: flight.start_airport_id,
      end_airport_id: flight.end_airport_id,
      airport_stop_ids: JSON.stringify(normaliseStops(flight.airport_stop_ids)),
      seat_limit: flight.seat_limit,
      status: flight.status,
    });
    setShowModal(true);
  };

  // Handle status toggle
  const handleStatusToggle = async (flight) => {
    setIsLoading(true);
    const newStatus = flight.status === 1 ? 0 : 1;
    const updatedFlight = {
      flight_number: flight.flight_number,
      departure_day: flight.departure_day,
      start_airport_id: flight.start_airport_id,
      end_airport_id: flight.end_airport_id,
      airport_stop_ids: normaliseStops(flight.airport_stop_ids),
      seat_limit: flight.seat_limit,
      status: newStatus,
    };
    
    try {
      await API.admin.updateFlight(flight.id, updatedFlight);
      setFlights(flights.map((f) => (f.id === flight.id ? { ...f, status: newStatus } : f)));
      toast.success(`Flight ${newStatus === 1 ? "activated" : "deactivated"}!`);
    } catch (error) {
      console.error('Status toggle error:', error);
      toast.error(error.message || "Failed to update status.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get airport name by ID
  const getAirportName = (id) => {
    const airport = airports.find((a) => a.id === id);
    if (!airport) {
      return `Invalid ID: ${id}`;
    }
    return airport.airport_name;
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtered and sorted flights
  const filteredFlights = useMemo(() => {
    let filtered = flights.filter((flight) => {
      const lower = searchTerm.toLowerCase();
      const matchesSearch =
        flight.flight_number.toLowerCase().includes(lower) ||
        getAirportName(flight.start_airport_id).toLowerCase().includes(lower) ||
        getAirportName(flight.end_airport_id).toLowerCase().includes(lower);

      const matchesDay = dayFilter === "ALL DAYS" || flight.departure_day === dayFilter;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && flight.status === 1) ||
        (statusFilter === "Inactive" && flight.status === 0);

      return matchesSearch && matchesDay && matchesStatus;
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
  }, [flights, searchTerm, dayFilter, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredFlights.length / entriesPerPage) || 1;
  const paginatedFlights = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredFlights.slice(start, start + entriesPerPage);
  }, [filteredFlights, currentPage, entriesPerPage]);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowsUpDownIcon className="w-4 h-4 text-slate-400" />;
    }
    return sortConfig.direction === 'asc' ?
      <ArrowsUpDownIcon className="w-4 h-4 text-blue-500 rotate-180" /> :
      <ArrowsUpDownIcon className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="space-y-8 " >
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl">
              <PaperAirplaneIcon className="w-8 h-8 text-white" />
            </div>
            Flight Management
          </h1>
          <p className="text-slate-600 mt-2">Manage flight schedules, routes, and capacity</p>
        </div>

        <button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg font-semibold"
          onClick={() => {
            setIsEdit(false);
            setFormData({
              flight_number: "",
              departure_day: "Monday",
              start_airport_id: "",
              end_airport_id: "",
              airport_stop_ids: "[]",
              seat_limit: 6,
              status: 1,
            });
            setShowModal(true);
          }}
          disabled={isLoading}
        >
          <PlusIcon className="w-5 h-5" />
          Add New Flight
        </button>
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
                placeholder="Search flights..."
              />
            </div>

            <select
              value={dayFilter}
              onChange={(e) => {
                setDayFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option>ALL DAYS</option>
              {WEEK_DAYS.map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
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
              {[10, 25, 50, 100].map((num) => (
                <option key={num}>{num}</option>
              ))}
            </select>
            <span className="text-sm text-slate-600">entries</span>
          </div>
        </div>
      </div>

      {/* Flight List */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <PaperAirplaneIcon className="w-6 h-6 text-blue-600" />
            Flight Directory ({filteredFlights.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { key: 'flight_number', label: 'Flight Number' },
                  { key: 'departure_day', label: 'Day' },
                  { key: 'start_airport_id', label: 'From' },
                  { key: 'end_airport_id', label: 'To' },
                  { key: 'seat_limit', label: 'Seats' },
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500">Loading flights...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedFlights.length ? (
                paginatedFlights.map((flight) => (
                  <tr key={flight.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <PaperAirplaneIcon className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-slate-900">{flight.flight_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{flight.departure_day}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <MapPinIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-900 truncate" title={getAirportName(flight.start_airport_id)}>
                          {getAirportName(flight.start_airport_id)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <MapPinIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-slate-900 truncate" title={getAirportName(flight.end_airport_id)}>
                          {getAirportName(flight.end_airport_id)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{flight.seat_limit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusToggle(flight)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${flight.status === 1
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        disabled={isLoading}
                      >
                        {flight.status === 1 ? (
                          <CheckCircleIcon className="w-3 h-3" />
                        ) : (
                          <XCircleIcon className="w-3 h-3" />
                        )}
                        {flight.status === 1 ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(flight)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          disabled={isLoading}
                          title="Edit flight"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(flight.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={isLoading}
                          title="Delete flight"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <PaperAirplaneIcon className="w-12 h-12 text-slate-300" />
                      <div>
                        <p className="text-slate-500 font-medium">No flights found</p>
                        <p className="text-slate-400 text-sm">
                          {searchTerm ? "Try adjusting your search terms" : "Add your first flight to get started"}
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
              disabled={currentPage === 1 || isLoading}
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
                    disabled={isLoading}
                    className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page
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
              disabled={currentPage === totalPages || isLoading}
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
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <PaperAirplaneIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <Dialog.Title className="text-xl font-semibold text-slate-900">
                      {isEdit ? "Edit Flight" : "Add New Flight"}
                    </Dialog.Title>
                  </div>
                  <button
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    onClick={() => setShowModal(false)}
                    disabled={isLoading}
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Flight Number
                      </label>
                      <input
                        type="text"
                        name="flight_number"
                        value={formData.flight_number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., FL001"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Departure Day
                      </label>
                      <select
                        name="departure_day"
                        value={formData.departure_day}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        disabled={isLoading}
                      >
                        {WEEK_DAYS.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Start Airport
                      </label>
                      <select
                        name="start_airport_id"
                        value={formData.start_airport_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        disabled={isLoading}
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
                        End Airport
                      </label>
                      <select
                        name="end_airport_id"
                        value={formData.end_airport_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        disabled={isLoading}
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
                        Seat Limit
                      </label>
                      <input
                        type="number"
                        name="seat_limit"
                        value={formData.seat_limit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        min="1"
                        required
                        disabled={isLoading}
                      />
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
                        disabled={isLoading}
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
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
                                checked={normaliseStops(formData.airport_stop_ids).includes(airport.id)}
                                onChange={handleStopsChange}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                disabled={
                                  isLoading ||
                                  airport.id === formData.start_airport_id ||
                                  airport.id === formData.end_airport_id
                                }
                              />
                              <label
                                htmlFor={`stop-airport-${airport.id}`}
                                className={`ml-2 text-sm cursor-pointer ${isLoading ||
                                  airport.id === formData.start_airport_id ||
                                  airport.id === formData.end_airport_id
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

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-semibold"
                      onClick={() => setShowModal(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 ${isEdit
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                        }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <PlusIcon className="w-5 h-5" />
                      )}
                      {isEdit ? "Update Flight" : "Add Flight"}
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
                  Are you sure you want to delete this flight? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                    onClick={() => setShowDeleteConfirm(null)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                    onClick={confirmDelete}
                    disabled={isLoading}
                  >
                    {isLoading ? (
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

export default FlightsPage;