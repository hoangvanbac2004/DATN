import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { AttachmentDto } from '../types';

export const attachmentService = {
  getTaskAttachments: async (taskId: string): Promise<AttachmentDto[]> => {
    const res = await apiClient.get<ApiResponse<AttachmentDto[]>>(`/tasks/${taskId}/attachments`);
    return res.data.data;
  },

  uploadTaskAttachment: async (taskId: string, file: File): Promise<AttachmentDto> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post<ApiResponse<AttachmentDto>>(`/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  deleteAttachment: async (attachmentId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/attachments/${attachmentId}`);
  },
};
