import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type {
  CommentDto,
  CreateCommentInput,
  PaginatedCommentsResponse,
  UpdateCommentInput,
} from '../types';

export const commentService = {
  getTaskComments: async (taskId: string, page = 0, size = 20): Promise<PaginatedCommentsResponse> => {
    const res = await apiClient.get<ApiResponse<PaginatedCommentsResponse>>(`/tasks/${taskId}/comments`, {
      params: { page, size },
    });
    return res.data.data;
  },

  createComment: async (taskId: string, data: CreateCommentInput): Promise<CommentDto> => {
    const res = await apiClient.post<ApiResponse<CommentDto>>(`/tasks/${taskId}/comments`, data);
    return res.data.data;
  },

  updateComment: async (commentId: string, data: UpdateCommentInput): Promise<CommentDto> => {
    const res = await apiClient.put<ApiResponse<CommentDto>>(`/comments/${commentId}`, data);
    return res.data.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/comments/${commentId}`);
  },
};
