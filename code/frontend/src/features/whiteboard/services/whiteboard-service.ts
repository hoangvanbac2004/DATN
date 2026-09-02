import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type {
  WhiteboardDto,
  CreateWhiteboardPayload,
  UpdateWhiteboardPayload,
  SyncElementsPayload,
} from '../types';

export const whiteboardService = {
  getWorkspaceWhiteboards: async (workspaceId: string): Promise<WhiteboardDto[]> => {
    const res = await apiClient.get<ApiResponse<WhiteboardDto[]>>(
      `/workspaces/${workspaceId}/whiteboards`
    );
    return res.data.data;
  },

  createWhiteboard: async (workspaceId: string, data: CreateWhiteboardPayload): Promise<WhiteboardDto> => {
    const res = await apiClient.post<ApiResponse<WhiteboardDto>>(
      `/workspaces/${workspaceId}/whiteboards`,
      data
    );
    return res.data.data;
  },

  getWhiteboardDetails: async (whiteboardId: string): Promise<WhiteboardDto> => {
    const res = await apiClient.get<ApiResponse<WhiteboardDto>>(`/whiteboards/${whiteboardId}`);
    return res.data.data;
  },

  updateWhiteboard: async (whiteboardId: string, data: UpdateWhiteboardPayload): Promise<WhiteboardDto> => {
    const res = await apiClient.put<ApiResponse<WhiteboardDto>>(`/whiteboards/${whiteboardId}`, data);
    return res.data.data;
  },

  deleteWhiteboard: async (whiteboardId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/whiteboards/${whiteboardId}`);
  },

  syncElements: async (whiteboardId: string, data: SyncElementsPayload): Promise<WhiteboardDto> => {
    const res = await apiClient.post<ApiResponse<WhiteboardDto>>(
      `/whiteboards/${whiteboardId}/elements/sync`,
      data
    );
    return res.data.data;
  },
};
