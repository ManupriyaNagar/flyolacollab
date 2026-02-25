"use client";

import { FilterManager } from "@/lib/business/FilterManager";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaFilter, FaHelicopter, FaMapMarkerAlt, FaPlane, FaRoute, FaSort, FaTimes, FaUsers } from "react-icons/fa";

/**
 * Generic Filter Sidebar Component
 * Works for both flights and helicopters
 * @security All filter logic is handled by FilterManager
 */
export default function FilterSidebar({
  type = "flight", // "flight" or "helicopter"
  locations = [], // airports or helipads
  filters,
  onFilterChange,
  isOpen = false,
  onClose
}) {
  const [localFilters, setLocalFilters] = useState(() => 
    FilterManager.mergeWithDefaults(filters)
  );
  const [errors, setErrors] = useState({});

  // Configuration based on type
  const config = useMemo(() => ({
    flight: {
      icon: FaPlane,
      label: "Flight",
      statusLabel: "Flight Status",
      departureLabel: "Departure Airport",
      arrivalLabel: "Arrival Airport"
    },
    helicopter: {
      icon: FaHelicopter,
      label: "Helicopter",
      statusLabel: "Helicopter Status",
      departureLabel: "Departure Helipad",
      arrivalLabel: "Arrival Helipad"
    }
  }), []);

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  // Count active filters
  const activeFilterCount = useMemo(() => 
    FilterManager.countActiveFilters(localFilters),
    [localFilters]
  );

  // Get filter summary
  const filterSummary = useMemo(() => 
    FilterManager.getFilterSummary(localFilters),
    [localFilters]
  );

  // Get location options
  const locationOptions = useMemo(() => 
    FilterManager.getLocationOptions(locations, type),
    [locations, type]
  );

  // Get minimum date (today in IST)
  const minDate = useMemo(() => {
    const today = new Date();
    const istDate = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    return istDate.toISOString().split('T')[0];
  }, []);

  /**
   * Handle filter change with validation
   */
  const handleFilterChange = useCallback((field, value) => {
    // Sanitize input
    const sanitized = FilterManager.sanitizeFilters({ [field]: value });
    const newValue = sanitized[field] !== undefined ? sanitized[field] : value;
    
    // Update local state
    const newFilters = { ...localFilters, [field]: newValue };
    setLocalFilters(newFilters);
    
    // Validate
    const validation = FilterManager.validateFilters(newFilters);
    setErrors(validation.errors);
    
    // Notify parent if valid
    if (validation.valid) {
      onFilterChange?.(newFilters);
    }
  }, [localFilters, onFilterChange]);

  /**
   * Clear all filters
   */
  const handleClearAll = useCallback(() => {
    const defaultFilters = FilterManager.getDefaultFilters();
    setLocalFilters(defaultFilters);
    setErrors({});
    onFilterChange?.(defaultFilters);
  }, [onFilterChange]);

  /**
   * Sync with external filter changes
   */
  useEffect(() => {
    if (filters) {
      setLocalFilters(FilterManager.mergeWithDefaults(filters));
    }
  }, [filters]);

  /**
   * Filter Section Component
   */
  const FilterSection = useCallback(({ icon: SectionIcon, title, children, error }) => (
    <motion.div 
      className={cn(
        "mb-6 bg-gray-50 rounded-xl p-4 border transition-colors",
        error ? "border-red-300" : "border-gray-100 hover:border-blue-200"
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className={cn('flex', 'items-center', 'mb-3')}>
        <SectionIcon className={cn("mr-2", error ? "text-red-600" : "text-blue-600")} size={16} />
        <label className={cn('text-sm', 'font-semibold', 'text-gray-800')}>{title}</label>
      </div>
      {children}
      {error && (
        <p className={cn('mt-2', 'text-xs', 'text-red-600')}>{error}</p>
      )}
    </motion.div>
  ), []);

  return (
    <AnimatePresence>
      <motion.aside 
        className={cn(
          "bg-white shadow-xl border-r border-gray-200 h-full overflow-y-auto",
          isOpen ? "block" : "hidden",
          "md:block"
        )}
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="p-6">
          {/* Header */}
          <div className={cn('flex', 'items-center', 'justify-between', 'mb-6')}>
            <div className={cn('flex', 'items-center')}>
              <FaFilter className={cn('text-blue-600', 'mr-3')} size={20} />
              <h2 className={cn('text-xl', 'font-bold', 'text-gray-800')}>Filters</h2>
              {activeFilterCount > 0 && (
                <span className={cn('ml-2', 'bg-blue-100', 'text-blue-800', 'text-xs', 'font-medium', 'px-2', 'py-1', 'rounded-full')}>
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button
              className={cn('md:hidden', 'text-gray-500', 'hover:text-gray-700', 'p-2', 'rounded-lg', 'hover:bg-gray-100', 'transition-colors')}
              onClick={onClose}
              aria-label="Close filters"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Clear All Filters */}
          {activeFilterCount > 0 && (
            <motion.button
              onClick={handleClearAll}
              className={cn('w-full', 'mb-6', 'px-4', 'py-2', 'text-sm', 'font-medium', 'text-red-600', 'bg-red-50', 'border', 'border-red-200', 'rounded-lg', 'hover:bg-red-100', 'transition-colors')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear All Filters
            </motion.button>
          )}

          {/* Date Filter */}
          <FilterSection icon={FaCalendarAlt} title="Travel Date" error={errors.date}>
            <input
              type="date"
              value={localFilters.date || minDate}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className={cn(
                "w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all",
                errors.date 
                  ? "border-red-300 focus:ring-red-500" 
                  : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
              )}
              min={minDate}
            />
          </FilterSection>

          {/* Departure Filter */}
          <FilterSection icon={FaMapMarkerAlt} title={currentConfig.departureLabel}>
            <select
              value={localFilters.departure || ''}
              onChange={(e) => handleFilterChange('departure', e.target.value)}
              className={cn('w-full', 'p-3', 'text-sm', 'border', 'border-gray-300', 'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all', 'bg-white')}
            >
              <option value="">All {currentConfig.departureLabel}s</option>
              {locationOptions.map((option, index) => (
                <option key={`dep-${index}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterSection>

          {/* Arrival Filter */}
          <FilterSection icon={FaMapMarkerAlt} title={currentConfig.arrivalLabel}>
            <select
              value={localFilters.arrival || ''}
              onChange={(e) => handleFilterChange('arrival', e.target.value)}
              className={cn('w-full', 'p-3', 'text-sm', 'border', 'border-gray-300', 'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all', 'bg-white')}
            >
              <option value="">All {currentConfig.arrivalLabel}s</option>
              {locationOptions.map((option, index) => (
                <option key={`arr-${index}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterSection>

          {/* Status Filter */}
          <FilterSection icon={Icon} title={currentConfig.statusLabel}>
            <select
              value={localFilters.status || 'All'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={cn('w-full', 'p-3', 'text-sm', 'border', 'border-gray-300', 'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all', 'bg-white')}
            >
              <option value="All">All Status</option>
              <option value="Scheduled">✈️ Scheduled</option>
              <option value="Departed">🛫 Departed</option>
            </select>
          </FilterSection>

          {/* Minimum Seats Filter */}
          <FilterSection icon={FaUsers} title="Minimum Seats Required" error={errors.passengers}>
            <div className="relative">
              <input
                type="number"
                value={localFilters.passengers || 0}
                onChange={(e) => handleFilterChange('passengers', e.target.value)}
                min="0"
                max="10"
                className={cn(
                  "w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all",
                  errors.passengers
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                )}
                placeholder="Enter number of seats"
              />
              <div className={cn('mt-2', 'text-xs', 'text-gray-500')}>
                {localFilters.passengers > 0 
                  ? `${localFilters.passengers} seat${localFilters.passengers > 1 ? 's' : ''} minimum` 
                  : 'Any number of seats'}
              </div>
            </div>
          </FilterSection>

          {/* Stops Filter */}
          <FilterSection icon={FaRoute} title="Number of Stops">
            <select
              value={localFilters.stops || 'All'}
              onChange={(e) => handleFilterChange('stops', e.target.value)}
              className={cn('w-full', 'p-3', 'text-sm', 'border', 'border-gray-300', 'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all', 'bg-white')}
            >
              <option value="All">All {currentConfig.label}s</option>
              <option value="0">🚀 Non-Stop (Direct)</option>
              <option value="1">🔄 1 Stop</option>
              <option value="2">🔄 2 Stops</option>
              <option value="3">🔄 3 Stops</option>
            </select>
          </FilterSection>

          {/* Sort Options */}
          <FilterSection icon={FaSort} title="Sort Results By">
            <select
              value={localFilters.sortOption || 'Price: Low to High'}
              onChange={(e) => handleFilterChange('sortOption', e.target.value)}
              className={cn('w-full', 'p-3', 'text-sm', 'border', 'border-gray-300', 'rounded-lg', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:border-transparent', 'transition-all', 'bg-white')}
            >
              <option value="Price: Low to High">💰 Price: Low to High</option>
              <option value="Price: High to Low">💰 Price: High to Low</option>
              <option value="Departure Time">⏰ Departure Time</option>
            </select>
          </FilterSection>

          {/* Filter Summary */}
          <div className={cn('mt-6', 'p-4', 'bg-blue-50', 'rounded-xl', 'border', 'border-blue-200')}>
            <h3 className={cn('text-sm', 'font-semibold', 'text-blue-800', 'mb-2')}>Active Filters Summary</h3>
            <div className={cn('text-xs', 'text-blue-600', 'space-y-1')}>
              {filterSummary.length > 0 ? (
                filterSummary.map((item, index) => (
                  <div key={index}>• {item.label}: {item.value}</div>
                ))
              ) : (
                <div className="text-gray-500">No filters applied</div>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className={cn('mt-4', 'p-3', 'bg-gray-100', 'rounded-lg', 'border', 'border-gray-200')}>
            <p className={cn('text-xs', 'text-gray-600', 'text-center')}>
              🔒 All filters are validated and secured
            </p>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
