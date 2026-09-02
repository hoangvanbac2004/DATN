import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { TaskDto } from '@/features/task/types';
import type { DashboardSummaryDto, ProductivityStatsDto } from '../types';

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummaryDto> => {
    const res = await apiClient.get<ApiResponse<DashboardSummaryDto>>('/dashboard/summary');
    return res.data.data;
  },

  getTodayTasks: async (): Promise<TaskDto[]> => {
    const res = await apiClient.get<ApiResponse<TaskDto[]>>('/dashboard/tasks/today');
    return res.data.data;
  },

  getUpcomingTasks: async (): Promise<TaskDto[]> => {
    const res = await apiClient.get<ApiResponse<TaskDto[]>>('/dashboard/tasks/upcoming');
    return res.data.data;
  },

  getOverdueTasks: async (): Promise<TaskDto[]> => {
    const res = await apiClient.get<ApiResponse<TaskDto[]>>('/dashboard/tasks/overdue');
    return res.data.data;
  },

  getProductivityStats: async (): Promise<ProductivityStatsDto[]> => {
    const res = await apiClient.get<ApiResponse<ProductivityStatsDto[]>>('/dashboard/productivity');
    return res.data.data;
  },
};
