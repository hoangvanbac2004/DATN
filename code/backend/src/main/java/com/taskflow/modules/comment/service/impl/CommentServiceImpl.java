package com.taskflow.modules.comment.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.PageResponse;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.comment.dto.CommentDto;
import com.taskflow.modules.comment.dto.CreateCommentRequest;
import com.taskflow.modules.comment.dto.UpdateCommentRequest;
import com.taskflow.modules.comment.entity.CommentEntity;
import com.taskflow.modules.comment.mapper.CommentMapper;
import com.taskflow.modules.comment.repository.CommentRepository;
import com.taskflow.modules.comment.service.CommentService;
import com.taskflow.modules.comment.util.MentionUtils;
import com.taskflow.modules.task.service.TaskService;
import com.taskflow.modules.user.dto.UserDto;
import com.taskflow.modules.user.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final TaskService taskService;
    private final UserService userService;
    private final CommentMapper commentMapper;
    private final com.taskflow.modules.notification.service.NotificationService notificationService;

    public CommentServiceImpl(
            CommentRepository commentRepository,
            TaskService taskService,
            UserService userService,
            CommentMapper commentMapper,
            com.taskflow.modules.notification.service.NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.taskService = taskService;
        this.userService = userService;
        this.commentMapper = commentMapper;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public CommentDto createComment(UUID userId, UUID taskId, CreateCommentRequest request) {
        com.taskflow.modules.task.dto.TaskDto task = taskService.getTaskDetails(userId, taskId);

        List<UUID> mentions = extractAndMergeMentions(request.getContent(), request.getMentionedUserIds());
        String mentionsStr = MentionUtils.serializeMentionedUserIds(mentions);

        CommentEntity entity = new CommentEntity(
                request.getContent().trim(),
                taskId,
                userId,
                mentionsStr
        );

        CommentEntity saved = commentRepository.save(entity);
        UserDto author = resolveAuthor(saved.getUserId());

        if (!mentions.isEmpty() && notificationService != null) {
            String authorName = author != null && author.getFullName() != null ? author.getFullName() : "Someone";
            for (UUID mentionedUserId : mentions) {
                if (!mentionedUserId.equals(userId)) {
                    try {
                        notificationService.createNotification(new com.taskflow.modules.notification.dto.CreateNotificationRequest(
                                "You were mentioned in a comment",
                                authorName + " mentioned you in a comment on task: " + task.getTitle(),
                                mentionedUserId,
                                "MENTION",
                                "/projects/" + task.getProjectId()
                        ));
                    } catch (Exception ignored) {
                    }
                }
            }
        }

        return commentMapper.toDto(saved, author);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CommentDto> getTaskComments(UUID userId, UUID taskId, Pageable pageable) {
        taskService.getTaskDetails(userId, taskId);

        Page<CommentEntity> page = commentRepository.findByTaskIdAndIsDeletedFalseOrderByCreatedAtDesc(taskId, pageable);

        List<CommentDto> dtos = page.getContent().stream().map(entity -> {
            UserDto author = resolveAuthor(entity.getUserId());
            return commentMapper.toDto(entity, author);
        }).collect(Collectors.toList());

        return PageResponse.<CommentDto>builder()
                .items(dtos)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CommentDto getCommentDetails(UUID userId, UUID commentId) {
        CommentEntity comment = findActiveCommentById(commentId);
        taskService.getTaskDetails(userId, comment.getTaskId());

        UserDto author = resolveAuthor(comment.getUserId());
        return commentMapper.toDto(comment, author);
    }

    @Override
    @Transactional
    public CommentDto updateComment(UUID userId, UUID commentId, UpdateCommentRequest request) {
        CommentEntity comment = findActiveCommentById(commentId);
        taskService.getTaskDetails(userId, comment.getTaskId());

        if (!comment.getUserId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "You are not authorized to edit this comment");
        }

        List<UUID> mentions = extractAndMergeMentions(request.getContent(), request.getMentionedUserIds());
        String mentionsStr = MentionUtils.serializeMentionedUserIds(mentions);

        comment.setContent(request.getContent().trim());
        comment.setMentionedUserIds(mentionsStr);

        CommentEntity updated = commentRepository.save(comment);
        UserDto author = resolveAuthor(updated.getUserId());
        return commentMapper.toDto(updated, author);
    }

    @Override
    @Transactional
    public void deleteComment(UUID userId, UUID commentId) {
        CommentEntity comment = findActiveCommentById(commentId);
        taskService.getTaskDetails(userId, comment.getTaskId());

        if (!comment.getUserId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "You are not authorized to delete this comment");
        }

        comment.setIsDeleted(true);
        comment.setDeletedAt(Instant.now());
        commentRepository.save(comment);
    }

    private CommentEntity findActiveCommentById(UUID commentId) {
        return commentRepository.findByIdAndIsDeletedFalse(commentId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Comment not found"));
    }

    private UserDto resolveAuthor(UUID userId) {
        if (userId == null) {
            return null;
        }
        try {
            return userService.getCurrentUserProfile(userId);
        } catch (Exception ignored) {
            return null;
        }
    }

    private List<UUID> extractAndMergeMentions(String content, List<UUID> explicitMentions) {
        List<UUID> parsed = MentionUtils.parseMentionedUserIds(content);
        List<UUID> merged = new ArrayList<>(parsed);
        if (explicitMentions != null) {
            for (UUID id : explicitMentions) {
                if (!merged.contains(id)) {
                    merged.add(id);
                }
            }
        }
        return merged;
    }
}
