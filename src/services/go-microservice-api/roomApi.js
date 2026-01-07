import { goHttpClient } from '../baseApi';

export const RoomService = {
    getRooms: async (params = {}) => {
        const response = await goHttpClient.get('/api/v1/rooms', params);
        return response.data;
    },

    createRoom: async (roomData) => {
        const response = await goHttpClient.post('/api/v1/rooms', roomData);
        return response.data;
    },

    getRoomById: async (id) => {
        const response = await goHttpClient.get(`/api/v1/rooms/${id}`);
        return response.data;
    },

    updateRoom: async (id, roomData) => {
        const response = await goHttpClient.put(`/api/v1/rooms/${id}`, roomData);
        return response.data;
    },

    getRoomsByHotel: async (hotelId) => {
        const response = await goHttpClient.get(`/api/v1/rooms/hotel/${hotelId}`);
        return response.data;
    },

    checkRoomAvailability: async (params = {}) => {
        const response = await goHttpClient.get('/api/v1/rooms/availability', params);
        return response.data;
    },

    getRoomAvailability: async (params = {}) => {
        const response = await goHttpClient.get('/api/v1/room-availability', params);
        return response.data;
    },

    createRoomAvailability: async (availabilityData) => {
        const response = await goHttpClient.post('/api/v1/room-availability', availabilityData);
        return response.data;
    },

    updateRoomAvailability: async (id, availabilityData) => {
        const response = await goHttpClient.put(`/api/v1/room-availability/${id}`, availabilityData);
        return response.data;
    },

    deleteRoomAvailability: async (id) => {
        const response = await goHttpClient.delete(`/api/v1/room-availability/${id}`);
        return response.data;
    },

    getRoomCategories: async () => {
        const response = await goHttpClient.get('/api/v1/room-categories');
        return response.data;
    },

    createRoomCategory: async (categoryData) => {
        const response = await goHttpClient.post('/api/v1/room-categories', categoryData);
        return response.data;
    },

    getRoomCategoryById: async (id) => {
        const response = await goHttpClient.get(`/api/v1/room-categories/${id}`);
        return response.data;
    },

    updateRoomCategory: async (id, categoryData) => {
        const response = await goHttpClient.put(`/api/v1/room-categories/${id}`, categoryData);
        return response.data;
    },

    deleteRoomCategory: async (id) => {
        const response = await goHttpClient.delete(`/api/v1/room-categories/${id}`);
        return response.data;
    }
};
