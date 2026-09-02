package com.taskflow.modules.tag.repository;

import com.taskflow.modules.tag.entity.TaskTagEntity;
import com.taskflow.modules.tag.entity.TaskTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskTagRepository extends JpaRepository<TaskTagEntity, TaskTagId> {

    List<TaskTagEntity> findByTaskId(UUID taskId);

    void deleteByTaskIdAndTagId(UUID taskId, UUID tagId);

    boolean existsByTaskIdAndTagId(UUID taskId, UUID tagId);

    @Query("SELECT tt.tagId FROM TaskTagEntity tt WHERE tt.taskId = :taskId")
    List<UUID> findTagIdsByTaskId(@Param("taskId") UUID taskId);
}
