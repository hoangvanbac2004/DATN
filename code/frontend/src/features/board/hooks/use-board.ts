import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardService } from '../services/board-service';
import type {
  CreateColumnPayload,
  MoveTaskPayload,
  ReorderColumnsPayload,
  UpdateBoardSettingsPayload,
  UpdateColumnPayload,
} from '../types';

export const boardKeys = {
  all: ['board'] as const,
  projectBoard: (projectId: string) => [...boardKeys.all, 'project', projectId] as const,
  boardDetails: (boardId: string) => [...boardKeys.all, 'details', boardId] as const,
};

export function useProjectBoard(projectId: string) {
  return useQuery({
    queryKey: boardKeys.projectBoard(projectId),
    queryFn: () => boardService.getProjectBoard(projectId),
    enabled: Boolean(projectId),
  });
}

export function useCreateColumn(projectId: string, boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateColumnPayload) => boardService.addColumn(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.projectBoard(projectId) });
    },
  });
}

export function useUpdateColumn(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ columnId, data }: { columnId: string; data: UpdateColumnPayload }) =>
      boardService.updateColumn(columnId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.projectBoard(projectId) });
    },
  });
}

export function useDeleteColumn(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (columnId: string) => boardService.deleteColumn(columnId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.projectBoard(projectId) });
    },
  });
}

export function useReorderColumns(projectId: string, boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReorderColumnsPayload) => boardService.reorderColumns(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.projectBoard(projectId) });
    },
  });
}

export function useMoveTask(projectId: string, boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MoveTaskPayload) => boardService.moveTask(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.projectBoard(projectId) });
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });
}

export function useUpdateBoardSettings(projectId: string, boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateBoardSettingsPayload) => boardService.updateBoardSettings(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.projectBoard(projectId) });
    },
  });
}
