package com.taskflow.modules.activity.service.impl;

import com.taskflow.modules.activity.dto.ActivityDto;
import com.taskflow.modules.activity.service.ActivityService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ActivityServiceImpl implements ActivityService {

    @Override
    public List<ActivityDto> getActivities() {
        return Collections.emptyList();
    }
}
