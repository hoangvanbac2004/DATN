package com.taskflow.modules.comment.service;

import com.taskflow.common.PageResponse;
import com.taskflow.modules.comment.dto.CommentDto;
import com.taskflow.modules.comment.dto.CreateCommentRequest;
import com.taskflow.modules.comment.dto.UpdateCommentRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Domain Service interface for managing task comments, pagination, and mention processing.
 */
public interface CommentService {

    /**
     * Creates a new comment under a task.
     *
     * @param userId  UUID identifier of requesting user
     * @param taskId  UUID identifier of target task
     * @param request creation request payload
     * @return CommentDto representation of created comment
     */
    CommentDto createComment(UUID userId, UUID taskId, CreateCommentRequest request);

    /**
     * Lists paginated comments for a task.
     *
     * @param userId   UUID identifier of requesting user
     * @param taskId   UUID identifier of target task
     * @param pageable pagination parameters
     * @return PageResponse of CommentDto items
     */
    PageResponse<CommentDto> getTaskComments(UUID userId, UUID taskId, Pageable pageable);

    /**
     * Gets comment details by ID.
     *
     * @param userId    UUID identifier of requesting user
     * @param commentId UUID identifier of target comment
     * @return CommentDto instance
     */
    CommentDto getCommentDetails(UUID userId, UUID commentId);

    /**
     * Updates comment content.
     *
     * @param userId    UUID identifier of requesting user
     * @param commentId UUID identifier of target comment
     * @param request   update request payload
     * @return updated CommentDto instance
     */
    CommentDto updateComment(UUID userId, UUID commentId, UpdateCommentRequest request);

    /**
     * Soft-deletes a comment.
     *
     * @param userId    UUID identifier of requesting user
     * @param commentId UUID identifier of target comment
     */
    void deleteComment(UUID userId, UUID commentId);
}
