package com.taskflow.modules.reminder.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.reminder.dto.CreateReminderRequest;
import com.taskflow.modules.reminder.dto.ReminderDto;
import com.taskflow.modules.reminder.dto.UpdateReminderRequest;
import com.taskflow.modules.reminder.entity.ReminderEntity;
import com.taskflow.modules.reminder.event.ReminderTriggeredEvent;
import com.taskflow.modules.reminder.mapper.ReminderMapper;
import com.taskflow.modules.reminder.repository.ReminderRepository;
import com.taskflow.modules.reminder.service.ReminderService;
import com.taskflow.modules.task.service.TaskService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReminderServiceImpl implements ReminderService {

    private final ReminderRepository reminderRepository;
    private final TaskService taskService;
    private final ApplicationEventPublisher eventPublisher;
    private final ReminderMapper reminderMapper;

    public ReminderServiceImpl(
            ReminderRepository reminderRepository,
            TaskService taskService,
            ApplicationEventPublisher eventPublisher,
            ReminderMapper reminderMapper) {
        this.reminderRepository = reminderRepository;
        this.taskService = taskService;
        this.eventPublisher = eventPublisher;
        this.reminderMapper = reminderMapper;
    }

    @Override
    @Transactional
    public ReminderDto createReminder(UUID userId, UUID taskId, CreateReminderRequest request) {
        taskService.getTaskDetails(userId, taskId);

        ReminderEntity entity = new ReminderEntity(
                taskId,
                userId,
                request.getRemindAt(),
                request.getType()
        );

        ReminderEntity saved = reminderRepository.save(entity);
        return reminderMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReminderDto> getTaskReminders(UUID userId, UUID taskId) {
        taskService.getTaskDetails(userId, taskId);

        List<ReminderEntity> list = reminderRepository.findByTaskIdAndIsDeletedFalseOrderByRemindAtAsc(taskId);
        return list.stream()
                .map(reminderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReminderDto> getUserUpcomingReminders(UUID userId) {
        List<ReminderEntity> list = reminderRepository.findByUserIdAndStatusAndIsDeletedFalseOrderByRemindAtAsc(userId, "PENDING");
        return list.stream()
                .map(reminderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReminderDto getReminderDetails(UUID userId, UUID reminderId) {
        ReminderEntity reminder = findActiveReminderById(reminderId);
        taskService.getTaskDetails(userId, reminder.getTaskId());
        return reminderMapper.toDto(reminder);
    }

    @Override
    @Transactional
    public ReminderDto updateReminder(UUID userId, UUID reminderId, UpdateReminderRequest request) {
        ReminderEntity reminder = findActiveReminderById(reminderId);
        taskService.getTaskDetails(userId, reminder.getTaskId());

        if (!reminder.getUserId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "You are not authorized to edit this reminder");
        }

        reminder.setRemindAt(request.getRemindAt());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            reminder.setStatus(request.getStatus());
        }
        if (request.getType() != null && !request.getType().isBlank()) {
            reminder.setType(request.getType());
        }

        ReminderEntity updated = reminderRepository.save(reminder);
        return reminderMapper.toDto(updated);
    }

    @Override
    @Transactional
    public ReminderDto dismissReminder(UUID userId, UUID reminderId) {
        ReminderEntity reminder = findActiveReminderById(reminderId);
        taskService.getTaskDetails(userId, reminder.getTaskId());

        if (!reminder.getUserId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "You are not authorized to dismiss this reminder");
        }

        reminder.setStatus("DISMISSED");
        ReminderEntity updated = reminderRepository.save(reminder);
        return reminderMapper.toDto(updated);
    }

    @Override
    @Transactional
    public void deleteReminder(UUID userId, UUID reminderId) {
        ReminderEntity reminder = findActiveReminderById(reminderId);
        taskService.getTaskDetails(userId, reminder.getTaskId());

        if (!reminder.getUserId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "You are not authorized to delete this reminder");
        }

        reminder.setIsDeleted(true);
        reminder.setDeletedAt(Instant.now());
        reminderRepository.save(reminder);
    }

    @Override
    @Transactional
    public void processDueReminders() {
        List<ReminderEntity> dueReminders = reminderRepository.findDuePendingReminders(Instant.now());
        for (ReminderEntity reminder : dueReminders) {
            reminder.setStatus("TRIGGERED");
            reminderRepository.save(reminder);

            eventPublisher.publishEvent(new ReminderTriggeredEvent(
                    reminder.getId(),
                    reminder.getTaskId(),
                    reminder.getUserId(),
                    reminder.getRemindAt(),
                    reminder.getType()
            ));
        }
    }

    private ReminderEntity findActiveReminderById(UUID reminderId) {
        return reminderRepository.findByIdAndIsDeletedFalse(reminderId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Reminder not found"));
    }
}
