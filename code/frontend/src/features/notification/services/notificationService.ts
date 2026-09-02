import { apiClient } from '@/lib/apiClient';

export const notificationService = {
  async getNotifications() {
    const response = await apiClient.get('/notifications');
    return response.data;
  },
};
