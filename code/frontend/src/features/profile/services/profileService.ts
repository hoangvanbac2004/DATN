import { apiClient } from '@/lib/apiClient';

export const profileService = {
  async getProfile() {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
};
