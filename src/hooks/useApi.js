/**
 * Custom React Hooks for API Operations
 * Professional API hooks for clean component integration
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import API, { ApiError } from '@/services/api';
import { toast } from 'react-toastify';

// Generic API hook for any API call
export const useApi = (apiCall, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const {
    immediate = true,
    onSuccess,
    onError,
    showErrorToast = true,
    showSuccessToast = false,
  } = options;

  const execute = useCallback(async (...args) => {
    if (!mountedRef.current) return;
    
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(...args);
      
      if (!mountedRef.current) return;
      
      setData(result);
      
      if (showSuccessToast) {
        toast.success('Operation completed successfully');
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      if (!mountedRef.current) return;
      
      setError(err);
      
      if (showErrorToast) {
        const message = API.isApiError(err) ? err.message : 'An unexpected error occurred';
        toast.error(message);
      }
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiCall, onSuccess, onError, showErrorToast, showSuccessToast]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};

// Authentication hooks
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials, remember = false) => {
    setLoading(true);
    try {
      const result = await API.auth.login(credentials);
      API.token.setToken(result.token, remember);
      setUser(result.user);
      toast.success('Welcome back!');
      return result;
    } catch (error) {
      const message = API.isApiError(error) ? error.message : 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const result = await API.auth.register(userData);
      toast.success('Account created successfully! Please sign in.');
      return result;
    } catch (error) {
      const message = API.isApiError(error) ? error.message : 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await API.auth.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      // Still clear local state even if API call fails
      API.token.removeToken();
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};

// Flight-related hooks
export const useFlights = (params = {}) => {
  return useApi(
    () => API.flights.getFlights(params),
    [JSON.stringify(params)],
    { immediate: true }
  );
};

export const useFlightSchedules = (params = {}) => {
  return useApi(
    () => API.flights.getFlightSchedules(params),
    [JSON.stringify(params)],
    { immediate: true }
  );
};

export const useFlightSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await API.flights.searchFlights(searchParams);
      setResults(data);
      return data;
    } catch (err) {
      setError(err);
      toast.error('Search failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    search,
  };
};

// Airport hooks
export const useAirports = () => {
  return useApi(
    () => API.airports.getAirports(),
    [],
    { immediate: true }
  );
};

// Booking hooks
export const useBookings = (params = {}) => {
  return useApi(
    () => API.bookings.getBookings(params),
    [JSON.stringify(params)],
    { immediate: true }
  );
};

export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);

  const createBooking = useCallback(async (bookingData) => {
    setLoading(true);
    try {
      const result = await API.bookings.createBooking(bookingData);
      toast.success('Booking created successfully!');
      return result;
    } catch (error) {
      const message = API.isApiError(error) ? error.message : 'Booking failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createBooking,
    loading,
  };
};

export const useAvailableSeats = (scheduleId, bookDate) => {
  return useApi(
    () => API.bookings.getAvailableSeats(scheduleId, bookDate),
    [scheduleId, bookDate],
    { 
      immediate: !!(scheduleId && bookDate),
      showErrorToast: false // Handle errors silently for seats
    }
  );
};

// User profile hooks
export const useProfile = () => {
  return useApi(
    () => API.users.getProfile(),
    [],
    { immediate: true }
  );
};

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      const result = await API.users.updateProfile(profileData);
      toast.success('Profile updated successfully!');
      return result;
    } catch (error) {
      const message = API.isApiError(error) ? error.message : 'Update failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateProfile,
    loading,
  };
};

// Payment hooks
export const usePayment = () => {
  const [loading, setLoading] = useState(false);

  const createPayment = useCallback(async (paymentData) => {
    setLoading(true);
    try {
      const result = await API.payments.createPayment(paymentData);
      return result;
    } catch (error) {
      const message = API.isApiError(error) ? error.message : 'Payment failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkPaymentStatus = useCallback(async (paymentId) => {
    try {
      const result = await API.payments.getPaymentStatus(paymentId);
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    createPayment,
    checkPaymentStatus,
    loading,
  };
};

// Admin hooks
export const useAdminStats = () => {
  return useApi(
    () => API.admin.getDashboardStats(),
    [],
    { immediate: true }
  );
};

export const useAdminUsers = (params = {}) => {
  return useApi(
    () => API.admin.getUsers(params),
    [JSON.stringify(params)],
    { immediate: true }
  );
};

// Joy ride hooks
export const useJoyRides = (params = {}) => {
  return useApi(
    () => API.joyRides.getJoyRides(params),
    [JSON.stringify(params)],
    { immediate: true }
  );
};

export const useJoyRideSlots = (date) => {
  return useApi(
    () => API.joyRides.getJoyRideSlots(date),
    [date],
    { immediate: !!date }
  );
};

// Charter hooks
export const useCharterOptions = () => {
  return useApi(
    () => API.charter.getCharterOptions(),
    [],
    { immediate: true }
  );
};

export const useCharterQuote = () => {
  const [loading, setLoading] = useState(false);

  const getQuote = useCallback(async (quoteData) => {
    setLoading(true);
    try {
      const result = await API.charter.getCharterQuote(quoteData);
      return result;
    } catch (error) {
      const message = API.isApiError(error) ? error.message : 'Quote request failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getQuote,
    loading,
  };
};

// Generic mutation hook for create/update/delete operations
export const useMutation = (mutationFn, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    onSuccess,
    onError,
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
  } = options;

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await mutationFn(...args);
      
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (showErrorToast) {
        const message = API.isApiError(err) ? err.message : 'Operation failed';
        toast.error(message);
      }
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, onSuccess, onError, showSuccessToast, showErrorToast, successMessage]);

  return {
    mutate,
    loading,
    error,
  };
};

// Polling hook for real-time data
export const usePolling = (apiCall, interval = 30000, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiCall();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const startPolling = useCallback(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, interval);
  }, [fetchData, interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startPolling();
    return stopPolling;
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    startPolling,
    stopPolling,
  };
};