import { goHttpClient } from '../baseApi';

export const ReviewService = {
    getHotelReviews: async (hotelId) => {
        const response = await goHttpClient.get(`/api/v1/reviews/hotel/${hotelId}`);
        return response.data;
    },

    createReview: async (reviewData) => {
        const response = await goHttpClient.post('/api/v1/reviews', reviewData);
        return response.data;
    },

    getAllHotelReviews: async (params = {}) => {
        const response = await goHttpClient.get('/api/v1/reviews', params);
        return response;
    },

    updateReviewStatus: async (reviewId, statusData) => {
        const response = await goHttpClient.put(`/api/v1/reviews/${reviewId}/status`, statusData);
        return response.data;
    },

    deleteReview: async (reviewId) => {
        const response = await goHttpClient.delete(`/api/v1/reviews/${reviewId}`);
        return response.data;
    }
};
