/**
 * Centralized Filter Management
 * All filter logic and validation in one place
 * @security This file contains critical business logic
 */

export class FilterManager {
  /**
   * Validate filter values
   */
  static validateFilters(filters) {
    const errors = {};
    
    // Validate date
    if (filters.date) {
      const selectedDate = new Date(filters.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'Cannot select past dates';
      }
    }
    
    // Validate passenger count
    if (filters.passengers !== undefined) {
      const passengers = parseInt(filters.passengers);
      if (isNaN(passengers) || passengers < 0 || passengers > 10) {
        errors.passengers = 'Passengers must be between 0 and 10';
      }
    }
    
    // Validate stops
    if (filters.stops && filters.stops !== 'All') {
      const stops = parseInt(filters.stops);
      if (isNaN(stops) || stops < 0 || stops > 5) {
        errors.stops = 'Invalid stops value';
      }
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Sanitize filter input
   */
  static sanitizeFilters(filters) {
    const sanitized = {};
    
    // Sanitize string inputs
    if (filters.departure) {
      sanitized.departure = filters.departure.trim().substring(0, 100);
    }
    
    if (filters.arrival) {
      sanitized.arrival = filters.arrival.trim().substring(0, 100);
    }
    
    // Sanitize numeric inputs
    if (filters.passengers !== undefined) {
      sanitized.passengers = Math.max(0, Math.min(10, parseInt(filters.passengers) || 0));
    }
    
    // Sanitize date
    if (filters.date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(filters.date)) {
        sanitized.date = filters.date;
      }
    }
    
    // Sanitize status
    if (filters.status) {
      const validStatuses = ['All', 'Scheduled', 'Departed'];
      sanitized.status = validStatuses.includes(filters.status) ? filters.status : 'All';
    }
    
    // Sanitize stops
    if (filters.stops) {
      const validStops = ['All', '0', '1', '2', '3', '4', '5'];
      sanitized.stops = validStops.includes(filters.stops.toString()) ? filters.stops : 'All';
    }
    
    // Sanitize sort option
    if (filters.sortOption) {
      const validSorts = ['Price: Low to High', 'Price: High to Low', 'Departure Time'];
      sanitized.sortOption = validSorts.includes(filters.sortOption) ? filters.sortOption : 'Price: Low to High';
    }
    
    return sanitized;
  }

  /**
   * Count active filters
   */
  static countActiveFilters(filters) {
    let count = 0;
    
    if (filters.departure) count++;
    if (filters.arrival) count++;
    if (filters.status && filters.status !== 'All') count++;
    if (filters.passengers && filters.passengers > 0) count++;
    if (filters.stops && filters.stops !== 'All') count++;
    if (filters.sortOption && filters.sortOption !== 'Price: Low to High') count++;
    
    return count;
  }

  /**
   * Get filter summary
   */
  static getFilterSummary(filters) {
    const summary = [];
    
    if (filters.departure) {
      summary.push({ label: 'From', value: filters.departure });
    }
    
    if (filters.arrival) {
      summary.push({ label: 'To', value: filters.arrival });
    }
    
    if (filters.status && filters.status !== 'All') {
      summary.push({ label: 'Status', value: filters.status });
    }
    
    if (filters.passengers && filters.passengers > 0) {
      summary.push({ label: 'Min Seats', value: filters.passengers });
    }
    
    if (filters.stops && filters.stops !== 'All') {
      const stopsText = filters.stops === '0' ? 'Non-Stop' : `${filters.stops} Stop${filters.stops > 1 ? 's' : ''}`;
      summary.push({ label: 'Stops', value: stopsText });
    }
    
    return summary;
  }

  /**
   * Apply filters to data
   */
  static applyFilters(data, filters) {
    if (!Array.isArray(data)) return [];
    
    return data.filter(item => {
      // Filter by departure
      if (filters.departure && item.departureCity !== filters.departure) {
        // Check if it's a multi-stop route
        if (!item.isMultiStop || !item.routeCities?.includes(filters.departure)) {
          return false;
        }
      }
      
      // Filter by arrival
      if (filters.arrival && item.arrivalCity !== filters.arrival) {
        // Check if it's a multi-stop route
        if (!item.isMultiStop || !item.routeCities?.includes(filters.arrival)) {
          return false;
        }
      }
      
      // Filter by status
      if (filters.status && filters.status !== 'All') {
        const statusMap = { 'Scheduled': 0, 'Departed': 1 };
        if (item.status !== statusMap[filters.status]) {
          return false;
        }
      }
      
      // Filter by minimum seats
      if (filters.passengers && filters.passengers > 0) {
        if (item.availableSeats < filters.passengers) {
          return false;
        }
      }
      
      // Filter by stops
      if (filters.stops && filters.stops !== 'All') {
        const requiredStops = parseInt(filters.stops);
        if (item.stops?.length !== requiredStops) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Sort filtered data
   */
  static sortData(data, sortOption) {
    if (!Array.isArray(data)) return [];
    
    const sorted = [...data];
    
    switch (sortOption) {
      case 'Price: Low to High':
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      
      case 'Price: High to Low':
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      
      case 'Departure Time':
        return sorted.sort((a, b) => {
          const timeA = new Date(`1970-01-01T${a.departure_time}:00Z`);
          const timeB = new Date(`1970-01-01T${b.departure_time}:00Z`);
          return timeA - timeB;
        });
      
      default:
        return sorted;
    }
  }

  /**
   * Get default filters
   */
  static getDefaultFilters() {
    const today = new Date();
    const istDate = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    
    return {
      departure: '',
      arrival: '',
      date: istDate.toISOString().split('T')[0],
      passengers: 1,
      status: 'All',
      stops: 'All',
      sortOption: 'Price: Low to High'
    };
  }

  /**
   * Reset filters to default
   */
  static resetFilters() {
    return this.getDefaultFilters();
  }

  /**
   * Merge filters with defaults
   */
  static mergeWithDefaults(filters) {
    return {
      ...this.getDefaultFilters(),
      ...filters
    };
  }

  /**
   * Validate location exists in list
   */
  static validateLocation(location, locationList) {
    if (!location) return true; // Empty is valid
    
    return locationList.some(loc => 
      loc.city === location || 
      loc.airport_code === location ||
      loc.helipad_code === location
    );
  }

  /**
   * Get location options for dropdown
   */
  static getLocationOptions(locations, type = 'flight') {
    if (!Array.isArray(locations)) return [];
    
    return locations.map(loc => ({
      value: loc.city,
      label: type === 'flight' 
        ? `${loc.city} (${loc.airport_code || 'N/A'})`
        : `${loc.city} (${loc.helipad_code || 'N/A'})`,
      code: loc.airport_code || loc.helipad_code
    }));
  }

  /**
   * Check if filters are modified from defaults
   */
  static areFiltersModified(filters) {
    const defaults = this.getDefaultFilters();
    
    return Object.keys(filters).some(key => {
      if (key === 'date') return false; // Date changes are normal
      return filters[key] !== defaults[key];
    });
  }
}

export default FilterManager;
