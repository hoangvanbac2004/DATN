package com.taskflow.modules.automation.service;

import com.taskflow.modules.automation.dto.AutomationLogDto;
import com.taskflow.modules.automation.dto.AutomationRuleDto;
import com.taskflow.modules.automation.dto.CreateAutomationRuleRequest;

import java.util.List;
import java.util.UUID;

public interface AutomationService {

    AutomationRuleDto createRule(UUID userId, UUID workspaceId, CreateAutomationRuleRequest request);

    List<AutomationRuleDto> getWorkspaceRules(UUID userId, UUID workspaceId);

    AutomationRuleDto toggleRule(UUID userId, UUID ruleId);

    void deleteRule(UUID userId, UUID ruleId);

    List<AutomationLogDto> getRuleLogs(UUID userId, UUID ruleId);
}
