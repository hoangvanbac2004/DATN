package com.taskflow.modules.tag.repository;

import com.taskflow.modules.tag.entity.TagEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TagRepository extends JpaRepository<TagEntity, UUID> {

    List<TagEntity> findByWorkspaceIdAndIsDeletedFalseOrderByNameAsc(UUID workspaceId);

    Optional<TagEntity> findByIdAndIsDeletedFalse(UUID id);

    boolean existsByWorkspaceIdAndNameIgnoreCaseAndIsDeletedFalse(UUID workspaceId, String name);

    @Query("SELECT t FROM TagEntity t WHERE t.workspaceId = :workspaceId AND t.isDeleted = false " +
           "AND (cast(:search as string) IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', cast(:search as string), '%'))) ORDER BY t.name ASC")
    List<TagEntity> searchWorkspaceTags(@Param("workspaceId") UUID workspaceId, @Param("search") String search);
}
