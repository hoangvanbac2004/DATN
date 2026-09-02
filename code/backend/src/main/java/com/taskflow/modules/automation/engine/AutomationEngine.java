package com.taskflow.modules.automation.engine;

import com.taskflow.modules.task.dto.TaskDto;

import java.util.UUID;

public interface AutomationEngine {

    void evaluateTaskEvent(UUID workspaceId, String triggerType, TaskDto task);
}
