"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { debounce } from "lodash";

const AddAirport = () => {
  const [city, setCity] = useState("");
  const [airportCode, setAirportCode] = useState("");
  const [airportName, setAirportName] = useState("");
  const [status, setStatus] = useState(1);
  const [locationType, setLocationType] = useState("airport"); // airport, helipad, both
  const [hasHelipad, setHasHelipad] = useState(false);
  const [helipadCode, setHelipadCode] = useState("");
  const [helipadName, setHelipadName] = useState("");
  const [airports, setAirports] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [bulkAction, setBulkAction] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [helipadFilter, setHelipadFilter] = useState('all');
  const [locationTypeFilter, setLocationTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const isAdmin = true;

  // Fetch airports (includes helipads as they're stored in Airport table)
  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/airport`);
      if (!response.ok) throw new Error("Failed to fetch airports");
      const data = await response.json();
      const validAirports = data.filter((airport) => airport.id);
      setAirports(validAirports);
    } catch (err) {
      setError("Failed to load airports. Please try again.");
      toast.error("Failed to load airports.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Validate airport code uniqueness
  const validateAirportCode = async (code, currentId = null) => {
    try {
      const response = await fetch(`${BASE_URL}/airport`);
      if (!response.ok) return false;
      const data = await response.json();
      return !data.some(
        (airport) => airport.airport_code === code && airport.id !== currentId
      );
    } catch {
      return false;
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city) {
      toast.error("City is required.");
      return;
    }

    // Validation based on location type
    if (locationType === "airport" || locationType === "both") {
      if (!airportCode || !airportName) {
        toast.error("Airport code and name are required for airport locations.");
        return;
      }
      if (airportCode.length !== 3) {
        toast.error("Airport code must be exactly 3 characters.");
        return;
      }
      if (!(await validateAirportCode(airportCode, editId))) {
        toast.error("Airport code already exists.");
        return;
      }
    }

    if (locationType === "helipad" || locationType === "both" || hasHelipad) {
      if (!helipadCode || !helipadName) {
        toast.error("Helipad code and name are required for helipad locations.");
        return;
      }
    }

    setLoading(true);
    const airportData = {
      city,
      status: Number(status),
    };

    // Set data based on location type
    if (locationType === "airport") {
      airportData.airport_code = airportCode;
      airportData.airport_name = airportName;
      airportData.has_helipad = false;
    } else if (locationType === "helipad") {
      // For helipad-only locations, DON'T set airport_code and airport_name
      // Only set helipad data
      airportData.has_helipad = true;
      airportData.helipad_code = helipadCode;
      airportData.helipad_name = helipadName;
      // airport_code and airport_name will be null/undefined
    } else if (locationType === "both") {
      airportData.airport_code = airportCode;
      airportData.airport_name = airportName;
      airportData.has_helipad = true;
      airportData.helipad_code = helipadCode;
      airportData.helipad_name = helipadName;
    }

    try {
      if (editMode) {
        const response = await fetch(`${BASE_URL}/airport/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(airportData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to update airport");
        setAirports((prev) =>
          prev.map((airport) =>
            airport.id === editId ? { ...airport, ...airportData, id: editId } : airport
          )
        );
        toast.success("Location updated successfully!");
      } else {
        const response = await fetch(`${BASE_URL}/airport`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(airportData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to add airport");
        setAirports((prev) => [
          ...prev,
          { ...airportData, id: data.airport.id || Date.now() },
        ]);
        toast.success("Location added successfully!");
      }
      // Reset form
      setCity("");
      setAirportCode("");
      setAirportName("");
      setStatus(1);
      setLocationType("airport");
      setHasHelipad(false);
      setHelipadCode("");
      setHelipadName("");
      setEditMode(false);
      setEditId(null);
    } catch (err) {
      toast.error(err.message || (editMode ? "Failed to update location." : "Failed to add location."));
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (airport) => {
    setCity(airport.city || "");
    setAirportCode(airport.airport_code || "");
    setAirportName(airport.airport_name || "");
    setStatus(airport.status ?? 1);
    setHasHelipad(airport.has_helipad || false);
    setHelipadCode(airport.helipad_code || "");
    setHelipadName(airport.helipad_name || "");
    
    // Determine location type based on existing data
    if (airport.has_helipad && !airport.airport_code) {
      // Helipad-only location (no airport code)
      setLocationType("helipad");
    } else if (airport.has_helipad && airport.airport_code) {
      // Airport with helipad (both codes present)
      setLocationType("both");
    } else {
      // Airport only
      setLocationType("airport");
    }
    
    setEditMode(true);
    setEditId(airport.id);
  };

  // Handle delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/airport/${deleteId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete airport");
      setAirports((prev) => prev.filter((airport) => airport.id !== deleteId));
      toast.success("Location deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete location.");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setDeleteId(null);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (!isAdmin) {
      toast.error("Admin access required for bulk operations.");
      return;
    }
    setLoading(true);
    try {
      let response;
      if (action === "activate") {
        response = await fetch(`${BASE_URL}/airport/activate`, { method: "PUT" });
      } else if (action === "delete") {
        response = await fetch(`${BASE_URL}/airport`, { method: "DELETE" });
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Failed to ${action} airports`);
      await fetchAirports();
      toast.success(`Airports ${action}d successfully!`);
    } catch (err) {
      toast.error(err.message || `Failed to ${action} airports.`);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setBulkAction(null);
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

  // Filtered airports
  const filteredAirports = useMemo(() => {
    let filtered = airports.filter((airport) => {
      const matchesSearch = [
        airport.city,
        airport.airport_code,
        airport.airport_name,
        airport.helipad_code,
        airport.helipad_name,
      ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && airport.status === 1) ||
        (statusFilter === 'inactive' && airport.status === 0);

      const matchesHelipad = helipadFilter === 'all' ||
        (helipadFilter === 'with' && airport.has_helipad) ||
        (helipadFilter === 'without' && !airport.has_helipad);

      const matchesLocationType = locationTypeFilter === 'all' ||
        (locationTypeFilter === 'airport' && !airport.has_helipad) ||
        (locationTypeFilter === 'helipad' && airport.has_helipad && !airport.airport_code) ||
        (locationTypeFilter === 'both' && airport.has_helipad && airport.airport_code);

      return matchesSearch && matchesStatus && matchesHelipad && matchesLocationType;
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
  }, [airports, searchTerm, statusFilter, helipadFilter, locationTypeFilter, sortConfig]);

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
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <MapPinIcon className="w-8 h-8 text-white" />
            </div>
            Location Management
          </h1>
          <p className="text-slate-600 mt-2">Manage airports, helipads, and aviation locations efficiently</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'table'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:text-slate-800'
                }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 hover:text-slate-800'
                }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            {editMode ? "Edit Location" : "Add New Location"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                City Name
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter city name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Location Type
              </label>
              <select
                value={locationType}
                onChange={(e) => {
                  const newType = e.target.value;
                  setLocationType(newType);
                  
                  // Reset fields when changing type
                  if (newType === "helipad") {
                    setAirportCode("");
                    setAirportName("");
                    setHasHelipad(true);
                  } else if (newType === "airport") {
                    setHasHelipad(false);
                    setHelipadCode("");
                    setHelipadName("");
                  } else if (newType === "both") {
                    setHasHelipad(true);
                  }
                }}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              >
                <option value="airport">Airport Only</option>
                <option value="helipad">Helipad Only</option>
                <option value="both">Airport + Helipad</option>
              </select>
            </div>

            {(locationType === "airport" || locationType === "both") && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Airport Code
                  </label>
                  <input
                    type="text"
                    value={airportCode}
                    onChange={(e) => setAirportCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., JFK"
                    required={locationType === "airport" || locationType === "both"}
                    maxLength={3}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Airport Name
                  </label>
                  <input
                    type="text"
                    value={airportName}
                    onChange={(e) => setAirportName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter airport name"
                    required={locationType === "airport" || locationType === "both"}
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>

          {/* Helipad Section */}
          {(locationType === "helipad" || locationType === "both") && (
            <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {locationType === "helipad" ? "Helipad Details" : "Helipad Facilities"}
                </h3>
              </div>

              {locationType === "both" && (
                <div className="mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasHelipad}
                      onChange={(e) => {
                        setHasHelipad(e.target.checked);
                        if (!e.target.checked) {
                          setHelipadCode("");
                          setHelipadName("");
                        }
                      }}
                      className="w-5 h-5 text-emerald-600 bg-white border-2 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2"
                      disabled={loading}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      This location has helipad facilities
                    </span>
                  </label>
                </div>
              )}

              {(locationType === "helipad" || hasHelipad) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Helipad Code
                    </label>
                    <input
                      type="text"
                      value={helipadCode}
                      onChange={(e) => setHelipadCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="e.g., MUM01"
                      required={locationType === "helipad" || hasHelipad}
                      maxLength={10}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Helipad Name
                    </label>
                    <input
                      type="text"
                      value={helipadName}
                      onChange={(e) => setHelipadName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter helipad name"
                      required={locationType === "helipad" || hasHelipad}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="submit"
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 ${editMode
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
              {editMode ? "Update Location" : "Add Location"}
            </button>

            {(editMode || city || airportCode || airportName || hasHelipad || helipadCode || helipadName) && (
              <button
                type="button"
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-200 font-semibold"
                onClick={() => {
                  setCity("");
                  setAirportCode("");
                  setAirportName("");
                  setStatus(1);
                  setLocationType("airport");
                  setHasHelipad(false);
                  setHelipadCode("");
                  setHelipadName("");
                  setEditMode(false);
                  setEditId(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search locations..."
                disabled={loading}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            <select
              value={locationTypeFilter}
              onChange={(e) => setLocationTypeFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Types</option>
              <option value="airport">Airport Only</option>
              <option value="helipad">Helipad Only</option>
              <option value="both">Airport + Helipad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Airport List */}
      {airports.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <GlobeAltIcon className="w-6 h-6 text-blue-600" />
                Location Directory ({filteredAirports.length})
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {[
                    { key: 'city', label: 'City' },
                    { key: 'airport_code', label: 'Code' },
                    { key: 'airport_name', label: 'Location Name' },
                    { key: 'location_type', label: 'Type' },
                    { key: 'has_helipad', label: 'Helipad Info' },
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
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-slate-500">Loading locations...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAirports.length ? (
                  filteredAirports.map((airport) => (
                    <tr
                      key={airport.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-900">{airport.city || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {airport.airport_code || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 max-w-[250px]">
                          <BuildingOfficeIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-slate-900 truncate" title={airport.airport_name || "N/A"}>
                            {airport.airport_name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          airport.has_helipad && !airport.airport_code
                            ? "bg-purple-100 text-purple-800" // Helipad only (no airport code)
                            : airport.has_helipad && airport.airport_code
                            ? "bg-blue-100 text-blue-800" // Airport + Helipad
                            : "bg-slate-100 text-slate-800" // Airport only
                        }`}>
                          {airport.has_helipad && !airport.airport_code
                            ? "Helipad"
                            : airport.has_helipad && airport.airport_code
                            ? "Airport + Helipad"
                            : "Airport"
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {airport.has_helipad ? (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                {airport.helipad_code || "Yes"}
                              </span>
                              {airport.helipad_name && (
                                <span className="text-xs text-slate-500 truncate max-w-[100px]" title={airport.helipad_name}>
                                  {airport.helipad_name}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                              No
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${airport.status === 1
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                          }`}>
                          {airport.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(airport)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            disabled={loading}
                            title="Edit airport"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(airport.id);
                              setShowConfirmModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={loading}
                            title="Delete airport"
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
                        <MapPinIcon className="w-12 h-12 text-slate-300" />
                        <div>
                          <p className="text-slate-500 font-medium">No locations found</p>
                          <p className="text-slate-400 text-sm">
                            {searchTerm ? "Try adjusting your search terms" : "Add your first location to get started"}
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
      )}

      {/* Confirmation Modal */}
      <Dialog
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-slate-900">
                Confirm Action
              </Dialog.Title>
            </div>

            <p className="text-slate-600 mb-6">
              {bulkAction
                ? `Are you sure you want to ${bulkAction} selected airports?`
                : "Are you sure you want to delete this location? This action cannot be undone."}
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                onClick={() => {
                  setShowConfirmModal(false);
                  setBulkAction(null);
                  setDeleteId(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                onClick={bulkAction ? () => handleBulkAction(bulkAction) : handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  bulkAction ? `${bulkAction.charAt(0).toUpperCase() + bulkAction.slice(1)}` : "Delete"
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AddAirport;