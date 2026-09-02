package com.taskflow.modules.activity.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.common.PageResponse;
import com.taskflow.modules.activity.dto.ActivityLogDto;
import com.taskflow.modules.activity.dto.CreateActivityLogRequest;
import com.taskflow.modules.activity.service.ActivityLogService;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@Tag(name = "Activity Log", description = "Endpoints for user, project, and workspace audit logs and activity feeds")
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    public ActivityLogController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @GetMapping("/api/v1/activities")
    @Operation(summary = "Get user activity timeline")
    public ResponseEntity<ApiResponse<PageResponse<ActivityLogDto>>> getUserActivities(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String entityType) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<ActivityLogDto> result = activityLogService.getUserActivities(principal.getId(), entityType, pageable);
        return ResponseEntity.ok(ApiResponse.success("User activity log retrieved successfully", result));
    }

    @GetMapping("/api/v1/projects/{projectId}/activities")
    @Operation(summary = "Get project activity timeline")
    public ResponseEntity<ApiResponse<PageResponse<ActivityLogDto>>> getProjectActivities(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String entityType) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<ActivityLogDto> result = activityLogService.getProjectActivities(principal.getId(), projectId, entityType, pageable);
        return ResponseEntity.ok(ApiResponse.success("Project activity log retrieved successfully", result));
    }

    @GetMapping("/api/v1/workspaces/{workspaceId}/activities")
    @Operation(summary = "Get workspace activity timeline")
    public ResponseEntity<ApiResponse<PageResponse<ActivityLogDto>>> getWorkspaceActivities(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String entityType) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<ActivityLogDto> result = activityLogService.getWorkspaceActivities(principal.getId(), workspaceId, entityType, pageable);
        return ResponseEntity.ok(ApiResponse.success("Workspace activity log retrieved successfully", result));
    }

    @PostMapping("/api/v1/activities")
    @Operation(summary = "Record custom activity log entry")
    public ResponseEntity<ApiResponse<ActivityLogDto>> logActivity(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateActivityLogRequest request) {
        ActivityLogDto created = activityLogService.logActivity(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Activity recorded successfully", created));
    }
}
