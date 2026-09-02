package com.taskflow.modules.search.repository;

import com.taskflow.modules.search.entity.SearchHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistoryEntity, UUID> {

    List<SearchHistoryEntity> findTop10ByUserIdOrderByCreatedAtDesc(UUID userId);

    void deleteByUserId(UUID userId);
}
