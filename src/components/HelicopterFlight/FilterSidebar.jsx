"use client";

import { useState, useEffect } from "react";
import { FaFilter, FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaHelicopter, FaUsers, FaSort, FaRoute } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentISTDate } from "@/utils/getCurrentISTDate";

const FilterSidebar = ({
  helipads,
  sortOption,
  setSortOption,
  filterDepartureCity,
  setFilterDepartureCity,
  filterArrivalCity,
  setFilterArrivalCity,
  filterStatus,
  setFilterStatus,
  filterMinSeats,
  setFilterMinSeats,
  filterStops,
  setFilterStops,
  isFilterOpen,
  setIsFilterOpen,
  authState,
  setAuthState,
  dates,
  selectedDate,
  setSearchCriteria,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(authState.isLoggedIn);
  const [activeFilters, setActiveFilters] = useState(0);

  const formattedDate = getCurrentISTDate();

  useEffect(() => {
    setIsLoggedIn(authState.isLoggedIn);
  }, [authState.isLoggedIn]);

  useEffect(() => {
    // Count active filters
    let count = 0;
    if (filterDepartureCity) count++;
    if (filterArrivalCity) count++;
    if (filterStatus !== "All") count++;
    if (filterMinSeats > 0) count++;
    if (filterStops !== "All") count++;
    if (sortOption !== "Price: Low to High") count++;
    setActiveFilters(count);
  }, [filterDepartureCity, filterArrivalCity, filterStatus, filterMinSeats, filterStops, sortOption]);
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (setSearchCriteria) {
      setSearchCriteria((prev) => ({ ...prev, date: newDate }));
    }
  };

  const clearAllFilters = () => {
    setFilterDepartureCity("");
    setFilterArrivalCity("");
    setFilterStatus("All");
    setFilterMinSeats(0);
    setFilterStops("All");
    setSortOption("Price: Low to High");
    if (setSearchCriteria) {
      setSearchCriteria((prev) => ({ 
        ...prev, 
        departure: "", 
        arrival: "", 
        passengers: 1 
      }));
    }
  };

  const FilterSection = ({ icon: Icon, title, children }) => (
    <motion.div 
      className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-blue-200 transition-colors"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center mb-3">
        <Icon className="text-blue-600 mr-2" size={16} />
        <label className="text-sm font-semibold text-gray-800">{title}</label>
      </div>
      {children}
    </motion.div>
  );

  return (
    <AnimatePresence>
      <motion.aside 
        className={`bg-white shadow-xl border-r border-gray-200 h-full overflow-y-auto ${
          isFilterOpen ? "block" : "hidden"
        } md:block`}
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaFilter className="text-blue-600 mr-3" size={20} />
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              {activeFilters > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {activeFilters}
                </span>
              )}
            </div>
            <button
              className="md:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsFilterOpen(false)}
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Clear All Filters */}
          {activeFilters > 0 && (
            <motion.button
              onClick={clearAllFilters}
              className="w-full mb-6 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear All Filters
            </motion.button>
          )}

          {/* Date Filter */}
          <FilterSection icon={FaCalendarAlt} title="Travel Date">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              min={formattedDate}
            />
          </FilterSection>

          {/* Departure Filter */}
          <FilterSection icon={FaMapMarkerAlt} title="Departure City">
            <select
              value={filterDepartureCity}
              onChange={(e) => {
                setFilterDepartureCity(e.target.value);
                if (setSearchCriteria) {
                  setSearchCriteria((prev) => ({ ...prev, departure: e.target.value }));
                }
              }}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">All Departure Cities</option>
              {helipads && helipads.map((helipad) => (
                <option key={helipad.id} value={helipad.city}>
                  {helipad.city} ({helipad.name})
                </option>
              ))}
            </select>
          </FilterSection>

          {/* Arrival Filter */}
          <FilterSection icon={FaMapMarkerAlt} title="Arrival City">
            <select
              value={filterArrivalCity}
              onChange={(e) => {
                setFilterArrivalCity(e.target.value);
                if (setSearchCriteria) {
                  setSearchCriteria((prev) => ({ ...prev, arrival: e.target.value }));
                }
              }}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">All Arrival Cities</option>
              {helipads && helipads.map((helipad) => (
                <option key={helipad.id} value={helipad.city}>
                  {helipad.city} ({helipad.name})
                </option>
              ))}
            </select>
          </FilterSection>

          {/* Helicopter Status Filter */}
          <FilterSection icon={FaHelicopter} title="Helicopter Status">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="All">All Status</option>
              <option value="Scheduled">🚁 Scheduled</option>
              <option value="Departed">🛫 Departed</option>
            </select>
          </FilterSection>

          {/* Minimum Seats Filter */}
          <FilterSection icon={FaUsers} title="Minimum Seats Required">
            <div className="relative">
              <input
                type="number"
                value={filterMinSeats}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setFilterMinSeats(value);
                  if (setSearchCriteria) {
                    setSearchCriteria((prev) => ({ ...prev, passengers: value }));
                  }
                }}
                min="0"
                max="10"
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter number of seats"
              />
              <div className="mt-2 text-xs text-gray-500">
                {filterMinSeats > 0 ? `${filterMinSeats} seat${filterMinSeats > 1 ? 's' : ''} minimum` : 'Any number of seats'}
              </div>
            </div>
          </FilterSection>

          {/* Stops Filter */}
          <FilterSection icon={FaRoute} title="Number of Stops">
            <select
              value={filterStops}
              onChange={(e) => setFilterStops(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="All">All Flights</option>
              <option value="0">🚀 Non-Stop (Direct)</option>
              <option value="1">🔄 1 Stop</option>
              <option value="2">🔄 2 Stops</option>
            </select>
          </FilterSection>

          {/* Sort Options */}
          <FilterSection icon={FaSort} title="Sort Results By">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            >
              <option value="Price: Low to High">💰 Price: Low to High</option>
              <option value="Price: High to Low">💰 Price: High to Low</option>
              <option value="Departure Time">⏰ Departure Time</option>
            </select>
          </FilterSection>

          {/* Filter Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Active Filters Summary</h3>
            <div className="text-xs text-blue-600 space-y-1">
              {filterDepartureCity && <div>• From: {filterDepartureCity}</div>}
              {filterArrivalCity && <div>• To: {filterArrivalCity}</div>}
              {filterStatus !== "All" && <div>• Status: {filterStatus}</div>}
              {filterMinSeats > 0 && <div>• Min Seats: {filterMinSeats}</div>}
              {filterStops !== "All" && <div>• Stops: {filterStops === "0" ? "Non-Stop" : `${filterStops} Stop${filterStops > 1 ? 's' : ''}`}</div>}
              {activeFilters === 0 && <div className="text-gray-500">No filters applied</div>}
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );

};

export default FilterSidebar;