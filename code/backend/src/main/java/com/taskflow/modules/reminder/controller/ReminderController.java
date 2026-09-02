package com.taskflow.modules.reminder.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.reminder.dto.CreateReminderRequest;
import com.taskflow.modules.reminder.dto.ReminderDto;
import com.taskflow.modules.reminder.dto.UpdateReminderRequest;
import com.taskflow.modules.reminder.service.ReminderService;
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
@Tag(name = "Reminder Management", description = "Endpoints for task reminder scheduling and status management")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @PostMapping("/api/v1/tasks/{taskId}/reminders")
    @Operation(summary = "Create a new scheduled reminder for a task")
    public ResponseEntity<ApiResponse<ReminderDto>> createReminder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @Valid @RequestBody CreateReminderRequest request) {
        ReminderDto created = reminderService.createReminder(principal.getId(), taskId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Reminder scheduled successfully", created));
    }

    @GetMapping("/api/v1/tasks/{taskId}/reminders")
    @Operation(summary = "List all active reminders for a task")
    public ResponseEntity<ApiResponse<List<ReminderDto>>> getTaskReminders(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId) {
        List<ReminderDto> reminders = reminderService.getTaskReminders(principal.getId(), taskId);
        return ResponseEntity.ok(ApiResponse.success("Task reminders retrieved successfully", reminders));
    }

    @GetMapping("/api/v1/reminders/user")
    @Operation(summary = "List user's upcoming pending reminders")
    public ResponseEntity<ApiResponse<List<ReminderDto>>> getUserUpcomingReminders(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ReminderDto> reminders = reminderService.getUserUpcomingReminders(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("User upcoming reminders retrieved successfully", reminders));
    }

    @GetMapping("/api/v1/reminders/{reminderId}")
    @Operation(summary = "Get reminder details by ID")
    public ResponseEntity<ApiResponse<ReminderDto>> getReminderDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID reminderId) {
        ReminderDto reminder = reminderService.getReminderDetails(principal.getId(), reminderId);
        return ResponseEntity.ok(ApiResponse.success("Reminder details retrieved successfully", reminder));
    }

    @PutMapping("/api/v1/reminders/{reminderId}")
    @Operation(summary = "Update reminder date/time or status")
    public ResponseEntity<ApiResponse<ReminderDto>> updateReminder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID reminderId,
            @Valid @RequestBody UpdateReminderRequest request) {
        ReminderDto updated = reminderService.updateReminder(principal.getId(), reminderId, request);
        return ResponseEntity.ok(ApiResponse.success("Reminder updated successfully", updated));
    }

    @PatchMapping("/api/v1/reminders/{reminderId}/dismiss")
    @Operation(summary = "Dismiss a reminder")
    public ResponseEntity<ApiResponse<ReminderDto>> dismissReminder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID reminderId) {
        ReminderDto updated = reminderService.dismissReminder(principal.getId(), reminderId);
        return ResponseEntity.ok(ApiResponse.success("Reminder dismissed", updated));
    }

    @DeleteMapping("/api/v1/reminders/{reminderId}")
    @Operation(summary = "Delete a reminder")
    public ResponseEntity<ApiResponse<Void>> deleteReminder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID reminderId) {
        reminderService.deleteReminder(principal.getId(), reminderId);
        return ResponseEntity.ok(ApiResponse.success("Reminder deleted successfully", null));
    }
}
