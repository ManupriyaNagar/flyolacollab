import { httpClient, TokenManager } from '../baseApi';

export class AuthService {
    static async login(credentials) {
        const response = await httpClient.post('/users/login', credentials);
        return response.data;
    }

    static async register(userData) {
        const response = await httpClient.post('/users/register', userData);
        return response.data;
    }

    static async forgotPassword(email) {
        const response = await httpClient.post('/users/forgot-password', { email });
        return response.data;
    }

    static async resetPassword(token, password) {
        const response = await httpClient.post('/users/reset-password', { token, password });
        return response.data;
    }

    static async refreshToken() {
        const response = await httpClient.post('/users/refresh-token');
        return response.data;
    }

    static async logout() {
        try {
            await httpClient.post('/users/logout');
        } finally {
            TokenManager.removeToken();
        }
    }
}
