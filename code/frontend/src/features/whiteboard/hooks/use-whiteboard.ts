import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whiteboardService } from '../services/whiteboard-service';
import type { CreateWhiteboardPayload, UpdateWhiteboardPayload, SyncElementsPayload } from '../types';

export const whiteboardKeys = {
  all: ['whiteboards'] as const,
  list: (workspaceId: string) => [...whiteboardKeys.all, 'list', workspaceId] as const,
  detail: (whiteboardId: string) => [...whiteboardKeys.all, 'detail', whiteboardId] as const,
};

export function useWorkspaceWhiteboards(workspaceId: string) {
  return useQuery({
    queryKey: whiteboardKeys.list(workspaceId),
    queryFn: () => whiteboardService.getWorkspaceWhiteboards(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useWhiteboardDetails(whiteboardId?: string | null) {
  return useQuery({
    queryKey: whiteboardKeys.detail(whiteboardId || ''),
    queryFn: () => whiteboardService.getWhiteboardDetails(whiteboardId!),
    enabled: Boolean(whiteboardId),
  });
}

export function useCreateWhiteboard(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWhiteboardPayload) => whiteboardService.createWhiteboard(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: whiteboardKeys.list(workspaceId) });
    },
  });
}

export function useUpdateWhiteboard(workspaceId: string, whiteboardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateWhiteboardPayload) => whiteboardService.updateWhiteboard(whiteboardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: whiteboardKeys.detail(whiteboardId) });
      queryClient.invalidateQueries({ queryKey: whiteboardKeys.list(workspaceId) });
    },
  });
}

export function useDeleteWhiteboard(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (whiteboardId: string) => whiteboardService.deleteWhiteboard(whiteboardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: whiteboardKeys.list(workspaceId) });
    },
  });
}

export function useSyncWhiteboardElements(whiteboardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SyncElementsPayload) => whiteboardService.syncElements(whiteboardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: whiteboardKeys.detail(whiteboardId) });
    },
  });
}
