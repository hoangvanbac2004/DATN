package com.taskflow.modules.checklist.service;

import com.taskflow.modules.checklist.dto.BatchUpdateChecklistRequest;
import com.taskflow.modules.checklist.dto.ChecklistDto;
import com.taskflow.modules.checklist.dto.ChecklistProgressDto;
import com.taskflow.modules.checklist.dto.CreateChecklistRequest;
import com.taskflow.modules.checklist.dto.UpdateChecklistRequest;

import java.util.List;
import java.util.UUID;

/**
 * Domain Service interface for managing task checklists, subtask progress, reordering, and batch operations.
 */
public interface ChecklistService {

    /**
     * Creates a new checklist item for a task.
     *
     * @param userId  UUID identifier of the requesting user
     * @param taskId  UUID identifier of the target task
     * @param request creation payload
     * @return ChecklistDto representation of the created checklist item
     */
    ChecklistDto createChecklist(UUID userId, UUID taskId, CreateChecklistRequest request);

    /**
     * Retrieves all active checklist items for a task ordered by position.
     *
     * @param userId UUID identifier of the requesting user
     * @param taskId UUID identifier of the target task
     * @return list of ChecklistDto items
     */
    List<ChecklistDto> getTaskChecklists(UUID userId, UUID taskId);

    /**
     * Calculates the completion progress metrics for a task's checklist.
     *
     * @param userId UUID identifier of the requesting user
     * @param taskId UUID identifier of the target task
     * @return ChecklistProgressDto containing total, completed, and percentage metrics
     */
    ChecklistProgressDto getChecklistProgress(UUID userId, UUID taskId);

    /**
     * Updates an existing checklist item's title and completion status.
     *
     * @param userId      UUID identifier of the requesting user
     * @param checklistId UUID identifier of the target checklist item
     * @param request     update payload
     * @return updated ChecklistDto
     */
    ChecklistDto updateChecklist(UUID userId, UUID checklistId, UpdateChecklistRequest request);

    /**
     * Toggles or explicitly sets the completion status of a checklist item.
     *
     * @param userId      UUID identifier of the requesting user
     * @param checklistId UUID identifier of the target checklist item
     * @param completed   boolean status
     * @return updated ChecklistDto
     */
    ChecklistDto toggleChecklistComplete(UUID userId, UUID checklistId, Boolean completed);

    /**
     * Reorders a checklist item's position.
     *
     * @param userId      UUID identifier of the requesting user
     * @param checklistId UUID identifier of the target checklist item
     * @param position    new position index
     * @return updated ChecklistDto
     */
    ChecklistDto reorderChecklist(UUID userId, UUID checklistId, Double position);

    /**
     * Soft-deletes a checklist item.
     *
     * @param userId      UUID identifier of the requesting user
     * @param checklistId UUID identifier of the target checklist item
     */
    void deleteChecklist(UUID userId, UUID checklistId);

    /**
     * Performs a batch update or reorder across multiple checklist items for a task.
     *
     * @param userId  UUID identifier of the requesting user
     * @param taskId  UUID identifier of the target task
     * @param request batch update payload
     * @return list of updated ChecklistDto items
     */
    List<ChecklistDto> batchUpdateChecklists(UUID userId, UUID taskId, BatchUpdateChecklistRequest request);
}
