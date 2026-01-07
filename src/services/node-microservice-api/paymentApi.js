import { httpClient } from '../baseApi';

export class PaymentService {
    static async createPayment(paymentData) {
        const response = await httpClient.post('/payments', paymentData);
        return response.data;
    }

    static async getPaymentStatus(paymentId) {
        const response = await httpClient.get(`/payments/${paymentId}/status`);
        return response.data;
    }

    static async processRefund(paymentId, amount) {
        const response = await httpClient.post(`/payments/${paymentId}/refund`, { amount });
        return response.data;
    }
}
