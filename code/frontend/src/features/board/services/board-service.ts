import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { TaskDto } from '@/features/task/types';
import type {
  BoardColumnDto,
  BoardDto,
  CreateColumnPayload,
  MoveTaskPayload,
  ReorderColumnsPayload,
  UpdateBoardSettingsPayload,
  UpdateColumnPayload,
} from '../types';

export const boardService = {
  getProjectBoard: async (projectId: string): Promise<BoardDto> => {
    const res = await apiClient.get<ApiResponse<BoardDto>>(`/projects/${projectId}/board`);
    return res.data.data;
  },

  getBoardById: async (boardId: string): Promise<BoardDto> => {
    const res = await apiClient.get<ApiResponse<BoardDto>>(`/boards/${boardId}`);
    return res.data.data;
  },

  updateBoardSettings: async (
    boardId: string,
    data: UpdateBoardSettingsPayload
  ): Promise<BoardDto> => {
    const res = await apiClient.patch<ApiResponse<BoardDto>>(`/boards/${boardId}/settings`, data);
    return res.data.data;
  },

  addColumn: async (boardId: string, data: CreateColumnPayload): Promise<BoardColumnDto> => {
    const res = await apiClient.post<ApiResponse<BoardColumnDto>>(`/boards/${boardId}/columns`, data);
    return res.data.data;
  },

  updateColumn: async (columnId: string, data: UpdateColumnPayload): Promise<BoardColumnDto> => {
    const res = await apiClient.patch<ApiResponse<BoardColumnDto>>(`/board-columns/${columnId}`, data);
    return res.data.data;
  },

  deleteColumn: async (columnId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/board-columns/${columnId}`);
  },

  reorderColumns: async (boardId: string, data: ReorderColumnsPayload): Promise<BoardDto> => {
    const res = await apiClient.patch<ApiResponse<BoardDto>>(`/boards/${boardId}/columns/reorder`, data);
    return res.data.data;
  },

  moveTask: async (boardId: string, data: MoveTaskPayload): Promise<TaskDto> => {
    const res = await apiClient.post<ApiResponse<TaskDto>>(`/boards/${boardId}/tasks/move`, data);
    return res.data.data;
  },
};
