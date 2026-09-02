import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/project-service';
import type { CreateProjectInput, UpdateProjectInput } from '../types';

export const PROJECT_QUERY_KEYS = {
  list: (workspaceId: string, params?: object) => ['projects', workspaceId, params] as const,
  detail: (id: string) => ['project', id] as const,
  stats: (id: string) => ['project-stats', id] as const,
};

export function useProjects(
  workspaceId: string | null,
  params?: { archived?: boolean; favorite?: boolean }
) {
  return useQuery({
    queryKey: PROJECT_QUERY_KEYS.list(workspaceId || '', params),
    queryFn: () => projectService.getWorkspaceProjects(workspaceId!, params),
    enabled: !!workspaceId,
  });
}

export function useProjectDetails(projectId: string | null) {
  return useQuery({
    queryKey: PROJECT_QUERY_KEYS.detail(projectId || ''),
    queryFn: () => projectService.getProjectDetails(projectId!),
    enabled: !!projectId,
  });
}

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectInput) => projectService.createProject(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProjectInput) => projectService.updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.detail(projectId) });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useToggleArchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectService.toggleArchiveProject(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.detail(projectId) });
    },
  });
}

export function useToggleFavoriteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectService.toggleFavoriteProject(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.detail(projectId) });
    },
  });
}

export function useProjectStats(projectId: string | null) {
  return useQuery({
    queryKey: PROJECT_QUERY_KEYS.stats(projectId || ''),
    queryFn: () => projectService.getProjectStats(projectId!),
    enabled: !!projectId,
  });
}
