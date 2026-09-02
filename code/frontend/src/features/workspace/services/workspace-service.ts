import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/features/auth/types';
import type { CreateWorkspaceInput, UpdateWorkspaceInput, WorkspaceDto, WorkspaceInvitationDto, WorkspaceMemberDto } from '../types';

export const workspaceService = {
  createWorkspace: async (data: CreateWorkspaceInput): Promise<WorkspaceDto> => {
    const res = await apiClient.post<ApiResponse<WorkspaceDto>>('/workspaces', data);
    return res.data.data;
  },

  getUserWorkspaces: async (): Promise<WorkspaceDto[]> => {
    const res = await apiClient.get<ApiResponse<WorkspaceDto[]>>('/workspaces');
    return res.data.data;
  },

  getWorkspaceDetails: async (workspaceId: string): Promise<WorkspaceDto> => {
    const res = await apiClient.get<ApiResponse<WorkspaceDto>>(`/workspaces/${workspaceId}`);
    return res.data.data;
  },

  updateWorkspace: async (workspaceId: string, data: UpdateWorkspaceInput): Promise<WorkspaceDto> => {
    const res = await apiClient.put<ApiResponse<WorkspaceDto>>(`/workspaces/${workspaceId}`, data);
    return res.data.data;
  },

  deleteWorkspace: async (workspaceId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/workspaces/${workspaceId}`);
  },

  getWorkspaceMembers: async (workspaceId: string): Promise<WorkspaceMemberDto[]> => {
    const res = await apiClient.get<ApiResponse<WorkspaceMemberDto[]>>(`/workspaces/${workspaceId}/members`);
    return res.data.data;
  },

  inviteMember: async (workspaceId: string, email: string, role = 'MEMBER'): Promise<WorkspaceInvitationDto> => {
    const res = await apiClient.post<ApiResponse<WorkspaceInvitationDto>>(`/workspaces/${workspaceId}/invitations`, { email, role });
    return res.data.data;
  },

  getPendingInvitations: async (workspaceId: string): Promise<WorkspaceInvitationDto[]> => {
    const res = await apiClient.get<ApiResponse<WorkspaceInvitationDto[]>>(`/workspaces/${workspaceId}/invitations`);
    return res.data.data;
  },

  cancelInvitation: async (invitationId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/workspaces/invitations/${invitationId}`);
  },

  getInvitationByToken: async (token: string): Promise<WorkspaceInvitationDto> => {
    const res = await apiClient.get<ApiResponse<WorkspaceInvitationDto>>(`/invitations/${token}`);
    return res.data.data;
  },

  acceptInvitation: async (token: string): Promise<WorkspaceMemberDto> => {
    const res = await apiClient.post<ApiResponse<WorkspaceMemberDto>>(`/workspaces/invitations/${token}/accept`);
    return res.data.data;
  },

  searchMembers: async (workspaceId: string, query?: string): Promise<WorkspaceMemberDto[]> => {
    const res = await apiClient.get<ApiResponse<WorkspaceMemberDto[]>>(`/workspaces/${workspaceId}/members/search`, {
      params: { q: query },
    });
    return res.data.data;
  },
};
