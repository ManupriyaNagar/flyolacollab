import { httpClient } from '../baseApi';

export class FlightService {
    static async getFlights(params = {}) {
        const response = await httpClient.get('/flights', { user: true, ...params });
        return response.data;
    }

    static async getFlightSchedules(params = {}) {
        const response = await httpClient.get('/flight-schedules', { user: true, ...params });
        return response.data;
    }

    static async getFlightById(id) {
        const response = await httpClient.get(`/flights/${id}`);
        return response.data;
    }

    static async searchFlights(searchParams) {
        const response = await httpClient.get('/flights/search', searchParams);
        return response.data;
    }
}
