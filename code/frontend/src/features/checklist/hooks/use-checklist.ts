import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checklistService } from '../services/checklist-service';
import type {
  BatchUpdateChecklistInput,
  CreateChecklistInput,
  UpdateChecklistInput,
} from '../types';

export const CHECKLIST_QUERY_KEYS = {
  list: (taskId: string) => ['checklists', taskId] as const,
  progress: (taskId: string) => ['checklist-progress', taskId] as const,
};

export function useTaskChecklists(taskId: string | null) {
  return useQuery({
    queryKey: CHECKLIST_QUERY_KEYS.list(taskId || ''),
    queryFn: () => checklistService.getTaskChecklists(taskId!),
    enabled: !!taskId,
  });
}

export function useChecklistProgress(taskId: string | null) {
  return useQuery({
    queryKey: CHECKLIST_QUERY_KEYS.progress(taskId || ''),
    queryFn: () => checklistService.getChecklistProgress(taskId!),
    enabled: !!taskId,
  });
}

export function useCreateChecklist(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChecklistInput) => checklistService.createChecklist(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEYS.list(taskId) });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEYS.progress(taskId) });
    },
  });
}

export function useUpdateChecklist(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ checklistId, data }: { checklistId: string; data: UpdateChecklistInput }) =>
      checklistService.updateChecklist(checklistId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEYS.list(taskId) });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEYS.progress(taskId) });
    },
  });
}

export function useToggleChecklistComplete(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ checklistId, completed }: { checklistId: string; completed?: boolean }) =>
      checklistService.toggleChecklistComplete(checklistId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEYS.list(taskId) });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEYS.progress(taskId) });
    },
  });
}

export function useReorderChecklist(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ checklistId, position }: { checklistId: string; position: number }) =>
      checklistService.reorderChecklist(checklistId, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEYS.list(taskId) });
    },
  });
}

export function useDeleteChecklist(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checklistId: string) => checklistService.deleteChecklist(checklistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEYS.list(taskId) });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEYS.progress(taskId) });
    },
  });
}

export function useBatchUpdateChecklists(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchUpdateChecklistInput) => checklistService.batchUpdateChecklists(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEYS.list(taskId) });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEYS.progress(taskId) });
    },
  });
}
