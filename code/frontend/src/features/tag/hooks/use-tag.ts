import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tagService } from '../services/tag-service';
import type { CreateTagInput, UpdateTagInput } from '../types';

export const TAG_QUERY_KEYS = {
  workspaceList: (workspaceId: string, search?: string) => ['tags', workspaceId, search] as const,
  taskTags: (taskId: string) => ['task-tags', taskId] as const,
  detail: (tagId: string) => ['tag', tagId] as const,
};

export function useWorkspaceTags(workspaceId: string | null, search?: string) {
  return useQuery({
    queryKey: TAG_QUERY_KEYS.workspaceList(workspaceId || '', search),
    queryFn: () => tagService.getWorkspaceTags(workspaceId!, search),
    enabled: !!workspaceId,
  });
}

export function useTaskTags(taskId: string | null) {
  return useQuery({
    queryKey: TAG_QUERY_KEYS.taskTags(taskId || ''),
    queryFn: () => tagService.getTaskTags(taskId!),
    enabled: !!taskId,
  });
}

export function useCreateTag(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagInput) => tagService.createTag(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags', workspaceId] });
    },
  });
}

export function useUpdateTag(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tagId, data }: { tagId: string; data: UpdateTagInput }) =>
      tagService.updateTag(tagId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags', workspaceId] });
      queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEYS.detail(variables.tagId) });
      queryClient.invalidateQueries({ queryKey: ['task-tags'] });
    },
  });
}

export function useDeleteTag(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: string) => tagService.deleteTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['task-tags'] });
    },
  });
}

export function useAssignTag(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: string) => tagService.assignTagToTask(taskId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEYS.taskTags(taskId) });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useRemoveTag(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: string) => tagService.removeTagFromTask(taskId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEYS.taskTags(taskId) });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
