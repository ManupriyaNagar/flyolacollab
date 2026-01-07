import { goHttpClient } from '../baseApi';

export const HotelBookingService = {
    getBookings: async (params = {}) => {
        const response = await goHttpClient.get('/api/v1/bookings', params);
        return response.data;
    },

    createBooking: async (bookingData) => {
        const response = await goHttpClient.post('/api/v1/bookings', bookingData);
        return response.data;
    },

    getBookingById: async (id) => {
        const response = await goHttpClient.get(`/api/v1/bookings/${id}`);
        return response.data;
    },

    cancelBooking: async (id) => {
        const response = await goHttpClient.put(`/api/v1/bookings/${id}/cancel`);
        return response.data;
    },

    updateBooking: async (id, bookingData) => {
        const response = await goHttpClient.put(`/api/v1/bookings/${id}`, bookingData);
        return response.data;
    },

    deleteBooking: async (id) => {
        const response = await goHttpClient.delete(`/api/v1/bookings/${id}`);
        return response.data;
    }
};
