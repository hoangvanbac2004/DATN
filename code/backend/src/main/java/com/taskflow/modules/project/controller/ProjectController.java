package com.taskflow.modules.project.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.project.dto.AddProjectMemberRequest;
import com.taskflow.modules.project.dto.CreateProjectRequest;
import com.taskflow.modules.project.dto.ProjectDto;
import com.taskflow.modules.project.dto.ProjectMemberDto;
import com.taskflow.modules.project.dto.ProjectStatsDto;
import com.taskflow.modules.project.dto.UpdateProjectRequest;
import com.taskflow.modules.workspace.dto.UpdateMemberRoleRequest;
import com.taskflow.modules.project.service.ProjectService;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@Tag(name = "Project Management", description = "Endpoints for managing workspace projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/api/v1/workspaces/{workspaceId}/projects")
    @Operation(summary = "Create a new project within a workspace")
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody CreateProjectRequest request) {
        ProjectDto project = projectService.createProject(principal.getId(), workspaceId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project created successfully", project));
    }

    @GetMapping("/api/v1/workspaces/{workspaceId}/projects")
    @Operation(summary = "List all projects within a workspace")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getWorkspaceProjects(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId,
            @RequestParam(required = false) Boolean archived,
            @RequestParam(required = false) Boolean favorite) {
        List<ProjectDto> projects = projectService.getWorkspaceProjects(principal.getId(), workspaceId, archived, favorite);
        return ResponseEntity.ok(ApiResponse.success("Workspace projects retrieved successfully", projects));
    }

    @GetMapping("/api/v1/projects/{projectId}")
    @Operation(summary = "Get project details by ID")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId) {
        ProjectDto project = projectService.getProjectDetails(principal.getId(), projectId);
        return ResponseEntity.ok(ApiResponse.success("Project details retrieved successfully", project));
    }

    @PutMapping("/api/v1/projects/{projectId}")
    @Operation(summary = "Update project information")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @Valid @RequestBody UpdateProjectRequest request) {
        ProjectDto updated = projectService.updateProject(principal.getId(), projectId, request);
        return ResponseEntity.ok(ApiResponse.success("Project updated successfully", updated));
    }

    @DeleteMapping("/api/v1/projects/{projectId}")
    @Operation(summary = "Delete (soft-delete) a project")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId) {
        projectService.deleteProject(principal.getId(), projectId);
        return ResponseEntity.ok(ApiResponse.success("Project deleted successfully", null));
    }

    @PatchMapping("/api/v1/projects/{projectId}/archive")
    @Operation(summary = "Toggle archive status of a project")
    public ResponseEntity<ApiResponse<ProjectDto>> toggleArchiveProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId) {
        ProjectDto updated = projectService.toggleArchiveProject(principal.getId(), projectId);
        return ResponseEntity.ok(ApiResponse.success("Project archive status updated", updated));
    }

    @PatchMapping("/api/v1/projects/{projectId}/favorite")
    @Operation(summary = "Toggle favorite status of a project")
    public ResponseEntity<ApiResponse<ProjectDto>> toggleFavoriteProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId) {
        ProjectDto updated = projectService.toggleFavoriteProject(principal.getId(), projectId);
        return ResponseEntity.ok(ApiResponse.success("Project favorite status updated", updated));
    }

    @GetMapping("/api/v1/projects/{projectId}/stats")
    @Operation(summary = "Get project statistics")
    public ResponseEntity<ApiResponse<ProjectStatsDto>> getProjectStats(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId) {
        ProjectStatsDto stats = projectService.getProjectStats(principal.getId(), projectId);
        return ResponseEntity.ok(ApiResponse.success("Project statistics retrieved successfully", stats));
    }

    @GetMapping("/api/v1/projects/{projectId}/members")
    @Operation(summary = "Get project members")
    public ResponseEntity<ApiResponse<List<ProjectMemberDto>>> getProjectMembers(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId) {
        List<ProjectMemberDto> members = projectService.getProjectMembers(principal.getId(), projectId);
        return ResponseEntity.ok(ApiResponse.success("Project members retrieved successfully", members));
    }

    @PostMapping("/api/v1/projects/{projectId}/members")
    @Operation(summary = "Add a member to a project")
    public ResponseEntity<ApiResponse<ProjectMemberDto>> addProjectMember(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @Valid @RequestBody AddProjectMemberRequest request) {
        ProjectMemberDto member = projectService.addProjectMember(principal.getId(), projectId, request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(ApiResponse.success("Project member added successfully", member));
    }

    @PatchMapping("/api/v1/projects/{projectId}/members/{memberId}/role")
    @Operation(summary = "Update project member role")
    public ResponseEntity<ApiResponse<ProjectMemberDto>> updateProjectMemberRole(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @PathVariable UUID memberId,
            @Valid @RequestBody UpdateMemberRoleRequest request) {
        ProjectMemberDto member = projectService.updateProjectMemberRole(principal.getId(), projectId, memberId, request);
        return ResponseEntity.ok(ApiResponse.success("Project member role updated successfully", member));
    }

    @DeleteMapping("/api/v1/projects/{projectId}/members/{memberId}")
    @Operation(summary = "Remove a member from a project")
    public ResponseEntity<ApiResponse<Void>> removeProjectMember(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @PathVariable UUID memberId) {
        projectService.removeProjectMember(principal.getId(), projectId, memberId);
        return ResponseEntity.ok(ApiResponse.success("Project member removed successfully", null));
    }
}
