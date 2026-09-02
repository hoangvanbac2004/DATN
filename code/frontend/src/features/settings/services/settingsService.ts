import { apiClient } from '@/lib/apiClient';

export const settingsService = {
  async getSettings() {
    const response = await apiClient.get('/settings');
    return response.data;
  },
};
