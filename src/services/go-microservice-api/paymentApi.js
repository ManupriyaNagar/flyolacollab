import { goHttpClient } from '../baseApi';

export const HotelPaymentService = {
    createOrder: async (orderData) => {
        const response = await goHttpClient.post('/api/v1/payments/create-order', orderData);
        return response.data;
    },

    processPayment: async (paymentData) => {
        const response = await goHttpClient.post('/api/v1/payments/process', paymentData);
        return response.data;
    },

    verifyPayment: async (verificationData) => {
        const response = await goHttpClient.post('/api/v1/payments/verify', verificationData);
        return response.data;
    },

    getPaymentByBooking: async (bookingId) => {
        const response = await goHttpClient.get(`/api/v1/payments/booking/${bookingId}`);
        return response.data;
    },

    getHotelPayments: async (params = {}) => {
        const response = await goHttpClient.get('/api/v1/payments', params);
        return response.data;
    },

    refreshPaymentStatus: async (paymentId) => {
        const response = await goHttpClient.post(`/api/v1/payments/${paymentId}/refresh`);
        return response.data;
    },

    processRefund: async (paymentId, refundData) => {
        const response = await goHttpClient.post(`/api/v1/payments/${paymentId}/refund`, refundData);
        return response.data;
    }
};
