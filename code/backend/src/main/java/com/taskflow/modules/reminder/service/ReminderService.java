package com.taskflow.modules.reminder.service;

import com.taskflow.modules.reminder.dto.CreateReminderRequest;
import com.taskflow.modules.reminder.dto.ReminderDto;
import com.taskflow.modules.reminder.dto.UpdateReminderRequest;

import java.util.List;
import java.util.UUID;

/**
 * Domain Service interface for managing scheduled reminders, status lifecycles, and background event processing.
 */
public interface ReminderService {

    /**
     * Creates a new scheduled reminder for a task.
     *
     * @param userId  UUID identifier of requesting user
     * @param taskId  UUID identifier of target task
     * @param request creation request payload
     * @return ReminderDto instance
     */
    ReminderDto createReminder(UUID userId, UUID taskId, CreateReminderRequest request);

    /**
     * Gets all active reminders for a task.
     *
     * @param userId UUID identifier of requesting user
     * @param taskId UUID identifier of target task
     * @return list of ReminderDto instances
     */
    List<ReminderDto> getTaskReminders(UUID userId, UUID taskId);

    /**
     * Gets user's upcoming pending reminders.
     *
     * @param userId UUID identifier of requesting user
     * @return list of pending ReminderDto instances
     */
    List<ReminderDto> getUserUpcomingReminders(UUID userId);

    /**
     * Gets reminder details by ID.
     *
     * @param userId     UUID identifier of requesting user
     * @param reminderId UUID identifier of target reminder
     * @return ReminderDto instance
     */
    ReminderDto getReminderDetails(UUID userId, UUID reminderId);

    /**
     * Updates reminder scheduled time or status.
     *
     * @param userId     UUID identifier of requesting user
     * @param reminderId UUID identifier of target reminder
     * @param request    update request payload
     * @return updated ReminderDto instance
     */
    ReminderDto updateReminder(UUID userId, UUID reminderId, UpdateReminderRequest request);

    /**
     * Dismisses a triggered or pending reminder.
     *
     * @param userId     UUID identifier of requesting user
     * @param reminderId UUID identifier of target reminder
     * @return updated ReminderDto instance with status DISMISSED
     */
    ReminderDto dismissReminder(UUID userId, UUID reminderId);

    /**
     * Soft-deletes a reminder.
     *
     * @param userId     UUID identifier of requesting user
     * @param reminderId UUID identifier of target reminder
     */
    void deleteReminder(UUID userId, UUID reminderId);

    /**
     * Processes all due pending reminders, updating status to TRIGGERED and publishing domain events.
     * Called by background scheduler.
     */
    void processDueReminders();
}
