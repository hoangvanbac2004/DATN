import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskService } from '../services/task-service';
import type { CreateTaskInput, TaskFilterState, TaskStatus, UpdateTaskInput } from '../types';

export const TASK_QUERY_KEYS = {
  list: (projectId: string, filters?: object) => ['tasks', projectId, filters] as const,
  workspaceList: (workspaceId: string, filters?: object) => ['workspace-tasks', workspaceId, filters] as const,
  detail: (id: string) => ['task', id] as const,
};

export function useWorkspaceTasks(workspaceId: string | null, filters?: TaskFilterState) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.workspaceList(workspaceId || '', filters),
    queryFn: () => taskService.getWorkspaceTasks(workspaceId!, filters),
    enabled: !!workspaceId,
  });
}

export function useCreateWorkspaceTask(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.createWorkspaceTask(workspaceId, data),
    onSuccess: () => {
      toast.success('Công việc đã được tạo thành công!');
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useProjectTasks(projectId: string | null, filters?: TaskFilterState) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list(projectId || '', filters),
    queryFn: () => taskService.getProjectTasks(projectId!, filters),
    enabled: !!projectId,
  });
}

export function useTaskDetails(taskId: string | null) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.detail(taskId || ''),
    queryFn: () => taskService.getTaskDetails(taskId!),
    enabled: !!taskId,
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.createTask(projectId, data),
    onSuccess: () => {
      toast.success('Công việc đã được tạo thành công!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
    },
  });
}

export function useUpdateTask(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTaskInput) => taskService.updateTask(taskId, data),
    onSuccess: () => {
      toast.success('Công việc đã được cập nhật!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks'] });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(taskId) });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: () => {
      toast.success('Công việc đã được xóa!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      taskService.updateTaskStatus(taskId, status),
    onSuccess: (_, variables) => {
      toast.success('Trạng thái công việc đã được cập nhật!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks'] });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
    },
  });
}

export function useToggleArchiveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => taskService.toggleArchiveTask(taskId),
    onSuccess: (_, taskId) => {
      toast.success('Trạng thái lưu trữ công việc đã thay đổi');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks'] });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(taskId) });
    },
  });
}

export function useReorderTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, position }: { taskId: string; position: number }) =>
      taskService.reorderTask(taskId, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks'] });
    },
  });
}

export function useAssignTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, assigneeId }: { taskId: string; assigneeId: string | null }) =>
      taskService.assignTask(taskId, assigneeId),
    onSuccess: (_, variables) => {
      toast.success(variables.assigneeId ? 'Đã phân công công việc' : 'Đã bỏ phân công công việc');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks'] });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(variables.taskId) });
    },
  });
}
