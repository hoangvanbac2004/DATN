import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timelineService } from '../services/timeline-service';
import type { CreateDependencyPayload, UpdateTaskTimelinePayload } from '../types';

export const timelineKeys = {
  all: ['timeline'] as const,
  projectTimeline: (projectId: string) => [...timelineKeys.all, 'project', projectId] as const,
};

export function useProjectTimeline(projectId: string) {
  return useQuery({
    queryKey: timelineKeys.projectTimeline(projectId),
    queryFn: () => timelineService.getProjectTimeline(projectId),
    enabled: Boolean(projectId),
  });
}

export function useUpdateTaskTimeline(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskTimelinePayload }) =>
      timelineService.updateTaskTimeline(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.projectTimeline(projectId) });
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });
}

export function useCreateDependency(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDependencyPayload) => timelineService.createDependency(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.projectTimeline(projectId) });
    },
  });
}

export function useDeleteDependency(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dependencyId: string) => timelineService.deleteDependency(dependencyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.projectTimeline(projectId) });
    },
  });
}
