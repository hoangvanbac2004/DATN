package com.taskflow.modules.activity.service;

import com.taskflow.modules.activity.dto.ActivityDto;
import java.util.List;

public interface ActivityService {
    List<ActivityDto> getActivities();
}
