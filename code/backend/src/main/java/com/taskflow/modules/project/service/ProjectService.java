package com.taskflow.modules.project.service;

import com.taskflow.modules.project.dto.CreateProjectRequest;
import com.taskflow.modules.project.dto.ProjectDto;
import com.taskflow.modules.project.dto.ProjectStatsDto;
import com.taskflow.modules.project.dto.UpdateProjectRequest;

import java.util.List;
import java.util.UUID;

/**
 * Domain Service interface for managing workspace projects, favorite status, archiving, and project statistics.
 */
public interface ProjectService {

    /**
     * Retrieves or auto-creates a default project for a workspace.
     */
    ProjectDto getOrCreateDefaultProject(UUID userId, UUID workspaceId);

    /**
     * Creates a new project within an authorized workspace.
     *
     * @param userId      UUID identifier of the user creating the project
     * @param workspaceId UUID identifier of the target workspace
     * @param request     creation request payload containing name, description, color, icon
     * @return ProjectDto representation of the created project
     */
    ProjectDto createProject(UUID userId, UUID workspaceId, CreateProjectRequest request);

    /**
     * Retrieves projects in a workspace with optional filtering by favorite or archived status.
     *
     * @param userId      UUID identifier of the requesting user
     * @param workspaceId UUID identifier of the target workspace
     * @param archived    optional flag to filter archived projects
     * @param favorite    optional flag to filter favorite projects
     * @return list of ProjectDto instances
     */
    List<ProjectDto> getWorkspaceProjects(UUID userId, UUID workspaceId, Boolean archived, Boolean favorite);

    /**
     * Retrieves detailed information of a specific project.
     *
     * @param userId    UUID identifier of the requesting user
     * @param projectId UUID identifier of the target project
     * @return ProjectDto instance
     */
    ProjectDto getProjectDetails(UUID userId, UUID projectId);

    /**
     * Updates project properties (name, description, color, icon).
     *
     * @param userId    UUID identifier of the requesting user
     * @param projectId UUID identifier of the target project
     * @param request   update payload
     * @return updated ProjectDto instance
     */
    ProjectDto updateProject(UUID userId, UUID projectId, UpdateProjectRequest request);

    /**
     * Soft-deletes a project.
     *
     * @param userId    UUID identifier of the requesting user
     * @param projectId UUID identifier of the target project
     */
    void deleteProject(UUID userId, UUID projectId);

    /**
     * Toggles the archived status of a project.
     *
     * @param userId    UUID identifier of the requesting user
     * @param projectId UUID identifier of the target project
     * @return updated ProjectDto instance
     */
    ProjectDto toggleArchiveProject(UUID userId, UUID projectId);

    /**
     * Toggles the favorite status of a project.
     *
     * @param userId    UUID identifier of the requesting user
     * @param projectId UUID identifier of the target project
     * @return updated ProjectDto instance
     */
    ProjectDto toggleFavoriteProject(UUID userId, UUID projectId);

    /**
     * Retrieves task completion statistics for a project.
     *
     * @param userId    UUID identifier of the requesting user
     * @param projectId UUID identifier of the target project
     * @return ProjectStatsDto instance containing task metrics
     */
    ProjectStatsDto getProjectStats(UUID userId, UUID projectId);

    /**
     * Gets active members assigned to a project.
     */
    List<com.taskflow.modules.project.dto.ProjectMemberDto> getProjectMembers(UUID userId, UUID projectId);

    /**
     * Adds a user as a member of a project.
     */
    com.taskflow.modules.project.dto.ProjectMemberDto addProjectMember(UUID userId, UUID projectId, com.taskflow.modules.project.dto.AddProjectMemberRequest request);

    /**
     * Updates a project member's role.
     */
    com.taskflow.modules.project.dto.ProjectMemberDto updateProjectMemberRole(UUID userId, UUID projectId, UUID memberId, com.taskflow.modules.workspace.dto.UpdateMemberRoleRequest request);

    /**
     * Removes a member from a project.
     */
    void removeProjectMember(UUID userId, UUID projectId, UUID memberId);
}
