import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type {
  WorkspaceMemberDto,
  WorkspaceInvitationDto,
  ProjectMemberDto,
  InviteMemberPayload,
  UpdateRolePayload,
  AddProjectMemberPayload,
} from '../types';

export const teamService = {
  // Workspace Members
  getWorkspaceMembers: async (workspaceId: string): Promise<WorkspaceMemberDto[]> => {
    const res = await apiClient.get<ApiResponse<WorkspaceMemberDto[]>>(`/workspaces/${workspaceId}/members`);
    return res.data.data;
  },

  inviteWorkspaceMember: async (
    workspaceId: string,
    data: InviteMemberPayload
  ): Promise<WorkspaceInvitationDto> => {
    const res = await apiClient.post<ApiResponse<WorkspaceInvitationDto>>(
      `/workspaces/${workspaceId}/invitations`,
      data
    );
    return res.data.data;
  },

  getPendingInvitations: async (workspaceId: string): Promise<WorkspaceInvitationDto[]> => {
    const res = await apiClient.get<ApiResponse<WorkspaceInvitationDto[]>>(
      `/workspaces/${workspaceId}/invitations`
    );
    return res.data.data;
  },

  updateWorkspaceMemberRole: async (
    workspaceId: string,
    memberId: string,
    data: UpdateRolePayload
  ): Promise<WorkspaceMemberDto> => {
    const res = await apiClient.patch<ApiResponse<WorkspaceMemberDto>>(
      `/workspaces/${workspaceId}/members/${memberId}/role`,
      data
    );
    return res.data.data;
  },

  removeWorkspaceMember: async (workspaceId: string, memberId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/workspaces/${workspaceId}/members/${memberId}`);
  },

  acceptInvitation: async (token: string): Promise<WorkspaceMemberDto> => {
    const res = await apiClient.post<ApiResponse<WorkspaceMemberDto>>(`/workspaces/invitations/${token}/accept`);
    return res.data.data;
  },

  cancelWorkspaceInvitation: async (invitationId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/workspaces/invitations/${invitationId}`);
  },

  // Project Members
  getProjectMembers: async (projectId: string): Promise<ProjectMemberDto[]> => {
    const res = await apiClient.get<ApiResponse<ProjectMemberDto[]>>(`/projects/${projectId}/members`);
    return res.data.data;
  },

  addProjectMember: async (
    projectId: string,
    data: AddProjectMemberPayload
  ): Promise<ProjectMemberDto> => {
    const res = await apiClient.post<ApiResponse<ProjectMemberDto>>(`/projects/${projectId}/members`, data);
    return res.data.data;
  },

  updateProjectMemberRole: async (
    projectId: string,
    memberId: string,
    data: UpdateRolePayload
  ): Promise<ProjectMemberDto> => {
    const res = await apiClient.patch<ApiResponse<ProjectMemberDto>>(
      `/projects/${projectId}/members/${memberId}/role`,
      data
    );
    return res.data.data;
  },

  removeProjectMember: async (projectId: string, memberId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/projects/${projectId}/members/${memberId}`);
  },
};
