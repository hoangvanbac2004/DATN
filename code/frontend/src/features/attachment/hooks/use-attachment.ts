import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attachmentService } from '../services/attachment-service';

export const ATTACHMENT_QUERY_KEYS = {
  taskAttachments: (taskId: string) => ['attachments', taskId] as const,
};

export function useTaskAttachments(taskId: string | null) {
  return useQuery({
    queryKey: ATTACHMENT_QUERY_KEYS.taskAttachments(taskId || ''),
    queryFn: () => attachmentService.getTaskAttachments(taskId!),
    enabled: !!taskId,
  });
}

export function useUploadAttachment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => attachmentService.uploadTaskAttachment(taskId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTACHMENT_QUERY_KEYS.taskAttachments(taskId) });
    },
  });
}

export function useDeleteAttachment(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId: string) => attachmentService.deleteAttachment(attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTACHMENT_QUERY_KEYS.taskAttachments(taskId) });
    },
  });
}
