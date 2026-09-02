package com.taskflow.modules.search.repository;

import com.taskflow.modules.search.entity.SavedSearchFilterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SavedSearchFilterRepository extends JpaRepository<SavedSearchFilterEntity, UUID> {

    List<SavedSearchFilterEntity> findByUserIdOrderByIsPinnedDescCreatedAtDesc(UUID userId);

    List<SavedSearchFilterEntity> findByUserIdAndWorkspaceIdOrderByIsPinnedDescCreatedAtDesc(UUID userId, UUID workspaceId);
}
