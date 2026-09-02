import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { PageResponse } from '@/types';
import type { ActivityLogDto } from '../types';

export const activityService = {
  getUserActivities: async (page = 0, size = 20, entityType?: string): Promise<PageResponse<ActivityLogDto>> => {
    const res = await apiClient.get<ApiResponse<PageResponse<ActivityLogDto>>>('/activities', {
      params: { page, size, entityType },
    });
    return res.data.data;
  },

  getProjectActivities: async (projectId: string, page = 0, size = 20, entityType?: string): Promise<PageResponse<ActivityLogDto>> => {
    const res = await apiClient.get<ApiResponse<PageResponse<ActivityLogDto>>>(
      `/projects/${projectId}/activities`,
      { params: { page, size, entityType } }
    );
    return res.data.data;
  },

  getWorkspaceActivities: async (workspaceId: string, page = 0, size = 20, entityType?: string): Promise<PageResponse<ActivityLogDto>> => {
    const res = await apiClient.get<ApiResponse<PageResponse<ActivityLogDto>>>(
      `/workspaces/${workspaceId}/activities`,
      { params: { page, size, entityType } }
    );
    return res.data.data;
  },
};
