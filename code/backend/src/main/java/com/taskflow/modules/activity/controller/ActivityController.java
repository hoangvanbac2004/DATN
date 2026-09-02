package com.taskflow.modules.activity.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.activity.dto.ActivityDto;
import com.taskflow.modules.activity.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ActivityDto>>> getActivities() {
        return ResponseEntity.ok(ApiResponse.success(activityService.getActivities()));
    }
}
