import { httpClient } from '../baseApi';

export class UserService {
    static async getProfile() {
        const response = await httpClient.get('/users/profile');
        return response.data;
    }

    static async updateProfile(profileData) {
        const response = await httpClient.put('/users/profile', profileData);
        return response.data;
    }

    static async changePassword(passwordData) {
        const response = await httpClient.put('/users/change-password', passwordData);
        return response.data;
    }

    static async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await httpClient.request('/users/avatar', {
            method: 'POST',
            body: formData,
            headers: {}, // Let browser set content-type for FormData
        });
        return response.data;
    }
}
