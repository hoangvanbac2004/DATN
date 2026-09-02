package com.taskflow.modules.analytics.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.analytics.dto.ProductivityOverviewDto;
import com.taskflow.modules.analytics.service.AnalyticsService;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@Tag(name = "Productivity Analytics", description = "Endpoints for task completion metrics, status trends, and productivity statistics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/api/v1/analytics/overview")
    @Operation(summary = "Get productivity analytics overview")
    public ResponseEntity<ApiResponse<ProductivityOverviewDto>> getProductivityOverview(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) UUID workspaceId,
            @RequestParam(required = false) UUID projectId,
            @RequestParam(defaultValue = "WEEKLY") String period) {

        ProductivityOverviewDto result = analyticsService.getProductivityOverview(principal.getId(), workspaceId, projectId, period);
        return ResponseEntity.ok(ApiResponse.success("Productivity analytics retrieved successfully", result));
    }
}
