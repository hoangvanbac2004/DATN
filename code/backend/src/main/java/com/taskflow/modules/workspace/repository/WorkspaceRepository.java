package com.taskflow.modules.workspace.repository;

import com.taskflow.modules.workspace.entity.WorkspaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkspaceRepository extends JpaRepository<WorkspaceEntity, UUID> {

    Optional<WorkspaceEntity> findBySlugAndIsDeletedFalse(String slug);

    boolean existsBySlug(String slug);

    Optional<WorkspaceEntity> findByIdAndIsDeletedFalse(UUID id);

    @Query("SELECT DISTINCT w FROM WorkspaceEntity w " +
           "LEFT JOIN WorkspaceMemberEntity wm ON wm.workspaceId = w.id " +
           "WHERE w.isDeleted = false AND (w.ownerId = :userId OR (wm.userId = :userId AND wm.status = 'ACTIVE')) " +
           "ORDER BY w.createdAt DESC")
    List<WorkspaceEntity> findAllWorkspacesByUserId(@Param("userId") UUID userId);
}
