import { goHttpClient } from '../baseApi';

export const NotificationService = {
    sendNotification: async (notificationData) => {
        const response = await goHttpClient.post('/api/v1/notifications/send', notificationData);
        return response.data;
    }
};
