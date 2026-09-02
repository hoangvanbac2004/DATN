package com.taskflow.modules.tag.service;

import com.taskflow.modules.tag.dto.CreateTagRequest;
import com.taskflow.modules.tag.dto.TagDto;
import com.taskflow.modules.tag.dto.UpdateTagRequest;

import java.util.List;
import java.util.UUID;

/**
 * Domain Service interface for managing workspace tags, colors, and task-tag associations.
 */
public interface TagService {

    /**
     * Creates a new tag within a workspace.
     *
     * @param userId      UUID identifier of requesting user
     * @param workspaceId UUID identifier of target workspace
     * @param request     creation request payload
     * @return TagDto representation of the created tag
     */
    TagDto createTag(UUID userId, UUID workspaceId, CreateTagRequest request);

    /**
     * Lists or searches tags in a workspace.
     *
     * @param userId      UUID identifier of requesting user
     * @param workspaceId UUID identifier of target workspace
     * @param search      optional search query matching tag name
     * @return list of matching TagDto instances
     */
    List<TagDto> getWorkspaceTags(UUID userId, UUID workspaceId, String search);

    /**
     * Gets tag details by tag ID.
     *
     * @param userId UUID identifier of requesting user
     * @param tagId  UUID identifier of target tag
     * @return TagDto instance
     */
    TagDto getTagDetails(UUID userId, UUID tagId);

    /**
     * Updates a tag's name or color.
     *
     * @param userId  UUID identifier of requesting user
     * @param tagId   UUID identifier of target tag
     * @param request update request payload
     * @return updated TagDto instance
     */
    TagDto updateTag(UUID userId, UUID tagId, UpdateTagRequest request);

    /**
     * Soft-deletes a tag and removes task associations.
     *
     * @param userId UUID identifier of requesting user
     * @param tagId  UUID identifier of target tag
     */
    void deleteTag(UUID userId, UUID tagId);

    /**
     * Assigns a tag to a task.
     *
     * @param userId UUID identifier of requesting user
     * @param taskId UUID identifier of target task
     * @param tagId  UUID identifier of target tag
     * @return list of current TagDto instances assigned to the task
     */
    List<TagDto> assignTagToTask(UUID userId, UUID taskId, UUID tagId);

    /**
     * Removes a tag assignment from a task.
     *
     * @param userId UUID identifier of requesting user
     * @param taskId UUID identifier of target task
     * @param tagId  UUID identifier of target tag
     * @return list of current TagDto instances assigned to the task
     */
    List<TagDto> removeTagFromTask(UUID userId, UUID taskId, UUID tagId);

    /**
     * Gets all tags assigned to a task.
     *
     * @param userId UUID identifier of requesting user
     * @param taskId UUID identifier of target task
     * @return list of assigned TagDto instances
     */
    List<TagDto> getTaskTags(UUID userId, UUID taskId);
}
