import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type {
  WikiPageDto,
  WikiPageTreeNodeDto,
  WikiPageVersionDto,
  CreateWikiPagePayload,
  UpdateWikiPagePayload,
} from '../types';

export const wikiService = {
  getWorkspaceWikiTree: async (workspaceId: string): Promise<WikiPageTreeNodeDto[]> => {
    const res = await apiClient.get<ApiResponse<WikiPageTreeNodeDto[]>>(
      `/workspaces/${workspaceId}/wiki/tree`
    );
    return res.data.data;
  },

  createPage: async (workspaceId: string, data: CreateWikiPagePayload): Promise<WikiPageDto> => {
    const res = await apiClient.post<ApiResponse<WikiPageDto>>(
      `/workspaces/${workspaceId}/wiki/pages`,
      data
    );
    return res.data.data;
  },

  getPageDetails: async (pageId: string): Promise<WikiPageDto> => {
    const res = await apiClient.get<ApiResponse<WikiPageDto>>(`/wiki/pages/${pageId}`);
    return res.data.data;
  },

  updatePage: async (pageId: string, data: UpdateWikiPagePayload): Promise<WikiPageDto> => {
    const res = await apiClient.put<ApiResponse<WikiPageDto>>(`/wiki/pages/${pageId}`, data);
    return res.data.data;
  },

  deletePage: async (pageId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/wiki/pages/${pageId}`);
  },

  getPageVersions: async (pageId: string): Promise<WikiPageVersionDto[]> => {
    const res = await apiClient.get<ApiResponse<WikiPageVersionDto[]>>(`/wiki/pages/${pageId}/versions`);
    return res.data.data;
  },
};
