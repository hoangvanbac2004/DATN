package com.taskflow.modules.attachment.specification;

import com.taskflow.modules.attachment.entity.AttachmentEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class AttachmentSpecification {
    public static Specification<AttachmentEntity> belongsToTask(UUID taskId) {
        return (root, query, cb) -> cb.equal(root.get("taskId"), taskId);
    }
}
