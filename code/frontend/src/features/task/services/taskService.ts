import { apiClient } from '@/lib/apiClient';

export const taskService = {
  async getTasks() {
    const response = await apiClient.get('/tasks');
    return response.data;
  },
};
