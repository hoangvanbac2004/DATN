package com.taskflow.modules.task.repository;

import com.taskflow.modules.task.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<TaskEntity, UUID> {

    List<TaskEntity> findByProjectIdAndIsDeletedFalseOrderByPositionAsc(UUID projectId);

    Optional<TaskEntity> findByIdAndIsDeletedFalse(UUID id);

    @Query("SELECT t FROM TaskEntity t WHERE t.projectId = :projectId AND t.isDeleted = false " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:assigneeId IS NULL OR t.assigneeId = :assigneeId) " +
           "AND (:archived IS NULL OR t.isArchived = :archived) " +
           "AND (cast(:search as string) IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', cast(:search as string), '%'))) " +
           "ORDER BY t.position ASC")
    List<TaskEntity> searchTasks(
            @Param("projectId") UUID projectId,
            @Param("status") String status,
            @Param("priority") String priority,
            @Param("assigneeId") UUID assigneeId,
            @Param("archived") Boolean archived,
            @Param("search") String search);

    @Query("SELECT COALESCE(MAX(t.position), 0.0) FROM TaskEntity t WHERE t.projectId = :projectId")
    Double findMaxPositionByProjectId(@Param("projectId") UUID projectId);

    @Query("SELECT t FROM TaskEntity t WHERE t.isDeleted = false " +
           "AND (:projectId IS NULL OR t.projectId = :projectId) " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (cast(:search as string) IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', cast(:search as string), '%'))) " +
           "ORDER BY t.createdAt DESC")
    List<TaskEntity> globalSearchTasks(
            @Param("projectId") UUID projectId,
            @Param("status") String status,
            @Param("priority") String priority,
            @Param("search") String search);

    @Query("SELECT t FROM TaskEntity t WHERE t.isDeleted = false AND t.dueDate IS NOT NULL AND t.dueDate >= :start AND t.dueDate <= :end")
    List<TaskEntity> findTasksWithDueDateInRange(@Param("start") java.time.Instant start, @Param("end") java.time.Instant end);

    List<TaskEntity> findAllByIsDeletedFalse();
}
