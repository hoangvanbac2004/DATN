package com.taskflow.modules.ai.specification;

import com.taskflow.modules.ai.entity.AiPromptLogEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class AiSpecification {
    public static Specification<AiPromptLogEntity> forUser(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("userId"), userId);
    }
}
