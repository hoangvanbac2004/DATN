package com.taskflow.modules.workspace.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.workspace.dto.WorkspaceInvitationDto;
import com.taskflow.modules.workspace.service.WorkspaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/invitations")
@Tag(name = "Workspace Invitations Public", description = "Public endpoints for checking workspace invitations")
public class InvitationController {

    private final WorkspaceService workspaceService;

    public InvitationController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @GetMapping("/{token}")
    @Operation(summary = "Get invitation details by token (Public endpoint)")
    public ResponseEntity<ApiResponse<WorkspaceInvitationDto>> getInvitationByToken(@PathVariable String token) {
        WorkspaceInvitationDto invitation = workspaceService.getInvitationByToken(token);
        return ResponseEntity.ok(ApiResponse.success("Invitation details retrieved successfully", invitation));
    }
}
