/**
 * API Utility Functions
 * Common utilities for API operations
 */

import { API_CONFIG, ERROR_MESSAGES, HTTP_STATUS } from './apiConstants';

// URL utilities
export const buildUrl = (baseUrl, endpoint, params = {}) => {
  let url = `${baseUrl}${endpoint}`;
  
  // Replace path parameters
  Object.keys(params).forEach(key => {
    if (url.includes(`:${key}`)) {
      url = url.replace(`:${key}`, params[key]);
      delete params[key];
    }
  });
  
  // Add query parameters
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      queryParams.append(key, params[key]);
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

// Request utilities
export const createRequestConfig = (options = {}) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

// Token management
export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const setStoredToken = (token, remember = false) => {
  if (typeof window === 'undefined') return;
  
  if (remember) {
    localStorage.setItem('token', token);
    sessionStorage.removeItem('token');
  } else {
    sessionStorage.setItem('token', token);
    localStorage.removeItem('token');
  }
};

export const removeStoredToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

// Error handling
export const handleApiError = (error, defaultMessage = ERROR_MESSAGES.UNKNOWN_ERROR) => {
  if (!error) return defaultMessage;

  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Timeout errors
  if (error.name === 'AbortError') {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }

  // HTTP errors
  if (error.status) {
    switch (error.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        removeStoredToken(); // Clear invalid token
        return ERROR_MESSAGES.UNAUTHORIZED;
      case HTTP_STATUS.FORBIDDEN:
        return ERROR_MESSAGES.FORBIDDEN;
      case HTTP_STATUS.NOT_FOUND:
        return ERROR_MESSAGES.NOT_FOUND;
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.BAD_GATEWAY:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return error.message || defaultMessage;
    }
  }

  // API errors with message
  if (error.message) {
    return error.message;
  }

  return defaultMessage;
};

// Response utilities
export const parseApiResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return await response.text();
};

export const isSuccessResponse = (status) => {
  return status >= 200 && status < 300;
};

// Retry logic
export const withRetry = async (fn, maxAttempts = API_CONFIG.RETRY_ATTEMPTS, delay = API_CONFIG.RETRY_DELAY) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxAttempts) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};

// Cache utilities
const cache = new Map();

export const getCachedData = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const { data, timestamp, ttl } = cached;
  if (Date.now() - timestamp > ttl) {
    cache.delete(key);
    return null;
  }
  
  return data;
};

export const setCachedData = (key, data, ttl = API_CONFIG.CACHE_DURATION) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
};

export const clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

// Request deduplication
const pendingRequests = new Map();

export const withDeduplication = async (key, requestFn) => {
  // If request is already pending, return the same promise
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }
  
  // Create new request
  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });
  
  pendingRequests.set(key, promise);
  return promise;
};

// File upload utilities
export const createFormData = (data, files = {}) => {
  const formData = new FormData();
  
  // Add regular data
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  // Add files
  Object.keys(files).forEach(key => {
    const file = files[key];
    if (file instanceof File) {
      formData.append(key, file);
    } else if (Array.isArray(file)) {
      file.forEach((f, index) => {
        if (f instanceof File) {
          formData.append(`${key}[${index}]`, f);
        }
      });
    }
  });
  
  return formData;
};

export const validateFileSize = (file, maxSize = 5 * 1024 * 1024) => {
  return file.size <= maxSize;
};

export const validateFileType = (file, allowedTypes = []) => {
  return allowedTypes.length === 0 || allowedTypes.includes(file.type);
};

// Query parameter utilities
export const serializeParams = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    
    if (value === null || value === undefined) {
      return;
    }
    
    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, item));
    } else if (typeof value === 'object') {
      searchParams.append(key, JSON.stringify(value));
    } else {
      searchParams.append(key, value);
    }
  });
  
  return searchParams.toString();
};

export const deserializeParams = (searchParams) => {
  const params = {};
  
  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      // Convert to array if multiple values
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      // Try to parse JSON
      try {
        params[key] = JSON.parse(value);
      } catch {
        params[key] = value;
      }
    }
  }
  
  return params;
};

// Date utilities for API
export const formatDateForApi = (date) => {
  if (!date) return null;
  
  if (typeof date === 'string') {
    return date;
  }
  
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  
  return null;
};

export const parseDateFromApi = (dateString) => {
  if (!dateString) return null;
  
  try {
    return new Date(dateString);
  } catch {
    return null;
  }
};

// Debounce utility for search
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for API calls
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Environment utilities
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

// Logging utilities
export const logApiCall = (method, url, data = null, response = null) => {
  if (isDevelopment()) {
  }
};

export const logApiError = (method, url, error) => {
  if (isDevelopment()) {
  }
};

export default {
  buildUrl,
  createRequestConfig,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  handleApiError,
  parseApiResponse,
  isSuccessResponse,
  withRetry,
  getCachedData,
  setCachedData,
  clearCache,
  withDeduplication,
  createFormData,
  validateFileSize,
  validateFileType,
  serializeParams,
  deserializeParams,
  formatDateForApi,
  parseDateFromApi,
  debounce,
  throttle,
  isDevelopment,
  isProduction,
  logApiCall,
  logApiError,
};