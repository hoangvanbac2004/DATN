import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '../services/team-service';
import type { InviteMemberPayload, UpdateRolePayload, AddProjectMemberPayload } from '../types';

export const teamKeys = {
  all: ['team'] as const,
  workspaceMembers: (workspaceId: string) => [...teamKeys.all, 'workspace', workspaceId, 'members'] as const,
  workspaceInvitations: (workspaceId: string) => [...teamKeys.all, 'workspace', workspaceId, 'invitations'] as const,
  projectMembers: (projectId: string) => [...teamKeys.all, 'project', projectId, 'members'] as const,
};

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: teamKeys.workspaceMembers(workspaceId),
    queryFn: () => teamService.getWorkspaceMembers(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function usePendingInvitations(workspaceId: string) {
  return useQuery({
    queryKey: teamKeys.workspaceInvitations(workspaceId),
    queryFn: () => teamService.getPendingInvitations(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useInviteMember(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteMemberPayload) => teamService.inviteWorkspaceMember(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.workspaceInvitations(workspaceId) });
    },
  });
}

export function useCancelInvitation(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) => teamService.cancelWorkspaceInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.workspaceInvitations(workspaceId) });
    },
  });
}

export function useUpdateMemberRole(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: UpdateRolePayload }) =>
      teamService.updateWorkspaceMemberRole(workspaceId, memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.workspaceMembers(workspaceId) });
    },
  });
}

export function useRemoveMember(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => teamService.removeWorkspaceMember(workspaceId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.workspaceMembers(workspaceId) });
    },
  });
}

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: teamKeys.projectMembers(projectId),
    queryFn: () => teamService.getProjectMembers(projectId),
    enabled: Boolean(projectId),
  });
}

export function useAddProjectMember(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddProjectMemberPayload) => teamService.addProjectMember(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.projectMembers(projectId) });
    },
  });
}
