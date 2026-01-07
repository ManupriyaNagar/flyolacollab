import { goHttpClient } from '../baseApi';

export const HotelCoreService = {
    getHotels: async (params = {}) => {
        const response = await goHttpClient.get('/api/v1/hotels', params);
        return response.data;
    },

    createHotel: async (hotelData) => {
        const response = await goHttpClient.post('/api/v1/hotels', hotelData);
        return response.data;
    },

    getHotelById: async (id) => {
        const response = await goHttpClient.get(`/api/v1/hotels/${id}`);
        return response.data;
    },

    updateHotel: async (id, hotelData) => {
        const response = await goHttpClient.put(`/api/v1/hotels/${id}`, hotelData);
        return response.data;
    },

    deleteHotel: async (id) => {
        const response = await goHttpClient.delete(`/api/v1/hotels/${id}`);
        return response.data;
    },

    getHotelsByCity: async (cityId) => {
        const response = await goHttpClient.get(`/api/v1/hotels/city/${cityId}`);
        return response.data;
    }
};
