package com.taskflow.modules.tag.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.tag.dto.CreateTagRequest;
import com.taskflow.modules.tag.dto.TagDto;
import com.taskflow.modules.tag.dto.UpdateTagRequest;
import com.taskflow.modules.tag.entity.TagEntity;
import com.taskflow.modules.tag.entity.TaskTagEntity;
import com.taskflow.modules.tag.mapper.TagMapper;
import com.taskflow.modules.tag.repository.TagRepository;
import com.taskflow.modules.tag.repository.TaskTagRepository;
import com.taskflow.modules.tag.service.TagService;
import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.modules.task.service.TaskService;
import com.taskflow.modules.workspace.service.WorkspaceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final TaskTagRepository taskTagRepository;
    private final WorkspaceService workspaceService;
    private final TaskService taskService;
    private final TagMapper tagMapper;

    public TagServiceImpl(
            TagRepository tagRepository,
            TaskTagRepository taskTagRepository,
            WorkspaceService workspaceService,
            TaskService taskService,
            TagMapper tagMapper) {
        this.tagRepository = tagRepository;
        this.taskTagRepository = taskTagRepository;
        this.workspaceService = workspaceService;
        this.taskService = taskService;
        this.tagMapper = tagMapper;
    }

    @Override
    @Transactional
    public TagDto createTag(UUID userId, UUID workspaceId, CreateTagRequest request) {
        workspaceService.getWorkspaceDetails(userId, workspaceId);

        String name = request.getName().trim();
        if (tagRepository.existsByWorkspaceIdAndNameIgnoreCaseAndIsDeletedFalse(workspaceId, name)) {
            throw new AppException(ResultCode.CONFLICT, "A tag with this name already exists in this workspace");
        }

        String color = (request.getColor() != null && !request.getColor().isBlank()) ? request.getColor().trim() : "#6366F1";
        TagEntity entity = new TagEntity(name, color, workspaceId);

        TagEntity saved = tagRepository.save(entity);
        return tagMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TagDto> getWorkspaceTags(UUID userId, UUID workspaceId, String search) {
        workspaceService.getWorkspaceDetails(userId, workspaceId);

        String searchPattern = (search != null && !search.isBlank()) ? search.trim() : null;
        List<TagEntity> tags = tagRepository.searchWorkspaceTags(workspaceId, searchPattern);

        return tags.stream()
                .map(tagMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TagDto getTagDetails(UUID userId, UUID tagId) {
        TagEntity tag = findActiveTagById(tagId);
        workspaceService.getWorkspaceDetails(userId, tag.getWorkspaceId());
        return tagMapper.toDto(tag);
    }

    @Override
    @Transactional
    public TagDto updateTag(UUID userId, UUID tagId, UpdateTagRequest request) {
        TagEntity tag = findActiveTagById(tagId);
        workspaceService.getWorkspaceDetails(userId, tag.getWorkspaceId());

        String newName = request.getName().trim();
        if (!tag.getName().equalsIgnoreCase(newName) &&
            tagRepository.existsByWorkspaceIdAndNameIgnoreCaseAndIsDeletedFalse(tag.getWorkspaceId(), newName)) {
            throw new AppException(ResultCode.CONFLICT, "A tag with this name already exists in this workspace");
        }

        tag.setName(newName);
        if (request.getColor() != null && !request.getColor().isBlank()) {
            tag.setColor(request.getColor().trim());
        }

        TagEntity updated = tagRepository.save(tag);
        return tagMapper.toDto(updated);
    }

    @Override
    @Transactional
    public void deleteTag(UUID userId, UUID tagId) {
        TagEntity tag = findActiveTagById(tagId);
        workspaceService.getWorkspaceDetails(userId, tag.getWorkspaceId());

        tag.setIsDeleted(true);
        tag.setDeletedAt(Instant.now());
        tagRepository.save(tag);
    }

    @Override
    @Transactional
    public List<TagDto> assignTagToTask(UUID userId, UUID taskId, UUID tagId) {
        TaskDto task = taskService.getTaskDetails(userId, taskId);
        TagEntity tag = findActiveTagById(tagId);

        if (!taskTagRepository.existsByTaskIdAndTagId(task.getId(), tag.getId())) {
            TaskTagEntity taskTag = new TaskTagEntity(task.getId(), tag.getId(), userId);
            taskTagRepository.save(taskTag);
        }

        return getTaskTags(userId, taskId);
    }

    @Override
    @Transactional
    public List<TagDto> removeTagFromTask(UUID userId, UUID taskId, UUID tagId) {
        TaskDto task = taskService.getTaskDetails(userId, taskId);
        taskTagRepository.deleteByTaskIdAndTagId(task.getId(), tagId);
        return getTaskTags(userId, taskId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TagDto> getTaskTags(UUID userId, UUID taskId) {
        taskService.getTaskDetails(userId, taskId);

        List<UUID> tagIds = taskTagRepository.findTagIdsByTaskId(taskId);
        if (tagIds.isEmpty()) {
            return List.of();
        }

        List<TagEntity> tags = tagRepository.findAllById(tagIds).stream()
                .filter(t -> !t.getIsDeleted())
                .collect(Collectors.toList());

        return tags.stream()
                .map(tagMapper::toDto)
                .collect(Collectors.toList());
    }

    private TagEntity findActiveTagById(UUID tagId) {
        return tagRepository.findByIdAndIsDeletedFalse(tagId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Tag not found"));
    }
}
