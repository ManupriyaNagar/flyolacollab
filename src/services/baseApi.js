/**
 * Base API Configuration and Shared Logic
 */

import BASE_URL, { GO_BASE_URL } from '@/baseUrl/baseUrl';

// API Configuration
export const API_CONFIG = {
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
};

// Token management utilities
export const TokenManager = {
    getToken: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    },

    setToken: (token, remember = false) => {
        if (typeof window === 'undefined') return;
        if (remember) {
            localStorage.setItem('token', token);
        } else {
            sessionStorage.setItem('token', token);
        }
    },

    removeToken: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    },

    getAuthHeaders: () => {
        const token = TokenManager.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
};

// Custom API Error class
export class ApiError extends Error {
    constructor(message, status = 0, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// HTTP Client with interceptors
export class HttpClient {
    constructor(config = {}) {
        this.config = { ...API_CONFIG, ...config };
    }

    async request(endpoint, options = {}) {
        const url = `${this.config.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: {
                ...this.config.headers,
                ...TokenManager.getAuthHeaders(),
                ...options.headers,
            },
            ...options,
        };

        // Add timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        config.signal = controller.signal;

        try {
            const response = await fetch(url, config);
            clearTimeout(timeoutId);

            // Handle different response types
            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw new ApiError(data.message || data.error || 'Request failed', response.status, data);
            }

            return { data, status: response.status, headers: response.headers };
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new ApiError('Request timeout', 408);
            }

            if (error instanceof ApiError) {
                throw error;
            }

            throw new ApiError('Network error', 0, error);
        }
    }

    get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    patch(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Create HTTP client instances
export const httpClient = new HttpClient();
export const goHttpClient = new HttpClient({ baseURL: GO_BASE_URL });

// Debug logging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('BaseAPI initialized:', { 
    BASE_URL, 
    GO_BASE_URL,
    httpClientCreated: !!httpClient,
    goHttpClientCreated: !!goHttpClient
  });
}
