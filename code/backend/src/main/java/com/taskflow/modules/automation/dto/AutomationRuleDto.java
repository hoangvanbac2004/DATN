package com.taskflow.modules.automation.dto;

import java.time.Instant;
import java.util.UUID;

public class AutomationRuleDto {
    private UUID id;
    private UUID workspaceId;
    private UUID projectId;
    private String name;
    private String description;
    private String triggerType;
    private String triggerConfigJson;
    private String conditionConfigJson;
    private String actionType;
    private String actionConfigJson;
    private Boolean isEnabled;
    private Integer executionCount;
    private Instant lastExecutedAt;
    private Instant createdAt;

    public AutomationRuleDto() {
    }

    public AutomationRuleDto(UUID id, UUID workspaceId, UUID projectId, String name, String description, String triggerType, String triggerConfigJson, String conditionConfigJson, String actionType, String actionConfigJson, Boolean isEnabled, Integer executionCount, Instant lastExecutedAt, Instant createdAt) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.triggerType = triggerType;
        this.triggerConfigJson = triggerConfigJson;
        this.conditionConfigJson = conditionConfigJson;
        this.actionType = actionType;
        this.actionConfigJson = actionConfigJson;
        this.isEnabled = isEnabled;
        this.executionCount = executionCount;
        this.lastExecutedAt = lastExecutedAt;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(UUID workspaceId) {
        this.workspaceId = workspaceId;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTriggerType() {
        return triggerType;
    }

    public void setTriggerType(String triggerType) {
        this.triggerType = triggerType;
    }

    public String getTriggerConfigJson() {
        return triggerConfigJson;
    }

    public void setTriggerConfigJson(String triggerConfigJson) {
        this.triggerConfigJson = triggerConfigJson;
    }

    public String getConditionConfigJson() {
        return conditionConfigJson;
    }

    public void setConditionConfigJson(String conditionConfigJson) {
        this.conditionConfigJson = conditionConfigJson;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getActionConfigJson() {
        return actionConfigJson;
    }

    public void setActionConfigJson(String actionConfigJson) {
        this.actionConfigJson = actionConfigJson;
    }

    public Boolean getIsEnabled() {
        return isEnabled;
    }

    public void setIsEnabled(Boolean enabled) {
        isEnabled = enabled;
    }

    public Integer getExecutionCount() {
        return executionCount;
    }

    public void setExecutionCount(Integer executionCount) {
        this.executionCount = executionCount;
    }

    public Instant getLastExecutedAt() {
        return lastExecutedAt;
    }

    public void setLastExecutedAt(Instant lastExecutedAt) {
        this.lastExecutedAt = lastExecutedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
