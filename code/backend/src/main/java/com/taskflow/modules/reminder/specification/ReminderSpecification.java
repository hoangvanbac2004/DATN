package com.taskflow.modules.reminder.specification;

import com.taskflow.modules.reminder.entity.ReminderEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class ReminderSpecification {
    public static Specification<ReminderEntity> isForTask(UUID taskId) {
        return (root, query, cb) -> cb.equal(root.get("taskId"), taskId);
    }
}
