package com.taskflow.modules.task.specification;

import com.taskflow.modules.task.entity.TaskEntity;
import org.springframework.data.jpa.domain.Specification;

public class TaskSpecification {
    public static Specification<TaskEntity> hasStatus(String status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }
}
