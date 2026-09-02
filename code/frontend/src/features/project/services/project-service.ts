import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { CreateProjectInput, ProjectDto, ProjectStatsDto, UpdateProjectInput } from '../types';

export const projectService = {
  createProject: async (workspaceId: string, data: CreateProjectInput): Promise<ProjectDto> => {
    const res = await apiClient.post<ApiResponse<ProjectDto>>(`/workspaces/${workspaceId}/projects`, data);
    return res.data.data;
  },

  getWorkspaceProjects: async (
    workspaceId: string,
    params?: { archived?: boolean; favorite?: boolean }
  ): Promise<ProjectDto[]> => {
    const res = await apiClient.get<ApiResponse<ProjectDto[]>>(`/workspaces/${workspaceId}/projects`, {
      params,
    });
    return res.data.data;
  },

  getProjectDetails: async (projectId: string): Promise<ProjectDto> => {
    const res = await apiClient.get<ApiResponse<ProjectDto>>(`/projects/${projectId}`);
    return res.data.data;
  },

  updateProject: async (projectId: string, data: UpdateProjectInput): Promise<ProjectDto> => {
    const res = await apiClient.put<ApiResponse<ProjectDto>>(`/projects/${projectId}`, data);
    return res.data.data;
  },

  deleteProject: async (projectId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/projects/${projectId}`);
  },

  toggleArchiveProject: async (projectId: string): Promise<ProjectDto> => {
    const res = await apiClient.patch<ApiResponse<ProjectDto>>(`/projects/${projectId}/archive`);
    return res.data.data;
  },

  toggleFavoriteProject: async (projectId: string): Promise<ProjectDto> => {
    const res = await apiClient.patch<ApiResponse<ProjectDto>>(`/projects/${projectId}/favorite`);
    return res.data.data;
  },

  getProjectStats: async (projectId: string): Promise<ProjectStatsDto> => {
    const res = await apiClient.get<ApiResponse<ProjectStatsDto>>(`/projects/${projectId}/stats`);
    return res.data.data;
  },
};
