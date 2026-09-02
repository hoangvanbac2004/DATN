package com.taskflow.modules.automation.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.workspace.service.WorkspaceService;
import com.taskflow.modules.automation.dto.AutomationLogDto;
import com.taskflow.modules.automation.dto.AutomationRuleDto;
import com.taskflow.modules.automation.dto.CreateAutomationRuleRequest;
import com.taskflow.modules.automation.entity.AutomationLogEntity;
import com.taskflow.modules.automation.entity.AutomationRuleEntity;
import com.taskflow.modules.automation.repository.AutomationLogRepository;
import com.taskflow.modules.automation.repository.AutomationRuleRepository;
import com.taskflow.modules.automation.service.AutomationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AutomationServiceImpl implements AutomationService {

    private final AutomationRuleRepository ruleRepository;
    private final AutomationLogRepository logRepository;
    private final WorkspaceService workspaceService;

    public AutomationServiceImpl(
            AutomationRuleRepository ruleRepository,
            AutomationLogRepository logRepository,
            WorkspaceService workspaceService) {
        this.ruleRepository = ruleRepository;
        this.logRepository = logRepository;
        this.workspaceService = workspaceService;
    }

    @Override
    @Transactional
    public AutomationRuleDto createRule(UUID userId, UUID workspaceId, CreateAutomationRuleRequest request) {
        workspaceService.getWorkspaceDetails(userId, workspaceId);

        AutomationRuleEntity rule = new AutomationRuleEntity(
                workspaceId,
                request.getProjectId(),
                request.getName().trim(),
                request.getDescription(),
                request.getTriggerType(),
                request.getTriggerConfigJson(),
                request.getConditionConfigJson(),
                request.getActionType(),
                request.getActionConfigJson(),
                request.getIsEnabled()
        );

        AutomationRuleEntity saved = ruleRepository.save(rule);
        return toRuleDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AutomationRuleDto> getWorkspaceRules(UUID userId, UUID workspaceId) {
        workspaceService.getWorkspaceDetails(userId, workspaceId);
        List<AutomationRuleEntity> rules = ruleRepository.findByWorkspaceId(workspaceId);
        return rules.stream().map(this::toRuleDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AutomationRuleDto toggleRule(UUID userId, UUID ruleId) {
        AutomationRuleEntity rule = findRuleById(ruleId);
        workspaceService.getWorkspaceDetails(userId, rule.getWorkspaceId());

        rule.setIsEnabled(!rule.getIsEnabled());
        AutomationRuleEntity updated = ruleRepository.save(rule);
        return toRuleDto(updated);
    }

    @Override
    @Transactional
    public void deleteRule(UUID userId, UUID ruleId) {
        AutomationRuleEntity rule = findRuleById(ruleId);
        workspaceService.getWorkspaceDetails(userId, rule.getWorkspaceId());
        ruleRepository.delete(rule);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AutomationLogDto> getRuleLogs(UUID userId, UUID ruleId) {
        AutomationRuleEntity rule = findRuleById(ruleId);
        workspaceService.getWorkspaceDetails(userId, rule.getWorkspaceId());

        List<AutomationLogEntity> logs = logRepository.findTop20ByRuleIdOrderByCreatedAtDesc(ruleId);
        return logs.stream()
                .map(l -> new AutomationLogDto(l.getId(), l.getRuleId(), l.getStatus(), l.getMessage(), l.getCreatedAt()))
                .collect(Collectors.toList());
    }

    private AutomationRuleEntity findRuleById(UUID ruleId) {
        return ruleRepository.findById(ruleId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Automation rule not found"));
    }

    private AutomationRuleDto toRuleDto(AutomationRuleEntity entity) {
        return new AutomationRuleDto(
                entity.getId(),
                entity.getWorkspaceId(),
                entity.getProjectId(),
                entity.getName(),
                entity.getDescription(),
                entity.getTriggerType(),
                entity.getTriggerConfigJson(),
                entity.getConditionConfigJson(),
                entity.getActionType(),
                entity.getActionConfigJson(),
                entity.getIsEnabled(),
                entity.getExecutionCount(),
                entity.getLastExecutedAt(),
                entity.getCreatedAt()
        );
    }
}
