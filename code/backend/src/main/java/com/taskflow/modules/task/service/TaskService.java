package com.taskflow.modules.task.service;

import com.taskflow.modules.task.dto.CreateTaskRequest;
import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.modules.task.dto.UpdateTaskRequest;

import java.util.List;
import java.util.UUID;

/**
 * Domain Service interface for managing project tasks, statuses, priorities, due dates, and reordering.
 */
public interface TaskService {

    /**
     * Creates a new task directly within a workspace.
     */
    TaskDto createWorkspaceTask(UUID userId, UUID workspaceId, CreateTaskRequest request);

    /**
     * Retrieves tasks directly within a workspace with optional filters.
     */
    List<TaskDto> getWorkspaceTasks(UUID userId, UUID workspaceId, String status, String priority, UUID assigneeId, String search, Boolean archived);

    /**
     * Creates a new task within a project.
     *
     * @param userId    UUID identifier of the creator
     * @param projectId UUID identifier of the target project
     * @param request   creation request payload
     * @return TaskDto representation of the created task
     */
    TaskDto createTask(UUID userId, UUID projectId, CreateTaskRequest request);

    /**
     * Retrieves tasks within a project matching status, priority, search text, or archived state.
     */
    List<TaskDto> getProjectTasks(UUID userId, UUID projectId, String status, String priority, String search, Boolean archived);

    /**
     * Retrieves tasks within a project matching status, priority, assigneeId, search text, or archived state.
     */
    List<TaskDto> getProjectTasks(UUID userId, UUID projectId, String status, String priority, UUID assigneeId, String search, Boolean archived);

    /**
     * Assigns or unassigns a task to a user.
     *
     * @param userId     UUID identifier of requesting user
     * @param taskId     UUID identifier of target task
     * @param assigneeId UUID identifier of target assignee (nullable)
     * @return updated TaskDto instance
     */
    TaskDto assignTask(UUID userId, UUID taskId, UUID assigneeId);

    /**
     * Retrieves task details by ID.
     *
     * @param userId UUID identifier of the requesting user
     * @param taskId UUID identifier of the target task
     * @return TaskDto instance
     */
    TaskDto getTaskDetails(UUID userId, UUID taskId);

    /**
     * Updates task title, description, status, priority, due date, and assignee.
     *
     * @param userId  UUID identifier of the requesting user
     * @param taskId  UUID identifier of the target task
     * @param request update request payload
     * @return updated TaskDto instance
     */
    TaskDto updateTask(UUID userId, UUID taskId, UpdateTaskRequest request);

    /**
     * Updates only the status of a task.
     *
     * @param userId UUID identifier of the requesting user
     * @param taskId UUID identifier of the target task
     * @param status new task status string
     * @return updated TaskDto instance
     */
    TaskDto updateTaskStatus(UUID userId, UUID taskId, String status);

    /**
     * Updates the position order value for list/Kanban drag-and-drop.
     *
     * @param userId   UUID identifier of the requesting user
     * @param taskId   UUID identifier of the target task
     * @param position double precision ordering index
     * @return updated TaskDto instance
     */
    TaskDto reorderTask(UUID userId, UUID taskId, Double position);

    /**
     * Soft-deletes a task.
     *
     * @param userId UUID identifier of the requesting user
     * @param taskId UUID identifier of the target task
     */
    void deleteTask(UUID userId, UUID taskId);

    /**
     * Toggles the archived status of a task.
     *
     * @param userId UUID identifier of the requesting user
     * @param taskId UUID identifier of the target task
     * @return updated TaskDto instance
     */
    TaskDto toggleArchiveTask(UUID userId, UUID taskId);

    /**
     * Gets tasks with due dates in the specified date range.
     *
     * @param userId UUID identifier of requesting user
     * @param start  range start instant
     * @param end    range end instant
     * @return list of TaskDto instances
     */
    List<TaskDto> getTasksWithDueDateInRange(UUID userId, java.time.Instant start, java.time.Instant end);

    /**
     * Moves a task to a specific board column and updates its status & ordering position.
     *
     * @param userId   UUID identifier of requesting user
     * @param taskId   UUID identifier of target task
     * @param columnId UUID identifier of target board column
     * @param status   status string matching target column
     * @param position ordering double precision index
     * @return updated TaskDto instance
     */
    TaskDto moveTaskToColumn(UUID userId, UUID taskId, UUID columnId, String status, Double position);

    /**
     * Updates task start date and due date for timeline positioning / resizing.
     */
    TaskDto updateTaskTimeline(UUID userId, UUID taskId, com.taskflow.modules.task.dto.UpdateTaskTimelineRequest request);

    /**
     * Retrieves all tasks and timeline attributes for a project.
     */
    List<TaskDto> getProjectTimeline(UUID userId, UUID projectId);

    /**
     * Connects two tasks via a task dependency link.
     */
    com.taskflow.modules.task.dto.TaskDependencyDto createDependency(UUID userId, com.taskflow.modules.task.dto.CreateTaskDependencyRequest request);

    /**
     * Removes a task dependency link.
     */
    void deleteDependency(UUID userId, UUID dependencyId);
}
