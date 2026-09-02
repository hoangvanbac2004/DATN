package com.taskflow.modules.project.specification;

import com.taskflow.modules.project.entity.ProjectEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class ProjectSpecification {
    public static Specification<ProjectEntity> belongsToWorkspace(UUID workspaceId) {
        return (root, query, cb) -> cb.equal(root.get("workspaceId"), workspaceId);
    }
}
