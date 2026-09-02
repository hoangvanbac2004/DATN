package com.taskflow.modules.activity.repository;

import com.taskflow.modules.activity.entity.ActivityLogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLogEntity, UUID> {

    Page<ActivityLogEntity> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<ActivityLogEntity> findByUserIdAndEntityTypeAndIsDeletedFalseOrderByCreatedAtDesc(UUID userId, String entityType, Pageable pageable);

    Page<ActivityLogEntity> findByProjectIdAndIsDeletedFalseOrderByCreatedAtDesc(UUID projectId, Pageable pageable);

    Page<ActivityLogEntity> findByProjectIdAndEntityTypeAndIsDeletedFalseOrderByCreatedAtDesc(UUID projectId, String entityType, Pageable pageable);

    Page<ActivityLogEntity> findByWorkspaceIdAndIsDeletedFalseOrderByCreatedAtDesc(UUID workspaceId, Pageable pageable);

    Page<ActivityLogEntity> findByWorkspaceIdAndEntityTypeAndIsDeletedFalseOrderByCreatedAtDesc(UUID workspaceId, String entityType, Pageable pageable);
}
