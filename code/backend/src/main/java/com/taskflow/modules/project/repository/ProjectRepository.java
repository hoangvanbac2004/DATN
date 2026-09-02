package com.taskflow.modules.project.repository;

import com.taskflow.modules.project.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {

    List<ProjectEntity> findByWorkspaceIdAndIsDeletedFalseOrderByCreatedAtDesc(UUID workspaceId);

    List<ProjectEntity> findByWorkspaceIdAndIsFavoriteTrueAndIsDeletedFalse(UUID workspaceId);

    List<ProjectEntity> findByWorkspaceIdAndIsArchivedTrueAndIsDeletedFalse(UUID workspaceId);

    Optional<ProjectEntity> findByIdAndIsDeletedFalse(UUID id);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM ProjectEntity p WHERE p.isDeleted = false " +
           "AND (:workspaceId IS NULL OR p.workspaceId = :workspaceId) " +
           "AND (cast(:search as string) IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', cast(:search as string), '%')))")
    List<ProjectEntity> searchProjects(
            @org.springframework.data.repository.query.Param("workspaceId") UUID workspaceId,
            @org.springframework.data.repository.query.Param("search") String search);
}
