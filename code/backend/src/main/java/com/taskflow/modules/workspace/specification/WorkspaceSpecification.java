package com.taskflow.modules.workspace.specification;

import com.taskflow.modules.workspace.entity.WorkspaceEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class WorkspaceSpecification {
    public static Specification<WorkspaceEntity> isOwnedBy(UUID ownerId) {
        return (root, query, cb) -> cb.equal(root.get("ownerId"), ownerId);
    }
}
