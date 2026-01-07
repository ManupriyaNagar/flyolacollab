import { httpClient } from '../baseApi';

export class JoyRideService {
    static async getJoyRides(params = {}) {
        const response = await httpClient.get('/joy-rides', params);
        return response.data;
    }

    static async bookJoyRide(bookingData) {
        const response = await httpClient.post('/joy-rides/book', bookingData);
        return response.data;
    }

    static async getJoyRideSlots(date) {
        const response = await httpClient.get('/joy-rides/slots', { date });
        return response.data;
    }
}
