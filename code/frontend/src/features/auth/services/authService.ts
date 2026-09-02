import { apiClient } from '@/lib/apiClient';

export const authService = {
  async login(payload: Record<string, string>) {
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  },
};
