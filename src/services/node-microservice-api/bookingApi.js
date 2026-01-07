import { httpClient } from '../baseApi';

export class BookingService {
    static async createBooking(bookingData) {
        const response = await httpClient.post('/api/booking/ticket', bookingData);
        return response.data;
    }

    static async getBookings(params = {}) {
        const response = await httpClient.get('/bookings', params);
        return response.data;
    }

    static async getBookingById(id) {
        const response = await httpClient.get(`/bookings/${id}`);
        return response.data;
    }

    static async updateBooking(id, data) {
        const response = await httpClient.put(`/bookings/${id}`, data);
        return response.data;
    }

    static async cancelBooking(id) {
        const response = await httpClient.delete(`/bookings/${id}`);
        return response.data;
    }

    static async getAvailableSeats(scheduleId, bookDate) {
        const response = await httpClient.get('/booked-seat/available-seats', {
            schedule_id: scheduleId,
            bookDate: bookDate,
        });
        return response.data;
    }

    static async getAvailableHelicopterSeats(scheduleId, bookDate) {
        const response = await httpClient.get('/helicopter-seat/available-seats', {
            schedule_id: scheduleId,
            bookDate: bookDate,
        });
        return response.data;
    }
}
