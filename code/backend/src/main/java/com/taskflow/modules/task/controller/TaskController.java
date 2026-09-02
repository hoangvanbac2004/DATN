package com.taskflow.modules.task.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.task.dto.AssignTaskRequest;
import com.taskflow.modules.task.dto.CreateTaskRequest;
import com.taskflow.modules.task.dto.ReorderTaskRequest;
import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.modules.task.dto.UpdateTaskRequest;
import com.taskflow.modules.task.dto.UpdateTaskStatusRequest;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@Tag(name = "Task Management", description = "Endpoints for managing workspace and project tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/api/v1/workspaces/{workspaceId}/tasks")
    @Operation(summary = "Create a new task directly under a workspace")
    public ResponseEntity<ApiResponse<TaskDto>> createWorkspaceTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody CreateTaskRequest request) {
        TaskDto task = taskService.createWorkspaceTask(principal.getId(), workspaceId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully in workspace", task));
    }

    @GetMapping("/api/v1/workspaces/{workspaceId}/tasks")
    @Operation(summary = "List all tasks for a workspace with optional filters")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getWorkspaceTasks(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) UUID assigneeId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean archived) {
        List<TaskDto> tasks = taskService.getWorkspaceTasks(principal.getId(), workspaceId, status, priority, assigneeId, search, archived);
        return ResponseEntity.ok(ApiResponse.success("Workspace tasks retrieved successfully", tasks));
    }

    @PostMapping("/api/v1/projects/{projectId}/tasks")
    @Operation(summary = "Create a new task under a project")
    public ResponseEntity<ApiResponse<TaskDto>> createTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateTaskRequest request) {
        TaskDto task = taskService.createTask(principal.getId(), projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", task));
    }

    @GetMapping("/api/v1/projects/{projectId}/tasks")
    @Operation(summary = "List all tasks for a project with optional filters")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getProjectTasks(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID projectId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) UUID assigneeId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean archived) {
        List<TaskDto> tasks = taskService.getProjectTasks(principal.getId(), projectId, status, priority, assigneeId, search, archived);
        return ResponseEntity.ok(ApiResponse.success("Project tasks retrieved successfully", tasks));
    }

    @GetMapping("/api/v1/tasks/{taskId}")
    @Operation(summary = "Get task details by ID")
    public ResponseEntity<ApiResponse<TaskDto>> getTaskDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId) {
        TaskDto task = taskService.getTaskDetails(principal.getId(), taskId);
        return ResponseEntity.ok(ApiResponse.success("Task details retrieved successfully", task));
    }

    @PutMapping("/api/v1/tasks/{taskId}")
    @Operation(summary = "Update task information")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @Valid @RequestBody UpdateTaskRequest request) {
        TaskDto updated = taskService.updateTask(principal.getId(), taskId, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated successfully", updated));
    }

    @DeleteMapping("/api/v1/tasks/{taskId}")
    @Operation(summary = "Delete (soft-delete) a task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId) {
        taskService.deleteTask(principal.getId(), taskId);
        return ResponseEntity.ok(ApiResponse.success("Task deleted successfully", null));
    }

    @PatchMapping("/api/v1/tasks/{taskId}/status")
    @Operation(summary = "Update task status")
    public ResponseEntity<ApiResponse<TaskDto>> updateTaskStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @Valid @RequestBody UpdateTaskStatusRequest request) {
        TaskDto updated = taskService.updateTaskStatus(principal.getId(), taskId, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Task status updated successfully", updated));
    }

    @PatchMapping("/api/v1/tasks/{taskId}/assign")
    @Operation(summary = "Assign or unassign task to a user")
    public ResponseEntity<ApiResponse<TaskDto>> assignTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @RequestBody AssignTaskRequest request) {
        TaskDto updated = taskService.assignTask(principal.getId(), taskId, request.getAssigneeId());
        return ResponseEntity.ok(ApiResponse.success("Task assignment updated successfully", updated));
    }

    @PatchMapping("/api/v1/tasks/{taskId}/archive")
    @Operation(summary = "Toggle archive status of a task")
    public ResponseEntity<ApiResponse<TaskDto>> toggleArchiveTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId) {
        TaskDto updated = taskService.toggleArchiveTask(principal.getId(), taskId);
        return ResponseEntity.ok(ApiResponse.success("Task archive status updated", updated));
    }

    @PatchMapping("/api/v1/tasks/{taskId}/reorder")
    @Operation(summary = "Reorder task position")
    public ResponseEntity<ApiResponse<TaskDto>> reorderTask(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @Valid @RequestBody ReorderTaskRequest request) {
        TaskDto updated = taskService.reorderTask(principal.getId(), taskId, request.getPosition());
        return ResponseEntity.ok(ApiResponse.success("Task position updated successfully", updated));
    }
}
