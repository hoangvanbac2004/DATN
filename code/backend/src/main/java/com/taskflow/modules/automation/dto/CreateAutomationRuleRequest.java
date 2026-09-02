package com.taskflow.modules.automation.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class CreateAutomationRuleRequest {

    @NotBlank(message = "Rule name must not be blank")
    private String name;

    private String description;
    private UUID projectId;

    @NotBlank(message = "Trigger type must not be blank")
    private String triggerType;

    private String triggerConfigJson;
    private String conditionConfigJson;

    @NotBlank(message = "Action type must not be blank")
    private String actionType;

    @NotBlank(message = "Action config JSON must not be blank")
    private String actionConfigJson;

    private Boolean isEnabled = true;

    public CreateAutomationRuleRequest() {
    }

    public CreateAutomationRuleRequest(String name, String description, UUID projectId, String triggerType, String triggerConfigJson, String conditionConfigJson, String actionType, String actionConfigJson, Boolean isEnabled) {
        this.name = name;
        this.description = description;
        this.projectId = projectId;
        this.triggerType = triggerType;
        this.triggerConfigJson = triggerConfigJson;
        this.conditionConfigJson = conditionConfigJson;
        this.actionType = actionType;
        this.actionConfigJson = actionConfigJson;
        this.isEnabled = isEnabled != null ? isEnabled : true;
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

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
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
}
