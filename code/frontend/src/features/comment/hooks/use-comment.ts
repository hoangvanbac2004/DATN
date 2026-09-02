import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../services/comment-service';
import type { CreateCommentInput, UpdateCommentInput } from '../types';

export const COMMENT_QUERY_KEYS = {
  list: (taskId: string, page: number) => ['comments', taskId, page] as const,
};

export function useTaskComments(taskId: string | null, page = 0, size = 20) {
  return useQuery({
    queryKey: COMMENT_QUERY_KEYS.list(taskId || '', page),
    queryFn: () => commentService.getTaskComments(taskId!, page, size),
    enabled: !!taskId,
  });
}

export function useCreateComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentInput) => commentService.createComment(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
    },
  });
}

export function useUpdateComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentInput }) =>
      commentService.updateComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    },
  });
}

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    },
  });
}
