package com.taskflow.modules.analytics.service.impl;

import com.taskflow.modules.analytics.dto.ProductivityOverviewDto;
import com.taskflow.modules.analytics.dto.TrendPointDto;
import com.taskflow.modules.analytics.service.AnalyticsService;
import com.taskflow.modules.task.entity.TaskEntity;
import com.taskflow.modules.task.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TaskRepository taskRepository;

    public AnalyticsServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductivityOverviewDto getProductivityOverview(UUID userId, UUID workspaceId, UUID projectId, String period) {
        String cleanPeriod = (period != null && !period.isBlank()) ? period.toUpperCase() : "WEEKLY";

        List<TaskEntity> tasks = taskRepository.findAllByIsDeletedFalse();

        if (projectId != null) {
            tasks = tasks.stream()
                    .filter(t -> projectId.equals(t.getProjectId()))
                    .collect(Collectors.toList());
        }

        Instant now = Instant.now();

        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus())).count();
        long overdueTasks = tasks.stream().filter(t ->
                t.getDueDate() != null && t.getDueDate().isBefore(now) && !"COMPLETED".equalsIgnoreCase(t.getStatus())
        ).count();
        long pendingTasks = tasks.stream().filter(t ->
                !"COMPLETED".equalsIgnoreCase(t.getStatus()) && !"CANCELLED".equalsIgnoreCase(t.getStatus())
        ).count();

        double completionRate = (totalTasks > 0) ? Math.round(((double) completedTasks / totalTasks) * 1000.0) / 10.0 : 0.0;

        // Status Breakdown
        Map<String, Long> statusMap = new HashMap<>();
        statusMap.put("TODO", tasks.stream().filter(t -> "TODO".equalsIgnoreCase(t.getStatus())).count());
        statusMap.put("IN_PROGRESS", tasks.stream().filter(t -> "IN_PROGRESS".equalsIgnoreCase(t.getStatus())).count());
        statusMap.put("IN_REVIEW", tasks.stream().filter(t -> "IN_REVIEW".equalsIgnoreCase(t.getStatus())).count());
        statusMap.put("COMPLETED", completedTasks);
        statusMap.put("CANCELLED", tasks.stream().filter(t -> "CANCELLED".equalsIgnoreCase(t.getStatus())).count());

        // Priority Breakdown
        Map<String, Long> priorityMap = new HashMap<>();
        priorityMap.put("LOW", tasks.stream().filter(t -> "LOW".equalsIgnoreCase(t.getPriority())).count());
        priorityMap.put("MEDIUM", tasks.stream().filter(t -> "MEDIUM".equalsIgnoreCase(t.getPriority())).count());
        priorityMap.put("HIGH", tasks.stream().filter(t -> "HIGH".equalsIgnoreCase(t.getPriority())).count());
        priorityMap.put("URGENT", tasks.stream().filter(t -> "URGENT".equalsIgnoreCase(t.getPriority())).count());

        // Trend Series calculation
        List<TrendPointDto> trendPoints = buildTrendSeries(tasks, cleanPeriod, now);

        return new ProductivityOverviewDto(
                totalTasks,
                completedTasks,
                overdueTasks,
                pendingTasks,
                completionRate,
                cleanPeriod,
                trendPoints,
                statusMap,
                priorityMap
        );
    }

    private List<TrendPointDto> buildTrendSeries(List<TaskEntity> tasks, String period, Instant now) {
        List<TrendPointDto> points = new ArrayList<>();
        ZoneId zone = ZoneId.systemDefault();
        DateTimeFormatter formatter = "MONTHLY".equals(period)
                ? DateTimeFormatter.ofPattern("MMM dd").withZone(zone)
                : DateTimeFormatter.ofPattern("EEE, MMM d").withZone(zone);

        int daysCount = "DAILY".equals(period) ? 7 : "MONTHLY".equals(period) ? 30 : 14;

        for (int i = daysCount - 1; i >= 0; i--) {
            Instant dayStart = now.minus(i, ChronoUnit.DAYS).truncatedTo(ChronoUnit.DAYS);
            Instant dayEnd = dayStart.plus(1, ChronoUnit.DAYS);

            String label = formatter.format(dayStart);

            long created = tasks.stream()
                    .filter(t -> t.getCreatedAt() != null && t.getCreatedAt().isAfter(dayStart) && t.getCreatedAt().isBefore(dayEnd))
                    .count();

            long completed = tasks.stream()
                    .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()) && t.getUpdatedAt() != null && t.getUpdatedAt().isAfter(dayStart) && t.getUpdatedAt().isBefore(dayEnd))
                    .count();

            points.add(new TrendPointDto(label, completed, created));
        }

        return points;
    }
}
