/**
 * Centralized API Service Layer
 * Professional API management for Flyola application
 */

// Base logic
import { ApiError, goHttpClient, httpClient, TokenManager } from './baseApi';

// Node.js Microservices
import { AdminService } from './node-microservice-api/adminApi';
import { AirportService } from './node-microservice-api/airportApi';
import { AuthService } from './node-microservice-api/authApi';
import { BookingService } from './node-microservice-api/bookingApi';
import { CharterService } from './node-microservice-api/charterApi';
import { FlightService } from './node-microservice-api/flightApi';
import { JoyRideService } from './node-microservice-api/joyRideApi';
import { PaymentService } from './node-microservice-api/paymentApi';
import { UserService } from './node-microservice-api/userApi';

// Go Microservices
import { HolidayPackageService } from './go-microservice-api/holidayPackageApi';
import { HotelService } from './go-microservice-api/hotelApi';

// Main API object - single point of access
const API = {
    // Services
    auth: AuthService,
    flights: FlightService,
    airports: AirportService,
    bookings: BookingService,
    payments: PaymentService,
    users: UserService,
    admin: AdminService,
    joyRides: JoyRideService,
    charter: CharterService,
    hotels: HotelService,
    holidayPackages: HolidayPackageService,
    
    systemSettings: {
        getBookingCutoffTime: () => httpClient.get('/system-settings/booking-cutoff-time'),
        updateBookingCutoffTime: (settings) => httpClient.put('/system-settings/booking-cutoff-time', settings),
        getAllSettings: () => httpClient.get('/system-settings/all'),
    },
    
    scheduleFile: {
        getCurrent: () => httpClient.get('/api/schedule-file/current'),
    },

    rescheduling: {
        getReschedulingDetails: (bookingId, bookingType, date = null) => {
            const url = `/rescheduling/details/${bookingId}?bookingType=${bookingType}${date ? `&date=${date}` : ''}`;
            return httpClient.get(url);
        },
        rescheduleFlightBooking: (bookingId, data) => httpClient.post(`/rescheduling/flight/${bookingId}`, data),
        rescheduleHelicopterBooking: (bookingId, data) => httpClient.post(`/rescheduling/helicopter/${bookingId}`, data),
        getReschedulingHistory: () => httpClient.get('/rescheduling/history'),
        createReschedulingOrder: (bookingId, data) => httpClient.post(`/rescheduling/create-order/${bookingId}`, data),
        verifyReschedulingPayment: (bookingId, data) => httpClient.post(`/rescheduling/verify-payment/${bookingId}`, data),
        adminReschedule: (bookingId, data) => httpClient.post(`/rescheduling/admin/${bookingId}`, data),
    },

    // Utilities
    token: TokenManager,
    client: httpClient,
    goClient: goHttpClient,

    // Error handling
    isApiError: (error) => error instanceof ApiError,
};

// Export everything
export default API;
export {
    AdminService, AirportService, ApiError, AuthService, BookingService, CharterService, FlightService, goHttpClient, HolidayPackageService, HotelService, httpClient, JoyRideService, PaymentService, TokenManager, UserService
};
