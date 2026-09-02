import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workspaceService } from '../services/workspace-service';
import { useWorkspaceStore } from '@/store/workspace-store';
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from '../types';

export const WORKSPACE_QUERY_KEYS = {
  list: ['workspaces'] as const,
  detail: (id: string) => ['workspace', id] as const,
  members: (id: string) => ['workspace-members', id] as const,
};

export function useWorkspaces() {
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);

  return useQuery({
    queryKey: WORKSPACE_QUERY_KEYS.list,
    queryFn: async () => {
      const list = await workspaceService.getUserWorkspaces();
      if (list.length > 0) {
        const found = list.find((w) => w.id === activeWorkspaceId);
        if (found) {
          setActiveWorkspace(found);
        } else {
          setActiveWorkspace(list[0]);
        }
      }
      return list;
    },
  });
}

export function useWorkspaceDetails(workspaceId: string | null) {
  return useQuery({
    queryKey: WORKSPACE_QUERY_KEYS.detail(workspaceId || ''),
    queryFn: () => workspaceService.getWorkspaceDetails(workspaceId!),
    enabled: !!workspaceId,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);

  return useMutation({
    mutationFn: (data: CreateWorkspaceInput) => workspaceService.createWorkspace(data),
    onSuccess: (newWorkspace) => {
      setActiveWorkspace(newWorkspace);
      queryClient.invalidateQueries({ queryKey: WORKSPACE_QUERY_KEYS.list });
    },
  });
}

export function useUpdateWorkspace(workspaceId: string) {
  const queryClient = useQueryClient();
  const setActiveWorkspace = useWorkspaceStore((state) => state.setActiveWorkspace);

  return useMutation({
    mutationFn: (data: UpdateWorkspaceInput) => workspaceService.updateWorkspace(workspaceId, data),
    onSuccess: (updated) => {
      setActiveWorkspace(updated);
      queryClient.invalidateQueries({ queryKey: WORKSPACE_QUERY_KEYS.list });
      queryClient.invalidateQueries({ queryKey: WORKSPACE_QUERY_KEYS.detail(workspaceId) });
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const clearActiveWorkspace = useWorkspaceStore((state) => state.clearActiveWorkspace);

  return useMutation({
    mutationFn: (workspaceId: string) => workspaceService.deleteWorkspace(workspaceId),
    onSuccess: () => {
      clearActiveWorkspace();
      queryClient.invalidateQueries({ queryKey: WORKSPACE_QUERY_KEYS.list });
    },
  });
}

export function useWorkspaceMembers(workspaceId: string | null) {
  return useQuery({
    queryKey: WORKSPACE_QUERY_KEYS.members(workspaceId || ''),
    queryFn: () => workspaceService.getWorkspaceMembers(workspaceId!),
    enabled: !!workspaceId,
  });
}

export function usePendingInvitations(workspaceId: string | null) {
  return useQuery({
    queryKey: ['workspace-invitations', workspaceId],
    queryFn: () => workspaceService.getPendingInvitations(workspaceId!),
    enabled: !!workspaceId,
  });
}

export function useInviteMember(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, role }: { email: string; role?: string }) =>
      workspaceService.inviteMember(workspaceId, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-invitations', workspaceId] });
    },
  });
}

export function useCancelInvitation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => workspaceService.cancelInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-invitations', workspaceId] });
    },
  });
}

export function useGetInvitation(token: string | null) {
  return useQuery({
    queryKey: ['invitation', token],
    queryFn: () => workspaceService.getInvitationByToken(token!),
    enabled: !!token,
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => workspaceService.acceptInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_QUERY_KEYS.list });
    },
  });
}

export function useSearchWorkspaceMembers(workspaceId: string | null, query?: string) {
  return useQuery({
    queryKey: ['workspace-members-search', workspaceId, query],
    queryFn: () => workspaceService.searchMembers(workspaceId!, query),
    enabled: !!workspaceId,
  });
}
