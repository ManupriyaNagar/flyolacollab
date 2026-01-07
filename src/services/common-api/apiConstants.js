/**
 * API Constants and Endpoints
 * Centralized API endpoint definitions
 */

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    LOGOUT: '/users/logout',
    REFRESH_TOKEN: '/users/refresh-token',
    FORGOT_PASSWORD: '/users/forgot-password',
    RESET_PASSWORD: '/users/reset-password',
    VERIFY_EMAIL: '/users/verify-email',
  },

  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/avatar',
    DELETE_ACCOUNT: '/users/account',
  },

  // Flights
  FLIGHTS: {
    LIST: '/flights',
    DETAIL: '/flights/:id',
    SEARCH: '/flights/search',
    SCHEDULES: '/flight-schedules',
    SCHEDULE_DETAIL: '/flight-schedules/:id',
  },

  // Airports
  AIRPORTS: {
    LIST: '/airport',
    DETAIL: '/airport/:id',
    SEARCH: '/airport/search',
  },

  // Bookings
  BOOKINGS: {
    CREATE: '/api/booking/ticket',
    LIST: '/bookings',
    DETAIL: '/bookings/:id',
    UPDATE: '/bookings/:id',
    CANCEL: '/bookings/:id',
    AVAILABLE_SEATS: '/booked-seat/available-seats',
  },

  // Payments
  PAYMENTS: {
    CREATE: '/payments',
    STATUS: '/payments/:id/status',
    REFUND: '/payments/:id/refund',
    HISTORY: '/payments/history',
  },

  // Joy Rides
  JOY_RIDES: {
    LIST: '/joy-rides',
    BOOK: '/joy-rides/book',
    SLOTS: '/joy-rides/slots',
    DETAIL: '/joy-rides/:id',
  },

  // Charter
  CHARTER: {
    OPTIONS: '/charter/options',
    REQUEST: '/charter/request',
    QUOTE: '/charter/quote',
    BOOKINGS: '/charter/bookings',
  },

  // Admin
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard/stats',
    USERS: '/admin/users',
    FLIGHTS: '/admin/flights',
    FLIGHT_DETAIL: '/admin/flights/:id',
    AIRPORTS: '/admin/airport',
    AIRPORT_DETAIL: '/admin/airport/:id',
    BOOKINGS: '/admin/bookings',
    REPORTS: '/admin/reports',
  },

  // Agent
  AGENT: {
    DASHBOARD: '/agent/dashboard',
    BOOKINGS: '/agent/bookings',
    COMMISSIONS: '/agent/commissions',
  },
};


export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};


export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
  IDLE: 'idle',
};


export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'You are not authorized. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  LOGOUT: 'Logged out successfully',
  REGISTER: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  BOOKING_CREATED: 'Booking created successfully!',
  BOOKING_CANCELLED: 'Booking cancelled successfully',
  PAYMENT_SUCCESS: 'Payment completed successfully',
  EMAIL_SENT: 'Email sent successfully',
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Request Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Cache Keys
export const CACHE_KEYS = {
  FLIGHTS: 'flights',
  AIRPORTS: 'airports',
  USER_PROFILE: 'user_profile',
  BOOKINGS: 'bookings',
  JOY_RIDES: 'joy_rides',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_DATA: 'userData',
  PREFERENCES: 'userPreferences',
  CART: 'bookingCart',
  SEARCH_HISTORY: 'searchHistory',
};

// API Rate Limiting
export const RATE_LIMIT = {
  REQUESTS_PER_MINUTE: 60,
  BURST_LIMIT: 10,
};

// WebSocket Events
export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  SEAT_UPDATE: 'seat-update',
  BOOKING_UPDATE: 'booking-update',
  FLIGHT_STATUS_UPDATE: 'flight-status-update',
};

export default {
  API_ENDPOINTS,
  HTTP_STATUS,
  API_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_CONFIG,
  DEFAULT_HEADERS,
  UPLOAD_CONFIG,
  PAGINATION,
  CACHE_KEYS,
  STORAGE_KEYS,
  RATE_LIMIT,
  WS_EVENTS,
};