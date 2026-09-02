package com.taskflow.modules.wiki.repository;

import com.taskflow.modules.wiki.entity.WikiPageVersionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WikiPageVersionRepository extends JpaRepository<WikiPageVersionEntity, UUID> {

    List<WikiPageVersionEntity> findByPageIdOrderByVersionDesc(UUID pageId);

    Optional<WikiPageVersionEntity> findByPageIdAndVersion(UUID pageId, Integer version);
}
