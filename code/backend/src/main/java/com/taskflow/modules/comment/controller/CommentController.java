package com.taskflow.modules.comment.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.common.PageResponse;
import com.taskflow.modules.comment.dto.CommentDto;
import com.taskflow.modules.comment.dto.CreateCommentRequest;
import com.taskflow.modules.comment.dto.UpdateCommentRequest;
import com.taskflow.modules.comment.service.CommentService;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@Tag(name = "Comment Management", description = "Endpoints for task comments and discussion threads")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/api/v1/tasks/{taskId}/comments")
    @Operation(summary = "Create a new comment under a task")
    public ResponseEntity<ApiResponse<CommentDto>> createComment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentDto created = commentService.createComment(principal.getId(), taskId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment posted successfully", created));
    }

    @GetMapping("/api/v1/tasks/{taskId}/comments")
    @Operation(summary = "List paginated comments for a task")
    public ResponseEntity<ApiResponse<PageResponse<CommentDto>>> getTaskComments(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID taskId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        PageResponse<CommentDto> comments = commentService.getTaskComments(principal.getId(), taskId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Task comments retrieved successfully", comments));
    }

    @GetMapping("/api/v1/comments/{commentId}")
    @Operation(summary = "Get comment details by ID")
    public ResponseEntity<ApiResponse<CommentDto>> getCommentDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID commentId) {
        CommentDto comment = commentService.getCommentDetails(principal.getId(), commentId);
        return ResponseEntity.ok(ApiResponse.success("Comment details retrieved successfully", comment));
    }

    @PutMapping("/api/v1/comments/{commentId}")
    @Operation(summary = "Update comment content")
    public ResponseEntity<ApiResponse<CommentDto>> updateComment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID commentId,
            @Valid @RequestBody UpdateCommentRequest request) {
        CommentDto updated = commentService.updateComment(principal.getId(), commentId, request);
        return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", updated));
    }

    @DeleteMapping("/api/v1/comments/{commentId}")
    @Operation(summary = "Delete a comment")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID commentId) {
        commentService.deleteComment(principal.getId(), commentId);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }
}
