import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { TaskDto } from '@/features/task/types';
import type {
  CreateDependencyPayload,
  TaskDependencyDto,
  TimelineTaskDto,
  UpdateTaskTimelinePayload,
} from '../types';

export const timelineService = {
  getProjectTimeline: async (projectId: string): Promise<TimelineTaskDto[]> => {
    const res = await apiClient.get<ApiResponse<TimelineTaskDto[]>>(`/projects/${projectId}/timeline`);
    return res.data.data;
  },

  updateTaskTimeline: async (
    taskId: string,
    data: UpdateTaskTimelinePayload
  ): Promise<TaskDto> => {
    const res = await apiClient.patch<ApiResponse<TaskDto>>(`/tasks/${taskId}/timeline`, data);
    return res.data.data;
  },

  createDependency: async (data: CreateDependencyPayload): Promise<TaskDependencyDto> => {
    const res = await apiClient.post<ApiResponse<TaskDependencyDto>>('/tasks/dependencies', data);
    return res.data.data;
  },

  deleteDependency: async (dependencyId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/tasks/dependencies/${dependencyId}`);
  },
};
