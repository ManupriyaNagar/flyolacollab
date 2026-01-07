import { goHttpClient } from '../baseApi';

export const CityService = {
    getCities: async () => {
        const response = await goHttpClient.get('/api/v1/cities');
        return response.data;
    },

    createCity: async (cityData) => {
        const response = await goHttpClient.post('/api/v1/cities', cityData);
        return response.data;
    },

    getCityById: async (id) => {
        const response = await goHttpClient.get(`/api/v1/cities/${id}`);
        return response.data;
    },

    updateCity: async (id, cityData) => {
        const response = await goHttpClient.put(`/api/v1/cities/${id}`, cityData);
        return response.data;
    },

    deleteCity: async (id) => {
        const response = await goHttpClient.delete(`/api/v1/cities/${id}`);
        return response.data;
    }
};
