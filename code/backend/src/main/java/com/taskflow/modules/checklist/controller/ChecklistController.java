package com.taskflow.modules.checklist.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.checklist.dto.BatchUpdateChecklistRequest;
import com.taskflow.modules.checklist.dto.ChecklistDto;
import com.taskflow.modules.checklist.dto.ChecklistProgressDto;
import com.taskflow.modules.checklist.dto.CreateChecklistRequest;
import com.taskflow.modules.checklist.dto.ReorderChecklistRequest;
import com.taskflow.modules.checklist.dto.ToggleChecklistRequest;
import com.taskflow.modules.checklist.dto.UpdateChecklistRequest;
import com.taskflow.modules.checklist.service.ChecklistService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@Tag(name = "Checklist Management", description = "Endpoints for task checklist items and progress tracking")
public class ChecklistController {

    private final ChecklistService checklistService;

    public ChecklistController(ChecklistService checklistService) {
        this.checklistService = checklistService;
    }

    @PostMapping("/api/v1/tasks/{taskId}/checklists")
    @Operation(summary = "Create a new checklist item under a task")
    public ResponseEntity<ApiResponse<ChecklistDto>> createChecklist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @Valid @RequestBody CreateChecklistRequest request) {
        ChecklistDto dto = checklistService.createChecklist(principal.getId(), taskId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Checklist item created successfully", dto));
    }

    @GetMapping("/api/v1/tasks/{taskId}/checklists")
    @Operation(summary = "List all checklist items for a task")
    public ResponseEntity<ApiResponse<List<ChecklistDto>>> getTaskChecklists(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId) {
        List<ChecklistDto> list = checklistService.getTaskChecklists(principal.getId(), taskId);
        return ResponseEntity.ok(ApiResponse.success("Task checklists retrieved successfully", list));
    }

    @GetMapping("/api/v1/tasks/{taskId}/checklists/progress")
    @Operation(summary = "Get task checklist progress statistics")
    public ResponseEntity<ApiResponse<ChecklistProgressDto>> getChecklistProgress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId) {
        ChecklistProgressDto progress = checklistService.getChecklistProgress(principal.getId(), taskId);
        return ResponseEntity.ok(ApiResponse.success("Checklist progress retrieved successfully", progress));
    }

    @PutMapping("/api/v1/checklists/{checklistId}")
    @Operation(summary = "Update checklist item title and completion status")
    public ResponseEntity<ApiResponse<ChecklistDto>> updateChecklist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID checklistId,
            @Valid @RequestBody UpdateChecklistRequest request) {
        ChecklistDto updated = checklistService.updateChecklist(principal.getId(), checklistId, request);
        return ResponseEntity.ok(ApiResponse.success("Checklist item updated successfully", updated));
    }

    @PatchMapping("/api/v1/checklists/{checklistId}/complete")
    @Operation(summary = "Toggle or update checklist item completion status")
    public ResponseEntity<ApiResponse<ChecklistDto>> toggleChecklistComplete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID checklistId,
            @RequestBody(required = false) ToggleChecklistRequest request) {
        Boolean completed = request != null ? request.getCompleted() : null;
        ChecklistDto updated = checklistService.toggleChecklistComplete(principal.getId(), checklistId, completed);
        return ResponseEntity.ok(ApiResponse.success("Checklist completion status updated", updated));
    }

    @PatchMapping("/api/v1/checklists/{checklistId}/reorder")
    @Operation(summary = "Reorder checklist item position")
    public ResponseEntity<ApiResponse<ChecklistDto>> reorderChecklist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID checklistId,
            @Valid @RequestBody ReorderChecklistRequest request) {
        ChecklistDto updated = checklistService.reorderChecklist(principal.getId(), checklistId, request.getPosition());
        return ResponseEntity.ok(ApiResponse.success("Checklist item reordered successfully", updated));
    }

    @DeleteMapping("/api/v1/checklists/{checklistId}")
    @Operation(summary = "Delete a checklist item")
    public ResponseEntity<ApiResponse<Void>> deleteChecklist(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID checklistId) {
        checklistService.deleteChecklist(principal.getId(), checklistId);
        return ResponseEntity.ok(ApiResponse.success("Checklist item deleted successfully", null));
    }

    @PutMapping("/api/v1/tasks/{taskId}/checklists/batch")
    @Operation(summary = "Batch update multiple checklist items for a task")
    public ResponseEntity<ApiResponse<List<ChecklistDto>>> batchUpdateChecklists(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @Valid @RequestBody BatchUpdateChecklistRequest request) {
        List<ChecklistDto> updatedList = checklistService.batchUpdateChecklists(principal.getId(), taskId, request);
        return ResponseEntity.ok(ApiResponse.success("Checklist items batch updated successfully", updatedList));
    }
}
