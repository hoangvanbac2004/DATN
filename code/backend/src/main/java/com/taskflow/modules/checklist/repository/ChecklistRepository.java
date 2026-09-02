package com.taskflow.modules.checklist.repository;

import com.taskflow.modules.checklist.entity.ChecklistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChecklistRepository extends JpaRepository<ChecklistEntity, UUID> {

    List<ChecklistEntity> findByTaskIdAndIsDeletedFalseOrderByPositionAsc(UUID taskId);

    Optional<ChecklistEntity> findByIdAndIsDeletedFalse(UUID id);

    long countByTaskIdAndIsDeletedFalse(UUID taskId);

    long countByTaskIdAndCompletedTrueAndIsDeletedFalse(UUID taskId);

    @Query("SELECT COALESCE(MAX(c.position), 0.0) FROM ChecklistEntity c WHERE c.taskId = :taskId AND c.isDeleted = false")
    Double findMaxPositionByTaskId(@Param("taskId") UUID taskId);
}
