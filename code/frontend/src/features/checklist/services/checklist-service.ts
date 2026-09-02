import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type {
  BatchUpdateChecklistInput,
  ChecklistDto,
  ChecklistProgressDto,
  CreateChecklistInput,
  UpdateChecklistInput,
} from '../types';

export const checklistService = {
  getTaskChecklists: async (taskId: string): Promise<ChecklistDto[]> => {
    const res = await apiClient.get<ApiResponse<ChecklistDto[]>>(`/tasks/${taskId}/checklists`);
    return res.data.data;
  },

  getChecklistProgress: async (taskId: string): Promise<ChecklistProgressDto> => {
    const res = await apiClient.get<ApiResponse<ChecklistProgressDto>>(`/tasks/${taskId}/checklists/progress`);
    return res.data.data;
  },

  createChecklist: async (taskId: string, data: CreateChecklistInput): Promise<ChecklistDto> => {
    const res = await apiClient.post<ApiResponse<ChecklistDto>>(`/tasks/${taskId}/checklists`, data);
    return res.data.data;
  },

  updateChecklist: async (checklistId: string, data: UpdateChecklistInput): Promise<ChecklistDto> => {
    const res = await apiClient.put<ApiResponse<ChecklistDto>>(`/checklists/${checklistId}`, data);
    return res.data.data;
  },

  toggleChecklistComplete: async (checklistId: string, completed?: boolean): Promise<ChecklistDto> => {
    const res = await apiClient.patch<ApiResponse<ChecklistDto>>(`/checklists/${checklistId}/complete`, {
      completed,
    });
    return res.data.data;
  },

  reorderChecklist: async (checklistId: string, position: number): Promise<ChecklistDto> => {
    const res = await apiClient.patch<ApiResponse<ChecklistDto>>(`/checklists/${checklistId}/reorder`, {
      position,
    });
    return res.data.data;
  },

  deleteChecklist: async (checklistId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/checklists/${checklistId}`);
  },

  batchUpdateChecklists: async (taskId: string, data: BatchUpdateChecklistInput): Promise<ChecklistDto[]> => {
    const res = await apiClient.put<ApiResponse<ChecklistDto[]>>(`/tasks/${taskId}/checklists/batch`, data);
    return res.data.data;
  },
};
