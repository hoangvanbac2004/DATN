package com.taskflow.modules.wiki.repository;

import com.taskflow.modules.wiki.entity.WikiPageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WikiPageRepository extends JpaRepository<WikiPageEntity, UUID> {

    List<WikiPageEntity> findByWorkspaceIdAndIsDeletedFalse(UUID workspaceId);

    List<WikiPageEntity> findByWorkspaceIdAndParentPageIdIsNullAndIsDeletedFalse(UUID workspaceId);

    List<WikiPageEntity> findByParentPageIdAndIsDeletedFalse(UUID parentPageId);

    Optional<WikiPageEntity> findByIdAndIsDeletedFalse(UUID id);

    Optional<WikiPageEntity> findByWorkspaceIdAndSlugAndIsDeletedFalse(UUID workspaceId, String slug);

    boolean existsByWorkspaceIdAndSlugAndIsDeletedFalse(UUID workspaceId, String slug);
}
