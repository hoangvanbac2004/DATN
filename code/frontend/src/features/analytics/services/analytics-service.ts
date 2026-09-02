import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { AnalyticsPeriod, ProductivityOverviewDto } from '../types';

export const analyticsService = {
  getProductivityOverview: async (
    period: AnalyticsPeriod = 'WEEKLY',
    workspaceId?: string,
    projectId?: string
  ): Promise<ProductivityOverviewDto> => {
    const res = await apiClient.get<ApiResponse<ProductivityOverviewDto>>('/analytics/overview', {
      params: { period, workspaceId, projectId },
    });
    return res.data.data;
  },
};
