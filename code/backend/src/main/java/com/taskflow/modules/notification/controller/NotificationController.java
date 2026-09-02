package com.taskflow.modules.notification.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.common.PageResponse;
import com.taskflow.modules.notification.dto.CreateNotificationRequest;
import com.taskflow.modules.notification.dto.NotificationDto;
import com.taskflow.modules.notification.dto.UnreadCountDto;
import com.taskflow.modules.notification.service.NotificationService;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notification Center", description = "Endpoints for in-app notifications, read status, and unread counts")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "Get paginated notifications for current user")
    public ResponseEntity<ApiResponse<PageResponse<NotificationDto>>> getUserNotifications(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<NotificationDto> result = notificationService.getUserNotifications(principal.getId(), unreadOnly, pageable);
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved successfully", result));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<ApiResponse<UnreadCountDto>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal principal) {
        UnreadCountDto count = notificationService.getUnreadCount(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Unread count retrieved successfully", count));
    }

    @PostMapping
    @Operation(summary = "Create a notification")
    public ResponseEntity<ApiResponse<NotificationDto>> createNotification(
            @Valid @RequestBody CreateNotificationRequest request) {
        NotificationDto created = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Notification created successfully", created));
    }

    @PatchMapping("/{notificationId}/read")
    @Operation(summary = "Mark single notification as read")
    public ResponseEntity<ApiResponse<NotificationDto>> markAsRead(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID notificationId) {
        NotificationDto updated = notificationService.markAsRead(principal.getId(), notificationId);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", updated));
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal principal) {
        notificationService.markAllAsRead(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @DeleteMapping("/{notificationId}")
    @Operation(summary = "Delete notification")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID notificationId) {
        notificationService.deleteNotification(principal.getId(), notificationId);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully", null));
    }
}
