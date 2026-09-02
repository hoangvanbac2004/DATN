package com.taskflow.modules.task.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.task.dto.CreateTaskDependencyRequest;
import com.taskflow.modules.task.dto.TaskDependencyDto;
import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.modules.task.dto.UpdateTaskTimelineRequest;
import com.taskflow.modules.task.service.TaskService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Timeline & Dependencies", description = "Endpoints for managing task timeline dates, durations, and Gantt chart dependencies")
public class TimelineController {

    private final TaskService taskService;

    public TimelineController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/projects/{projectId}/timeline")
    @Operation(summary = "Get project tasks with timeline start/due dates and dependencies")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getProjectTimeline(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId) {
        List<TaskDto> timelineTasks = taskService.getProjectTimeline(principal.getId(), projectId);
        return ResponseEntity.ok(ApiResponse.success("Project timeline retrieved successfully", timelineTasks));
    }

    @PatchMapping("/tasks/{taskId}/timeline")
    @Operation(summary = "Update task start date and due date for drag timeline or resize duration")
    public ResponseEntity<ApiResponse<TaskDto>> updateTaskTimeline(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @Valid @RequestBody UpdateTaskTimelineRequest request) {
        TaskDto updated = taskService.updateTaskTimeline(principal.getId(), taskId, request);
        return ResponseEntity.ok(ApiResponse.success("Task timeline updated successfully", updated));
    }

    @PostMapping("/tasks/dependencies")
    @Operation(summary = "Create dependency link between predecessor and successor tasks")
    public ResponseEntity<ApiResponse<TaskDependencyDto>> createDependency(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateTaskDependencyRequest request) {
        TaskDependencyDto dependency = taskService.createDependency(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task dependency created successfully", dependency));
    }

    @DeleteMapping("/tasks/dependencies/{dependencyId}")
    @Operation(summary = "Remove task dependency link")
    public ResponseEntity<ApiResponse<Void>> deleteDependency(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID dependencyId) {
        taskService.deleteDependency(principal.getId(), dependencyId);
        return ResponseEntity.ok(ApiResponse.success("Task dependency deleted successfully", null));
    }
}
