package com.taskflow.modules.workspace.service;

import com.taskflow.modules.workspace.dto.CreateWorkspaceRequest;
import com.taskflow.modules.workspace.dto.UpdateWorkspaceRequest;
import com.taskflow.modules.workspace.dto.WorkspaceDto;
import com.taskflow.modules.workspace.dto.WorkspaceMemberDto;

import java.util.List;
import java.util.UUID;

/**
 * Domain Service interface for managing workspace creation, membership roles, settings, and soft-deletion.
 */
public interface WorkspaceService {

    /**
     * Creates a new workspace and registers the creator as OWNER.
     *
     * @param ownerId UUID identifier of the workspace owner
     * @param request creation request payload
     * @return WorkspaceDto of the created workspace
     */
    WorkspaceDto createWorkspace(UUID ownerId, CreateWorkspaceRequest request);

    /**
     * Retrieves all active workspaces accessible by the user.
     *
     * @param userId UUID identifier of the requesting user
     * @return list of accessible WorkspaceDto instances
     */
    List<WorkspaceDto> getUserWorkspaces(UUID userId);

    /**
     * Retrieves detailed information of a specific workspace, verifying membership access.
     *
     * @param userId      UUID identifier of the requesting user
     * @param workspaceId UUID identifier of the target workspace
     * @return WorkspaceDto instance
     */
    WorkspaceDto getWorkspaceDetails(UUID userId, UUID workspaceId);

    /**
     * Updates workspace settings (name, description, theme color).
     * Requires OWNER or ADMIN role.
     *
     * @param userId      UUID identifier of the requesting user
     * @param workspaceId UUID identifier of the target workspace
     * @param request     update payload
     * @return updated WorkspaceDto instance
     */
    WorkspaceDto updateWorkspace(UUID userId, UUID workspaceId, UpdateWorkspaceRequest request);

    /**
     * Soft-deletes a workspace. Requires OWNER role.
     *
     * @param userId      UUID identifier of the requesting user
     * @param workspaceId UUID identifier of the target workspace
     */
    void deleteWorkspace(UUID userId, UUID workspaceId);

    /**
     * Retrieves list of active workspace members and assigned roles.
     *
     * @param userId      UUID identifier of the requesting user
     * @param workspaceId UUID identifier of the target workspace
     * @return list of WorkspaceMemberDto instances
     */
    List<WorkspaceMemberDto> getWorkspaceMembers(UUID userId, UUID workspaceId);

    /**
     * Invites a new member to a workspace by email.
     */
    com.taskflow.modules.workspace.dto.WorkspaceInvitationDto inviteMember(UUID userId, UUID workspaceId, com.taskflow.modules.workspace.dto.InviteMemberRequest request);

    /**
     * Updates an existing workspace member's assigned role.
     */
    WorkspaceMemberDto updateMemberRole(UUID userId, UUID workspaceId, UUID memberId, com.taskflow.modules.workspace.dto.UpdateMemberRoleRequest request);

    /**
     * Removes a member from a workspace.
     */
    void removeMember(UUID userId, UUID workspaceId, UUID memberId);

    /**
     * Gets all pending invitations for a workspace.
     */
    List<com.taskflow.modules.workspace.dto.WorkspaceInvitationDto> getPendingInvitations(UUID userId, UUID workspaceId);

    /**
     * Accepts a workspace invitation using an invitation token.
     */
    WorkspaceMemberDto acceptInvitation(UUID userId, String token);

    /**
     * Gets invitation info by token (public).
     */
    com.taskflow.modules.workspace.dto.WorkspaceInvitationDto getInvitationByToken(String token);

    /**
     * Cancels a pending invitation.
     */
    void cancelInvitation(UUID userId, UUID invitationId);

    /**
     * Searches workspace members by name or email query for mention autocomplete.
     */
    List<WorkspaceMemberDto> searchWorkspaceMembers(UUID userId, UUID workspaceId, String query);
}
