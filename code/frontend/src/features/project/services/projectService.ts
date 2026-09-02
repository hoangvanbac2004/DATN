import { apiClient } from '@/lib/apiClient';

export const projectService = {
  async getProjects() {
    const response = await apiClient.get('/projects');
    return response.data;
  },
};
