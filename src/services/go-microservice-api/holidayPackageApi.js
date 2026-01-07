import { goHttpClient } from '../baseApi';

export class HolidayPackageService {
    // Package Management
    static async getAllPackages() {
        const response = await goHttpClient.get('/api/v1/holiday-packages');
        return response.data;
    }

    static async getPackageById(id) {
        const response = await goHttpClient.get(`/api/v1/holiday-packages/${id}`);
        return response.data;
    }

    static async getPackagesByType(type) {
        const response = await goHttpClient.get(`/api/v1/holiday-packages/type/${type}`);
        return response.data;
    }

    static async createPackage(packageData) {
        const response = await goHttpClient.post('/api/v1/holiday-packages', packageData);
        return response.data;
    }

    static async updatePackage(id, packageData) {
        const response = await goHttpClient.put(`/api/v1/holiday-packages/${id}`, packageData);
        return response.data;
    }

    static async deletePackage(id) {
        const response = await goHttpClient.delete(`/api/v1/holiday-packages/${id}`);
        return response.data;
    }

    // Package Booking Management
    static async createPackageBooking(bookingData) {
        const response = await goHttpClient.post('/api/v1/holiday-packages/book', bookingData);
        return response.data;
    }

    static async confirmPackageBooking(bookingId, paymentData) {
        const response = await goHttpClient.post(`/api/v1/holiday-packages/book/${bookingId}/confirm`, paymentData);
        return response.data;
    }

    static async getPackageBookingById(bookingId) {
        const response = await goHttpClient.get(`/api/v1/holiday-packages/bookings/${bookingId}`);
        return response.data;
    }

    static async getPackageBookingByReference(reference) {
        const response = await goHttpClient.get(`/api/v1/holiday-packages/bookings/reference/${reference}`);
        return response.data;
    }

    static async cancelPackageBooking(bookingId) {
        const response = await goHttpClient.delete(`/api/v1/holiday-packages/bookings/${bookingId}`);
        return response.data;
    }

    // Admin specific methods
    static async getAllPackageBookings(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await goHttpClient.get(`/api/v1/holiday-packages/admin/bookings${queryParams ? `?${queryParams}` : ''}`);
        return response.data;
    }

    static async getPackageAnalytics(dateRange = {}) {
        const response = await goHttpClient.get('/api/v1/holiday-packages/admin/analytics', { params: dateRange });
        return response.data;
    }
}