import { apiClient } from '@/lib/apiClient';

export const workspaceService = {
  async getWorkspaces() {
    const response = await apiClient.get('/workspaces');
    return response.data;
  },
};
