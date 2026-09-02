package com.taskflow.modules.automation.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "automation_rules")
public class AutomationRuleEntity extends BaseEntity {

    @Column(name = "workspace_id", nullable = false)
    private UUID workspaceId;

    @Column(name = "project_id")
    private UUID projectId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "trigger_type", nullable = false, length = 50)
    private String triggerType;

    @Column(name = "trigger_config_json", columnDefinition = "TEXT")
    private String triggerConfigJson;

    @Column(name = "condition_config_json", columnDefinition = "TEXT")
    private String conditionConfigJson;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType;

    @Column(name = "action_config_json", nullable = false, columnDefinition = "TEXT")
    private String actionConfigJson;

    @Column(name = "is_enabled", nullable = false)
    private Boolean isEnabled = true;

    @Column(name = "execution_count", nullable = false)
    private Integer executionCount = 0;

    @Column(name = "last_executed_at")
    private Instant lastExecutedAt;

    public AutomationRuleEntity() {
    }

    public AutomationRuleEntity(UUID workspaceId, UUID projectId, String name, String description, String triggerType, String triggerConfigJson, String conditionConfigJson, String actionType, String actionConfigJson, Boolean isEnabled) {
        this.workspaceId = workspaceId;
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.triggerType = triggerType;
        this.triggerConfigJson = triggerConfigJson;
        this.conditionConfigJson = conditionConfigJson;
        this.actionType = actionType;
        this.actionConfigJson = actionConfigJson;
        this.isEnabled = isEnabled != null ? isEnabled : true;
        this.executionCount = 0;
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
}
