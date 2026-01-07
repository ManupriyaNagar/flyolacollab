import { httpClient } from '../baseApi';

export class AdminService {
    static async getDashboardStats() {
        const response = await httpClient.get('/admin/dashboard/stats');
        return response.data;
    }

    static async getUsers(params = {}) {
        const response = await httpClient.get('/admin/users', params);
        return response.data;
    }

    static async createFlight(flightData) {
        const response = await httpClient.post('/admin/flights', flightData);
        return response.data;
    }

    static async updateFlight(id, flightData) {
        const response = await httpClient.put(`/flights/${id}`, flightData);
        return response.data;
    }

    static async deleteFlight(id) {
        const response = await httpClient.delete(`/flights/${id}`);
        return response.data;
    }

    static async createAirport(airportData) {
        const response = await httpClient.post('/admin/airport', airportData);
        return response.data;
    }
}
