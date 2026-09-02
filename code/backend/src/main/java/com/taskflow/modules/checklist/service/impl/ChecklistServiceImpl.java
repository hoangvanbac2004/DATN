package com.taskflow.modules.checklist.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.checklist.dto.BatchUpdateChecklistRequest;
import com.taskflow.modules.checklist.dto.ChecklistDto;
import com.taskflow.modules.checklist.dto.ChecklistProgressDto;
import com.taskflow.modules.checklist.dto.CreateChecklistRequest;
import com.taskflow.modules.checklist.dto.UpdateChecklistRequest;
import com.taskflow.modules.checklist.entity.ChecklistEntity;
import com.taskflow.modules.checklist.mapper.ChecklistMapper;
import com.taskflow.modules.checklist.repository.ChecklistRepository;
import com.taskflow.modules.checklist.service.ChecklistService;
import com.taskflow.modules.task.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChecklistServiceImpl implements ChecklistService {

    private final ChecklistRepository checklistRepository;
    private final TaskService taskService;
    private final ChecklistMapper checklistMapper;

    public ChecklistServiceImpl(
            ChecklistRepository checklistRepository,
            TaskService taskService,
            ChecklistMapper checklistMapper) {
        this.checklistRepository = checklistRepository;
        this.taskService = taskService;
        this.checklistMapper = checklistMapper;
    }

    @Override
    @Transactional
    public ChecklistDto createChecklist(UUID userId, UUID taskId, CreateChecklistRequest request) {
        taskService.getTaskDetails(userId, taskId);

        Double maxPosition = checklistRepository.findMaxPositionByTaskId(taskId);
        Double position = request.getPosition() != null ? request.getPosition() : (maxPosition != null ? maxPosition + 1000.0 : 1000.0);

        ChecklistEntity entity = new ChecklistEntity(
                request.getTitle().trim(),
                request.getCompleted(),
                taskId,
                position
        );

        ChecklistEntity saved = checklistRepository.save(entity);
        return checklistMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChecklistDto> getTaskChecklists(UUID userId, UUID taskId) {
        taskService.getTaskDetails(userId, taskId);

        List<ChecklistEntity> items = checklistRepository.findByTaskIdAndIsDeletedFalseOrderByPositionAsc(taskId);
        return items.stream()
                .map(checklistMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ChecklistProgressDto getChecklistProgress(UUID userId, UUID taskId) {
        taskService.getTaskDetails(userId, taskId);

        long totalItems = checklistRepository.countByTaskIdAndIsDeletedFalse(taskId);
        long completedItems = checklistRepository.countByTaskIdAndCompletedTrueAndIsDeletedFalse(taskId);
        double percentage = totalItems > 0 ? ((double) completedItems / totalItems) * 100.0 : 0.0;

        return new ChecklistProgressDto(taskId, totalItems, completedItems, Math.round(percentage * 100.0) / 100.0);
    }

    @Override
    @Transactional
    public ChecklistDto updateChecklist(UUID userId, UUID checklistId, UpdateChecklistRequest request) {
        ChecklistEntity entity = findActiveChecklistById(checklistId);
        taskService.getTaskDetails(userId, entity.getTaskId());

        entity.setTitle(request.getTitle().trim());
        if (request.getCompleted() != null) {
            entity.setCompleted(request.getCompleted());
        }

        ChecklistEntity updated = checklistRepository.save(entity);
        return checklistMapper.toDto(updated);
    }

    @Override
    @Transactional
    public ChecklistDto toggleChecklistComplete(UUID userId, UUID checklistId, Boolean completed) {
        ChecklistEntity entity = findActiveChecklistById(checklistId);
        taskService.getTaskDetails(userId, entity.getTaskId());

        boolean newStatus = (completed != null) ? completed : !entity.getCompleted();
        entity.setCompleted(newStatus);

        ChecklistEntity updated = checklistRepository.save(entity);
        return checklistMapper.toDto(updated);
    }

    @Override
    @Transactional
    public ChecklistDto reorderChecklist(UUID userId, UUID checklistId, Double position) {
        ChecklistEntity entity = findActiveChecklistById(checklistId);
        taskService.getTaskDetails(userId, entity.getTaskId());

        entity.setPosition(position);
        ChecklistEntity updated = checklistRepository.save(entity);
        return checklistMapper.toDto(updated);
    }

    @Override
    @Transactional
    public void deleteChecklist(UUID userId, UUID checklistId) {
        ChecklistEntity entity = findActiveChecklistById(checklistId);
        taskService.getTaskDetails(userId, entity.getTaskId());

        entity.setIsDeleted(true);
        entity.setDeletedAt(Instant.now());
        checklistRepository.save(entity);
    }

    @Override
    @Transactional
    public List<ChecklistDto> batchUpdateChecklists(UUID userId, UUID taskId, BatchUpdateChecklistRequest request) {
        taskService.getTaskDetails(userId, taskId);

        for (BatchUpdateChecklistRequest.ChecklistItemUpdate itemUpdate : request.getItems()) {
            ChecklistEntity entity = checklistRepository.findByIdAndIsDeletedFalse(itemUpdate.getId())
                    .orElse(null);

            if (entity != null && entity.getTaskId().equals(taskId)) {
                if (itemUpdate.getTitle() != null && !itemUpdate.getTitle().isBlank()) {
                    entity.setTitle(itemUpdate.getTitle().trim());
                }
                if (itemUpdate.getCompleted() != null) {
                    entity.setCompleted(itemUpdate.getCompleted());
                }
                if (itemUpdate.getPosition() != null) {
                    entity.setPosition(itemUpdate.getPosition());
                }
                checklistRepository.save(entity);
            }
        }

        return getTaskChecklists(userId, taskId);
    }

    private ChecklistEntity findActiveChecklistById(UUID checklistId) {
        return checklistRepository.findByIdAndIsDeletedFalse(checklistId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Checklist item not found"));
    }
}
