package com.taskflow.modules.automation.engine.impl;

import com.taskflow.modules.automation.engine.AutomationEngine;
import com.taskflow.modules.automation.entity.AutomationLogEntity;
import com.taskflow.modules.automation.entity.AutomationRuleEntity;
import com.taskflow.modules.automation.repository.AutomationLogRepository;
import com.taskflow.modules.automation.repository.AutomationRuleRepository;
import com.taskflow.modules.notification.dto.CreateNotificationRequest;
import com.taskflow.modules.notification.service.NotificationService;
import com.taskflow.modules.task.dto.TaskDto;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Component
public class AutomationEngineImpl implements AutomationEngine {

    private final AutomationRuleRepository ruleRepository;
    private final AutomationLogRepository logRepository;
    private final NotificationService notificationService;

    public AutomationEngineImpl(
            AutomationRuleRepository ruleRepository,
            AutomationLogRepository logRepository,
            NotificationService notificationService) {
        this.ruleRepository = ruleRepository;
        this.logRepository = logRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Async
    @Transactional
    public void evaluateTaskEvent(UUID workspaceId, String triggerType, TaskDto task) {
        if (workspaceId == null || task == null) return;

        List<AutomationRuleEntity> activeRules = ruleRepository
                .findByWorkspaceIdAndTriggerTypeAndIsEnabledTrue(workspaceId, triggerType);

        for (AutomationRuleEntity rule : activeRules) {
            try {
                executeAction(rule, task);
                rule.setExecutionCount(rule.getExecutionCount() + 1);
                rule.setLastExecutedAt(Instant.now());
                ruleRepository.save(rule);

                logRepository.save(new AutomationLogEntity(
                        rule.getId(),
                        "SUCCESS",
                        "Rule executed successfully for task: " + task.getTitle()
                ));
            } catch (Exception ex) {
                logRepository.save(new AutomationLogEntity(
                        rule.getId(),
                        "FAILED",
                        "Execution failed: " + ex.getMessage()
                ));
            }
        }
    }

    private void executeAction(AutomationRuleEntity rule, TaskDto task) {
        String actionType = rule.getActionType();
        if ("SEND_NOTIFICATION".equalsIgnoreCase(actionType)) {
            if (task.getAssignee() != null) {
                CreateNotificationRequest req = new CreateNotificationRequest(
                        "Automation Rule Triggered",
                        "Task '" + task.getTitle() + "' triggered rule: " + rule.getName(),
                        task.getAssignee().getId(),
                        "AUTOMATION",
                        "/tasks?id=" + task.getId()
                );
                notificationService.createNotification(req);
            }
        }
    }
}
