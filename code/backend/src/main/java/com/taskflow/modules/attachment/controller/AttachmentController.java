package com.taskflow.modules.attachment.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.attachment.dto.AttachmentDto;
import com.taskflow.modules.attachment.service.AttachmentService;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@Tag(name = "Attachment Management", description = "Endpoints for task file attachments and cloud storage uploads")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @PostMapping(value = "/api/v1/tasks/{taskId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a file attachment to a task")
    public ResponseEntity<ApiResponse<AttachmentDto>> uploadTaskAttachment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @RequestParam("file") MultipartFile file) {
        AttachmentDto created = attachmentService.uploadTaskAttachment(principal.getId(), taskId, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("File uploaded successfully", created));
    }

    @GetMapping("/api/v1/tasks/{taskId}/attachments")
    @Operation(summary = "Get all active attachments for a task")
    public ResponseEntity<ApiResponse<List<AttachmentDto>>> getTaskAttachments(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId) {
        List<AttachmentDto> attachments = attachmentService.getTaskAttachments(principal.getId(), taskId);
        return ResponseEntity.ok(ApiResponse.success("Task attachments retrieved successfully", attachments));
    }

    @GetMapping("/api/v1/attachments/{attachmentId}")
    @Operation(summary = "Get attachment details by ID")
    public ResponseEntity<ApiResponse<AttachmentDto>> getAttachmentDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID attachmentId) {
        AttachmentDto attachment = attachmentService.getAttachmentDetails(principal.getId(), attachmentId);
        return ResponseEntity.ok(ApiResponse.success("Attachment details retrieved successfully", attachment));
    }

    @DeleteMapping("/api/v1/attachments/{attachmentId}")
    @Operation(summary = "Delete an attachment")
    public ResponseEntity<ApiResponse<Void>> deleteAttachment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID attachmentId) {
        attachmentService.deleteAttachment(principal.getId(), attachmentId);
        return ResponseEntity.ok(ApiResponse.success("Attachment deleted successfully", null));
    }
}
