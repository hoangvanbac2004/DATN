package com.taskflow.modules.reminder.scheduler;

import com.taskflow.modules.reminder.service.ReminderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReminderScheduler {

    private static final Logger log = LoggerFactory.getLogger(ReminderScheduler.class);

    private final ReminderService reminderService;

    public ReminderScheduler(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    /**
     * Executes every minute to check for due pending reminders.
     */
    @Scheduled(fixedDelay = 60000)
    public void processDueReminders() {
        try {
            reminderService.processDueReminders();
        } catch (Exception e) {
            log.error("Error processing due reminders in background scheduler", e);
        }
    }
}
