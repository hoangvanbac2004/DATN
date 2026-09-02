package com.taskflow.modules.automation.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.automation.dto.AutomationLogDto;
import com.taskflow.modules.automation.dto.AutomationRuleDto;
import com.taskflow.modules.automation.dto.CreateAutomationRuleRequest;
import com.taskflow.modules.automation.service.AutomationService;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Automation Engine", description = "Endpoints for managing no-code automation rules, triggers, actions, and execution logs")
public class AutomationController {

    private final AutomationService automationService;

    public AutomationController(AutomationService automationService) {
        this.automationService = automationService;
    }

    @PostMapping("/workspaces/{workspaceId}/automation/rules")
    @Operation(summary = "Create a new automation rule in a workspace")
    public ResponseEntity<ApiResponse<AutomationRuleDto>> createRule(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody CreateAutomationRuleRequest request) {
        AutomationRuleDto rule = automationService.createRule(principal.getId(), workspaceId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Automation rule created successfully", rule));
    }

    @GetMapping("/workspaces/{workspaceId}/automation/rules")
    @Operation(summary = "Get list of all automation rules in a workspace")
    public ResponseEntity<ApiResponse<List<AutomationRuleDto>>> getWorkspaceRules(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId) {
        List<AutomationRuleDto> rules = automationService.getWorkspaceRules(principal.getId(), workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Workspace automation rules retrieved successfully", rules));
    }

    @PatchMapping("/automation/rules/{ruleId}/toggle")
    @Operation(summary = "Toggle enable or disable status of an automation rule")
    public ResponseEntity<ApiResponse<AutomationRuleDto>> toggleRule(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID ruleId) {
        AutomationRuleDto updated = automationService.toggleRule(principal.getId(), ruleId);
        return ResponseEntity.ok(ApiResponse.success("Automation rule status updated successfully", updated));
    }

    @DeleteMapping("/automation/rules/{ruleId}")
    @Operation(summary = "Delete an automation rule")
    public ResponseEntity<ApiResponse<Void>> deleteRule(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID ruleId) {
        automationService.deleteRule(principal.getId(), ruleId);
        return ResponseEntity.ok(ApiResponse.success("Automation rule deleted successfully", null));
    }

    @GetMapping("/automation/rules/{ruleId}/logs")
    @Operation(summary = "Get execution logs for an automation rule")
    public ResponseEntity<ApiResponse<List<AutomationLogDto>>> getRuleLogs(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID ruleId) {
        List<AutomationLogDto> logs = automationService.getRuleLogs(principal.getId(), ruleId);
        return ResponseEntity.ok(ApiResponse.success("Automation rule logs retrieved successfully", logs));
    }
}
