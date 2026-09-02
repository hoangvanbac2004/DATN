import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { CreateTagInput, TagDto, UpdateTagInput } from '../types';

export const tagService = {
  getWorkspaceTags: async (workspaceId: string, search?: string): Promise<TagDto[]> => {
    const res = await apiClient.get<ApiResponse<TagDto[]>>(`/workspaces/${workspaceId}/tags`, {
      params: { search },
    });
    return res.data.data;
  },

  getTagDetails: async (tagId: string): Promise<TagDto> => {
    const res = await apiClient.get<ApiResponse<TagDto>>(`/tags/${tagId}`);
    return res.data.data;
  },

  createTag: async (workspaceId: string, data: CreateTagInput): Promise<TagDto> => {
    const res = await apiClient.post<ApiResponse<TagDto>>(`/workspaces/${workspaceId}/tags`, data);
    return res.data.data;
  },

  updateTag: async (tagId: string, data: UpdateTagInput): Promise<TagDto> => {
    const res = await apiClient.put<ApiResponse<TagDto>>(`/tags/${tagId}`, data);
    return res.data.data;
  },

  deleteTag: async (tagId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/tags/${tagId}`);
  },

  getTaskTags: async (taskId: string): Promise<TagDto[]> => {
    const res = await apiClient.get<ApiResponse<TagDto[]>>(`/tasks/${taskId}/tags`);
    return res.data.data;
  },

  assignTagToTask: async (taskId: string, tagId: string): Promise<TagDto[]> => {
    const res = await apiClient.post<ApiResponse<TagDto[]>>(`/tasks/${taskId}/tags/${tagId}`);
    return res.data.data;
  },

  removeTagFromTask: async (taskId: string, tagId: string): Promise<TagDto[]> => {
    const res = await apiClient.delete<ApiResponse<TagDto[]>>(`/tasks/${taskId}/tags/${tagId}`);
    return res.data.data;
  },
};
