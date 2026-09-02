package com.taskflow.modules.whiteboard.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.whiteboard.dto.CreateWhiteboardRequest;
import com.taskflow.modules.whiteboard.dto.SyncWhiteboardElementsRequest;
import com.taskflow.modules.whiteboard.dto.UpdateWhiteboardRequest;
import com.taskflow.modules.whiteboard.dto.WhiteboardDto;
import com.taskflow.modules.whiteboard.service.WhiteboardService;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Whiteboard & Visual Canvas", description = "Endpoints for managing workspace whiteboards, metadata, spatial elements, and bulk synchronization")
public class WhiteboardController {

    private final WhiteboardService whiteboardService;

    public WhiteboardController(WhiteboardService whiteboardService) {
        this.whiteboardService = whiteboardService;
    }

    @PostMapping("/workspaces/{workspaceId}/whiteboards")
    @Operation(summary = "Create a new visual whiteboard in a workspace")
    public ResponseEntity<ApiResponse<WhiteboardDto>> createWhiteboard(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody CreateWhiteboardRequest request) {
        WhiteboardDto board = whiteboardService.createWhiteboard(principal.getId(), workspaceId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Whiteboard created successfully", board));
    }

    @GetMapping("/workspaces/{workspaceId}/whiteboards")
    @Operation(summary = "Get list of all whiteboards in a workspace")
    public ResponseEntity<ApiResponse<List<WhiteboardDto>>> getWorkspaceWhiteboards(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId) {
        List<WhiteboardDto> boards = whiteboardService.getWorkspaceWhiteboards(principal.getId(), workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Workspace whiteboards retrieved successfully", boards));
    }

    @GetMapping("/whiteboards/{whiteboardId}")
    @Operation(summary = "Get whiteboard details and element canvas layout")
    public ResponseEntity<ApiResponse<WhiteboardDto>> getWhiteboardDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID whiteboardId) {
        WhiteboardDto board = whiteboardService.getWhiteboardDetails(principal.getId(), whiteboardId);
        return ResponseEntity.ok(ApiResponse.success("Whiteboard details retrieved successfully", board));
    }

    @PutMapping("/whiteboards/{whiteboardId}")
    @Operation(summary = "Update whiteboard metadata")
    public ResponseEntity<ApiResponse<WhiteboardDto>> updateWhiteboard(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID whiteboardId,
            @Valid @RequestBody UpdateWhiteboardRequest request) {
        WhiteboardDto updated = whiteboardService.updateWhiteboard(principal.getId(), whiteboardId, request);
        return ResponseEntity.ok(ApiResponse.success("Whiteboard metadata updated successfully", updated));
    }

    @DeleteMapping("/whiteboards/{whiteboardId}")
    @Operation(summary = "Delete a whiteboard")
    public ResponseEntity<ApiResponse<Void>> deleteWhiteboard(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID whiteboardId) {
        whiteboardService.deleteWhiteboard(principal.getId(), whiteboardId);
        return ResponseEntity.ok(ApiResponse.success("Whiteboard deleted successfully", null));
    }

    @PostMapping("/whiteboards/{whiteboardId}/elements/sync")
    @Operation(summary = "Bulk synchronize spatial canvas elements for a whiteboard")
    public ResponseEntity<ApiResponse<WhiteboardDto>> syncElements(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID whiteboardId,
            @RequestBody SyncWhiteboardElementsRequest request) {
        WhiteboardDto synced = whiteboardService.syncElements(principal.getId(), whiteboardId, request);
        return ResponseEntity.ok(ApiResponse.success("Whiteboard elements synchronized successfully", synced));
    }
}
