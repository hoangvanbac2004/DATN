package com.taskflow.modules.activity.service.impl;

import com.taskflow.common.PageResponse;
import com.taskflow.modules.activity.dto.ActivityLogDto;
import com.taskflow.modules.activity.dto.CreateActivityLogRequest;
import com.taskflow.modules.activity.entity.ActivityLogEntity;
import com.taskflow.modules.activity.mapper.ActivityLogMapper;
import com.taskflow.modules.activity.repository.ActivityLogRepository;
import com.taskflow.modules.activity.service.ActivityLogService;
import com.taskflow.modules.project.service.ProjectService;
import com.taskflow.modules.user.dto.UserDto;
import com.taskflow.modules.user.service.UserService;
import com.taskflow.modules.workspace.service.WorkspaceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserService userService;
    private final ProjectService projectService;
    private final WorkspaceService workspaceService;
    private final ActivityLogMapper activityLogMapper;

    public ActivityLogServiceImpl(
            ActivityLogRepository activityLogRepository,
            UserService userService,
            ProjectService projectService,
            WorkspaceService workspaceService,
            ActivityLogMapper activityLogMapper) {
        this.activityLogRepository = activityLogRepository;
        this.userService = userService;
        this.projectService = projectService;
        this.workspaceService = workspaceService;
        this.activityLogMapper = activityLogMapper;
    }

    @Override
    @Transactional
    public ActivityLogDto logActivity(UUID userId, CreateActivityLogRequest request) {
        ActivityLogEntity entity = new ActivityLogEntity(
                request.getAction().trim(),
                request.getEntityType().trim(),
                request.getEntityId(),
                userId,
                request.getDetails(),
                request.getWorkspaceId(),
                request.getProjectId()
        );

        ActivityLogEntity saved = activityLogRepository.save(entity);
        UserDto user = resolveUser(userId);
        return activityLogMapper.toDto(saved, user);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ActivityLogDto> getUserActivities(UUID userId, String entityType, Pageable pageable) {
        Page<ActivityLogEntity> page = (entityType != null && !entityType.isBlank())
                ? activityLogRepository.findByUserIdAndEntityTypeAndIsDeletedFalseOrderByCreatedAtDesc(userId, entityType.trim(), pageable)
                : activityLogRepository.findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId, pageable);

        return mapPageToResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ActivityLogDto> getProjectActivities(UUID userId, UUID projectId, String entityType, Pageable pageable) {
        projectService.getProjectDetails(userId, projectId);
        Page<ActivityLogEntity> page = (entityType != null && !entityType.isBlank())
                ? activityLogRepository.findByProjectIdAndEntityTypeAndIsDeletedFalseOrderByCreatedAtDesc(projectId, entityType.trim(), pageable)
                : activityLogRepository.findByProjectIdAndIsDeletedFalseOrderByCreatedAtDesc(projectId, pageable);
        return mapPageToResponse(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ActivityLogDto> getWorkspaceActivities(UUID userId, UUID workspaceId, String entityType, Pageable pageable) {
        workspaceService.getWorkspaceDetails(userId, workspaceId);
        Page<ActivityLogEntity> page = (entityType != null && !entityType.isBlank())
                ? activityLogRepository.findByWorkspaceIdAndEntityTypeAndIsDeletedFalseOrderByCreatedAtDesc(workspaceId, entityType.trim(), pageable)
                : activityLogRepository.findByWorkspaceIdAndIsDeletedFalseOrderByCreatedAtDesc(workspaceId, pageable);
        return mapPageToResponse(page);
    }

    private PageResponse<ActivityLogDto> mapPageToResponse(Page<ActivityLogEntity> page) {
        List<ActivityLogDto> dtos = page.getContent().stream().map(entity -> {
            UserDto user = resolveUser(entity.getUserId());
            return activityLogMapper.toDto(entity, user);
        }).collect(Collectors.toList());

        return PageResponse.<ActivityLogDto>builder()
                .items(dtos)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private UserDto resolveUser(UUID userId) {
        if (userId == null) return null;
        try {
            return userService.getCurrentUserProfile(userId);
        } catch (Exception ignored) {
            return null;
        }
    }
}
