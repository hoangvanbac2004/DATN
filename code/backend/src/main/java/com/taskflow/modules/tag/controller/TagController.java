package com.taskflow.modules.tag.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.tag.dto.CreateTagRequest;
import com.taskflow.modules.tag.dto.TagDto;
import com.taskflow.modules.tag.dto.UpdateTagRequest;
import com.taskflow.modules.tag.service.TagService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@Tag(name = "Tag Management", description = "Endpoints for workspace tags and task-tag assignments")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping("/api/v1/workspaces/{workspaceId}/tags")
    @Operation(summary = "Create a new tag under a workspace")
    public ResponseEntity<ApiResponse<TagDto>> createTag(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody CreateTagRequest request) {
        TagDto created = tagService.createTag(principal.getId(), workspaceId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tag created successfully", created));
    }

    @GetMapping("/api/v1/workspaces/{workspaceId}/tags")
    @Operation(summary = "List or search all tags for a workspace")
    public ResponseEntity<ApiResponse<List<TagDto>>> getWorkspaceTags(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId,
            @RequestParam(required = false) String search) {
        List<TagDto> tags = tagService.getWorkspaceTags(principal.getId(), workspaceId, search);
        return ResponseEntity.ok(ApiResponse.success("Workspace tags retrieved successfully", tags));
    }

    @GetMapping("/api/v1/tags/{tagId}")
    @Operation(summary = "Get tag details by ID")
    public ResponseEntity<ApiResponse<TagDto>> getTagDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID tagId) {
        TagDto tag = tagService.getTagDetails(principal.getId(), tagId);
        return ResponseEntity.ok(ApiResponse.success("Tag details retrieved successfully", tag));
    }

    @PutMapping("/api/v1/tags/{tagId}")
    @Operation(summary = "Update tag name or color")
    public ResponseEntity<ApiResponse<TagDto>> updateTag(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID tagId,
            @Valid @RequestBody UpdateTagRequest request) {
        TagDto updated = tagService.updateTag(principal.getId(), tagId, request);
        return ResponseEntity.ok(ApiResponse.success("Tag updated successfully", updated));
    }

    @DeleteMapping("/api/v1/tags/{tagId}")
    @Operation(summary = "Delete a tag")
    public ResponseEntity<ApiResponse<Void>> deleteTag(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID tagId) {
        tagService.deleteTag(principal.getId(), tagId);
        return ResponseEntity.ok(ApiResponse.success("Tag deleted successfully", null));
    }

    @PostMapping("/api/v1/tasks/{taskId}/tags/{tagId}")
    @Operation(summary = "Assign a tag to a task")
    public ResponseEntity<ApiResponse<List<TagDto>>> assignTagToTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @PathVariable UUID tagId) {
        List<TagDto> assignedTags = tagService.assignTagToTask(principal.getId(), taskId, tagId);
        return ResponseEntity.ok(ApiResponse.success("Tag assigned to task successfully", assignedTags));
    }

    @DeleteMapping("/api/v1/tasks/{taskId}/tags/{tagId}")
    @Operation(summary = "Remove a tag from a task")
    public ResponseEntity<ApiResponse<List<TagDto>>> removeTagFromTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @PathVariable UUID tagId) {
        List<TagDto> assignedTags = tagService.removeTagFromTask(principal.getId(), taskId, tagId);
        return ResponseEntity.ok(ApiResponse.success("Tag removed from task successfully", assignedTags));
    }

    @GetMapping("/api/v1/tasks/{taskId}/tags")
    @Operation(summary = "List all tags assigned to a task")
    public ResponseEntity<ApiResponse<List<TagDto>>> getTaskTags(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId) {
        List<TagDto> assignedTags = tagService.getTaskTags(principal.getId(), taskId);
        return ResponseEntity.ok(ApiResponse.success("Task tags retrieved successfully", assignedTags));
    }
}
