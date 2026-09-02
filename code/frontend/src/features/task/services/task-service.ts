import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { CreateTaskInput, TaskDto, TaskFilterState, TaskStatus, UpdateTaskInput } from '../types';

export const taskService = {
  createWorkspaceTask: async (workspaceId: string, data: CreateTaskInput): Promise<TaskDto> => {
    const res = await apiClient.post<ApiResponse<TaskDto>>(`/workspaces/${workspaceId}/tasks`, data);
    return res.data.data;
  },

  getWorkspaceTasks: async (workspaceId: string, filters?: TaskFilterState): Promise<TaskDto[]> => {
    const res = await apiClient.get<ApiResponse<TaskDto[]>>(`/workspaces/${workspaceId}/tasks`, {
      params: filters,
    });
    return res.data.data;
  },

  createTask: async (projectId: string, data: CreateTaskInput): Promise<TaskDto> => {
    const res = await apiClient.post<ApiResponse<TaskDto>>(`/projects/${projectId}/tasks`, data);
    return res.data.data;
  },

  getProjectTasks: async (projectId: string, filters?: TaskFilterState): Promise<TaskDto[]> => {
    const res = await apiClient.get<ApiResponse<TaskDto[]>>(`/projects/${projectId}/tasks`, {
      params: filters,
    });
    return res.data.data;
  },

  getTaskDetails: async (taskId: string): Promise<TaskDto> => {
    const res = await apiClient.get<ApiResponse<TaskDto>>(`/tasks/${taskId}`);
    return res.data.data;
  },

  updateTask: async (taskId: string, data: UpdateTaskInput): Promise<TaskDto> => {
    const res = await apiClient.put<ApiResponse<TaskDto>>(`/tasks/${taskId}`, data);
    return res.data.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/tasks/${taskId}`);
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<TaskDto> => {
    const res = await apiClient.patch<ApiResponse<TaskDto>>(`/tasks/${taskId}/status`, { status });
    return res.data.data;
  },

  toggleArchiveTask: async (taskId: string): Promise<TaskDto> => {
    const res = await apiClient.patch<ApiResponse<TaskDto>>(`/tasks/${taskId}/archive`);
    return res.data.data;
  },

  reorderTask: async (taskId: string, position: number): Promise<TaskDto> => {
    const res = await apiClient.patch<ApiResponse<TaskDto>>(`/tasks/${taskId}/reorder`, { position });
    return res.data.data;
  },

  assignTask: async (taskId: string, assigneeId: string | null): Promise<TaskDto> => {
    const res = await apiClient.patch<ApiResponse<TaskDto>>(`/tasks/${taskId}/assign`, { assigneeId });
    return res.data.data;
  },
};
