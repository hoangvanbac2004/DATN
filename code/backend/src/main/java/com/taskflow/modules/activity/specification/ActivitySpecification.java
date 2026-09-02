package com.taskflow.modules.activity.specification;

import com.taskflow.modules.activity.entity.ActivityEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class ActivitySpecification {
    public static Specification<ActivityEntity> performedByUser(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("userId"), userId);
    }
}
