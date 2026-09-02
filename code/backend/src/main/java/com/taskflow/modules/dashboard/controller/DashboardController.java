package com.taskflow.modules.dashboard.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.dashboard.dto.DashboardSummaryDto;
import com.taskflow.modules.dashboard.dto.ProductivityStatsDto;
import com.taskflow.modules.dashboard.service.DashboardService;
import com.taskflow.modules.task.dto.TaskDto;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@Tag(name = "Dashboard & Analytics", description = "Endpoints for aggregated personal productivity metrics")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get aggregated dashboard metrics and summary")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getDashboardSummary(
            @AuthenticationPrincipal UserPrincipal principal) {
        DashboardSummaryDto summary = dashboardService.getDashboardSummary(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary retrieved successfully", summary));
    }

    @GetMapping("/tasks/today")
    @Operation(summary = "Get tasks due today across user workspaces")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTodayTasks(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<TaskDto> tasks = dashboardService.getTodayTasks(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Today's tasks retrieved successfully", tasks));
    }

    @GetMapping("/tasks/upcoming")
    @Operation(summary = "Get upcoming tasks due within 7 days")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getUpcomingTasks(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<TaskDto> tasks = dashboardService.getUpcomingTasks(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Upcoming tasks retrieved successfully", tasks));
    }

    @GetMapping("/tasks/overdue")
    @Operation(summary = "Get overdue tasks past due date")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getOverdueTasks(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<TaskDto> tasks = dashboardService.getOverdueTasks(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Overdue tasks retrieved successfully", tasks));
    }

    @GetMapping("/productivity")
    @Operation(summary = "Get 7-day productivity statistics")
    public ResponseEntity<ApiResponse<List<ProductivityStatsDto>>> getProductivityStats(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ProductivityStatsDto> stats = dashboardService.getProductivityStats(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Productivity statistics retrieved successfully", stats));
    }
}
